import { needsPolicyAcceptance, type PolicyStatus } from "./policies";

export type AccessStage = "login" | "error" | "policies" | "app";

export const accessStage = (
  signedIn: boolean,
  profile: PolicyStatus | null,
  profileFailed = false,
): AccessStage => {
  if (!signedIn) return "login";
  if (profile === null && profileFailed) return "error";
  if (needsPolicyAcceptance(profile)) return "policies";
  return "app";
};
