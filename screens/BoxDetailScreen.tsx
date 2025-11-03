import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Item } from "../src/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import getItems from "../src/services/getItems";
import ItemCard from "../components/ItemCard";
import OptionsModal from "../components/OptionsModal";
import BoxEditModal from "../components/BoxEditModal";
import BoxDeleteModal from "../components/BoxDeleteModal";

type Props = NativeStackScreenProps<RootStackParamList, "BoxDetailScreen">;

export default function BoxDetailScreen({ route, navigation }: Props) {
  const { box } = route.params;
  const [items, setItems] = useState<Item[]>([]);
  const [fdata, setFData] = useState<string>();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentBox, setCurrentBox] = useState(box);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleItemDeleted = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems(box.id.toString());
        const normalizedItems = data.map((d) => ({
          ...d,
          box_related: d.box_related ?? box.id, 
        }));

        setItems(normalizedItems);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      }
    };

    fetchItems();

    if (box.deadline_date) {
      setFData(new Date(box.deadline_date).toLocaleDateString("pt-BR"));
    } else {
      setFData("Data não informada :)");
    }
  }, [box.id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Boxes")}
        >
          <Ionicons name="arrow-back" size={28} color="#eef4ed" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setOptionsVisible(true)}
        >
          <Ionicons name="ellipsis-vertical" size={28} color="#eef4ed" />
        </TouchableOpacity>

        <Text style={styles.title}>{currentBox.box_title}</Text>
        {currentBox.box_description && (
          <Text style={styles.description}>{currentBox.box_description}</Text>
        )}

        <View style={styles.infoContainer}>
          {currentBox.area_name && (
            <Text style={styles.infoText}>
              <Ionicons name="reader" size={16} color="#eef4ed" /> Área:{" "}
              {currentBox.area_name}
            </Text>
          )}
          {fdata && (
            <Text style={styles.infoText}>
              <Ionicons name="calendar" size={16} color="#eef4ed" /> Prazo:{" "}
              {fdata}
            </Text>
          )}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard item={item} onDeleteSuccess={handleItemDeleted} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modais */}
      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        type="box"
        onEdit={() => {
          setOptionsVisible(false);
          setEditModalVisible(true);
        }}
        onDelete={() => {
          setOptionsVisible(false);
          setDeleteModalVisible(true);
        }}
      />

      <BoxEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        box={currentBox}
        onSave={(updatedBox) => setCurrentBox({ ...currentBox, ...updatedBox })}
      />

      <BoxDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        box={currentBox}
        onDeleted={() => navigation.navigate("Boxes")}
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
  optionsButton: {
    position: "absolute",
    left: 360,
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
  // ======= Menu de opções (box) =======
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  optionsContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#034078",
    textAlign: "left",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 2,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionDelete: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#034078",
    marginLeft: 12,
    fontWeight: "500",
  },
});