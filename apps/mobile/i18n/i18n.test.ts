import { describe, expect, it } from "vitest";

import { t } from "./index";

describe("t", () => {
  it("devuelve el texto de una clave", () => {
    expect(t("home.signOut")).toBe("Cerrar sesión");
  });

  it("reemplaza los parámetros", () => {
    expect(t("home.signedInAs", { email: "a@b.com" })).toBe("Sesión iniciada como a@b.com");
  });

  it("deja vacío un parámetro que no se pasó", () => {
    expect(t("home.signedInAs")).toBe("Sesión iniciada como {{email}}");
    expect(t("home.signedInAs", {})).toBe("Sesión iniciada como ");
  });
});
