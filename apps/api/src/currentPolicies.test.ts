import { describe, expect, it } from "vitest";
import { createCurrentPolicies, createCurrentPoliciesVersion } from "./policies.js";

const dbWith = (found: object | null) => ({ policyVersion: { findFirst: async () => found } }) as never;

describe("createCurrentPoliciesVersion", () => {
  it("devuelve el identificador de la versión vigente", async () => {
    expect(await createCurrentPoliciesVersion(dbWith({ id: "2026-11-12" }))()).toBe("2026-11-12");
  });

  it("falla si ninguna versión está marcada como vigente", async () => {
    await expect(createCurrentPoliciesVersion(dbWith(null))()).rejects.toThrow("versión vigente");
  });
});

describe("createCurrentPolicies", () => {
  it("devuelve la versión vigente con su texto", async () => {
    const publishedAt = new Date("2026-11-12");
    const documents = { terms: {}, privacy: {}, accountDeletion: {} };
    const current = await createCurrentPolicies(dbWith({ id: "2026-11-12", publishedAt, documents }))();
    expect(current).toEqual({ version: "2026-11-12", publishedAt, documents });
  });

  it("falla si ninguna versión está marcada como vigente", async () => {
    await expect(createCurrentPolicies(dbWith(null))()).rejects.toThrow("versión vigente");
  });
});
