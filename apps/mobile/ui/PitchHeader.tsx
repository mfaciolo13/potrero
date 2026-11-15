import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { makeStyles } from "@/theme";

import { Text } from "./Text";

const CIRCLE = 160;
const CENTER_X = 80;
const DOT = 8;

const useStyles = makeStyles((t) => ({
  header: {
    backgroundColor: t.colors.pitch,
    paddingHorizontal: t.spacing.s4,
    paddingBottom: t.spacing.s4,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    top: -30,
    right: CENTER_X - CIRCLE / 2 - 20,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: t.stroke.hair,
    borderColor: t.colors.onPitchGlass,
  },
  line: {
    position: "absolute",
    top: 0,
    right: CENTER_X - 20,
    width: t.stroke.hair,
    height: 150,
    backgroundColor: t.colors.onPitchGlass,
  },
  dot: {
    position: "absolute",
    top: 50 - DOT / 2,
    right: CENTER_X - 20 - DOT / 2,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: t.colors.lime,
  },
  title: { fontSize: 36, lineHeight: 38, marginTop: t.spacing.s14 - t.spacing.s2 },
}));

type PitchHeaderProps = { title: string; subtitle: string };

export const PitchHeader = ({ title, subtitle }: PitchHeaderProps) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="light" />
      <View style={styles.circle} />
      <View style={styles.line} />
      <View style={styles.dot} />
      <Text variant="displayTitle" color="onPitch" style={styles.title}>
        {title}
      </Text>
      <Text variant="secondary" color="onPitchMute">
        {subtitle}
      </Text>
    </View>
  );
};
