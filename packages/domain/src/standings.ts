import { isTeamReady } from "./fixture.js";
import type { Match, Registration, Rules, Team, TournamentFormat } from "./types.js";

export const YELLOW_CARD_POINTS = 1;
export const RED_CARD_POINTS = 3;

export interface StandingsRow {
  teamId: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  fairPlay: number;
  removed: boolean;
}

export function standings(input: {
  teams: Team[];
  registrations: Registration[];
  matches: Match[];
  rules: Rules;
  format: TournamentFormat;
}): StandingsRow[] {
  const { teams, registrations, matches, rules, format } = input;
  const rows = new Map<string, StandingsRow>();

  for (const registration of registrations) {
    const hasMatches = matches.some((m) => m.homeId === registration.teamId || m.awayId === registration.teamId);
    if (!isTeamReady(registration, format) && registration.status !== "REMOVED" && !hasMatches) continue;
    rows.set(registration.teamId, {
      teamId: registration.teamId,
      name: teams.find((t) => t.id === registration.teamId)?.name ?? "?",
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      fairPlay: 0,
      removed: registration.status === "REMOVED",
    });
  }

  for (const match of matches) {
    if (match.status === "PENDING" || match.status === "CANCELLED") continue;
    const home = rows.get(match.homeId);
    const away = rows.get(match.awayId);
    if (!home || !away) continue;

    let homeGoals = match.homeGoals ?? 0;
    let awayGoals = match.awayGoals ?? 0;

    if (match.status === "WALKOVER") {
      if (!match.walkoverWinnerId) {
        home.played++;
        away.played++;
        home.lost++;
        away.lost++;
        continue;
      }
      homeGoals = match.walkoverWinnerId === match.homeId ? rules.walkoverGoals : 0;
      awayGoals = match.walkoverWinnerId === match.awayId ? rules.walkoverGoals : 0;
    } else {
      home.fairPlay += (match.homeYellowCards ?? 0) * YELLOW_CARD_POINTS + (match.homeRedCards ?? 0) * RED_CARD_POINTS;
      away.fairPlay += (match.awayYellowCards ?? 0) * YELLOW_CARD_POINTS + (match.awayRedCards ?? 0) * RED_CARD_POINTS;
    }

    home.played++;
    away.played++;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.won++;
      away.lost++;
      home.points += rules.pointsWin;
    } else if (homeGoals < awayGoals) {
      away.won++;
      home.lost++;
      away.points += rules.pointsWin;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += rules.pointsDraw;
      away.points += rules.pointsDraw;
    }
  }

  const table = [...rows.values()];
  for (const row of table) row.goalDifference = row.goalsFor - row.goalsAgainst;

  return table.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.fairPlay - b.fairPlay ||
      a.name.localeCompare(b.name),
  );
}
