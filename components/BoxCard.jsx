import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function BoxCard({ title, subtitle, color }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Ionicons name="albums-outline" size={20} color="#eef4ed" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, height: 100, borderRadius: 8, padding: 15, justifyContent: "center", margin: 5 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#eef4ed", marginTop: 5 },
  cardSubtitle: { fontSize: 12, color: "#eef4ed", marginTop: 5 },
});
