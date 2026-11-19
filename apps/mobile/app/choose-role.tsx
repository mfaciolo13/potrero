import { View } from "react-native";

import { RoleOption, SignOutButton } from "@/components";
import { t } from "@/i18n";
import { useRoleSelection } from "@/lib/useRoleSelection";
import { makeStyles } from "@/theme";
import { Button, PitchHeader, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  body: { gap: theme.spacing.s4 },
}));

const ChooseRole = () => {
  const styles = useStyles();
  const { role, setRole, submitting, error, handleSubmit } = useRoleSelection();

  return (
    <>
      <PitchHeader title={t("role.title")} subtitle={t("role.subtitle")} />
      <Screen contentStyle={styles.body}>
        <Text variant="label" color="mute">
          {t("role.label")}
        </Text>
        <View style={styles.body}>
          <RoleOption
            title={t("role.player.title")}
            badge={t("role.player.badge")}
            badgeTone="ok"
            description={t("role.player.description")}
            selected={role === "PLAYER"}
            onSelect={() => setRole("PLAYER")}
          />
          <RoleOption
            title={t("role.organizer.title")}
            badge={t("role.organizer.badge")}
            badgeTone="warn"
            description={t("role.organizer.description")}
            selected={role === "ORGANIZER"}
            onSelect={() => setRole("ORGANIZER")}
          />
        </View>
        {error !== "" && <Text color="badFg">{error}</Text>}
        <Button label={t("role.continue")} loading={submitting} fullWidth onPress={handleSubmit} />
        <SignOutButton />
      </Screen>
    </>
  );
};

export default ChooseRole;
