import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { makeStyles } from "@/theme";

import { AnimatedLogo } from "./AnimatedLogo";

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: t.colors.pitch },
}));

export const LoadingScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <AnimatedLogo />
    </View>
  );
};
