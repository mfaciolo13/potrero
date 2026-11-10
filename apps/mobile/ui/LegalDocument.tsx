import { View } from "react-native";

import type { LegalDocument as LegalDocumentData } from "@/lib/legal/types";
import { makeStyles } from "@/theme";

import { Screen } from "./Screen";
import { Text } from "./Text";

const useStyles = makeStyles((t) => ({
  header: { gap: t.spacing.s3, marginBottom: t.spacing.s6 },
  section: { gap: t.spacing.s3, marginBottom: t.spacing.s6 },
  item: { flexDirection: "row", gap: t.spacing.s2 },
  grow: { flex: 1 },
}));

export const LegalDocument = ({ document }: { document: LegalDocumentData }) => {
  const styles = useStyles();

  return (
    <Screen edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text variant="displayTitle">{document.title}</Text>
        <Text color="mute">{document.intro}</Text>
      </View>
      {document.sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text variant="displaySection">{section.heading}</Text>
          {section.blocks.map((block, index) =>
            typeof block === "string" ? (
              <Text key={index}>{block}</Text>
            ) : (
              <View key={index} style={styles.section}>
                {block.map((item) => (
                  <View key={item} style={styles.item}>
                    <Text>•</Text>
                    <Text style={styles.grow}>{item}</Text>
                  </View>
                ))}
              </View>
            ),
          )}
        </View>
      ))}
    </Screen>
  );
};
