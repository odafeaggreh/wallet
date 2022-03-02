import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider as StoreProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import thunk from "redux-thunk";
import rootReducer from "../stores/rootReducer";
import Tabs from "./tabs";
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
import { Home } from "../screens";
import AppBar from "../components/AppBar";
import BuyCrypto from "../screens/BuyCrypto";
import Withdraw from "../screens/Withdraw";

const Stack = createStackNavigator();

const store = createStore(rootReducer, applyMiddleware(thunk));

export const SignedInSack = () => (
  <StoreProvider store={store}>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"MainLayout"}
        >
          <Stack.Screen name="MainLayout" component={Tabs} />
          <Stack.Screen name="BuyCrypto" component={BuyCrypto} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </StoreProvider>
);

export const SignedOutStack = () => (
  <StoreProvider store={store}>
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Login"}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  </StoreProvider>
);
