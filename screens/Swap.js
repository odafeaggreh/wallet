import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { useLinkTo } from "@react-navigation/native";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import NoCoin from "./NoCoin";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const Swap = ({ navigation }) => {
  const linkTo = useLinkTo();
  const { currentUser, homeTopUp, globalCurrency, fireHoldings } = useAuth();
  //convert globalCurrency to lowercase
  const globalCurrencyLower = globalCurrency.toLowerCase();
  const docRef = collection(db, "users", currentUser.uid, "transactions");

  const [userCoins, setUserCoins] = useState([
    {
      label: "Select from portfolio",
      value: "",
    },
  ]);

  const coinsRef = useRef(false);

  useEffect(() => {
    if (coinsRef.current === false) {
      fireHoldings.map((holding) => {
        setUserCoins((oldArr) => [
          ...oldArr,
          {
            label: holding.id,
            value: holding.id,
          },
        ]);
        // return
      });

      return () => {
        coinsRef.current = true;
      };
    }
  }, []);

  // Initiate swap crypto transaction
  const [swapCryptoButtonText, setSwapCryptoButtonText] = useState("Swap Coin");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [newCrypto, setNewCrypto] = useState("");
  const [swapType, setSwapType] = useState("Swap");

  const getCryptoQuantity = () => {
    setSwapCryptoButtonText("Loading...");
    // Get current crypto current price from API
    let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=${globalCurrency}`;

    axios({
      url: apiUrl,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.status == 200) {
        // Massage Data
        let cryptoQuantity = response.data[selectedCrypto][globalCurrencyLower];

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

        const cryptoInCurr = cryptoQuantity * amountTonumber;

        // get new crypto value
        // Get current crypto current price from API
        let apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${newCrypto}&vs_currencies=${globalCurrency}`;

        axios({
          url: apiUrl,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }).then((newResponse) => {
          if (newResponse.status == 200) {
            // Massage Data
            let newCryptoQuantity =
              newResponse.data[newCrypto][globalCurrencyLower];

            const newCryptoAmount = cryptoInCurr / newCryptoQuantity;

            getDoc(holdingsDocRef).then((doc) => {
              const dbCoinAmount = doc.data().qty;

              if (amount > dbCoinAmount) {
                setSwapCryptoButtonText("Swap Coin");
                Alert.alert(
                  "Insufficient Coins",
                  "You do not have enough coins to perform this transaction.",
                  [{ text: "OK" }]
                );
              } else {
                addDoc(docRef, {
                  cryptoInCurr,
                  newCryptoAmount,
                  amount,
                  date: new Date().toDateString(),
                  type: "Swap",
                  status: "Pending",
                  to: ["Michaeljohn423633@gmail.com"],
                  selectedCrypto,
                  newCrypto,
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
                })
                  .then(() => {
                    setSwapCryptoButtonText("Swap Coin");
                    Alert.alert(
                      "Success!",
                      "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
                      [{ text: "OK", onPress: () => linkTo("/Activity") }]
                    );
                    setSelectedCrypto("");
                    setAmount("");
                    setNewCrypto("");
                  })
                  .catch((error) => {
                    setSwapCryptoButtonText("Swap Coins");
                    console.log(error);
                  });
              }
            });
          }
        });
      }
    });
  };

  const createTransactions = () => {
    getCryptoQuantity();
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
                  {userCoins.map(({ label, value }) => (
                    <Picker.Item label={label} value={value} />
                  ))}
                </Picker>
              </View>
            </View>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 30 }}
                mode="outlined"
                label="Amount"
                onChange={(e) => setAmount(e.nativeEvent.text)}
                keyboardType="numeric"
              />
            </View>
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
                  selectedValue={newCrypto}
                  onValueChange={(itemValue, itemIndex) =>
                    setNewCrypto(itemValue)
                  }
                >
                  <Picker.Item label="Select Cryptocurrency to Swap" value="" />
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
