import { needsPolicyAcceptance, type PolicyStatus } from "./policies";

export type AccessProfile = PolicyStatus & { role: string | null; organizerRequestPending: boolean };

export const ACCESS_STAGE = {
  login: "login",
  error: "error",
  policies: "policies",
  role: "role",
  app: "app",
} as const;

export type AccessStage = (typeof ACCESS_STAGE)[keyof typeof ACCESS_STAGE];

export const accessStage = (
  signedIn: boolean,
  profile: AccessProfile | null,
  profileFailed = false,
): AccessStage => {
  if (!signedIn) return ACCESS_STAGE.login;
  if (profile === null && profileFailed) return ACCESS_STAGE.error;
  if (needsPolicyAcceptance(profile)) return ACCESS_STAGE.policies;
  if (profile !== null && profile.role === null && !profile.organizerRequestPending) return ACCESS_STAGE.role;
  return ACCESS_STAGE.app;
};
