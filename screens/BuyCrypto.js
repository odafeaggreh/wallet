import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS } from "../constants";
import { TextInput, Button, Surface } from "react-native-paper";
import SignupAppBar from "../components/SignupAppBar";
import { useAuth } from "../context/AuthContext";
import * as Clipboard from "expo-clipboard";

const BuyCrypto = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [walletId, setWalletId] = useState(currentUser.uid);

  const copyToClipboard = () => {
    Clipboard.setString(walletId);
    Alert.alert("Done!", "\n\n Wallet id has been copied to clipboard");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
      <SignupAppBar title="Add Crypto" navigation={navigation} />

      <View>
        <Surface
          style={{
            marginHorizontal: SIZES.padding,
            marginVertical: 150,
            paddingHorizontal: 20,
            elevation: 2,
          }}
        >
          <View style={{ marginVertical: 20 }}>
            <Text style={{ textAlign: "center", ...FONTS.h3 }}>
              Copy wallet id to make transfer
            </Text>
          </View>
          <View>
            <TextInput
              style={{ marginTop: 10, marginBottom: 30 }}
              mode="outlined"
              label="Walled Id"
              value={walletId}
              editable={false}
            />
          </View>

          <View>
            <Button
              mode="contained"
              uppercase={false}
              onPress={copyToClipboard}
              style={{
                marginHorizontal: SIZES.padding,
                marginVertical: 50,
                padding: 5,

                justifyContent: "center",
                elevation: 0,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
              color={COLORS.lightBlueAccent}
            >
              Copy Address
            </Button>
          </View>
        </Surface>
      </View>
    </View>
  );
};

export default BuyCrypto;
