import { Appbar, Menu } from "react-native-paper";
import { View } from "react-native";
import { SIZES, COLORS, FONTS } from "../constants";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NavigationDrawer from "./NavigationDrawer";
import { useState } from "react";
import { DrawerActions } from "@react-navigation/native";

function AppBar({ title, navigation }) {
  const qrScan = () => {
    console.log("Scanner");
  };

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
        <Appbar.Content title={title} />

        <Appbar.Action icon="qrcode-scan" onPress={qrScan} />
      </Appbar.Header>
    </View>
  );
}

export default AppBar;
