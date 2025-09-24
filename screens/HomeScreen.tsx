import React, { useState } from "react";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import Header from "../components/Header";
import BoxCard from "../components/BoxCard";
import boxes from "../src/data/boxes.json";
import { ScreenName } from "../App";

interface Box {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

interface HomeScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [search, setSearch] = useState<string>("");

  const filteredBoxes = (boxes as Box[]).filter((box) =>
    box.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (onNavigate) onNavigate("Add");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header search={search} setSearch={setSearch} onAdd={handleAdd} />

      <FlatList
        data={filteredBoxes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoxCard {...item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 15 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 90, paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4ed" },
});
