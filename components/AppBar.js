import { Appbar, Menu } from "react-native-paper";
import { View } from "react-native";
import { SIZES, COLORS, FONTS } from "../constants";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NavigationDrawer from "./NavigationDrawer";
import { useState } from "react";
import { DrawerActions } from "@react-navigation/native";

function AppBar({ title, navigation }) {
  // const openMenu = (navigation) => {
  //   navigation.openDrawer();
  //   console.log(navigation.openDrawer());
  // };

  // function openMyDrawer() {
  //   navigation.openDrawer();
  // }

  const { logout } = useAuth();

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
        <Appbar.Content title={title} />

        <Appbar.Action icon="qrcode-scan" onPress={logout} />
      </Appbar.Header>
    </View>
  );
}

export default AppBar;
