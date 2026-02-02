import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ItemCard from "./ItemCard";
import { Item } from "../src/types/Item";

type Props = {
  overdueItems: Item[];
  expanded: boolean;
  onToggleExpand: () => void;
  onItemUpdated: (item: Item) => void;
  onItemDeleted: (id: number) => void;
};

export default function OverdueItemsSection({
  overdueItems,
  expanded,
  onToggleExpand,
  onItemUpdated,
  onItemDeleted,
}: Props) {
  if (overdueItems.length === 0) return null;

  return (
    <View style={styles.overdueContainer}>
      <TouchableOpacity
        style={styles.overdueHeader}
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
          );
          onToggleExpand();
        }}
      >
        <Text style={styles.overdueTitle}>
          Atividades em atraso ({overdueItems.length})
        </Text>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={22}
          color="#b07800"
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.overdueList}>
          {overdueItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onItemUpdated={onItemUpdated}
              onDeleteSuccess={onItemDeleted}
              context="calendar"
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overdueContainer: {
    marginHorizontal: 2,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ffefcc",
    borderRadius: 12,
    padding: 12,
  },
  overdueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overdueTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b07800",
  },
  overdueList: {
    marginTop: 10,
  },
});
