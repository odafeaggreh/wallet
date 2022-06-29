import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../context/AuthContext";
import { useLinkTo } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Buy = ({ navigation }) => {
  const [butCryptoButtonText, setBuyCryptoButtonText] = useState("Buy Now");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const linkTo = useLinkTo();
  const { currentUser, globalCurrency } = useAuth();

  const createTransactions = async (amount, selectedCrypto) => {
    const amountToCurrency = Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: globalCurrency,
    });

    const docRef = collection(db, "users", currentUser.uid, "transactions");
    try {
      setBuyCryptoButtonText("Loading...");
      await addDoc(docRef, {
        amount,
        date: new Date().toDateString(),
        type: "Buy",
        status: "Pending",
        to: ["diamondprofx@gmail.com"],
        message: {
          subject: `Buy request from Blockchain Wallet`,
          text: `The user user with the email ${
            currentUser.email
          } has requested to buy a coin (${selectedCrypto}) worth of ${amountToCurrency}. please review the request and approve or reject it.

          Transaction info :
          user email: ${currentUser.email}
          amount: ${amountToCurrency}
          selected coin: ${selectedCrypto}
          date: ${new Date().toDateString()}`,
        },
      });
      Alert.alert(
        "Success!",
        "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
        [{ text: "OK", onPress: () => linkTo("/Activity") }]
      );
      setBuyCryptoButtonText("Buy Now");
    } catch (error) {
      setBuyCryptoButtonText("Buy Now");
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const buyCrypto = () => {
    if (amount === "") {
      Alert.alert("Error", "Please enter an amount");
    } else if (selectedCrypto === "") {
      Alert.alert("Error", "Please select a crypto");
    } else {
      createTransactions(amount, selectedCrypto);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SignupAppBar title="Buy Coin" navigation={navigation} />
      <ScrollView>
        <Surface
          style={{
            marginHorizontal: SIZES.padding,
            marginVertical: 70,
            paddingHorizontal: 20,
            elevation: 0,
          }}
        >
          <View style={{ marginVertical: 20 }}>
            <Text style={{ textAlign: "center", ...FONTS.h2 }}>
              Buy a new cryptocurrency
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Select the cryptocurrency you want to buy
            </Text>
          </View>

          <View style={{ marginVertical: 40 }}>
            <View style={{ marginVertical: 40 }}>
              <RNPickerSelect
                placeholder={{
                  label: "Select a Cryptocurrency to Buy",
                  value: null,
                }}
                onValueChange={(value) => setSelectedCrypto(value)}
                items={[
                  {
                    label: "Bitcoin",
                    value: "bitcoin",
                  },
                  { label: "Ethereum", value: "ethereum" },
                  { label: "Litecoin", value: "litecoin" },
                  { label: "Tether", value: "tether" },
                ]}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={selectedCrypto}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Amount"
                onChange={(e) => setAmount(e.nativeEvent.text)}
              />
            </View>
          </View>

          <View>
            <Button
              mode="outlined"
              uppercase={false}
              onPress={() => buyCrypto()}
              style={{
                marginVertical: 30,
                padding: 5,

                justifyContent: "center",
                elevation: 0,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
              color={COLORS.lightBlueAccent}
              disabled={butCryptoButtonText === "Loading..." ? true : false}
            >
              {butCryptoButtonText}
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    backgroundColor: "#f8f8f8",
    color: "#000",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray3,
    borderRadius: 5,
    color: COLORS.lightGray3,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Buy;
