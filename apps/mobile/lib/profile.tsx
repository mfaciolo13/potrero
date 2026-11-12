import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { apiFetch } from "./api";
import { useAuth } from "./auth";

export type Profile = {
  id: string;
  role: string | null;
  policiesVersion: string | null;
  policiesAccepted: boolean;
};

type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

const fetchProfile = async (): Promise<Profile> => {
  const response = await apiFetch("/me");
  if (!response.ok) throw new Error(String(response.status));
  return (await response.json()) as Profile;
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;
  const [stored, setStored] = useState<Profile | null>(null);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setStored(await fetchProfile());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchProfile()
      .then((next) => {
        if (cancelled) return;
        setStored(next);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const profile = userId !== null && stored?.id === userId ? stored : null;
  const loading = userId !== null && profile === null && !error;

  const value = useMemo(() => ({ profile, loading, error, refresh }), [profile, loading, error, refresh]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile debe usarse dentro de ProfileProvider");
  return value;
};
