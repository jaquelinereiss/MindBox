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
                  item_completed: d.item_completed ?? false
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
      setFData("Data não informada :)")
    }
  }, [box.id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Boxes")}>
          <Ionicons name="arrow-back" size={28} color="#eef4ed"/>
        </TouchableOpacity>

        <Text style={styles.title}>{box.box_title}</Text>

        {box.box_description ? (
          <Text style={styles.description}>{box.box_description}</Text>
        ) : null}

        <View style={styles.infoContainer}>
          {box.area_name && (
            <Text style={styles.infoText}>
              <Ionicons name="reader" size={16} color="#eef4ed"/> Área: {box.area_name}
            </Text>
          )}
          {fdata && (
            <Text style={styles.infoText}>
              <Ionicons name="calendar" size={16} color="#eef4ed"/> Prazo: {fdata}
            </Text>
          )}
        </View>
      </View>

      {/* Lista de itens */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemCard item={item}/>}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 25,
    borderRadius: 8,
    padding: 5,
    marginTop: 25,
    marginBottom: 25
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10,
  },
  description: { 
    fontSize: 15, 
    color: "#eef4ed",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  infoText: { 
    fontSize: 13, 
    color: "#eef4ed",
    marginBottom: 5,
    flexDirection: "row",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});