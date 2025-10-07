import { NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { RootStackParamList } from "../src/navigation/types";
import { Box, Item } from "../src/types";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import getItems from "../src/services/getItems";
import ItemCard from "../components/ItemCard";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "BoxDetailScreen">;

export default function BoxDetailScreen({ route, navigation }: Props) {
  const { box } = route.params;
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems(box.id.toString());
        setItems(
          data.map((d) => ({
            id: d.id,
            title: d.item_title,
            description: d.item_description,
            priority: d.priority_number.toString(),
            date: d.realization_date,
            completed: d.completed || false
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      }
    };
    fetchItems();
  }, [box.id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Boxes")}>
            <Ionicons name="arrow-back" size={30} color="#eef4ed" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{box.box_title}</Text>
        {box.description && <Text style={styles.description}>{box.description}</Text>}
      </View>

      {/* Lista de itens do box */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#eef4ed" 
  },
  header: {
    backgroundColor: "#034078",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  description: { 
    fontSize: 16, 
    color: "#eef4ed",
    textAlign: "center"
  },
  listContent: {
    padding: 20,
    paddingBottom: 30
  }
});
