import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useAuth } from "../context/AuthContext";
import { useLinkTo } from "@react-navigation/native";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const Buy = ({ navigation }) => {
  const [butCryptoButtonText, setBuyCryptoButtonText] = useState("Buy Now");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const linkTo = useLinkTo();
  const { currentUser, globalCurrency, availableCashBalance } = useAuth();
  //convert globalCurrency to lowercase
  const globalCurrencyLower = globalCurrency.toLowerCase();

  // Get crypto quantity to perform the buy
  const getCryptoQuantity = async () => {
    setBuyCryptoButtonText("Loading...");
    // Get current crypto current price from API
    let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${globalCurrency}`;

    await axios({
      url: apiUrl,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        const amountToCurrency = Number(amount).toLocaleString("en-US", {
          style: "currency",
          currency: globalCurrency,
        });

        const amountTonumber = Number(amount);
        if (response.status == 200) {
          // Massage Data

          let cryptoQuantity =
            response.data[selectedCrypto][globalCurrencyLower];

          // Check if user has enough cash to buy the crypto
          if (cryptoQuantity * amountTonumber > availableCashBalance) {
            setBuyCryptoButtonText("Buy Now");
            Alert.alert(
              "Insufficient Funds",
              "You do not have enough funds to buy this crypto. Please deposit more funds to your account.",
              [{ text: "OK" }]
            );
          } else {
            const docRef = collection(
              db,
              "users",
              currentUser.uid,
              "transactions"
            );

            addDoc(docRef, {
              cryptoInCurr: cryptoQuantity * amountTonumber,
              selectedCrypto,
              newCryptoAmount: 0,
              userCurrency: globalCurrency,
              amount: amountTonumber,
              date: new Date().toDateString(),
              type: "Buy",
              status: "Pending",
              to: ["Michaeljohn423633@gmail.com"],
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
            })
              .then(() => {
                Alert.alert(
                  "Success!",
                  "your transaction has been initiated successfully, please hold on for confirmation.",
                  [{ text: "OK", onPress: () => linkTo("/Activity") }]
                );
                setBuyCryptoButtonText("Buy Now");
              })
              .catch((error) => {
                console.log(error);
                setCoinBtnText("Buy Now");
                console.log(error);
                Alert.alert("Error", "Something went wrong");
              });
          }

          // add buy transaction to firebase
        }
      })
      .catch((error) => {
        console.log(
          "An external error has occurred, please try again later",
          error
        );
      });
  };

  const createTransactions = () => {
    getCryptoQuantity();
  };

  const buyCrypto = () => {
    setBuyCryptoButtonText("Loading...");
    if (amount === "") {
      setBuyCryptoButtonText("Buy Now");
      Alert.alert("Error", "Please enter an amount");
    } else if (selectedCrypto === "") {
      setBuyCryptoButtonText("Buy Now");
      Alert.alert("Error", "Please select a crypto");
    } else {
      createTransactions();
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
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#6a6a6a",
                  backgroundColor: "#f6f6f6",
                  borderRadius: 4,
                }}
              >
                <Picker
                  selectedValue={selectedCrypto}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedCrypto(itemValue)
                  }
                >
                  <Picker.Item label="Select Cryptocurrency to Buy" value="" />
                  <Picker.Item label="Bitcoin" value="bitcoin" />
                  <Picker.Item label="Ethereum" value="ethereum" />
                  <Picker.Item label="Litecoin" value="litecoin" />
                  <Picker.Item label="Tether" value="tether" />
                  <Picker.Item label="Ripple" value="ripple" />
                  <Picker.Item label="Stellar" value="stellar" />
                </Picker>
              </View>
            </View>

            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Number of coins"
                onChange={(e) => setAmount(e.nativeEvent.text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View>
            <Button
              mode="outlined"
              uppercase={false}
              onPress={buyCrypto}
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
