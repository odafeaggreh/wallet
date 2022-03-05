import React, { useState } from "react";
import { useEffect } from "react";
import { auth } from "./firebase";
import { SignedInSack, SignedOutStack } from "./navigation/nav";
import { DrawerNavStack } from "./navigation/draw";
import NavigationDrawer from "./components/NavigationDrawer";
import { useAuth } from "./context/AuthContext";
import ReactNativeBiometrics from "react-native-biometrics";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert, View, Text } from "react-native";
import * as RootNavigation from "./navigation/RootNavigation";

const AuthNavigation = ({ navigation }) => {
  const { currentUser } = useAuth();

  return <>{currentUser ? <SignedInSack /> : <SignedOutStack />}</>;
};

export default AuthNavigation;
