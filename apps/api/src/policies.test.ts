import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { requireAcceptedPolicies, type AuthUser } from "./auth.js";

const CURRENT_POLICIES_VERSION = "2026-11-12";

const asUser = (policiesVersion: string | null): express.RequestHandler => (req, _res, next) => {
  const user: AuthUser = { id: "u1", role: null, policiesVersion };
  if (req.header("x-anonymous") !== "1") req.user = user;
  next();
};

const buildApp = (policiesVersion: string | null, currentVersion = async () => CURRENT_POLICIES_VERSION) => {
  const app = express();
  app.use(asUser(policiesVersion));
  app.get("/items", requireAcceptedPolicies(currentVersion), (_req, res) => res.json({ ok: true }));
  app.post("/items", requireAcceptedPolicies(currentVersion), (_req, res) => res.json({ ok: true }));
  app.delete("/items/1", requireAcceptedPolicies(currentVersion), (_req, res) => res.json({ ok: true }));
  return app;
};

const listen = async (app: express.Express) => {
  let server!: Server;
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  return { server, url: `http://localhost:${(server.address() as AddressInfo).port}` };
};

describe("requireAcceptedPolicies", () => {
  const servers: Server[] = [];
  const urls: Record<string, string> = {};

  beforeAll(async () => {
    for (const [name, version] of [
      ["none", null],
      ["outdated", "2020-01-01"],
      ["current", CURRENT_POLICIES_VERSION],
    ] as const) {
      const { server, url } = await listen(buildApp(version));
      servers.push(server);
      urls[name] = url;
    }
  });

  afterAll(() => Promise.all(servers.map((s) => new Promise<void>((resolve) => s.close(() => resolve())))));

  it("rechaza con 403 una escritura de quien nunca aceptó", async () => {
    const res = await fetch(`${urls.none}/items`, { method: "POST" });
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "policies_not_accepted" });
  });

  it("rechaza con 403 una escritura de quien aceptó una versión vieja", async () => {
    expect((await fetch(`${urls.outdated}/items`, { method: "POST" })).status).toBe(403);
    expect((await fetch(`${urls.outdated}/items/1`, { method: "DELETE" })).status).toBe(403);
  });

  it("deja pasar las escrituras de quien aceptó la versión vigente", async () => {
    expect((await fetch(`${urls.current}/items`, { method: "POST" })).status).toBe(200);
  });

  it("no bloquea las lecturas aunque no haya aceptado", async () => {
    expect((await fetch(`${urls.none}/items`)).status).toBe(200);
  });

  it("toma la versión vigente en cada pedido, sin redeploy", async () => {
    let current = "2026-11-12";
    const { server, url } = await listen(buildApp("2026-11-12", async () => current));
    servers.push(server);
    expect((await fetch(`${url}/items`, { method: "POST" })).status).toBe(200);
    current = "2026-12-01";
    expect((await fetch(`${url}/items`, { method: "POST" })).status).toBe(403);
  });

  it("responde 500 si no se puede leer la versión vigente", async () => {
    const { server, url } = await listen(
      buildApp("2026-11-12", async () => {
        throw new Error("sin base");
      }),
    );
    servers.push(server);
    expect((await fetch(`${url}/items`, { method: "POST" })).status).toBe(500);
  });

  it("responde 401 a una escritura sin usuario autenticado", async () => {
    const res = await fetch(`${urls.current}/items`, { method: "POST", headers: { "x-anonymous": "1" } });
    expect(res.status).toBe(401);
  });
});
