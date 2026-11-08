import { describe, expect, it } from "vitest";
import { addDays, isMonday, nextMonday } from "./dates.js";
import { buildFixture, roundRobin } from "./fixture.js";
import type { Registration } from "./types.js";

const team = (id: string, verifiedPlayers = 5): Registration => ({
  teamId: id,
  status: "ACTIVE",
  verifiedPlayers,
  charges: [],
});

const ids = (n: number) => Array.from({ length: n }, (_, i) => `t${i + 1}`);

describe("roundRobin", () => {
  it("con 6 equipos arma 5 fechas de 3 partidos", () => {
    const rounds = roundRobin(ids(6));
    expect(rounds).toHaveLength(5);
    expect(rounds.every((r) => r.length === 3)).toBe(true);
  });

  it("cada par de equipos se enfrenta una sola vez", () => {
    const pairs = roundRobin(ids(6)).flat().map((p) => [p.homeId, p.awayId].sort().join("-"));
    expect(new Set(pairs).size).toBe(15);
  });

  it("con cantidad impar, un equipo queda libre por fecha", () => {
    const rounds = roundRobin(ids(5));
    expect(rounds).toHaveLength(5);
    for (const round of rounds) {
      const playing = new Set(round.flatMap((p) => [p.homeId, p.awayId]));
      expect(round).toHaveLength(2);
      expect(playing.size).toBe(4);
    }
  });

  it("ningún equipo juega dos veces en la misma fecha", () => {
    for (const round of roundRobin(ids(8))) {
      const teams = round.flatMap((p) => [p.homeId, p.awayId]);
      expect(new Set(teams).size).toBe(teams.length);
    }
  });
});

describe("buildFixture (RF-16, RN-13, RN-14)", () => {
  const registrations = ids(6).map((id) => team(id));

  it("6 equipos con plantel mínimo generan 15 partidos en 5 fechas, una por semana", () => {
    const fixture = buildFixture({ registrations, format: "F5", legs: 1, startDate: "2026-11-09" });
    expect(fixture.matchdays).toHaveLength(5);
    expect(fixture.matchdays.flatMap((m) => m.pairings)).toHaveLength(15);
    expect(fixture.matchdays.map((m) => m.weekStart)).toEqual([
      "2026-11-09",
      "2026-11-16",
      "2026-11-23",
      "2026-11-30",
      "2026-12-07",
    ]);
    expect(fixture.matchdays.every((m) => isMonday(m.weekStart))).toBe(true);
  });

  it("con dos vueltas se duplican las fechas y se invierte la localía", () => {
    const fixture = buildFixture({ registrations, format: "F5", legs: 2, startDate: "2026-11-09" });
    expect(fixture.matchdays).toHaveLength(10);
    const first = fixture.matchdays[0].pairings[0];
    const return_ = fixture.matchdays[5].pairings[0];
    expect(return_).toEqual({ homeId: first.awayId, awayId: first.homeId });
  });

  it("un equipo con 4 jugadores verificados en F5 queda fuera del fixture (RN-01)", () => {
    const fixture = buildFixture({
      registrations: [...registrations, team("corto", 4)],
      format: "F5",
      legs: 1,
      startDate: "2026-11-09",
    });
    expect(fixture.excludedTeamIds).toEqual(["corto"]);
    const playing = fixture.matchdays.flatMap((m) => m.pairings).flatMap((p) => [p.homeId, p.awayId]);
    expect(playing).not.toContain("corto");
  });

  it("en F7 hacen falta 7 jugadores verificados", () => {
    const fixture = buildFixture({
      registrations: [team("a", 7), team("b", 6)],
      format: "F7",
      legs: 1,
      startDate: "2026-11-09",
    });
    expect(fixture.excludedTeamIds).toEqual(["b"]);
  });

  it("un equipo dado de baja no entra al fixture", () => {
    const removed: Registration = { ...team("baja"), status: "REMOVED" };
    const fixture = buildFixture({ registrations: [...registrations, removed], format: "F5", legs: 1, startDate: "2026-11-09" });
    expect(fixture.excludedTeamIds).toEqual(["baja"]);
  });

  it("rechaza una fecha de inicio que no es lunes", () => {
    expect(() => buildFixture({ registrations, format: "F5", legs: 1, startDate: "2026-11-10" })).toThrow();
  });
});

describe("fechas", () => {
  it("addDays suma días respetando el cambio de mes", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-11-09", 7)).toBe("2026-11-16");
  });

  it("nextMonday devuelve siempre un lunes posterior", () => {
    expect(nextMonday(new Date(2026, 10, 7))).toBe("2026-11-09");
    expect(nextMonday(new Date(2026, 10, 9))).toBe("2026-11-16");
  });
});
