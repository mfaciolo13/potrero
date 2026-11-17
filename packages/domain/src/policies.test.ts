import { describe, expect, it } from "vitest";

import { hasAcceptedPolicies } from "./policies.js";

describe("hasAcceptedPolicies", () => {
  it("acepta la versión vigente", () => {
    expect(hasAcceptedPolicies("2026-11-12", "2026-11-12")).toBe(true);
  });

  it("rechaza una versión anterior", () => {
    expect(hasAcceptedPolicies("2025-01-01", "2026-11-12")).toBe(false);
  });

  it("rechaza si nunca aceptó", () => {
    expect(hasAcceptedPolicies(null, "2026-11-12")).toBe(false);
    expect(hasAcceptedPolicies(undefined, "2026-11-12")).toBe(false);
  });
});
