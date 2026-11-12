import { describe, expect, it } from "vitest";

import { needsPolicyAcceptance } from "./policies";

describe("needsPolicyAcceptance", () => {
  it("pide aceptar si el usuario todavía no aceptó la versión vigente", () => {
    expect(needsPolicyAcceptance({ policiesAccepted: false })).toBe(true);
  });

  it("no pide nada si ya aceptó", () => {
    expect(needsPolicyAcceptance({ policiesAccepted: true })).toBe(false);
  });

  it("no pide nada mientras no hay perfil cargado", () => {
    expect(needsPolicyAcceptance(null)).toBe(false);
  });
});
