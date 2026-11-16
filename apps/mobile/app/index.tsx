import { Redirect } from "expo-router";

import { accessStage, type AccessStage } from "@/lib/accessStage";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";

const ENTRY: Record<AccessStage, "/login" | "/profile-error" | "/accept-policies" | "/home"> = {
  login: "/login",
  error: "/profile-error",
  policies: "/accept-policies",
  app: "/home",
};

const Entry = () => {
  const { session } = useAuth();
  const { profile, error } = useProfile();

  return <Redirect href={ENTRY[accessStage(session !== null, profile, error)]} />;
};

export default Entry;
