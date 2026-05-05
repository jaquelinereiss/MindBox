import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DashboardCardProps {
  boxCount: number;
  itemCount: number;
  progressPercent: number;
  onPress?: () => void;
  loading?: boolean;
}

export default function DashboardCard({
  boxCount,
  itemCount,
  progressPercent,
  onPress,
  loading = false,
}: DashboardCardProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
        <LinearGradient
            colors={["#034078", "#8da9c4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dashboardCard}
        >
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Ionicons name="trending-up-sharp" size={30} color="#eef4ed" />
        </View>

        <Text style={styles.dashboardSubtitle}>Tudo sob controle… ou quase.</Text>
        <Text style={styles.dashboardNumbers}>Box: {boxCount}    Item: {itemCount}</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    dashboardCard: {
        width: "85%",
        marginLeft: 30,
        borderRadius: 12,
        padding: 20,
        margin: 20,
        shadowColor: "#0b2545",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6
    },
    dashboardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    dashboardTitle:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff"
    },
    dashboardSubtitle: {
        fontSize: 15,
        marginBottom: 5,
        color: "#eef4ed"
    },
    dashboardNumbers: {
        fontSize: 12,
        marginTop: 15,
        marginBottom: 10,
        color: "#eef4ed"
    },
    progressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 2
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#eef4ed"
    },
    progressPercent: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#eef4ed"
    },
    progressBar: {
        marginTop: 5,
        height: 6,
        width: "100%",
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.3)"
    },
    progressFill: {
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#a1c3e4ff"
    }
});
