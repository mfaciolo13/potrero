import { describe, expect, it } from "vitest";
import { publishPolicies } from "./publishPolicies.js";

const doc = { title: "t", intro: "i", sections: [{ heading: "h", blocks: ["a", ["b", "c"]] }] };
const documents = { terms: doc, privacy: doc, accountDeletion: doc };

const fakeDb = () => {
  const versions = new Map<string, { current: boolean }>([["2026-11-12", { current: true }]]);
  const tx = {
    policyVersion: {
      updateMany: async ({ where }: { where: { NOT: { id: string } } }) => {
        for (const [id, v] of versions) if (id !== where.NOT.id) v.current = false;
      },
      upsert: async ({ where }: { where: { id: string } }) => {
        versions.set(where.id, { current: true });
        return { id: where.id, publishedAt: new Date(), current: true };
      },
    },
  };
  return { versions, db: { $transaction: async (fn: (t: typeof tx) => unknown) => fn(tx) } as never };
};

describe("publishPolicies", () => {
  it("deja una sola versión vigente y conserva el historial", async () => {
    const { db, versions } = fakeDb();
    await publishPolicies(db, " 2026-12-01 ", documents);
    expect(versions.get("2026-12-01")?.current).toBe(true);
    expect(versions.get("2026-11-12")?.current).toBe(false);
    expect(versions.size).toBe(2);
  });

  it("rechaza una versión vacía", async () => {
    const { db } = fakeDb();
    await expect(publishPolicies(db, "  ", documents)).rejects.toThrow("vacía");
  });

  it("rechaza textos con una forma inválida", async () => {
    const { db, versions } = fakeDb();
    await expect(publishPolicies(db, "2026-12-01", { terms: doc })).rejects.toThrow();
    expect(versions.has("2026-12-01")).toBe(false);
  });
});
