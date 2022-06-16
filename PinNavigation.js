import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SignedInSack, SignedOutStack } from "./navigation/nav";
import CreatePin from "./screens/CreatePin";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import EnterPinNavigation from "./EnterPinNavigation";
import AppLoading from "expo-app-loading";

const PinNavigation = ({ navigation }) => {
  const [userGetPin, setUserGetPin] = useState(null);
  const [appReady, setAppReady] = useState(false);

  const getPin = async () => {
    try {
      await AsyncStorage.getItem("pin").then((value) => {
        if (value !== null) {
          setUserGetPin(value);
        } else {
          setUserGetPin(null);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPin();
  }, []);

  if (!appReady) {
    return (
      <AppLoading
        startAsync={getPin}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  } else {
    return <>{userGetPin ? <EnterPinNavigation /> : <CreatePin />}</>;
  }
};

export default PinNavigation;
