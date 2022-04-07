import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignedInSack, SignedOutStack } from "./navigation/nav";
import CreatePin from "./screens/CreatePin";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AppState,
} from "react-native";
import EnterPin from "./screens/EnterPin";
import { useAppState } from "@react-native-community/hooks";
import { useAuth } from "./context/AuthContext";

const EnterPinNavigation = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { userAppState, setUserAppState } = useAuth();

  return <>{userAppState ? <EnterPin /> : <SignedInSack />}</>;
};

export default EnterPinNavigation;
