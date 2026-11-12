import { describe, expect, it } from "vitest";

import { CURRENT_POLICIES_VERSION, hasAcceptedCurrentPolicies } from "./policies.js";

describe("hasAcceptedCurrentPolicies", () => {
  it("acepta la versión vigente", () => {
    expect(hasAcceptedCurrentPolicies(CURRENT_POLICIES_VERSION)).toBe(true);
  });

  it("rechaza una versión anterior", () => {
    expect(hasAcceptedCurrentPolicies("2025-01-01")).toBe(false);
  });

  it("rechaza si nunca aceptó", () => {
    expect(hasAcceptedCurrentPolicies(null)).toBe(false);
    expect(hasAcceptedCurrentPolicies(undefined)).toBe(false);
  });
});
