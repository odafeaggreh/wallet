import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useLinkTo } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const Crypto = ({ navigation }) => {
  const [sendCryptoButtonText, setSendCryptoButtonText] =
    useState("Send Crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientWallet, setRecipientWallet] = useState("");

  const linkTo = useLinkTo();
  const { currentUser, globalCurrency, fireHoldings } = useAuth();
  const globalCurrencyLower = globalCurrency.toLowerCase();
  const docRef = collection(db, "users", currentUser.uid, "transactions");

  const [userCoins, setUserCoins] = useState([
    {
      label: "Select a Cryptocurrency to Send",
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

  const getCryptoQuantity = () => {
    setSendCryptoButtonText("Loading...");
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
        let cryptoQuantity = response.data[selectedCrypto][globalCurrencyLower];

        const amountTonumber = Number(amount);

        const cryptoInCurr = cryptoQuantity * amountTonumber;

        const holdingsDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "holdings",
          selectedCrypto
        );

        const docRef = collection(db, "users", currentUser.uid, "transactions");

        getDoc(holdingsDocRef).then((doc) => {
          const dbCoinAmount = doc.data().qty;

          if (Number(amount) > dbCoinAmount) {
            setSendCryptoButtonText("Send Crypto");
            Alert.alert(
              "Insufficient Coins",
              "You do not have enough coins to perform this transaction.",
              [{ text: "OK" }]
            );
          } else {
            addDoc(docRef, {
              amount,
              cryptoInCurr,
              selectedCrypto,
              date: new Date().toDateString(),
              type: "Send",
              assetType: "crypto",
              status: "Pending",
              to: ["Michaeljohn423633@gmail.com"],
              message: {
                subject: `Transfer request to another wallet from Blockchain Wallet`,
                text: `The user user with the email ${
                  currentUser.email
                } has requested to send coin (${selectedCrypto}) worth of ${cryptoInCurr} from their wallet to ${recipientWallet}. please review the request and approve or reject it.

          Transaction info :
          user email: ${currentUser.email}
          amount: ${cryptoInCurr}
          selected coin: ${selectedCrypto}
          date: ${new Date().toDateString()}`,
              },
            })
              .then(() => {
                setSendCryptoButtonText("Send Crypto");
                Alert.alert(
                  "Success!",
                  "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
                  [{ text: "OK", onPress: () => linkTo("/Activity") }]
                );
              })
              .catch((err) => {
                setSendCryptoButtonText("Send Crypto");
                console.log(err);
                Alert.alert("Error", "Something went wrong");
              });
          }
        });
      }
    });
  };

  const createTransactions = () => {
    getCryptoQuantity();
  };

  const sendCrypto = () => {
    if (amount === "") {
      Alert.alert("Error", "Please enter an amount");
    } else if (selectedCrypto === "") {
      Alert.alert("Error", "Please select a crypto");
    } else if (recipientWallet === "") {
      Alert.alert("Error", "Please enter a recipient wallet");
    } else {
      createTransactions(amount, selectedCrypto, recipientWallet);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SignupAppBar navigation={navigation} />

      <ScrollView>
        <Surface
          style={{
            marginHorizontal: SIZES.padding,
            marginVertical: 70,
            paddingHorizontal: 20,
            elevation: 0,
          }}
        >
          <View style={{ marginVertical: 10 }}>
            <Text style={{ textAlign: "center", ...FONTS.h2 }}>
              Send Crypto to any wallet address
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Enter the amount of cryptocurrency you want to send
            </Text>
          </View>

          <View style={{ marginVertical: 40 }}>
            <View style={{ marginVertical: 10 }}>
              {/* <RNPickerSelect
                placeholder={{
                  label: "Select a Cryptocurrency to Send",
                  value: null,
                }}
                onValueChange={(value) => setSelectedCrypto(value)}
                items={holdingsobj}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={selectedCrypto}
                useNativeAndroidPickerStyle={false}
              /> */}

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
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Recipient Wallet Address"
                onChange={(e) => setRecipientWallet(e.nativeEvent.text)}
              />
            </View>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Amount"
                onChange={(e) => setAmount(e.nativeEvent.text)}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View>
            <Button
              mode="outlined"
              uppercase={false}
              onPress={sendCrypto}
              style={{
                marginVertical: 30,
                padding: 5,

                justifyContent: "center",
                elevation: 0,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
              color={COLORS.lightBlueAccent}
              disabled={sendCryptoButtonText === "Loading..." ? true : false}
            >
              {sendCryptoButtonText}
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

export default Crypto;
