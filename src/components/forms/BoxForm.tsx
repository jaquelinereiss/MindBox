import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  handleCreateBox
}: BoxFormProps) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Informe um título bem legal aqui"
        value={boxTitle}
        onChangeText={setBoxTitle}
        placeholderTextColor="#bfcad5"
        maxLength={60}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Descreva sua box em poucas palavras"
        value={boxDescription}
        onChangeText={setBoxDescription}
        placeholderTextColor="#bfcad5"
        maxLength={120}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Defina um prazo (opcional)"
        value={boxDeadline}
        onChangeText={setBoxDeadline}
        placeholderTextColor="#bfcad5"
        keyboardType="number-pad"
        maxLength={10}
      />
      <TouchableOpacity style={styles.pickerBtn} onPress={openAreaPicker}>
        <Text style={styles.pickerBtnText}>
          {boxArea ? boxArea : "Área (escolha uma opção da lista)"}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#0b2545" />
      </TouchableOpacity>
      {errorBox ? <Text style={styles.errorText}>{errorBox}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleCreateBox}>
        <Text style={styles.submitButtonText}>Cadastrar box</Text>
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
