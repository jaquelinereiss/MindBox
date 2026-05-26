import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

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
  openBoxForItemModal: () => void;
  openSubareaModal: () => void;
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
  openBoxForItemModal,
  openSubareaModal,
  handleAddItem,
}: ItemFormProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirmDate = (date: Date) => {
    const formatted = date.toLocaleDateString("pt-BR");

    setBoxDeadline(formatted);

    setDatePickerVisibility(false);
  };

  return (
    <View>
      <Text style={styles.label}>Título*</Text>
      <Input
        style={styles.input}
        placeholder="O que precisa ser feito?"
        value={itemTitle}
        onChangeText={setItemTitle}
        maxLength={50}
        multiline
        showCounter
      />

      <Text style={styles.label}>Descrição</Text>
      <Input
        style={styles.input}
        placeholder="Conte mais sobre esse item"
        value={itemDescription}
        onChangeText={setItemDescription}
        maxLength={100}
        multiline
        showCounter
      />
      <Text style={styles.label}>Prioridade</Text>
      <Input
        style={styles.input}
        placeholder="Escolha uma prioridade de 1 a 4"
        value={itemPriority}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          if (numeric === "" || /^[1-4]$/.test(numeric))
            setItemPriority(numeric);
        }}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Prazo*</Text>
      <Input
        style={styles.input}
        placeholder="Quando esse item deve ser realizado?"
        value={boxDeadline}
        onChangeText={setBoxDeadline}
        icon="calendar-outline"
        iconPosition="right"
        onPressIcon={() => setDatePickerVisibility(true)}
        keyboardType="number-pad"
        maxLength={10}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Box*</Text>
      <TouchableOpacity style={styles.pickerBtn} onPress={openBoxForItemModal}>
        <Text style={styles.pickerBtnText}>
          {itemBox ? itemBox : "Escolher uma box para adicionar o item"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#034078" />
      </TouchableOpacity>

      {subareaOptions.length > 0 && <Text style={styles.label}>Subárea*</Text>}
      {subareaOptions.length > 0 && (
        <TouchableOpacity style={styles.pickerBtn} onPress={openSubareaModal}>
          <Text style={styles.pickerBtnText}>
            {itemSubarea ? itemSubarea : "Escolher uma opção da lista"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#034078" />
        </TouchableOpacity>
      )}

      {errorItem ? <Text style={styles.errorText}>{errorItem}</Text> : null}

      <Button title="Adicionar" variant="primary" onPress={handleAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 15,
  },
  pickerBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerBtnText: {
    color: "#999",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    color: "#134074",
    fontWeight: "500",
    marginBottom: 2,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#c1121f",
  },
});
