import { Link } from "expo-router";
import { View } from "react-native";

import { SignOutButton } from "@/components";
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
  const { accepted, setAccepted, submitting, error, handleSubmit } = usePoliciesAcceptance();

  return (
    <Screen edges={["top", "left", "right"]} contentStyle={styles.content}>
      <SignOutButton variant="cross" />
      <Text variant="displayTitle">{t("policies.title")}</Text>
      <Text color="mute">{t("policies.intro")}</Text>
      <View style={styles.links}>
        <Link href="/terms-of-use" asChild>
          <Button label={t("policies.readTerms")} variant="outline" />
        </Link>
        <Link href="/privacy" asChild>
          <Button label={t("policies.readPrivacy")} variant="outline" />
        </Link>
      </View>
      <Checkbox label={t("policies.accept")} checked={accepted} onChange={setAccepted} />
      {error !== "" && <Text color="badFg">{error}</Text>}
      <Button label={t("policies.continue")} disabled={!accepted} loading={submitting} onPress={handleSubmit} />
    </Screen>
  );
};

export default AcceptPolicies;
