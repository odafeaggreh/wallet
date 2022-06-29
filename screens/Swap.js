import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useAuth } from "../context/AuthContext";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../firebase";
import { useLinkTo } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import NoCoin from "./NoCoin";

const Swap = ({ navigation }) => {
  const linkTo = useLinkTo();
  const { currentUser, homeTopUp, globalCurrency } = useAuth();

  console.log(homeTopUp);

  // Initiate swap crypto transaction
  const [swapCryptoButtonText, setSwapCryptoButtonText] = useState("Swap Coin");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [newCrypto, setNewCrypto] = useState("");
  const [swapType, setSwapType] = useState("Swap");

  const createTransactions = async (
    amount,
    type,
    selectedCrypto,
    newCrypto
  ) => {
    const amountToCurrency = Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: globalCurrency,
    });

    const docRef = collection(db, "users", currentUser.uid, "transactions");
    try {
      setSwapCryptoButtonText("Loading...");
      await addDoc(docRef, {
        amount,
        date: new Date().toDateString(),
        type,
        status: "Pending",
        to: ["diamondprofx@gmail.com"],
        message: {
          subject: `Swap request from Blockchain Wallet`,
          text: `The user user with the email ${
            currentUser.email
          } has requested to swap a coin (${selectedCrypto}) worth of ${amountToCurrency} to ${newCrypto}. please review the request and approve or reject it.

          Transaction info :
          user email: ${currentUser.email}
          amount: ${amountToCurrency}
          selected coin: ${selectedCrypto}
          new coin: ${newCrypto}
          date: ${new Date().toDateString()}`,
        },
      });
      setSwapCryptoButtonText("Swap Coins");
      Alert.alert(
        "Success!",
        "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
        [{ text: "OK", onPress: () => linkTo("/Activity") }]
      );
      setSelectedCrypto("");
      setAmount("");
      setNewCrypto("");
    } catch (error) {
      setSwapCryptoButtonText("Swap Coins");
      console.log(error);
    }
  };

  const swap = (amount, Swap, selectedCrypto, newCrypto) => {
    if (amount === "" || selectedCrypto === "" || newCrypto === "") {
      Alert.alert("Error", "Please fill all the fields");
    } else {
      createTransactions(amount, Swap, selectedCrypto, newCrypto);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SignupAppBar title="Swap Coin" navigation={navigation} />

      {/* Form info */}
      {homeTopUp && (
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
                Swap one cryptocurrency for another
              </Text>
            </View>

            <View style={{ marginVertical: 40 }}>
              <RNPickerSelect
                placeholder={{
                  label: "Select from your portfolio",
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
                  { label: "Ripple", value: "ripple" },
                  { label: "Stellar", value: "stellar" },
                ]}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={selectedCrypto}
                useNativeAndroidPickerStyle={false}
              />
            </View>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 30 }}
                mode="outlined"
                label="Amount"
                onChange={(e) => setAmount(e.nativeEvent.text)}
              />
            </View>
            <View style={{ marginVertical: 40 }}>
              <RNPickerSelect
                placeholder={{
                  label: "Select Cryptocurrency to Swap",
                  value: null,
                }}
                onValueChange={(value) => setNewCrypto(value)}
                items={[
                  {
                    label: "Bitcoin",
                    value: "bitcoin",
                  },
                  { label: "Ethereum", value: "ethereum" },
                  { label: "Litecoin", value: "litecoin" },
                  { label: "Tether", value: "tether" },
                  { label: "Ripple", value: "ripple" },
                  { label: "Stellar", value: "stellar" },
                ]}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={newCrypto}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View>
              <Button
                mode="outlined"
                uppercase={false}
                onPress={() =>
                  swap(amount, swapType, selectedCrypto, newCrypto)
                }
                style={{
                  marginVertical: 50,
                  padding: 5,

                  justifyContent: "center",
                  elevation: 0,
                }}
                contentStyle={{ height: 40 }}
                labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
                color={COLORS.lightBlueAccent}
                disabled={swapCryptoButtonText === "Loading..." ? true : false}
              >
                {swapCryptoButtonText}
              </Button>
            </View>
          </Surface>
        </ScrollView>
      )}

      {!homeTopUp && <NoCoin />}
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

export default Swap;
