import { useRouter } from "expo-router";

import { t } from "@/i18n";
import type { LegalDocument as LegalDocumentData } from "@/lib/legal/types";
import { LegalDocument } from "@/ui";

export type LegalScreenProps = { document: LegalDocumentData };

export const LegalScreen = ({ document }: LegalScreenProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/");
  };

  return <LegalDocument document={document} backLabel={t("navigation.back")} onBack={handleBack} />;
};
