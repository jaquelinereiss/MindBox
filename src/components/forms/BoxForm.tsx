import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SelectField } from "../ui/SelectField";

interface BoxFormProps {
  boxTitle: string;
  boxDescription: string;
  boxDeadline: string;
  boxArea: string | null;
  errorBox: string;
  setBoxTitle: (val: string) => void;
  setBoxDescription: (val: string) => void;
  setBoxDeadline: (val: string) => void;
  openAreaModal: () => void;
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
  openAreaModal,
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
      <Input
        style={styles.input}
        label="Título"
        required
        placeholder="Como essa box vai se chamar?"
        value={boxTitle}
        onChangeText={setBoxTitle}
        maxLength={60}
        multiline
        showCounter
      />

      <Input
        style={styles.input}
        label="Descrição"
        required
        placeholder="O que você deseja organizar aqui?"
        value={boxDescription}
        onChangeText={setBoxDescription}
        maxLength={300}
        multiline
        showCounter
      />

      <Input
        style={styles.input}
        label="Prazo"
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

      <SelectField
        label="Área"
        required
        value={boxArea ?? undefined}
        placeholder="Escolher uma opção da lista"
        onPress={openAreaModal}
      />

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
  errorText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#c1121f",
  },
});
