import { Text, StyleSheet, Animated, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#3396D3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
});
