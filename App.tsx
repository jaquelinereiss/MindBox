import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./src/lib/supabaseClient";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import BoxesScreen from "./screens/BoxesScreen";
import BoxDetailScreen from "./screens/BoxDetailScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DashboardScreen from "./screens/DashboardScreen";
import Menu from "./components/Menu";
import { ToastProvider } from "./components/ToastContext";
import CalendarScreen from "./screens/CalendarScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Add: undefined;
  Boxes: undefined;
  BoxDetailScreen: { box: any };
  Settings: undefined;
  Dashboard: undefined;
  Calendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screensWithMenu: (keyof RootStackParamList)[] = [
  "Home",
  "Add",
  "Boxes",
  "Settings",
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentScreen, setCurrentScreen] =
    useState<keyof RootStackParamList>("Home");

  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleNavigate = <T extends keyof RootStackParamList>(
    screen: T,
    params?: RootStackParamList[T],
  ) => {
    if (!navigationRef.current?.isReady()) return;

    navigationRef.current.navigate(
      params !== undefined
        ? ({ name: screen, params } as never)
        : ({ name: screen } as never),
    );

    setCurrentScreen(screen);
  };

  return (
    <ToastProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const route = navigationRef.current?.getCurrentRoute();
          if (route) {
            setCurrentScreen(route.name as keyof RootStackParamList);
          }
        }}
      >
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!isAuthenticated ? (
                <>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <LoginScreen
                        {...props}
                        onLoginSuccess={() => setIsAuthenticated(true)}
                      />
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home">
                    {(props) => (
                      <HomeScreen {...props} navigate={handleNavigate} />
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="Add">
                    {(props) => (
                      <AddScreen {...props} navigate={handleNavigate} />
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="Boxes">
                    {(props) => (
                      <BoxesScreen {...props} navigate={handleNavigate} />
                    )}
                  </Stack.Screen>

                  <Stack.Screen name="Settings">
                    {(props) => (
                      <SettingsScreen
                        {...props}
                        onLogout={async () => {
                          await supabase.auth.signOut();
                          setIsAuthenticated(false);
                        }}
                      />
                    )}
                  </Stack.Screen>

                  <Stack.Screen
                    name="BoxDetailScreen"
                    component={BoxDetailScreen}
                  />

                  <Stack.Screen name="Dashboard" component={DashboardScreen} />

                  <Stack.Screen name="Calendar" component={CalendarScreen} />
                </>
              )}
            </Stack.Navigator>
          </View>

          {isAuthenticated && screensWithMenu.includes(currentScreen) && (
            <Menu
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              navigate={handleNavigate}
            />
          )}
        </View>
      </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ed",
  },
});
