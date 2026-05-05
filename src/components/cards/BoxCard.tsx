import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BoxCardProps {
  title: string;
  subtitle: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export default function BoxCard({ title, subtitle, color, icon, onPress }: BoxCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={40} color="#fff" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  icon: { 
    marginBottom: 10 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#fff", 
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 12, 
    color: "#fff", 
    textAlign: "center", 
    marginTop: 5 },
});
