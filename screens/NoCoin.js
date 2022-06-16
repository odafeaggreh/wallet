import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { COLORS, icons, SIZES, FONTS } from "../constants";
import { Surface } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLinkTo } from "@react-navigation/native";

const NoCoin = () => {
  const linkTo = useLinkTo();
  const TransferBTn = (icon, text, location) => {
    return (
      <Surface
        style={{
          elevation: 2,
          marginHorizontal: SIZES.padding,
          height: 80,
          justifyContent: "center",
          paddingHorizontal: 20,
          borderRadius: 10,
          width: SIZES.width - SIZES.padding * 2,
        }}
      >
        <TouchableOpacity onPress={() => linkTo(location)}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#BFDAFF",
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Image
                source={icon}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: COLORS.lightBlueAccent,
                }}
              />
            </View>
            <Text style={{ ...FONTS.h3, color: COLORS.black }}>{text}</Text>
            <Image
              source={icons.rightArrow}
              style={{ width: 20, height: 20, tintColor: COLORS.lightGray3 }}
            />
          </View>
        </TouchableOpacity>
      </Surface>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{}}>
        <Image
          source={icons.coinImage}
          style={{
            width: SIZES.width - SIZES.padding * 1.5,
            height: 200,
            resizeMode: "contain",
            marginHorizontal: 20,
            alignSelf: "center",
          }}
        />
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <Text style={{ ...FONTS.h3, color: COLORS.black, textAlign: "center" }}>
          You don't have any coins
        </Text>
        <Text
          style={{ ...FONTS.body4, color: COLORS.black, textAlign: "center" }}
        >
          You can buy or receive coins by tapping one of the buttons below
        </Text>
      </View>

      <View style={{ marginTop: 90, marginBottom: 20 }}>
        {TransferBTn(icons.cart, "Buy cryptocurrency", "/Buy")}
      </View>
      <View style={{ marginTop: 10 }}>
        {TransferBTn(icons.qr, "Receive cryptocurrency", "/BuyCrypto")}
      </View>
    </View>
  );
};

export default NoCoin;
