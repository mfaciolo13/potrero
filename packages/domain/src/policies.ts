export const CURRENT_POLICIES_VERSION = "2026-11-12";

export const hasAcceptedCurrentPolicies = (version: string | null | undefined): boolean =>
  version === CURRENT_POLICIES_VERSION;
