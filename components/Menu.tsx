import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../src/navigation/types";

interface MenuProps {
  currentScreen: keyof RootStackParamList;
  setCurrentScreen: (screen: keyof RootStackParamList) => void;
  navigate: (screen: keyof RootStackParamList) => void;
}

const menuItems = [
  { screen: "Home", icon: "home" },
  { screen: "Add", icon: "add-circle" },
  { screen: "Boxes", icon: "albums" },
  { screen: "Settings", icon: "settings" },
] as const;

export default function Menu({ currentScreen, setCurrentScreen, navigate }: MenuProps) {
  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.button}
          onPress={() => {
            setCurrentScreen(item.screen);
            navigate(item.screen);
          }}
        >
          <Ionicons
            name={item.icon as any}
            size={30}
            color={currentScreen === item.screen ? "#134074" : "#aaa"}
            style={styles.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#eef4ed",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: { 
    alignItems: "center", 
    flex: 1 
  },
  icon: { 
    margin: 10, 
    marginBottom: 35, 
    paddingBottom: 5 
  },
});
