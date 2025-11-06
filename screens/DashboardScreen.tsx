import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/navigation/types";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const [progress, setProgress] = useState(0.65);
  const [totalBoxes, setTotalBoxes] = useState(6);
  const [averageProgress, setAverageProgress] = useState(0.52);
  const [topAreas, setTopAreas] = useState([
    { name: "Trabalho", percent: 0.45 },
    { name: "Estudos", percent: 0.35 },
    { name: "Pessoal", percent: 0.2 },
  ]);

  useEffect(() => {
    // trazer dados reais futuramente
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.chartContainer}>
            <ProgressChart
                data={{ data: [progress] }}
                width={screenWidth - 40}
                height={180}
                strokeWidth={10}
                radius={60}
                chartConfig={{
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    color: (opacity = 1) => `rgba(3, 64, 120, ${opacity})`,
                    strokeWidth: 2,
                }}
                hideLegend
            />
            <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.progressLabel}>Itens concluídos</Text>
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
        paddingVertical: 20,
        marginTop: 10,
        marginBottom: 25,
        elevation: 3,
        position: "relative"
    },
    progressText: {
        position: "absolute",
        top: "50%",
        fontSize: 24,
        fontWeight: "700",
        color: "#034078"
    },
    progressLabel: {
        fontSize: 14,
        color: "#555"
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
        paddingVertical: 20,
        borderRadius: 16,
        marginHorizontal: 5,
        elevation: 3
    },
    cardValue: { 
        fontSize: 22, 
        fontWeight: "700", 
        color: "#034078", 
        marginTop: 8 
    },
    cardLabel: { 
        fontSize: 14, 
        color: "#555", 
        marginTop: 2 
    },
    section: { 
        backgroundColor: "#fff", 
        borderRadius: 16, 
        padding: 20, 
        elevation: 3 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: "600", 
        color: "#034078", 
        marginBottom: 10 
    },
    areaRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginVertical: 6 
    },
    areaName: { 
        flex: 1, 
        fontSize: 15, 
        color: "#333" 
    },
    progressBarBackground: { 
        flex: 3, 
        height: 10, 
        backgroundColor: "#E5E7EB", 
        borderRadius: 8, 
        marginHorizontal: 8 
    },
    progressBarFill: { 
        height: 10, 
        backgroundColor: "#034078", 
        borderRadius: 8 
    },
    areaPercent: { 
        width: 40, 
        textAlign: "right", 
        fontSize: 13, 
        color: "#333" 
    },
    moreButton: { 
        marginTop: 25, 
        alignSelf: "center" 
    },
    moreButtonText: { 
        fontSize: 14, 
        color: "#777", 
        fontStyle: "italic"
    },
});
