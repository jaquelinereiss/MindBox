import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, TextInput, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BoxCard from "../components/BoxCard";
import { ScreenName } from "../App";
import getBoxes, { Box } from "../src/services/getBoxes";

interface BoxesScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export default function BoxesScreen({ onNavigate }: BoxesScreenProps) {
  const [search, setSearch] = useState<string>("");

  const [box, setBox] = useState<Box[]>();

  const filteredBoxes = (box ?? []).filter((b) =>
    b.box_title.toLowerCase().includes(search.toLowerCase())
  );

  const getBoxesScreen = async () => {
      try {
        const box: Box[] = await getBoxes();
        setBox(box);
      } catch (error) {
        console.error('Ops! Erro ao carregar os boxes:', error)
      }
    }
  
    useEffect(()=>{
      getBoxesScreen();
    },[box])

    const getColor = (area: number) => {
      switch (area) {
        case 1:
          return "#012a4a"
        case 2:
          return "#013a63"
        case 3:
          return "#01497c"
        case 4:
          return "#014f86"
        case 5:
          return "#2a6f97"
        case 6:
          return "#34699A"
        case 7:
          return "#154D71"
        case 8:
          return "#002855"
        case 9:
          return "#3e5c76"
        case 10:
          return "#3D74B6"
        case 11:
          return "#134074"
        case 12:
          return "#3E5879"
        case 13:
          return "#578FCA"
        case 14:
          return "#133E87"
        case 15:
          return "#023e7d"
        case 16:
          return "#23486A"
        case 17:
          return "#00296b"
        default:
          return "#13315c"
      }
    }

    const getIcon = (area: number) => {
      switch (area) {
        case 1:
          return "briefcase"
        case 2:
          return "home"
        case 3:
          return "earth"
        case 4:
          return "book"
        case 5:
          return "sparkles"
        case 6:
          return "flower"
        case 7:
          return "film"
        case 8:
          return "school"
        case 9:
          return "heart-half"
        case 10:
          return "cash"
        case 11:
          return "extension-puzzle"
        case 12:
          return "sunny"
        case 13:
          return "albums"
        case 14:
          return "paw"
        case 15:
          return "happy"
        case 16:
          return "fitness"
        case 17:
          return "airplane"
        default:
          return "flash-sharp"
      }
    }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.title}>Boxes</Text>
        <Text style={styles.subtitle}>Tudo que você guardou, bonitinho no lugar certo.</Text>
      </View>

      {/* Campo de busca */}
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
        keyExtractor={(item) => item.box_title}
        renderItem={({ item }) => (
          <BoxCard
            title={item.box_title}
            subtitle="itens: 5"
            color={getColor(item.box_area)}
            icon={getIcon(item.box_area)}
          />
        )}
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
