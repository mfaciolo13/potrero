import { describe, expect, it } from "vitest";

import { authErrorKey, validateCredentials } from "./credentials";

describe("validateCredentials", () => {
  it("acepta un mail y una contraseña válidos", () => {
    expect(validateCredentials("ana@mail.com", "secreto1")).toBeNull();
  });

  it("ignora los espacios alrededor del mail", () => {
    expect(validateCredentials("  ana@mail.com ", "secreto1")).toBeNull();
  });

  it("rechaza un mail mal formado", () => {
    expect(validateCredentials("ana", "secreto1")).toBe("auth.errors.invalidEmail");
    expect(validateCredentials("ana@mail", "secreto1")).toBe("auth.errors.invalidEmail");
  });

  it("rechaza una contraseña corta", () => {
    expect(validateCredentials("ana@mail.com", "12345")).toBe("auth.errors.shortPassword");
  });
});

describe("authErrorKey", () => {
  it("traduce los códigos conocidos de Supabase", () => {
    expect(authErrorKey({ code: "invalid_credentials" })).toBe("auth.errors.invalidCredentials");
    expect(authErrorKey({ code: "user_already_exists" })).toBe("auth.errors.emailTaken");
  });

  it("usa el mensaje genérico para un error desconocido", () => {
    expect(authErrorKey({ code: "otra_cosa" })).toBe("errors.signInFailed");
    expect(authErrorKey(new Error("boom"))).toBe("errors.signInFailed");
    expect(authErrorKey(null)).toBe("errors.signInFailed");
  });
});
