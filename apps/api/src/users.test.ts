import { describe, expect, it, vi } from "vitest";
import { createUserStore } from "./users.js";

type Row = { role: string | null; regionId: string | null };

const build = (row: Row, pending = false) => {
  const state = { ...row };
  const create = vi.fn(async () => ({}));
  const prisma = {
    user: {
      updateMany: async ({ where }: { where: { role: null } }) => {
        if (state.role !== where.role) return { count: 0 };
        state.role = "PLAYER";
        return { count: 1 };
      },
      findUniqueOrThrow: async () => state,
    },
    organizerRequest: { findFirst: async () => (pending ? { id: "r1" } : null), create },
  };
  return { store: createUserStore(prisma as never), state, create };
};

describe("chooseRole", () => {
  it("guarda el rol de jugador si todavía no tiene uno", async () => {
    const { store, state } = build({ role: null, regionId: null });
    expect(await store.chooseRole("u1", "PLAYER")).toEqual({ ok: true });
    expect(state.role).toBe("PLAYER");
  });

  it("no cambia el rol si ya eligió uno", async () => {
    const { store, state } = build({ role: "ADMIN", regionId: null });
    expect(await store.chooseRole("u1", "PLAYER")).toEqual({ ok: false, error: "role_already_chosen" });
    expect(await store.chooseRole("u1", "ORGANIZER")).toEqual({ ok: false, error: "role_already_chosen" });
    expect(state.role).toBe("ADMIN");
  });

  it("pedir ser organizador crea una solicitud pendiente en su región y no cambia el rol", async () => {
    const { store, state, create } = build({ role: null, regionId: "reg1" });
    expect(await store.chooseRole("u1", "ORGANIZER")).toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith({ data: { userId: "u1", regionId: "reg1", description: "" } });
    expect(state.role).toBeNull();
  });

  it("no duplica la solicitud si ya hay una pendiente", async () => {
    const { store, create } = build({ role: null, regionId: "reg1" }, true);
    expect(await store.chooseRole("u1", "ORGANIZER")).toEqual({ ok: true });
    expect(create).not.toHaveBeenCalled();
  });

  it("pide la región antes de crear la solicitud de organizador", async () => {
    const { store, create } = build({ role: null, regionId: null });
    expect(await store.chooseRole("u1", "ORGANIZER")).toEqual({ ok: false, error: "region_required" });
    expect(create).not.toHaveBeenCalled();
  });
});
