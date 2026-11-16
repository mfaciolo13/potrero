import { ActivityIndicator, View } from "react-native";

import { makeStyles, useTheme } from "@/theme";

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: t.colors.bg },
}));

export const LoadingScreen = () => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={theme.colors.green} />
    </View>
  );
};
