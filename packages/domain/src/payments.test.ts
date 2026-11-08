import { describe, expect, it } from "vitest";
import {
  cancelPendingMatches,
  closeMatchday,
  debtOf,
  isEnabled,
  mustLoseByWalkover,
  shouldBeRemoved,
  unpaidStreak,
} from "./payments.js";
import type { Charge, Match, Registration } from "./types.js";

const AMOUNTS = { fee: 1000, fine: 500 };

const registration = (charges: Charge[]): Registration => ({
  teamId: "a",
  status: "ACTIVE",
  verifiedPlayers: 5,
  charges,
});

const paidFee = (round: number): Charge => ({ round, type: "FEE", status: "PAID", amount: 1000 });

describe("cierre de fecha (RF-21, RN-03)", () => {
  it("fecha 1 impaga: la cuota queda vencida y se suma la multa", () => {
    const charges = closeMatchday([], 1, AMOUNTS);
    expect(charges).toContainEqual({ round: 1, type: "FEE", status: "OVERDUE", amount: 1000 });
    expect(charges).toContainEqual({ round: 1, type: "FINE", status: "OVERDUE", amount: 500 });
    expect(debtOf(charges)).toBe(1500);
  });

  it("pasa también por una cuota pendiente ya creada", () => {
    const charges = closeMatchday([{ round: 1, type: "FEE", status: "PENDING", amount: 1000 }], 1, AMOUNTS);
    expect(charges.filter((c) => c.type === "FEE")).toEqual([{ round: 1, type: "FEE", status: "OVERDUE", amount: 1000 }]);
  });

  it("fecha pagada: no hay multa ni deuda", () => {
    const charges = closeMatchday([paidFee(1)], 1, AMOUNTS);
    expect(charges).toEqual([paidFee(1)]);
    expect(debtOf(charges)).toBe(0);
  });

  it("cerrar dos veces la misma fecha no duplica la multa", () => {
    const once = closeMatchday([], 1, AMOUNTS);
    const twice = closeMatchday(once, 1, AMOUNTS);
    expect(twice.filter((c) => c.type === "FINE")).toHaveLength(1);
  });

  it("usa el monto del cargo existente y no el actual del torneo", () => {
    const charges = closeMatchday([{ round: 1, type: "FEE", status: "PENDING", amount: 800 }], 1, AMOUNTS);
    expect(charges.find((c) => c.type === "FEE")?.amount).toBe(800);
  });
});

describe("walkover por deuda (RN-04)", () => {
  it("con la fecha 1 vencida, la fecha 2 solo admite walkover en contra", () => {
    const charges = closeMatchday([], 1, AMOUNTS);
    expect(mustLoseByWalkover(charges, 2)).toBe(true);
  });

  it("la deuda de la misma fecha no impide jugarla", () => {
    const charges = closeMatchday([], 2, AMOUNTS);
    expect(mustLoseByWalkover(charges, 2)).toBe(false);
  });

  it("sin deuda juega normal", () => {
    expect(mustLoseByWalkover([paidFee(1)], 2)).toBe(false);
  });
});

describe("baja por falta de pago (RN-05, RN-06)", () => {
  it("dos fechas seguidas impagas dan de baja", () => {
    const charges = closeMatchday(closeMatchday([], 1, AMOUNTS), 2, AMOUNTS);
    expect(unpaidStreak(charges, 2)).toBe(2);
    expect(shouldBeRemoved(charges, 2)).toBe(true);
  });

  it("una sola fecha impaga no da de baja", () => {
    expect(shouldBeRemoved(closeMatchday([], 1, AMOUNTS), 1)).toBe(false);
  });

  it("dos fechas impagas pero no seguidas no dan de baja", () => {
    const charges = closeMatchday([paidFee(2), ...closeMatchday([], 1, AMOUNTS)], 3, AMOUNTS);
    expect(shouldBeRemoved(charges, 3)).toBe(false);
  });

  it("los partidos pendientes se cancelan y los jugados se mantienen", () => {
    const matches: Match[] = [
      { id: "1", round: 1, homeId: "a", awayId: "b", status: "PLAYED", homeGoals: 1, awayGoals: 0 },
      { id: "2", round: 3, homeId: "c", awayId: "a", status: "PENDING" },
      { id: "3", round: 3, homeId: "b", awayId: "c", status: "PENDING" },
    ];
    const result = cancelPendingMatches(matches, "a");
    expect(result.map((m) => m.status)).toEqual(["PLAYED", "CANCELLED", "PENDING"]);
  });

  it("la deuda de un equipo dado de baja sigue exigible (RN-08)", () => {
    const charges = closeMatchday(closeMatchday([], 1, AMOUNTS), 2, AMOUNTS);
    expect(debtOf(charges)).toBe(3000);
  });
});

describe("habilitación (RF-23, RN-07)", () => {
  it("con deuda vencida el equipo no está habilitado", () => {
    expect(isEnabled(registration(closeMatchday([], 1, AMOUNTS)))).toBe(false);
  });

  it("saldar la deuda vuelve a habilitar al equipo", () => {
    const settled = closeMatchday([], 1, AMOUNTS).map((c): Charge => ({ ...c, status: "PAID" }));
    expect(isEnabled(registration(settled))).toBe(true);
    expect(debtOf(settled)).toBe(0);
  });

  it("un equipo dado de baja nunca está habilitado", () => {
    expect(isEnabled({ ...registration([]), status: "REMOVED" })).toBe(false);
  });
});
