import { addDays, isMonday } from "./dates.js";
import type { Registration, TournamentFormat } from "./types.js";

export const MIN_PLAYERS: Record<TournamentFormat, number> = { F5: 5, F7: 7 };

export interface Pairing {
  homeId: string;
  awayId: string;
}

export interface FixtureMatchday {
  number: number;
  weekStart: string;
  pairings: Pairing[];
}

export interface Fixture {
  matchdays: FixtureMatchday[];
  excludedTeamIds: string[];
}

export function isTeamReady(registration: Registration, format: TournamentFormat): boolean {
  return registration.status === "ACTIVE" && registration.verifiedPlayers >= MIN_PLAYERS[format];
}

export function roundRobin(ids: string[]): Pairing[][] {
  const list: (string | null)[] = [...ids];
  if (list.length % 2) list.push(null);
  const size = list.length;
  const rounds: Pairing[][] = [];

  for (let round = 0; round < size - 1; round++) {
    const pairings: Pairing[] = [];
    for (let i = 0; i < size / 2; i++) {
      const a = list[i];
      const b = list[size - 1 - i];
      if (a && b) pairings.push(round % 2 === 0 ? { homeId: a, awayId: b } : { homeId: b, awayId: a });
    }
    rounds.push(pairings);
    list.splice(1, 0, list.pop() as string | null);
  }
  return rounds;
}

export function buildFixture(input: {
  registrations: Registration[];
  format: TournamentFormat;
  legs: 1 | 2;
  startDate: string;
}): Fixture {
  if (!isMonday(input.startDate)) throw new Error("La primera fecha tiene que empezar un lunes");

  const ready = input.registrations.filter((r) => isTeamReady(r, input.format));
  const excludedTeamIds = input.registrations.filter((r) => !isTeamReady(r, input.format)).map((r) => r.teamId);

  let rounds = roundRobin(ready.map((r) => r.teamId));
  if (input.legs === 2) {
    rounds = [...rounds, ...rounds.map((round) => round.map((p) => ({ homeId: p.awayId, awayId: p.homeId })))];
  }

  const matchdays = rounds.map((pairings, index) => ({
    number: index + 1,
    weekStart: addDays(input.startDate, index * 7),
    pairings,
  }));
  return { matchdays, excludedTeamIds };
}
