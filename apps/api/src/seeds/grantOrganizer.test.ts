import { describe, expect, it, vi } from "vitest";
import { grantOrganizer } from "./grantOrganizer.js";

const fakeDb = (found: { id: string; name: string | null }[]) => {
  const upsert = vi.fn(async ({ create }: { create: { id: string; name: string; role: string } }) => create);
  const queryRaw = vi.fn(async () => found);
  return { db: { user: { upsert }, $queryRaw: queryRaw } as never, upsert };
};

describe("grantOrganizer", () => {
  it("da el rol de organizador a la cuenta con ese mail", async () => {
    const { db, upsert } = fakeDb([{ id: "u1", name: "Ana" }]);
    await grantOrganizer(db, "  Ana@Mail.com ");
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u1" },
        create: { id: "u1", name: "Ana", role: "ORGANIZER" },
        update: { role: "ORGANIZER" },
      }),
    );
  });

  it("usa el mail como nombre si la cuenta no tiene uno", async () => {
    const { db, upsert } = fakeDb([{ id: "u1", name: null }]);
    await grantOrganizer(db, "ana@mail.com");
    expect(upsert.mock.calls[0]![0].create.name).toBe("ana");
  });

  it("falla si no hay ninguna cuenta con ese mail", async () => {
    const { db, upsert } = fakeDb([]);
    await expect(grantOrganizer(db, "nadie@mail.com")).rejects.toThrow("nadie@mail.com");
    expect(upsert).not.toHaveBeenCalled();
  });
});
