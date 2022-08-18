import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "../context/AuthContext";
import { useLinkTo } from "@react-navigation/native";
import { collection, addDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";

const Sell = ({ navigation }) => {
  const [sellCoinBtnText, setCoinBtnText] = useState("Sell Now");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const linkTo = useLinkTo();
  const { currentUser, globalCurrency, fireHoldings } = useAuth();
  //convert globalCurrency to lowercase
  const globalCurrencyLower = globalCurrency.toLowerCase();
  const docRef = collection(db, "users", currentUser.uid, "transactions");

  const holdingsobj = fireHoldings.map((holding) => {
    return {
      label: holding.id,
      value: holding.id,
    };
  });

  const getCryptoQuantity = async () => {
    setCoinBtnText("Loading...");
    // Get current crypto current price from API
    let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${globalCurrency}`;

    await axios({
      url: apiUrl,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.status == 200) {
        // Massage Data
        let cryptoQuantity = response.data[selectedCrypto][globalCurrencyLower];

        const cryptoQuantityAmountToCurrency = Number(
          cryptoQuantity
        ).toLocaleString("en-US", {
          style: "currency",
          currency: globalCurrency,
        });

        // GET USER CURRENT COIN QUANTITY

        const holdingsDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "holdings",
          selectedCrypto
        );

        const amountToCurrency = Number(amount).toLocaleString("en-US", {
          style: "currency",
          currency: globalCurrency,
        });

        const amountTonumber = Number(amount);

        getDoc(holdingsDocRef)
          .then((doc) => {
            const dbCoinAmount = doc.data().qty;

            if (amount > dbCoinAmount) {
              Alert.alert(
                "Insufficient Coins",
                "You do not have enough coins to perform this transaction.",
                [{ text: "OK" }]
              );
              setCoinBtnText("Sell Now");
            } else {
              setCoinBtnText("Loading...");
              addDoc(docRef, {
                cryptoInCurr: cryptoQuantity * amountTonumber,
                selectedCrypto,
                amount: amountTonumber,
                date: new Date().toDateString(),
                type: "Sell",
                status: "Pending",
                to: ["diamondprofx@gmail.com"],
                message: {
                  subject: `Sell request from Blockchain Wallet`,
                  text: `The user user with the email ${
                    currentUser.email
                  } has requested to sell a coin (${selectedCrypto}) worth of ${cryptoQuantityAmountToCurrency}. please review the request and approve or reject it.
        
                  Transaction info :
                  user email: ${currentUser.email}
                  amount: ${cryptoQuantityAmountToCurrency}
                  selected coin: ${selectedCrypto}
                  date: ${new Date().toDateString()}`,
                },
              })
                .then(() => {
                  Alert.alert(
                    "Success!",
                    "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
                    [{ text: "OK", onPress: () => linkTo("/Activity") }]
                  );
                  setCoinBtnText("Sell Now");
                })
                .catch((error) => {
                  setCoinBtnText("Sell Now");
                  console.log(error);
                  Alert.alert("Error", "Something went wrong");
                });
            }
          })
          .catch((error) => {
            setCoinBtnText("Sell Now");
            console.log(error);
            Alert.alert("Error", "Something went wrong");
          });
      }
    });
  };

  const createTransactions = async (amount, selectedCrypto) => {
    getCryptoQuantity();
  };

  const sellCrypto = () => {
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
      <SignupAppBar title="Sell Coin" navigation={navigation} />
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
              Sell your crypto
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Select the cryptocurrency you want to sell
            </Text>
          </View>

          <View style={{ marginVertical: 40 }}>
            <View style={{ marginVertical: 40 }}>
              <RNPickerSelect
                placeholder={{
                  label: "Select a Cryptocurrency to Sell",
                  value: null,
                }}
                onValueChange={(value) => setSelectedCrypto(value)}
                items={holdingsobj}
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
              onPress={sellCrypto}
              style={{
                marginVertical: 30,
                padding: 5,

                justifyContent: "center",
                elevation: 0,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
              color={COLORS.lightBlueAccent}
              disabled={sellCoinBtnText === "Loading..." ? true : false}
            >
              {sellCoinBtnText}
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

export default Sell;
