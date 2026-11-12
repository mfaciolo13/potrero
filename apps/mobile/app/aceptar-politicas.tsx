import { Link } from "expo-router";
import { View } from "react-native";

import { t } from "@/i18n";
import { usePoliciesAcceptance } from "@/lib/usePoliciesAcceptance";
import { makeStyles } from "@/theme";
import { Button, Checkbox, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  content: { justifyContent: "center", gap: theme.spacing.s4 },
  links: { gap: theme.spacing.s2 },
}));

const AcceptPolicies = () => {
  const styles = useStyles();
  const { accepted, setAccepted, submitting, error, handleSubmit, handleSignOut } = usePoliciesAcceptance();

  return (
    <Screen edges={["top", "left", "right"]} contentStyle={styles.content}>
      <Text variant="displayTitle">{t("policies.title")}</Text>
      <Text color="mute">{t("policies.intro")}</Text>
      <View style={styles.links}>
        <Link href="/politicas-de-uso" asChild>
          <Button label={t("policies.readTerms")} variant="outline" />
        </Link>
        <Link href="/privacidad" asChild>
          <Button label={t("policies.readPrivacy")} variant="outline" />
        </Link>
      </View>
      <Checkbox label={t("policies.accept")} checked={accepted} onChange={setAccepted} />
      {error !== "" && <Text color="badFg">{error}</Text>}
      <Button label={t("policies.continue")} disabled={!accepted} loading={submitting} onPress={handleSubmit} />
      <Button label={t("home.signOut")} variant="ghost" onPress={handleSignOut} />
    </Screen>
  );
};

export default AcceptPolicies;
