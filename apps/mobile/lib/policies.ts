export type PolicyStatus = { policiesAccepted: boolean };

export const needsPolicyAcceptance = (profile: PolicyStatus | null): boolean =>
  profile !== null && !profile.policiesAccepted;
