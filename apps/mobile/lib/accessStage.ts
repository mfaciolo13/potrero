import { needsPolicyAcceptance, type PolicyStatus } from "./policies";

export type AccessStage = "login" | "policies" | "app";

export const accessStage = (signedIn: boolean, profile: PolicyStatus | null): AccessStage => {
  if (!signedIn) return "login";
  if (needsPolicyAcceptance(profile)) return "policies";
  return "app";
};
