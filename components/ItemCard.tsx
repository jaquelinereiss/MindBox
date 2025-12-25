import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Item } from "../src/navigation/types";
import completeItem from "../src/services/items/completeItem";
import OptionsModal from "../components/OptionsModal";
import ItemEditModal from "../components/ItemEditModal";
import ItemDeleteModal from "../components/ItemDeleteModal";

interface ItemCardProps {
  item: Item;
  onDeleteSuccess: (itemId: number) => void;
  onItemUpdated: (updatedItem: Item) => void;
  context?: "box" | "calendar";
}

export default function ItemCard({ item, onDeleteSuccess, onItemUpdated }: ItemCardProps) {
  const [itemState, setItemState] = useState(item);
  const [completed, setCompleted] = useState(item.item_completed || false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return "Data não definida";

    try {
      const dateObj = new Date(isoDate);
      const day = String(dateObj.getUTCDate()).padStart(2, "0");
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const year = dateObj.getUTCFullYear();

      return `${day}/${month}/${year}`;
    } catch {
      return "Data inválida";
    }
  };

  const toggleCompletion = async () => {
    const newStatus = !completed;
    setCompleted(newStatus);

    const { error } = await completeItem(itemState.id, newStatus);

    if (error) {
      Alert.alert("Erro", "Não foi possível atualizar o item.");
      setCompleted(!newStatus);
      return;
    }

    onItemUpdated({
      ...itemState,
      item_completed: newStatus
    });

    setItemState(prev => ({ ...prev, item_completed: newStatus }));
  };

  const handleItemUpdated = (updatedItem: Item) => {
    setItemState(updatedItem);
    setCompleted(updatedItem.item_completed || false);

    onItemUpdated(updatedItem);
  };

  return (
    <View style={[styles.card, completed && styles.completedCard]}>
      <View style={styles.left}>
        <TouchableOpacity onPress={toggleCompletion}>
          <Ionicons
            name={completed ? "checkbox" : "square-outline"}
            size={30}
            color={completed ? "#777" : "#134074"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text
          style={[
            styles.title,
            completed && { textDecorationLine: "line-through" },
            completed && styles.completedText,
          ]}
        >
          {itemState.item_title}
        </Text>

        <Text
          style={[
            styles.description,
            completed && styles.completedText,
            completed && { textDecorationLine: "line-through" }
          ]}
        >
          {itemState.item_description}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Prioridade: {itemState.priority_number}
          </Text>
          <Text style={styles.metaText}>
            Data: {formatDate(itemState.realization_date ?? null)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.right}
        onPress={() => setOptionsVisible(true)}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={25}
          color={completed ? "#777" : "#134074"}
        />
      </TouchableOpacity>

      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        type="item"
        onEdit={() => {
          setOptionsVisible(false);
          setEditModalVisible(true);
        }}
        onDelete={() => {
          setOptionsVisible(false);
          setDeleteModalVisible(true);
        }}
      />

      <ItemEditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        item={itemState}
        boxAreaId={itemState.box_related}
        onItemUpdated={handleItemUpdated}
      />

      <ItemDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        item={itemState}
        onDeleteSuccess={(id) => {
          onDeleteSuccess(id);
          setDeleteModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3
  },
  left: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  center: {
    flex: 1,
    justifyContent: "center"
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#134074",
    marginBottom: 3
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  metaText: {
    fontSize: 12,
    color: "#999"
  },
  completedCard: {
    opacity: 0.7
  },
  completedText: {
    color: "#777"
  }
});
