import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("GET /health", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = createApp().listen(0, () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("responde 200 con el estado de la API", async () => {
    const res = await fetch(`${baseUrl}/health`);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("responde 404 en una ruta inexistente", async () => {
    const res = await fetch(`${baseUrl}/no-existe`);

    expect(res.status).toBe(404);
  });
});

describe("GET /health/db", () => {
  async function conServidor(pingDb: (() => Promise<void>) | undefined, probar: (baseUrl: string) => Promise<void>) {
    const server = await new Promise<Server>((resolve) => {
      const s = createApp({ pingDb }).listen(0, () => resolve(s));
    });
    try {
      await probar(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  }

  it("responde 200 cuando la base responde", async () => {
    await conServidor(async () => {}, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/health/db`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ status: "ok", db: "ok" });
    });
  });

  it("responde 503 cuando la base no responde, sin filtrar el error", async () => {
    await conServidor(async () => { throw new Error("password authentication failed for user x"); }, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/health/db`);
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ status: "error", db: "unreachable" });
    });
  });

  it("no existe si no se configura la base", async () => {
    await conServidor(undefined, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/health/db`);
      expect(res.status).toBe(404);
    });
  });
});

describe("GET /policies/current", () => {
  const doc = { title: "t", intro: "i", sections: [] };
  const documents = { terms: doc, privacy: doc, accountDeletion: doc };

  async function conServidor(
    currentPolicies: () => Promise<never>,
    probar: (baseUrl: string) => Promise<void>,
  ) {
    const server = await new Promise<Server>((resolve) => {
      const s = createApp({ currentPolicies }).listen(0, () => resolve(s));
    });
    try {
      await probar(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  }

  it("devuelve la versión vigente con su texto, sin pedir sesión", async () => {
    const current = { version: "2026-11-12", publishedAt: new Date("2026-11-12"), documents };
    await conServidor(async () => current as never, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/policies/current`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ...current, publishedAt: current.publishedAt.toISOString() });
    });
  });

  it("responde 500 si no se puede leer la versión vigente", async () => {
    await conServidor(
      async () => {
        throw new Error("sin base");
      },
      async (baseUrl) => {
        expect((await fetch(`${baseUrl}/policies/current`)).status).toBe(500);
      },
    );
  });

  it("no existe si no se configura", async () => {
    const server = await new Promise<Server>((resolve) => {
      const s = createApp().listen(0, () => resolve(s));
    });
    const res = await fetch(`http://127.0.0.1:${(server.address() as AddressInfo).port}/policies/current`);
    expect(res.status).toBe(404);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
