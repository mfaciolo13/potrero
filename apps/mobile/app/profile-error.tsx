import { SignOutButton } from "@/components";
import { t } from "@/i18n";
import { useProfileRetry } from "@/lib/useProfileRetry";
import { makeStyles } from "@/theme";
import { Button, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  content: { justifyContent: "center", gap: theme.spacing.s4 },
}));

const ProfileError = () => {
  const styles = useStyles();
  const { retrying, handleRetry } = useProfileRetry();

  return (
    <Screen edges={["top", "left", "right"]} contentStyle={styles.content}>
      <Text variant="displayTitle">{t("profileError.title")}</Text>
      <Text color="mute">{t("profileError.message")}</Text>
      <Button label={t("profileError.retry")} loading={retrying} fullWidth onPress={handleRetry} />
      <SignOutButton />
    </Screen>
  );
};

export default ProfileError;
