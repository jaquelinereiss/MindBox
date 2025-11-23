import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ItemFormProps {
  itemTitle: string;
  itemDescription: string;
  itemPriority: string;
  itemBox: string | null;
  itemSubarea: string | null;
  subareaOptions: string[];
  boxDeadline: string;
  errorItem: string;
  setItemTitle: (val: string) => void;
  setItemDescription: (val: string) => void;
  setItemPriority: (val: string) => void;
  setBoxDeadline: (val: string) => void;
  openBoxPickerForItem: () => void;
  openSubareaPicker: () => void;
  handleAddItem: () => void;
}

export default function ItemForm({
  itemTitle,
  itemDescription,
  itemPriority,
  itemBox,
  itemSubarea,
  subareaOptions,
  boxDeadline,
  errorItem,
  setItemTitle,
  setItemDescription,
  setItemPriority,
  setBoxDeadline,
  openBoxPickerForItem,
  openSubareaPicker,
  handleAddItem
}: ItemFormProps) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Informe um nome para o item"
        value={itemTitle}
        onChangeText={setItemTitle}
        placeholderTextColor="#bfcad5"
        maxLength={50}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Conte mais sobre esse item (opcional)"
        value={itemDescription}
        onChangeText={setItemDescription}
        placeholderTextColor="#bfcad5"
        maxLength={100}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Defina uma prioridade: 1 a 4 (opcional)"
        value={itemPriority}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          if (numeric === "" || /^[1-4]$/.test(numeric)) setItemPriority(numeric);
        }}
        keyboardType="numeric"
        placeholderTextColor="#bfcad5"
      />
      <TextInput
        style={styles.input}
        placeholder="Indique a data de realização"
        value={boxDeadline}
        onChangeText={setBoxDeadline}
        placeholderTextColor="#bfcad5"
        keyboardType="number-pad"
        maxLength={10}
      />
      <TouchableOpacity style={styles.pickerBtn} onPress={openBoxPickerForItem}>
        <Text style={styles.pickerBtnText}>
          {itemBox ? itemBox : "Box (escolha uma opção da lista)"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#0b2545" />
      </TouchableOpacity>
      {subareaOptions.length > 0 && (
        <TouchableOpacity style={styles.pickerBtn} onPress={openSubareaPicker}>
          <Text style={styles.pickerBtnText}>
            {itemSubarea ? itemSubarea : "Subárea (escolha uma opção da lista)"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#0b2545" />
        </TouchableOpacity>
      )}
      {errorItem ? <Text style={styles.errorText}>{errorItem}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleAddItem}>
        <Text style={styles.submitButtonText}>Adicionar item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15, 
    fontSize: 15 
  },
  pickerBtn: { 
    backgroundColor: "#fff", 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 12, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  pickerBtnText: { 
    color: "#0b2545", 
    fontSize: 14 
  },
  submitButton: {
    backgroundColor: "#8da9c4", 
    borderRadius: 80, 
    paddingVertical: 12, 
    marginTop: 15, 
    alignItems: "center" 
  },
  submitButtonText: { 
    color: "#0b2545", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  errorText: { 
    fontSize: 14, 
    marginBottom: 8, 
    textAlign: "center", 
    color: "#ff9013" 
  },
});
