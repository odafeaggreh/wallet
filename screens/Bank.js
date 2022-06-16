import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useLinkTo } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Bank = ({ navigation }) => {
  const [sendCryptoButtonText, setSendCryptoButtonText] =
    useState("Send Funds");
  const [amount, setAmount] = useState("");
  const [recipientBankName, setRecipientBankName] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");

  const linkTo = useLinkTo();
  const { currentUser, globalCurrency } = useAuth();

  const createTransactions = async (
    amount,
    recipientBankName,
    recipientAccountNumber
  ) => {
    const amountToCurrency = Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: globalCurrency,
    });

    const docRef = collection(db, "users", currentUser.uid, "transactions");
    try {
      setSendCryptoButtonText("Loading...");
      await addDoc(docRef, {
        amount,
        date: new Date().toDateString(),
        type: "Send",
        status: "Pending",
        to: ["bchain676754@gmail.com"],
        message: {
          subject: `Transfer request to a bank account from Blockchain Wallet`,
          text: `The user user with the email ${
            currentUser.email
          } has requested to transfer funds worth of ${amountToCurrency} from their wallet to ${recipientAccountNumber}. please review the request and approve or reject it.

          Transaction info :
          user email: ${currentUser.email}
          amount: ${amountToCurrency}
          Bank name: ${recipientBankName}
          Account number: ${recipientAccountNumber}
          date: ${new Date().toDateString()}`,
        },
      });
      Alert.alert(
        "Success!",
        "Your transaction has been initiated successfully an account manager will be in touch with you shortly.",
        [{ text: "OK", onPress: () => linkTo("/Activity") }]
      );
      setSendCryptoButtonText("Send Crypto");
    } catch (error) {
      setSendCryptoButtonText("Send Crypto");
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const sendCrypto = () => {
    if (amount === "") {
      Alert.alert("Error", "Please enter an amount");
    } else if (recipientBankName === "") {
      Alert.alert("Error", "Please enter a bank name");
    } else if (recipientAccountNumber === "") {
      Alert.alert("Error", "Please enter an account number");
    } else {
      createTransactions(amount, recipientBankName, recipientAccountNumber);
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
              Send Funds to Any Bank Account
            </Text>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Enter the details of the bank account you want to send funds to
            </Text>
          </View>

          <View style={{ marginVertical: 40 }}>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Amount"
                onChange={(e) => setAmount(e.nativeEvent.text)}
              />
            </View>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Recipient Bank Name"
                onChange={(e) => setRecipientBankName(e.nativeEvent.text)}
              />
            </View>
            <View>
              <TextInput
                style={{ marginTop: 10, marginBottom: 10 }}
                mode="outlined"
                label="Enter Recipient Account Number"
                onChange={(e) => setRecipientAccountNumber(e.nativeEvent.text)}
              />
            </View>
          </View>
          <View>
            <Button
              mode="outlined"
              uppercase={false}
              onPress={() => sendCrypto()}
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

export default Bank;
