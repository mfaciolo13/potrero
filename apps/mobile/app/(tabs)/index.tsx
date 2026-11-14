import { Link } from "expo-router";

import { SignOutButton } from "@/components/SignOutButton";
import { t } from "@/i18n";
import { useSessionActions } from "@/lib/useSessionActions";
import { useTheme } from "@/theme";
import { Button, Screen, Text } from "@/ui";

const Index = () => {
  const theme = useTheme();
  const { session, message, handleCheckApi } = useSessionActions();

  return (
    <Screen contentStyle={{ justifyContent: "center", alignItems: "center", gap: theme.spacing.s4 }}>
      <Text variant="displayTitle">{t("home.title")}</Text>
      <Text color="mute" align="center">
        {t("home.signedInAs", { email: session?.user.email ?? "" })}
      </Text>
      <Button label={t("home.checkApi")} variant="lime" onPress={handleCheckApi} />
      <SignOutButton />
      {message !== "" && (
        <Text color="mute" align="center">
          {message}
        </Text>
      )}
      {__DEV__ && (
        <Link href="/showcase" asChild>
          <Button label={t("home.openShowcase")} variant="lime" />
        </Link>
      )}
    </Screen>
  );
};

export default Index;
