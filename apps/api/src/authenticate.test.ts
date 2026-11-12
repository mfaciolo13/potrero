import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWK } from "jose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CURRENT_POLICIES_VERSION } from "@potrero/domain";
import { createApp } from "./app.js";
import { authenticate } from "./auth.js";
import { createTokenVerifier } from "./tokens.js";
import { displayName, type UserStore } from "./users.js";

const SUPABASE_URL = "https://abc.supabase.co";
const ISSUER = `${SUPABASE_URL}/auth/v1`;
const USER_ID = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

const { publicKey, privateKey } = await generateKeyPair("ES256");
const other = await generateKeyPair("ES256");
const jwk: JWK = { ...(await exportJWK(publicKey)), kid: "k1", alg: "ES256" };

const sign = (
  claims: Record<string, unknown> = {},
  { key = privateKey, issuer = ISSUER, audience = "authenticated", expires = "1h" } = {},
) =>
  new SignJWT({ email: "ana@example.com", ...claims })
    .setProtectedHeader({ alg: "ES256", kid: "k1" })
    .setSubject(USER_ID)
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expires)
    .sign(key);

const rows = new Map<
  string,
  { role: "PLAYER" | null; removed: boolean; name: string; policiesVersion: string | null }
>();
const store: UserStore = {
  async upsertFromClaims(claims) {
    if (!rows.has(claims.id)) rows.set(claims.id, { role: null, removed: false, name: displayName(claims), policiesVersion: null });
    const row = rows.get(claims.id)!;
    return { id: claims.id, role: row.role, policiesVersion: row.policiesVersion, removed: row.removed };
  },
  async acceptPolicies(userId, version) {
    rows.get(userId)!.policiesVersion = version;
  },
};

describe("authenticate", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    const verify = createTokenVerifier(SUPABASE_URL, createLocalJWKSet({ keys: [jwk] }));
    const app = createApp({
      authenticate: authenticate(verify, store),
      acceptPolicies: (userId, version) => store.acceptPolicies(userId, version),
    });
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  const me = (token?: string) =>
    fetch(`${baseUrl}/me`, { headers: token ? { authorization: `Bearer ${token}` } : {} });

  it("rechaza una llamada sin token", async () => {
    expect((await me()).status).toBe(401);
  });

  it("rechaza un header que no es Bearer", async () => {
    const res = await fetch(`${baseUrl}/me`, { headers: { authorization: "Basic abc" } });
    expect(res.status).toBe(401);
  });

  it("rechaza un token que no es un JWT", async () => {
    expect((await me("basura")).status).toBe(401);
  });

  it("rechaza un token firmado con otra clave", async () => {
    expect((await me(await sign({}, { key: other.privateKey }))).status).toBe(401);
  });

  it("rechaza un token vencido", async () => {
    expect((await me(await sign({}, { expires: "-1m" }))).status).toBe(401);
  });

  it("rechaza un token de otro emisor", async () => {
    expect((await me(await sign({}, { issuer: "https://otro.supabase.co/auth/v1" }))).status).toBe(401);
  });

  it("rechaza un token con otra audiencia", async () => {
    expect((await me(await sign({}, { audience: "anon" }))).status).toBe(401);
  });

  it("acepta un token valido y crea el usuario sin rol", async () => {
    const res = await me(await sign());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: USER_ID, role: null, policiesVersion: null, policiesAccepted: false });
    expect(rows.get(USER_ID)?.name).toBe("ana");
  });

  it("devuelve el rol guardado del usuario", async () => {
    rows.get(USER_ID)!.role = "PLAYER";
    expect(await (await me(await sign())).json()).toEqual({
      id: USER_ID,
      role: "PLAYER",
      policiesVersion: null,
      policiesAccepted: false,
    });
  });

  const accept = (token: string, body: unknown) =>
    fetch(`${baseUrl}/me/accept-policies`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("exige token para aceptar las políticas", async () => {
    const res = await fetch(`${baseUrl}/me/accept-policies`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("rechaza aceptar una versión que no es la vigente", async () => {
    const res = await accept(await sign(), { version: "2020-01-01" });
    expect(res.status).toBe(400);
    expect(rows.get(USER_ID)?.policiesVersion).toBeNull();
  });

  it("rechaza aceptar sin indicar la versión", async () => {
    expect((await accept(await sign(), {})).status).toBe(400);
  });

  it("registra la aceptación de la versión vigente", async () => {
    const res = await accept(await sign(), { version: CURRENT_POLICIES_VERSION });
    expect(res.status).toBe(200);
    expect(rows.get(USER_ID)?.policiesVersion).toBe(CURRENT_POLICIES_VERSION);
    const me = await (await fetch(`${baseUrl}/me`, { headers: { authorization: `Bearer ${await sign()}` } })).json();
    expect(me.policiesAccepted).toBe(true);
  });

  it("rechaza con 403 a un usuario dado de baja", async () => {
    rows.get(USER_ID)!.removed = true;
    expect((await me(await sign())).status).toBe(403);
  });
});

describe("displayName", () => {
  it("prefiere el nombre del token", () => {
    expect(displayName({ id: "1", name: " Ana Perez ", email: "a@b.com" })).toBe("Ana Perez");
  });

  it("usa la parte local del mail si no hay nombre", () => {
    expect(displayName({ id: "1", email: "ana@example.com" })).toBe("ana");
  });

  it("cae a Usuario si no hay nada", () => {
    expect(displayName({ id: "1" })).toBe("Usuario");
  });
});
