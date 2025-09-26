import React, { useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TextInput, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BoxCard from "../components/BoxCard";
import boxes from "../src/data/boxes.json";
import { ScreenName } from "../App";

interface Box {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

interface BoxesScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export default function BoxesScreen({ onNavigate }: BoxesScreenProps) {
  const [search, setSearch] = useState<string>("");

  const filteredBoxes = (boxes as Box[]).filter((box) =>
    box.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.title}>Boxes</Text>
        <Text style={styles.subtitle}>Tudo que você guardou, bonitinho no lugar certo.</Text>
      </View>

      {/* Campo de busca com o mesmo estilo do Header */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-sharp" size={20} color="#134074" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Buscar box..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de Boxes */}
      <FlatList
        data={filteredBoxes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoxCard {...item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 5 }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 80,
          paddingTop: 10,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4ed", padding: 20, marginTop: 30 },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 15, color: "gray", textAlign: "left", paddingHorizontal: 2 },
  paragraph: { fontSize: 18, color: "gray", textAlign: "center", paddingHorizontal: 2, fontWeight: "bold", marginTop: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    width: "100%",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 5,
    elevation: 3,
  },
  input: { flex: 1, fontSize: 16 },
});
