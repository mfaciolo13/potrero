import { describe, expect, it } from "vitest";
import { standings } from "./standings.js";
import type { Match, Registration, Rules, Team } from "./types.js";

const RULES: Rules = { pointsWin: 3, pointsDraw: 1, walkoverGoals: 3, legs: 1 };

const teams: Team[] = ["A", "B", "C", "D"].map((name) => ({ id: name.toLowerCase(), name }));
const registrations: Registration[] = teams.map((t) => ({
  teamId: t.id,
  status: "ACTIVE",
  verifiedPlayers: 5,
  charges: [],
}));

let counter = 0;
const played = (home: string, away: string, homeGoals: number, awayGoals: number, extra: Partial<Match> = {}): Match => ({
  id: `m${++counter}`,
  round: 1,
  homeId: home,
  awayId: away,
  status: "PLAYED",
  homeGoals,
  awayGoals,
  ...extra,
});

const table = (matches: Match[], regs = registrations) =>
  standings({ teams, registrations: regs, matches, rules: RULES, format: "F5" });

describe("tabla de posiciones", () => {
  it("suma 3 por victoria, 1 por empate y 0 por derrota (RN-11)", () => {
    const rows = table([played("a", "b", 2, 0), played("c", "d", 1, 1)]);
    const byId = Object.fromEntries(rows.map((r) => [r.teamId, r]));
    expect(byId.a.points).toBe(3);
    expect(byId.b.points).toBe(0);
    expect(byId.c.points).toBe(1);
    expect(byId.d.points).toBe(1);
  });

  it("empate en puntos se define por diferencia de gol (RN-12)", () => {
    const rows = table([played("a", "c", 1, 0), played("b", "d", 4, 0)]);
    expect(rows.map((r) => r.teamId).slice(0, 2)).toEqual(["b", "a"]);
  });

  it("con igual diferencia, define por goles a favor", () => {
    const rows = table([played("a", "c", 1, 0), played("b", "d", 3, 2)]);
    expect(rows.map((r) => r.teamId).slice(0, 2)).toEqual(["b", "a"]);
  });

  it("con todo igual, define el fair play: gana quien tuvo menos tarjetas", () => {
    const rows = table([
      played("a", "c", 1, 0, { homeYellowCards: 2 }),
      played("b", "d", 1, 0, { homeYellowCards: 1, homeRedCards: 0 }),
    ]);
    expect(rows.map((r) => r.teamId).slice(0, 2)).toEqual(["b", "a"]);
  });

  it("una roja pesa 3 y una amarilla 1 en el fair play", () => {
    const rows = table([played("a", "b", 0, 0, { homeYellowCards: 1, homeRedCards: 1, awayYellowCards: 2 })]);
    const byId = Object.fromEntries(rows.map((r) => [r.teamId, r]));
    expect(byId.a.fairPlay).toBe(4);
    expect(byId.b.fairPlay).toBe(2);
  });

  it("con todo igual, ordena por nombre", () => {
    const rows = table([]);
    expect(rows.map((r) => r.name)).toEqual(["A", "B", "C", "D"]);
  });

  it("ignora los partidos pendientes y cancelados", () => {
    const rows = table([
      { id: "p", round: 1, homeId: "a", awayId: "b", status: "PENDING" },
      { id: "c", round: 2, homeId: "a", awayId: "c", status: "CANCELLED" },
    ]);
    expect(rows.every((r) => r.played === 0)).toBe(true);
  });
});

describe("walkover (RN-10)", () => {
  it("el ganador suma los goles configurados y el otro queda en cero", () => {
    const rows = table([
      { id: "w", round: 1, homeId: "a", awayId: "b", status: "WALKOVER", walkoverWinnerId: "b" },
    ]);
    const byId = Object.fromEntries(rows.map((r) => [r.teamId, r]));
    expect(byId.b).toMatchObject({ points: 3, goalsFor: 3, goalsAgainst: 0, won: 1 });
    expect(byId.a).toMatchObject({ points: 0, goalsFor: 0, goalsAgainst: 3, lost: 1 });
  });

  it("un walkover no suma tarjetas al fair play", () => {
    const rows = table([
      { id: "w", round: 1, homeId: "a", awayId: "b", status: "WALKOVER", walkoverWinnerId: "a", homeYellowCards: 3 },
    ]);
    expect(rows.find((r) => r.teamId === "a")?.fairPlay).toBe(0);
  });

  it("sin ganador, los dos pierden y no suman goles", () => {
    const rows = table([{ id: "w", round: 1, homeId: "a", awayId: "b", status: "WALKOVER", walkoverWinnerId: null }]);
    const byId = Object.fromEntries(rows.map((r) => [r.teamId, r]));
    expect(byId.a).toMatchObject({ played: 1, lost: 1, points: 0, goalsFor: 0 });
    expect(byId.b).toMatchObject({ played: 1, lost: 1, points: 0, goalsFor: 0 });
  });
});

describe("equipos en la tabla", () => {
  it("un equipo sin plantel mínimo y sin partidos no aparece", () => {
    const short: Registration = { teamId: "d", status: "ACTIVE", verifiedPlayers: 3, charges: [] };
    const rows = table([], [...registrations.filter((r) => r.teamId !== "d"), short]);
    expect(rows.map((r) => r.teamId)).not.toContain("d");
  });

  it("un equipo dado de baja sigue apareciendo marcado", () => {
    const removed: Registration = { teamId: "d", status: "REMOVED", verifiedPlayers: 5, charges: [] };
    const rows = table([played("a", "d", 2, 0)], [...registrations.filter((r) => r.teamId !== "d"), removed]);
    expect(rows.find((r) => r.teamId === "d")).toMatchObject({ removed: true, played: 1 });
  });
});
