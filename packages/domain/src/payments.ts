import type { Charge, Match, Registration } from "./types.js";

export const MAX_UNPAID_STREAK = 2;

export function debtOf(charges: Charge[]): number {
  return charges.filter((c) => c.status === "OVERDUE").reduce((total, c) => total + c.amount, 0);
}

export function isEnabled(registration: Registration): boolean {
  return registration.status === "ACTIVE" && !registration.charges.some((c) => c.status === "OVERDUE");
}

export function mustLoseByWalkover(charges: Charge[], round: number): boolean {
  return charges.some((c) => c.status === "OVERDUE" && c.round < round);
}

export function closeMatchday(charges: Charge[], round: number, amounts: { fee: number; fine: number }): Charge[] {
  const fee = charges.find((c) => c.round === round && c.type === "FEE");
  if (fee?.status === "PAID") return charges;

  const fine = charges.find((c) => c.round === round && c.type === "FINE");
  const rest = charges.filter((c) => c.round !== round || (c.type !== "FEE" && c.type !== "FINE"));

  return [
    ...rest,
    { round, type: "FEE", status: "OVERDUE", amount: fee?.amount ?? amounts.fee },
    { round, type: "FINE", status: fine?.status === "PAID" ? "PAID" : "OVERDUE", amount: fine?.amount ?? amounts.fine },
  ];
}

export function unpaidStreak(charges: Charge[], upToRound: number): number {
  let streak = 0;
  for (let round = upToRound; round >= 1; round--) {
    const fee = charges.find((c) => c.round === round && c.type === "FEE");
    if (fee?.status !== "OVERDUE") break;
    streak++;
  }
  return streak;
}

export function shouldBeRemoved(charges: Charge[], upToRound: number): boolean {
  return unpaidStreak(charges, upToRound) >= MAX_UNPAID_STREAK;
}

export function cancelPendingMatches(matches: Match[], teamId: string): Match[] {
  return matches.map((m) =>
    m.status === "PENDING" && (m.homeId === teamId || m.awayId === teamId) ? { ...m, status: "CANCELLED" } : m,
  );
}
