import { View, Text, Image } from "react-native";
import React from "react";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLinkTo } from "@react-navigation/native";

const ModalButtons = ({ icon, heading, text, route }) => {
  const linkTo = useLinkTo();
  return (
    <TouchableOpacity
      onPress={() => linkTo(route)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SIZES.padding,
        marginBottom: 10,
        marginTop: 10,
      }}
    >
      <View style={{ marginRight: 15 }}>
        <View
          style={{
            backgroundColor: "#BFDAFF",
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Image
            source={icon}
            resizeMode="contain"
            style={{ width: 15, height: 15, tintColor: COLORS.lightBlueAccent }}
          />
        </View>
      </View>
      <View style={{ flexGrow: 1 }}>
        <Text style={{ textAlign: "left", fontWeight: "bold", ...FONTS.h3 }}>
          {heading}
        </Text>
        <Text style={{ ...FONTS.body4 }}>{text}</Text>
      </View>
      <View>
        <Image
          source={icons.rightArrow}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: COLORS.lightGray3,
            opacity: 0.8,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ModalButtons;
