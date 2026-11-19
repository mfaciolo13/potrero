export const hasAcceptedPolicies = (
  acceptedVersion: string | null | undefined,
  currentVersion: string,
): boolean => acceptedVersion === currentVersion;
