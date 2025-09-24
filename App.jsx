import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import BoxesScreen from "./screens/BoxesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import Menu from "./components/Menu";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case "Add":
        return <AddScreen onNavigate={setCurrentScreen} />;
      case "Boxes":
        return <BoxesScreen onNavigate={setCurrentScreen} />;
      case "Settings":
        return <SettingsScreen onNavigate={setCurrentScreen} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <Menu currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4ed" },
});
