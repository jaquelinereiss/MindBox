import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ReactNode } from "react";

type CenterSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function CenterSheet({ visible, onClose, children }: CenterSheetProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    elevation: 8,
  },
});