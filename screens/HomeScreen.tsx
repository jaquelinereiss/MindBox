import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import { RootStackParamList } from "../App";
import { getUser } from "../src/services/auth";

interface HomeScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function HomeScreen({ navigate }: HomeScreenProps) {
  const handleAdd = () => {
    navigate("Add");
  };

  const handleDashboard = () => {
    navigate("Dashboard");
  };

  const [displayName, setDisplayName] = useState("");
  
  useEffect(() => {
    async function loadUser() {
      const { data } = await getUser();
      const name = data?.user?.user_metadata?.display_name;
      if (name) setDisplayName(name);
    }

    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onAdd={handleAdd}
        displayName={displayName}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <TouchableOpacity style={styles.card} onPress={handleDashboard} activeOpacity={0.8}>
          <Ionicons name="trending-up-sharp" size={30} color="#eef4ed" />
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardSubtitle}>O resumo do caos diário.</Text>
        </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: "#eef4ed"
  },
  card: {
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    margin: 20,
    height: 150,
    backgroundColor: "#034078",
    shadowColor: "#0b2545",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
  },
  cardTitle: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#eef4ed", 
    marginTop: 5 
  },
  cardSubtitle: { 
    fontSize: 15, 
    color: "#eef4ed", 
    marginTop: 5
  },
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
    shadowColor: "#0b2545",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 10,
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
  }
});
