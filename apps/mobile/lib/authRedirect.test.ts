import { describe, expect, it } from "vitest";

import { parseSessionTokens } from "./authRedirect";

describe("parseSessionTokens", () => {
  it("lee los tokens del fragmento de la URL", () => {
    const url = "potrero://auth#access_token=abc&refresh_token=def&expires_in=3600&token_type=bearer";
    expect(parseSessionTokens(url)).toEqual({ accessToken: "abc", refreshToken: "def" });
  });

  it("devuelve null si no hay fragmento", () => {
    expect(parseSessionTokens("potrero://auth")).toBeNull();
  });

  it("devuelve null si falta el refresh token", () => {
    expect(parseSessionTokens("potrero://auth#access_token=abc")).toBeNull();
  });

  it("devuelve null si Google devolvió un error", () => {
    expect(parseSessionTokens("potrero://auth#error=access_denied&error_description=denegado")).toBeNull();
  });
});
