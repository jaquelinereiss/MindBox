import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import BoxesScreen from "./screens/BoxesScreen";
import BoxDetailScreen from "./screens/BoxDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DashboardScreen from "./screens/DashboardScreen";
import Menu from "./components/Menu";

export type RootStackParamList = {
  Home: undefined;
  Add: undefined;
  Boxes: undefined;
  BoxDetailScreen: { box: any };
  Settings: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<keyof RootStackParamList>("Home");

  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleNavigate = <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T]
  ) => {
    if (!navigationRef.current?.isReady()) return;

    if (params !== undefined) {
      navigationRef.current.navigate({
        name: screen,
        params,
      } as never);
    } else {
      navigationRef.current.navigate({
        name: screen,
      } as never);
    }

    setCurrentScreen(screen);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Add">
              {(props) => <AddScreen {...props} navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Boxes">
              {(props) => <BoxesScreen {...props} navigate={handleNavigate} />}
            </Stack.Screen>

            <Stack.Screen name="Dashboard" component={DashboardScreen} />

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
