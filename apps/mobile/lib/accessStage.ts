import { needsPolicyAcceptance, type PolicyStatus } from "./policies";

export const ACCESS_STAGE = {
  login: "login",
  error: "error",
  policies: "policies",
  app: "app",
} as const;

export type AccessStage = (typeof ACCESS_STAGE)[keyof typeof ACCESS_STAGE];

export const accessStage = (
  signedIn: boolean,
  profile: PolicyStatus | null,
  profileFailed = false,
): AccessStage => {
  if (!signedIn) return ACCESS_STAGE.login;
  if (profile === null && profileFailed) return ACCESS_STAGE.error;
  if (needsPolicyAcceptance(profile)) return ACCESS_STAGE.policies;
  return ACCESS_STAGE.app;
};
