import React from "react";
import { SafeAreaView, View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { RootStackParamList } from "../../navigation/types";
import BoxForm from "../../components/forms/BoxForm";
import ItemForm from "../../components/forms/ItemForm";
import BottomSheetCurved from "../../components/ui/BottomSheetCurved";
import SelectModal from "../../components/modals/SelectModal";
import { formatDateInput } from "../../utils/date";
import { useAddScreen } from "../../hooks/add/useAddScreen";

interface AddScreenProps {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
}

export default function AddScreen({ navigate }: AddScreenProps) {
  const {
    tab,
    setTab,
    box,
    item,
    selectModal,
    openAreaModal,
    openBoxForItemModal,
    openSubareaModal,
    handleCreateBox,
    handleAddItem,
  } = useAddScreen(navigate);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topHeader}>
        <Text style={styles.title}>Adicionar</Text>
        <Text style={styles.subtitle}>
          Vamos colocar suas ideias em movimento?
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BottomSheetCurved
          activeSide={tab === "Box" ? "left" : "right"}
          leftLabel="Box"
          rightLabel="Item"
          onLeftPress={() => setTab("Box")}
          onRightPress={() => setTab("Item")}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {tab === "Box" ? (
              <BoxForm
                boxTitle={box.title}
                boxDescription={box.description}
                boxDeadline={box.deadline}
                boxArea={box.area}
                errorBox={box.error}
                setBoxTitle={box.setTitle}
                setBoxDescription={box.setDescription}
                setBoxDeadline={(text) => box.setDeadline(formatDateInput(text))}
                openAreaModal={openAreaModal}
                handleCreateBox={handleCreateBox}
              />
            ) : (
              <ItemForm
                itemTitle={item.title}
                itemDescription={item.description}
                itemPriority={item.priority}
                itemBox={item.box}
                itemSubarea={item.subarea}
                subareaOptions={item.subareaOptions}
                boxDeadline={box.deadline}
                errorItem={item.error}
                setItemTitle={item.setTitle}
                setItemDescription={item.setDescription}
                setItemPriority={item.setPriority}
                setBoxDeadline={(text) => box.setDeadline(formatDateInput(text))}
                openBoxForItemModal={openBoxForItemModal}
                openSubareaModal={openSubareaModal}
                handleAddItem={handleAddItem}
              />
            )}
          </ScrollView>
        </BottomSheetCurved>
      </KeyboardAvoidingView>

      <SelectModal
        visible={selectModal.visible}
        title="Selecione uma opção"
        options={selectModal.options}
        onSelect={selectModal.onSelect}
        onClose={selectModal.closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b2545",
  },
  topHeader: {
    paddingVertical: 20,
    alignItems: "center",
    padding: 20,
    marginTop: 30,
    height: 130,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#c7d5ea",
    textAlign: "center",
    marginBottom: 10,
  },
});
