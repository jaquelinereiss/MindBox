import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/types";
import { getDashboardData } from "../src/services/dashboard/getDashboardData";
import { supabase } from "../src/lib/supabaseClient";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [completedItems, setCompletedItems] = useState(0);
  const [progress, setProgress] = useState(0);
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);
  const [topAreas, setTopAreas] = useState<{ name: string; percent: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const result = await getDashboardData(user.user.id);

      setTotalItems(result.totalItems);
      setCompletedItems(result.completedItems);
      setProgress(result.overallProgress);
      setTotalBoxes(result.totalBoxes);
      setAverageProgress(result.averageProgress);
      setTopAreas(result.topAreas);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={28} color="#034078" />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            Acompanhe a visão geral do seu progresso!
          </Text>
        </View>
      </View>

      {loading && (
        <View style={{ marginTop: 80 }}>
          <ActivityIndicator size="large" color="#034078" />
        </View>
      )}

      {!loading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.chartContainer}>
            <ProgressChart
              data={{ data: [progress] }}
              width={screenWidth - 40}
              height={180}
              strokeWidth={8}
              radius={60}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(3, 64, 120, ${opacity})`,
                strokeWidth: 2,
              }}
              hideLegend
            />

            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>

            <Text style={styles.progressLabel}>Itens concluídos</Text>

            <Text style={styles.itemsCount}>
              {completedItems} / {totalItems}
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Ionicons name="albums-outline" size={26} color="#034078" />
              <Text style={styles.cardValue}>{totalBoxes}</Text>
              <Text style={styles.cardLabel}>Boxes criados</Text>
            </View>

            <View style={styles.card}>
              <Ionicons name="bar-chart-outline" size={26} color="#034078" />
              <Text style={styles.cardValue}>
                {Math.round(averageProgress * 100)}%
              </Text>
              <Text style={styles.cardLabel}>Progresso médio</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Áreas com mais boxes</Text>

            {topAreas.length === 0 && (
              <Text style={{ fontSize: 14, color: "#777" }}>
                Nenhuma área cadastrada ainda.
              </Text>
            )}

            {topAreas.map((area, index) => (
              <View key={index} style={styles.areaRow}>
                <Text style={styles.areaName}>{area.name}</Text>

                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${area.percent * 100}%` },
                    ]}
                  />
                </View>

                <Text style={styles.areaPercent}>
                  {Math.round(area.percent * 100)}%
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>
              Se acalme... teremos novas métricas em breve.
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  header: {
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
    zIndex: 10
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 5,
    marginBottom: 10,
    marginTop: 25
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#034078",
    marginBottom: 5,
    paddingLeft: 5
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
    paddingLeft: 5
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150
  },
  chartContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 25,
    marginTop: 15,
    marginBottom: 25,
    elevation: 3,
    position: "relative"
  },
  progressText: {
    position: "absolute",
    top: "45%",
    fontSize: 26,
    fontWeight: "700",
    color: "#034078"
  },
  progressLabel: {
    fontSize: 15,
    color: "#555",
    marginTop: 5
  },
  itemsCount: {
    fontSize: 14,
    color: "#034078",
    marginTop: 4,
    fontWeight: "600"
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },
  card: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 22,
    borderRadius: 18,
    marginHorizontal: 6,
    elevation: 3
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#034078",
    marginTop: 10
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 4
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#034078",
    marginBottom: 10
  },
  areaRow: {
    marginVertical: 4
  },
  areaName: {
    fontSize: 14,
    color: "#034078",
    fontWeight: "500",
    marginBottom: 4
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#7190ad",
    borderRadius: 8
  },
  areaPercent: {
    fontSize: 13,
    color: "#333",
    marginTop: 2,
    textAlign: "right"
  },
  moreButton: {
    marginTop: 25,
    alignSelf: "center"
  },
  moreButtonText: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    textAlign: "center"
  },
});
