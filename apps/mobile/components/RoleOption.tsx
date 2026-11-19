import { Pressable } from "react-native";

import { makeStyles } from "@/theme";
import { Card, Chip, Text, type ChipTone } from "@/ui";

const useStyles = makeStyles((t) => ({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: t.spacing.s2 },
  grow: { flex: 1 },
  card: { gap: t.spacing.s2 },
}));

export type RoleOptionProps = {
  title: string;
  badge: string;
  badgeTone: ChipTone;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

export const RoleOption = ({ title, badge, badgeTone, description, selected, onSelect }: RoleOptionProps) => {
  const styles = useStyles();

  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onSelect}>
      <Card variant={selected ? "active" : "default"} style={styles.card}>
        <Text variant="title" style={styles.grow}>
          {title}
        </Text>
        <Chip label={badge} tone={badgeTone} />
        <Text color="mute">{description}</Text>
      </Card>
    </Pressable>
  );
};
