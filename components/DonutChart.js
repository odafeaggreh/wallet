import { View, Text, Animated } from "react-native";
import React from "react";
import Svg, { G, Circle } from "react-native-svg";

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DonutChart = ({
  percentage,
  radius = 50,
  strokeWidth = 10,
  duration = 500,
  color,
  delay = 0,
  textColor,
  max = 100,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef();
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circleCircumference - (circleCircumference * percentage) / 100;

  console.log(color);

  return (
    <View>
      <Svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            strokeOpacity={0.2}
            fill="transparent"
          />
          <Circle
            cx="50%"
            cy="50%"
            stroke={color}
            strokeWidth={strokeWidth}
            r={radius}
            fill="transparent"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

export default DonutChart;
