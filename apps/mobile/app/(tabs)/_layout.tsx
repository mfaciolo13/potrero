import { Tabs } from "expo-router";

import { t } from "@/i18n";

const TabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: t("navigation.home") }} />
    </Tabs>
  );
};

export default TabLayout;
