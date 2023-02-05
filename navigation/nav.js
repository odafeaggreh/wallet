import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider as StoreProvider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import thunk from "redux-thunk";
import rootReducer from "../stores/rootReducer";
import Tabs from "./tabs";
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
import { Home, Profile } from "../screens";
import AppBar from "../components/AppBar";
import BuyCrypto from "../screens/BuyCrypto";
import Withdraw from "../screens/Withdraw";
import { navigationRef } from "./RootNavigation";
import CreatePin from "../screens/CreatePin";
import EnterPin from "../screens/EnterPin";
import MyTabs from "./newTabs";
import tabs from "./tabs";
import ChangePassword from "../screens/ChangePassword";
import Swap from "../screens/Swap";
import Send from "../screens/Send";
import Bank from "../screens/Bank";
import Crypto from "../screens/Crypto";
import Buy from "../screens/Buy";
import Sell from "../screens/Sell";

const Stack = createStackNavigator();

const store = createStore(rootReducer, applyMiddleware(thunk));

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surface: "white",
  },
};

export const SignedInSack = () => (
  <StoreProvider store={store}>
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"MainLayout"}
        >
          <Stack.Screen name="MainLayout" component={MyTabs} />
          <Stack.Screen name="BuyCrypto" component={BuyCrypto} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
          <Stack.Screen name="password" component={ChangePassword} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Swap" component={Swap} />
          <Stack.Screen name="Send" component={Send} />
          <Stack.Screen name="Bank" component={Bank} />
          <Stack.Screen name="Crypto" component={Crypto} />
          <Stack.Screen name="Buy" component={Buy} />
          <Stack.Screen name="Sell" component={Sell} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </StoreProvider>
);

export const SignedOutStack = () => (
  <StoreProvider store={store}>
    <PaperProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Login"}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CreatePin" component={CreatePin} />
          <Stack.Screen name="EnterPin" component={EnterPin} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </StoreProvider>
);
