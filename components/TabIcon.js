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
          marginTop: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={icon}
          resizeMode="contain"
          style={{
            width: 125,
            height: 40,
            tintColor: COLORS.lightBlueAccent,
            ...iconStyle,
          }}
        />
        <Text style={{ color: COLORS.lightBlueAccent, ...FONTS.body5 }}>
          {label}
        </Text>
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
