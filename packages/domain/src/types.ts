export type TournamentFormat = "F5" | "F7";
export type MatchStatus = "PENDING" | "PLAYED" | "WALKOVER" | "CANCELLED";
export type RegistrationStatus = "ACTIVE" | "REMOVED";
export type ChargeType = "FEE" | "FINE";
export type ChargeStatus = "PENDING" | "OVERDUE" | "PAID";

export interface Rules {
  pointsWin: number;
  pointsDraw: number;
  walkoverGoals: number;
  legs: 1 | 2;
}

export interface Charge {
  round: number;
  type: ChargeType;
  status: ChargeStatus;
  amount: number;
}

export interface Registration {
  teamId: string;
  status: RegistrationStatus;
  verifiedPlayers: number;
  charges: Charge[];
}

export interface Match {
  id: string;
  round: number;
  homeId: string;
  awayId: string;
  status: MatchStatus;
  homeGoals?: number;
  awayGoals?: number;
  homeYellowCards?: number;
  homeRedCards?: number;
  awayYellowCards?: number;
  awayRedCards?: number;
  walkoverWinnerId?: string | null;
}

export interface Team {
  id: string;
  name: string;
}
