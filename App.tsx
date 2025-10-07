import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import BoxesScreen from "./screens/BoxesScreen";
import BoxDetailScreen from "./screens/BoxDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import Menu from "./components/Menu";

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Boxes: undefined;
  BoxDetailScreen: { box: any }; // precisa de param
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<keyof RootStackParamList>("Home");
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  // Função de navegação
  const handleNavigate = (screen: keyof RootStackParamList, params?: any) => {
    if (!navigationRef.current?.isReady()) return;

    if (screen === "BoxDetailScreen") {
      if (!params) {
        console.warn("BoxDetailScreen precisa de parâmetro 'box'");
        return;
      }
      navigationRef.current.navigate(screen, params); // BoxDetailScreen exige params
    } else {
      // Todas as outras telas não têm params
      navigationRef.current.navigate(screen as Exclude<keyof RootStackParamList, "BoxDetailScreen">);
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {() => <HomeScreen navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Add">
              {() => <AddScreen navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Boxes">
              {() => <BoxesScreen navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Settings" component={SettingsScreen} />

            <Stack.Screen name="BoxDetailScreen" component={BoxDetailScreen} />
          </Stack.Navigator>
        </View>

        <Menu
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          navigate={handleNavigate}
        />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ed",
  },
});
