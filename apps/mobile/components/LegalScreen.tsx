import { useRouter } from "expo-router";

import { t } from "@/i18n";
import { useLegalDocument, type LegalDocumentKey } from "@/lib/useLegalDocument";
import { makeStyles } from "@/theme";
import { Button, LegalDocument, LoadingScreen, Screen, Text } from "@/ui";

const useStyles = makeStyles((theme) => ({
  content: { justifyContent: "center", gap: theme.spacing.s4 },
}));

export type LegalScreenProps = { documentKey: LegalDocumentKey };

export const LegalScreen = ({ documentKey }: LegalScreenProps) => {
  const router = useRouter();
  const styles = useStyles();
  const { document, error, retry } = useLegalDocument(documentKey);

  const handleBack = () => {
    router.replace("/");
  };

  if (document) {
    return <LegalDocument document={document} backLabel={t("navigation.back")} onBack={handleBack} />;
  }

  if (!error) return <LoadingScreen />;

  return (
    <Screen edges={["top", "left", "right"]} contentStyle={styles.content}>
      <Text variant="displayTitle">{t("legal.error.title")}</Text>
      <Text color="mute">{t("legal.error.message")}</Text>
      <Button label={t("legal.error.retry")} fullWidth onPress={retry} />
      <Button label={t("navigation.back")} variant="ghost" fullWidth onPress={handleBack} />
    </Screen>
  );
};
