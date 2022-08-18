import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView, StatusBar, Text } from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { SignedInSack } from "../navigation/nav";

const CreatePin = ({ navigation }) => {
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [getUserPin, setUserGetPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsPinEntered, isPinEntered } = useAuth();

  const storePin = async (enteredPin) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("pin", enteredPin);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      setIsPinEntered(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (enteredPin.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (enteredPin.length < 0) {
      setIsLoading(true);
    }
    if (enteredPin.length === 4) {
      storePin(enteredPin);
    } else {
      setShowCompletedButton(false);
    }
  }, [enteredPin]);

  const btnText = {
    one: "1",
    two: "2 \n ABC",
    three: "3 \n DEF",
    four: "4 \n GHI",
    five: "5 \n JKL",
    six: "6 \n MNO",
    seven: "7 \n PQRS",
    eight: "8 \n TUV",
    nine: "9 \n WXYZ",
    zero: "0",
  };

  if (!isPinEntered) {
    return (
      <>
        {/* Loading indicator */}

        <Loader isLoading={isLoading} message="validating PIN..." />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}
        >
          <View style={{ height: SIZES.height }}>
            {/* LOGO */}
            <View
              style={{
                alignItems: "center",
                marginTop: 100,
                marginBottom: 0,
                height: SIZES.height * 0.2,
              }}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 480 480"
                style={{
                  enableBackground: "new 0 0 480 480",
                }}
                xmlSpace="preserve"
              >
                <Path
                  d="m113.3 197.6-14 14c-3.9 3.7-7 8.2-9.1 13.1S87 235 87 240.4s1.1 10.7 3.2 15.6 5.2 9.4 9.1 13.1l112.8 114c2.7 2.7 5.8 5 9.2 6.7V251.7l-108-54.1z"
                  style={{
                    fill: "#3d89f5",
                  }}
                />
                <Path
                  d="m367.7 197.6 14 14c3.9 3.7 7 8.2 9.1 13.1s3.2 10.3 3.2 15.6-1.1 10.7-3.2 15.6-5.2 9.4-9.1 13.1L268.9 383c-2.7 2.7-5.8 5-9.2 6.7v-138l108-54.1z"
                  style={{
                    fill: "#1656b9",
                  }}
                />
                <Path
                  d="M340.6 169 270 98.2c-3.7-3.9-8.2-6.9-13.2-9S246.6 86 241.2 86s-10.7 1.1-15.6 3.2-9.4 5.2-13.2 9L141.7 169l99.2 49.5 99.7-49.5z"
                  style={{
                    fill: "#85b5f8",
                  }}
                />
              </Svg>
            </View>
            {/* PIN VIEW */}
            <View style={{ height: SIZES.height * 0.8 }}>
              <View style={{ marginTop: 90, marginBottom: 60 }}>
                <Text
                  style={{
                    color: "#1656B9",
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  Create PIN
                </Text>
              </View>

              <View>
                <ReactNativePinView
                  inputSize={30}
                  activeOpacity={0.5}
                  buttonTextByKey={btnText}
                  ref={pinView}
                  pinLength={4}
                  buttonSize={55}
                  onValueChange={(value) => setEnteredPin(value)}
                  buttonAreaStyle={{
                    marginTop: 30,
                    marginBottom: 10,
                    backgroundColor: "#1656b9",
                  }}
                  inputAreaStyle={{
                    marginBottom: 10,
                  }}
                  inputViewEmptyStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 1.1,
                    borderColor: "#1656b9",
                  }}
                  inputViewFilledStyle={{
                    backgroundColor: "#1656b9",
                  }}
                  buttonViewStyle={{
                    borderRadius: 0,
                  }}
                  buttonTextStyle={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                  onButtonPress={(key) => {
                    if (key === "custom_right") {
                      pinView.current.clear();
                    }
                  }}
                  customRightButton={
                    <Icon name={"ios-backspace"} size={36} color={"#fff"} />
                  }
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  } else {
    return <SignedInSack />;
  }
};

export default CreatePin;
