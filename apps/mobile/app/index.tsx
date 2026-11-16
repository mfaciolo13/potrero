import { Redirect } from "expo-router";

import { accessStage, type AccessStage } from "@/lib/accessStage";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";

const ENTRY: Record<AccessStage, "/login" | "/accept-policies" | "/home"> = {
  login: "/login",
  policies: "/accept-policies",
  app: "/home",
};

const Entry = () => {
  const { session } = useAuth();
  const { profile } = useProfile();

  return <Redirect href={ENTRY[accessStage(session !== null, profile)]} />;
};

export default Entry;
