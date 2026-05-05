import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  iconColor?: string;
  chevronColor?: string;
}

export default function ActionCard({
  iconName,
  title,
  subtitle,
  onPress,
  iconColor = "#034078",
  chevronColor = "#034078",
}: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={iconColor} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={chevronColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#8da9c4",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 10
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#034078"
    },
    subtitle: {
        fontSize: 13,
        color: "#6e7a8a",
        marginTop: 2
    }
});
