import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface TodayItem {
  title: string;
  subtitle: string;
}

interface TodayItemsProps {
  items: TodayItem[];
  remaining: number;
  expanded: boolean;
  onSeeMore?: () => void;
  onShowRemaining?: () => void;
}

export default function TodayItems({ 
  items, 
  remaining, 
  expanded,
  onSeeMore, 
  onShowRemaining 
}: TodayItemsProps) {
  return (
    <View style={styles.todayBox}>
      <View style={styles.todayHeader}>
        <Text style={styles.todayTitle}>Atividades do dia</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMore}>ver tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 ? (
        items.map((item, index) => (
          <View key={index} style={styles.itemLine}>
            <Text style={styles.itemTitle}>Item: {item.title}</Text>
            <Text style={styles.itemSubtitle}>Box: {item.subtitle}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noItems}>Agenda livre! Nenhum item encontrado para hoje.</Text>
      )}

      {onShowRemaining && (
        <TouchableOpacity onPress={onShowRemaining}>
          {expanded ? (
            <Text style={styles.remainingText}>mostrar menos</Text>
          ) : remaining > 0 ? (
            <Text style={styles.remainingText}>+{remaining} itens restantes</Text>
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todayBox: {
    width: "85%",
    marginLeft: 30,
    marginTop: 5,
    padding: 15,
    backgroundColor: "#eef4ed",
    borderTopWidth: 3,
    borderTopColor: "#034078",
    borderRadius: 12,
    shadowColor: "#034078",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  todayTitle: {
    color: "#034078",
    fontWeight: "bold",
    fontSize: 16
  },
  itemLine: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#a1c3e4ff",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  itemTitle: { 
    color: "#034078",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2
  },
  itemSubtitle: {
    color: "#6e7a8a",
    fontSize: 12
  },
  noItems: {
    color: "#034078",
    fontSize: 12,
    marginTop: 10,
    fontStyle: "italic"
  },
  seeMore: {
    color: "#034078",
    fontSize: 14,
    fontWeight: "600"
  },
   remainingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#034078",
    fontWeight: "600",
    textAlign: "center"
  }
});
