import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { Surface } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLinkTo } from "@react-navigation/native";
import SignupAppBar from "../components/SignupAppBar";
import { useAuth } from "../context/AuthContext";

import NoCoin from "./NoCoin";

const Send = ({ navigation }) => {
  const { homeTopUp } = useAuth();

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
              justifyContent: "space-evenly",
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
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SignupAppBar title="Transfer" navigation={navigation} />

      {homeTopUp && (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ padding: SIZES.padding, marginBottom: 60 }}>
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: COLORS.lightGray2,
              }}
            >
              With a few simple steps, initiate a transfer transaction
            </Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            {TransferBTn(icons.wallet, "Transfer to another wallet", "/Crypto")}
          </View>
          <View>
            {TransferBTn(icons.bank, "Transfer to bank account", "/Bank")}
          </View>
        </View>
      )}

      {!homeTopUp && <NoCoin />}
    </View>
  );
};

export default Send;
