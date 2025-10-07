import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { RootStackParamList } from "../App";

interface HomeScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function HomeScreen({ navigate }: HomeScreenProps) {
  const handleAdd = () => {
    navigate("Add");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onAdd={handleAdd} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.card}>
          <Ionicons name="trending-up-sharp" size={30} color="#eef4ed" />
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardSubtitle}>O resumo do caos diário.</Text>
        </View>

        <View style={styles.styleSubCard}>
          <View style={styles.subCard}>
            <Ionicons name="calendar-sharp" size={30} color="#034078" />
            <Text style={styles.subCardTitle}>Calendário</Text>
            <Text style={styles.subCardSubtitle}>Tudo sob controle… ou quase.</Text>
          </View>
          <View style={styles.subCard}>
            <Ionicons name="information-circle-sharp" size={30} color="#034078" />
            <Text style={styles.subCardTitle}>Ajuda</Text>
            <Text style={styles.subCardSubtitle}>Apoio? Eu te ajudo docinho.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4ed" },
  card: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    margin: 20,
    height: 150,
    backgroundColor: "#034078",
  },
  cardTitle: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#eef4ed", 
    marginTop: 5 },
  cardSubtitle: { 
    fontSize: 15, 
    color: "#eef4ed", 
    marginTop: 5 },
  styleSubCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
  subCard: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    backgroundColor: "#8da9c4",
    marginHorizontal: 5,
    height: 150,
  },
  subCardTitle: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#034078", 
    marginTop: 5 
  },
  subCardSubtitle: { 
    fontSize: 15, 
    color: "#034078", 
    marginTop: 5 
  },
});
