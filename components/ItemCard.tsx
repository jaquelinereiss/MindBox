import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "../src/types";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [completed, setCompleted] = useState(item.completed || false);
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR"); 
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => setCompleted(!completed)}>
          <Ionicons
            name={completed ? "checkbox" : "square-outline"}
            size={30}
            color={completed ? "#2a6f97" : "#134074"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <Text style={[styles.title, completed && { textDecorationLine: "line-through" }]}>
          {item.item_title}
        </Text>
        <Text style={styles.description}>{item.item_description}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>Prioridade: {item.priority_number}</Text>
          <Text style={styles.metaText}>Data: {formatDate(item.realization_date)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 3,
  },
  left: { 
    justifyContent: "center", 
    marginRight: 10 
  },
  right: { 
    flex: 1 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 3 
  },
  description: { 
    fontSize: 14, 
    color: "#666",
    marginBottom: 5 
  },
  meta: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  metaText: { 
    fontSize: 12, 
    color: "#999" 
  },
});
