import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SelectField } from "../ui/SelectField";

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
      <Input
        style={styles.input}
        label="Título"
        required
        placeholder="O que precisa ser feito?"
        value={itemTitle}
        onChangeText={setItemTitle}
        maxLength={50}
        multiline
        showCounter
      />

      <Input
        style={styles.input}
        label="Descrição"
        placeholder="Conte mais sobre esse item"
        value={itemDescription}
        onChangeText={setItemDescription}
        maxLength={200}
        multiline
        showCounter
      />

      <Input
        style={styles.input}
        label="Prioridade"
        placeholder="Escolha uma prioridade de 1 a 4"
        value={itemPriority}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          if (numeric === "" || /^[1-4]$/.test(numeric))
            setItemPriority(numeric);
        }}
        keyboardType="numeric"
      />

      <Input
        style={styles.input}
        label="Prazo"
        required
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

      <SelectField
        label="Box"
        required
        value={itemBox ?? undefined}
        placeholder="Escolher uma opção da lista"
        onPress={openBoxForItemModal}
      />

      {subareaOptions.length > 0 && (
        <SelectField
          label="Subárea"
          required
          value={itemSubarea ?? undefined}
          placeholder="Escolher uma opção da lista"
          onPress={openSubareaModal}
        />
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
  errorText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#c1121f",
  },
});
