export type SessionTokens = { accessToken: string; refreshToken: string };

export const parseSessionTokens = (url: string): SessionTokens | null => {
  const fragment = url.split("#")[1] ?? "";
  const params = new URLSearchParams(fragment);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};
