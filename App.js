import React from "react";
import AuthNavigation from "./AuthNavigation";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { AuthProvider } from "./context/AuthContext";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App({ navigation }) {
  let [fontsLoaded] = useFonts({
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <AuthProvider>
        <AuthNavigation navigation={navigation} />
      </AuthProvider>
    );
  }
}
