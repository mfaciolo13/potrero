import { Redirect } from "expo-router";

import { ACCESS_STAGE, accessStage, type AccessStage } from "@/lib/accessStage";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";
import { LoadingScreen } from "@/ui";

const ENTRY: Record<AccessStage, "/login" | "/profile-error" | "/accept-policies" | "/choose-role" | "/home"> = {
  [ACCESS_STAGE.login]: "/login",
  [ACCESS_STAGE.error]: "/profile-error",
  [ACCESS_STAGE.policies]: "/accept-policies",
  [ACCESS_STAGE.role]: "/choose-role",
  [ACCESS_STAGE.app]: "/home",
};

const Entry = () => {
  const { session } = useAuth();
  const { profile, error } = useProfile();

  return (
    <>
      <LoadingScreen />
      <Redirect href={ENTRY[accessStage(session !== null, profile, error)]} />
    </>
  );
};

export default Entry;
