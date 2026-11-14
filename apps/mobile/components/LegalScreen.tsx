import { useRouter } from "expo-router";

import { t } from "@/i18n";
import type { LegalDocument as LegalDocumentData } from "@/lib/legal/types";
import { LegalDocument } from "@/ui";

export const LegalScreen = ({ document }: { document: LegalDocumentData }) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return <LegalDocument document={document} backLabel={t("navigation.back")} onBack={handleBack} />;
};
