import {
  View,
  Text,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ErrorMessage, Formik, yupToFormErrors } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import SignupAppBar from "../components/SignupAppBar";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import * as Clipboard from "expo-clipboard";

const Withdraw = ({ navigation }) => {
  const withdrawFormSchema = Yup.object().shape({
    BankName: Yup.string().required(),
    AccountName: Yup.string().required(),
    AccountNumber: Yup.string().required(),
    Amount: Yup.string().required(),
  });

  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [walletId, setWalletId] = useState(currentUser.uid);

  const handleWithdraw = () => {
    setLoading(true);
    Alert.alert(
      "Done!",
      "\n\n Your withdrawal order has been made, you would receive an email with further details"
    );
    setLoading(false);

    setTimeout(() => {
      navigation.push("MainLayout");
    }, 3000);
  };

  // Activity indicator state
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
      <SignupAppBar title="Withdraw" navigation={navigation} />

      <View>
        <Surface
          style={{
            marginHorizontal: SIZES.padding,
            marginVertical: 50,
            paddingHorizontal: 20,
            elevation: 2,
          }}
        >
          <Formik
            initialValues={{
              BankName: "",
              AccountName: "",
              AccountNumber: "",
              Amount: "",
            }}
            onSubmit={handleWithdraw}
            validationSchema={withdrawFormSchema}
            validateOnMount={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isValid,
              errors,
            }) => (
              <View>
                <View style={{ marginVertical: 20 }}>
                  <Text style={{ textAlign: "center", ...FONTS.h3 }}>
                    Enter transfer details
                  </Text>
                </View>
                <View>
                  <TextInput
                    style={{ marginTop: 10, marginBottom: 30 }}
                    mode="outlined"
                    label="Bank Name"
                    value={values.BankName}
                    onChangeText={handleChange("BankName")}
                    onBlur={handleBlur("BankName")}
                  />
                </View>

                <View>
                  <TextInput
                    style={{ marginTop: 10, marginBottom: 30 }}
                    mode="outlined"
                    label="Account name"
                    value={values.AccountName}
                    onChangeText={handleChange("AccountName")}
                    onBlur={handleBlur("AccountName")}
                  />
                </View>

                <View>
                  <TextInput
                    style={{ marginTop: 10, marginBottom: 30 }}
                    mode="outlined"
                    label="Account number"
                    value={values.AccountNumber}
                    onChangeText={handleChange("AccountNumber")}
                    onBlur={handleBlur("AccountNumber")}
                  />
                </View>

                <View>
                  <TextInput
                    style={{ marginTop: 10, marginBottom: 30 }}
                    mode="outlined"
                    label="Amount"
                    value={values.Amount}
                    onChangeText={handleChange("Amount")}
                    onBlur={handleBlur("Amount")}
                  />
                </View>

                <View>
                  <Button
                    mode="contained"
                    uppercase={false}
                    onPress={handleSubmit}
                    style={{
                      marginHorizontal: SIZES.padding,
                      marginVertical: 30,
                      padding: 5,

                      justifyContent: "center",
                      elevation: 0,
                    }}
                    contentStyle={{ height: 40 }}
                    labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
                    color={COLORS.lightBlueAccent}
                    loading={loading}
                    disabled={loading}
                  >
                    Make Order
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </Surface>
      </View>
    </View>
  );
};

export default Withdraw;
