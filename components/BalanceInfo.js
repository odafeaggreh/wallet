import React from "react";
import { View, Text, Image } from "react-native";
import { SIZES, COLORS, FONTS, icons } from "../constants";

const BalanceInfo = ({
  title,
  displayAmount,
  changePercentage,
  containerStyle,
}) => {
  function numberToMoney(
    amount,
    simbol = "$",
    decimalCount = 2,
    decimal = ".",
    thousands = ","
  ) {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    const i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      simbol +
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  }
  return (
    <View style={{ ...containerStyle }}>
      <Text style={{ ...FONTS.h3, color: COLORS.black }}>{title}</Text>

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {/* <Text style={{ ...FONTS.h3, color: COLORS.lightGray3 }}>$</Text> */}
        <Text
          style={{ marginLeft: SIZES.base, ...FONTS.h2, color: COLORS.white }}
        >
          {numberToMoney(displayAmount)}
        </Text>
        <Text style={{ color: COLORS.black, ...FONTS.h3 }}>USD</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        {changePercentage != 0 && (
          <Image
            source={icons.upArrow}
            style={{
              width: 10,
              height: 10,
              alignSelf: "center",
              tintColor: changePercentage > 0 ? COLORS.lightGreen : COLORS.red,
              transform:
                changePercentage > 0
                  ? [{ rotate: "45deg" }]
                  : [{ rotate: "125deg" }],
            }}
          />
        )}
        <Text
          style={{
            marginLeft: SIZES.base,
            alignSelf: "flex-end",
            color:
              changePercentage == 0
                ? COLORS.lightGray3
                : changePercentage > 0
                ? COLORS.lightGreen
                : COLORS.red,
            ...FONTS.h4,
          }}
        >
          {changePercentage.toFixed(2)}%
        </Text>

        <Text
          style={{
            marginLeft: SIZES.radius,
            alignSelf: "flex-end",
            color: COLORS.black,
            ...FONTS.h5,
          }}
        >
          7d Change
        </Text>
      </View>
    </View>
  );
};

export default BalanceInfo;
