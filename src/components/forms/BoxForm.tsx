import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface BoxFormProps {
  boxTitle: string;
  boxDescription: string;
  boxDeadline: string;
  boxArea: string | null;
  errorBox: string;
  setBoxTitle: (val: string) => void;
  setBoxDescription: (val: string) => void;
  setBoxDeadline: (val: string) => void;
  openAreaPicker: () => void;
  handleCreateBox: () => void;
}

export default function BoxForm({
  boxTitle,
  boxDescription,
  boxDeadline,
  boxArea,
  errorBox,
  setBoxTitle,
  setBoxDescription,
  setBoxDeadline,
  openAreaPicker,
  handleCreateBox,
}: BoxFormProps) {
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
        placeholder="Como essa box vai se chamar?"
        value={boxTitle}
        onChangeText={setBoxTitle}
        maxLength={60}
        multiline
        showCounter
      />

      <Text style={styles.label}>Descrição*</Text>
      <Input
        style={styles.input}
        placeholder="O que você deseja organizar aqui?"
        value={boxDescription}
        onChangeText={setBoxDescription}
        maxLength={120}
        multiline
        showCounter
      />

      <Text style={styles.label}>Prazo</Text>
      <Input
        style={styles.input}
        placeholder="Adicione uma data de conclusão"
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

      <Text style={styles.label}>Área*</Text>
      <TouchableOpacity style={styles.pickerBtn} onPress={openAreaPicker}>
        <Text style={styles.pickerBtnText}>
          {boxArea ? boxArea : "Escolher uma opção da lista"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#999" />
      </TouchableOpacity>

      {errorBox ? <Text style={styles.errorText}>{errorBox}</Text> : null}

      <Button title="Cadastrar" variant="primary" onPress={handleCreateBox} />
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
    marginBottom: 30,
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
