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
  const [fdata, setFData] = useState<string>();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems(box.id.toString());
        setItems(
                  data.map((d) => ({
                  id: d.id,
                  item_title: d.item_title,
                  item_description: d.item_description,
                  priority_number: Number(d.priority_number) || 0, // converte pra number
                  box_related: d.box_related ?? 0,                 // fallback pra 0 se vier null
                  subarea_box: d.subarea_box ?? 0,                 // idem
                  realization_date: d.realization_date ?? "",
                  completed: false
          }))
        );
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      }
    };
    fetchItems();
    if(box.deadline_date){
      const rData = new Date(box.deadline_date)
      setFData(rData.toLocaleDateString("pt-BR"))
    } else {
      setFData("Voce não informou uma data bb...")
    }
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
        {box.box_description && <Text style={styles.description}>{box.box_description}</Text>}
        {box.area_name && <Text style={styles.description}>{box.area_name}</Text>}
        {fdata && <Text style={styles.description}>{fdata}</Text>}
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
