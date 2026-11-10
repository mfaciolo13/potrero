import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();

vi.mock("./supabase", () => ({ supabase: { auth: { getSession } } }));

const { apiFetch } = await import("./api");

describe("apiFetch", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("envía el token de la sesión como Bearer", async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: "token-123" } } });

    await apiFetch("/me");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url.endsWith("/me")).toBe(true);
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer token-123");
  });

  it("no envía Authorization si no hay sesión", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    await apiFetch("/me");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
  });

  it("conserva los headers que se le pasan", async () => {
    getSession.mockResolvedValue({ data: { session: { access_token: "t" } } });

    await apiFetch("/me", { headers: { "Content-Type": "application/json" } });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).get("Content-Type")).toBe("application/json");
  });
});
