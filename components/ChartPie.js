import { View, Text } from "react-native";
import React from "react";
import { Pie } from "react-native-pie";

const ChartPie = () => {
  return (
    <View>
      <Pie
        radius={80}
        innerRadius={75}
        sections={[
          {
            percentage: 60,
            color: "#f00",
          },
        ]}
        backgroundColor="#ddd"
      />
    </View>
  );
};

export default ChartPie;
