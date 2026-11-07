import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app.js";

const WEB = "https://potrero.example.com";

describe("CORS", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = createApp({ corsOrigins: [WEB] }).listen(0, () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  it("permite el origen configurado", async () => {
    const res = await fetch(`${baseUrl}/health`, { headers: { origin: WEB } });
    expect(res.headers.get("access-control-allow-origin")).toBe(WEB);
  });

  it("no permite un origen que no está en la lista", async () => {
    const res = await fetch(`${baseUrl}/health`, { headers: { origin: "https://otro.com" } });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("responde el preflight con los headers permitidos", async () => {
    const res = await fetch(`${baseUrl}/me`, {
      method: "OPTIONS",
      headers: {
        origin: WEB,
        "access-control-request-method": "GET",
        "access-control-request-headers": "authorization",
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe(WEB);
    expect(res.headers.get("access-control-allow-headers")).toContain("Authorization");
  });

  it("sin origenes configurados no permite ninguno", async () => {
    const closed = createApp().listen(0);
    const port = (closed.address() as AddressInfo).port;
    const res = await fetch(`http://127.0.0.1:${port}/health`, { headers: { origin: WEB } });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
    await new Promise<void>((resolve) => closed.close(() => resolve()));
  });
});
