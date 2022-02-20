import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FONTS, COLORS } from "../constants";

const TabIcon = ({ focused, icon, iconStyle, label, isTrade }) => {
  const styles = StyleSheet.create({
    myIcons: {
      width: 125,
      height: 25,
      tintColor: focused ? COLORS.lightBlueAccent : COLORS.lightGray3,
      ...iconStyle,
    },
  });

  if (isTrade) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
          borderRadius: 30,
          backgroundColor: COLORS.lightBlueAccent,
        }}
      >
        <Image
          source={icon}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.white,
            ...iconStyle,
          }}
        />
        <Text style={{ color: COLORS.white, ...FONTS.body5 }}>{label}</Text>
      </View>
    );
  } else {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={icon} resizeMode="contain" style={styles.myIcons} />
        <Text
          style={{
            color: focused ? COLORS.lightBlueAccent : COLORS.lightGray3,
            ...FONTS.body5,
          }}
        >
          {label}
        </Text>
      </View>
    );
  }
};

export default TabIcon;
