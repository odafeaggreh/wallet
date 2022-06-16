import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import MainLayout from "./MainLayout";
import { HeaderBar } from "../components";
import { FONTS, COLORS, SIZES, dummyData, icons } from "../constants";
import AppBar from "../components/AppBar";
import { useAuth } from "../context/AuthContext";
import { Button, Divider, Snackbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { useLinkTo } from "@react-navigation/native";
import BottomSheet from "reanimated-bottom-sheet";
import { currencies } from "../constants/currencies";
import * as Linking from "expo-linking";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../components/Loader";

const SectionTitle = ({ title }) => {
  return (
    <View style={{ marginTop: SIZES.padding }}>
      <Text style={{ color: COLORS.lightGray3, ...FONTS.h3 }}>{title}</Text>
    </View>
  );
};

const Setting = ({ title, value, type, onPress, icon, subTitle, id }) => {
  if (type === "Button") {
    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row", height: 50, alignItems: "center" }}
          onPress={onPress}
          testID={id}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: COLORS.lightGray2,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {title}
            </Text>
            <Text
              style={{ color: COLORS.lightGray3, fontSize: 14, marginTop: 3 }}
            >
              {subTitle}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginRight: SIZES.radius,
                color: COLORS.black,
                ...FONTS.h3,
              }}
            >
              {value}
            </Text>
            <Image
              source={icon}
              style={{ height: 20, width: 20, tintColor: COLORS.lightGray3 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={{ flexDirection: "row", height: 50, alignItems: "center" }}>
        <Text style={{ flex: 1, color: COLORS.black, ...FONTS.h3 }}>
          {title}
        </Text>

        <Switch value={value} onValueChange={(value) => onPress(value)} />
      </View>
    );
  }
};

const Profile = ({ navigation }) => {
  const [faceId, setFaceId] = React.useState(true);
  const {
    logout,
    currentUser,
    setGlobalCurrency,
    currencyName,
    setCurrencyName,
    globalCurrency,
    deleteUserPin,
  } = useAuth();
  const [walletId, setWalletId] = useState(currentUser.uid);
  const linkTo = useLinkTo();
  const sheetRef = React.useRef(null);
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;
  const [modalOpen, setModalOpen] = useState(false);
  const currencyRef = doc(db, "users", currentUser.uid);
  const [isLoading, setIsLoading] = useState(false);

  // Change the global currency
  const changeCurrency = async (currency, currencyName) => {
    setModalOpen(false);
    setIsLoading(true);
    await updateDoc(currencyRef, {
      localCurrency: {
        code: currency,
        name: currencyName,
      },
    });
    setIsLoading(false);

    setGlobalCurrency(currency);
    setCurrencyName(currencyName);
  };

  const renderContentCurrency = () => {
    return (
      <View style={{ backgroundColor: COLORS.white, padding: 16 }}>
        {currencies.map(({ name, code }) => (
          <View key={name}>
            <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
              <Setting
                title={name}
                subTitle={code}
                value=""
                type="Button"
                onPress={() => changeCurrency(code, name)}
                icon={icons.rightArrow}
              />
            </View>
            <Divider />
          </View>
        ))}
      </View>
    );
  };

  // Modal content
  const renderContent = () => {
    return renderContentCurrency();
  };

  const renderHeader = () => {
    return (
      <View style={{ backgroundColor: COLORS.white, padding: 16, height: 150 }}>
        <View
          style={{
            width: 30,
            height: 3,
            backgroundColor: COLORS.lightGray3,
            alignSelf: "center",
            marginBottom: 30,
            borderRadius: SIZES.radius,
          }}
        />

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={icons.earth}
            style={{ marginBottom: 10, tintColor: COLORS.lightBlueAccent }}
          />
          <Text
            style={{
              color: COLORS.lightGray2,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Select a display currency
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (modalOpen) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
      sheetRef.current.snapTo(0);
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [modalOpen]);

  // Copy to clipboard function
  const copyToClipboard = () => {
    Clipboard.setString(walletId);
    Alert.alert("Done!", "\n\n Wallet id has been copied to clipboard");
  };

  // Activity indicator state
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  }, []);

  // Update user pin
  const [visible, setVisible] = useState(false);

  return (
    <MainLayout navigation={navigation}>
      <View style={{ flex: 1 }}>
        <AppBar title="Profile" navigation={navigation} showBackButton={true} />
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          {/* Details */}
          <ScrollView>
            <View
              style={{
                marginTop: SIZES.padding,
                marginBottom: SIZES.padding,
                paddingHorizontal: SIZES.padding,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#E3D5F8",
                  borderRadius: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={icons.profile}
                  style={{ height: 50, width: 50, tintColor: "#5312BC" }}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ ...FONTS.h3 }}>{currentUser?.email}</Text>
              </View>
            </View>
            {/* App */}
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                backgroundColor: "#f8f8fa",
              }}
            >
              <SectionTitle title="Account" />
            </View>

            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Wallet ID"
                subTitle="Warning: Do not share publicly"
                value=""
                type="Button"
                onPress={copyToClipboard}
                icon={icons.copy}
              />
            </View>
            <Divider />
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Local Currency"
                subTitle={`${currencyName} (${globalCurrency})`}
                value=""
                type="Button"
                onPress={() => setModalOpen(true)}
                icon={icons.rightArrow}
                id="localCurrency"
              />
            </View>

            <View
              style={{
                paddingHorizontal: SIZES.padding,
                backgroundColor: "#f8f8fa",
              }}
            >
              <SectionTitle title="Security" />
            </View>

            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Change Password"
                subTitle="Create a new password"
                value=""
                type="Button"
                onPress={() => linkTo("/password")}
                icon={icons.rightArrow}
              />
            </View>

            <Divider />
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Change Pin"
                subTitle="Create a new 4 Digit Pin"
                value=""
                type="Button"
                onPress={() => setVisible(true)}
                icon={icons.rightArrow}
              />
            </View>

            <Divider />
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Delete Pin"
                subTitle="Delete your 4 Digit Pin"
                value=""
                type="Button"
                onPress={() => deleteUserPin()}
                icon={icons.rightArrow}
              />
            </View>

            <View
              style={{
                paddingHorizontal: SIZES.padding,
                backgroundColor: "#f8f8fa",
              }}
            >
              <SectionTitle title="About App" />
            </View>

            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Terms of Service"
                value=""
                type="Button"
                onPress={() =>
                  Linking.openURL("https://www.blockchain.com/legal/terms")
                }
                icon={icons.rightArrow}
              />
            </View>
            <Divider />
            <View
              style={{
                paddingHorizontal: SIZES.padding,
                paddingVertical: 20,
              }}
            >
              <Setting
                title="Privacy Policy"
                value=""
                type="Button"
                onPress={() =>
                  Linking.openURL("https://www.blockchain.com/legal/privacy")
                }
                icon={icons.rightArrow}
              />
            </View>

            {/* Logout */}
            <View
              style={{ paddingHorizontal: SIZES.padding, marginVertical: 50 }}
            >
              <Button
                mode="outlined"
                uppercase={false}
                style={{ padding: 5 }}
                labelStyle={{ color: "#D00F0F", ...FONTS.h3 }}
                onPress={logout}
              >
                Sign Out
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>

      {modalOpen && (
        <>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: COLORS.transparentBlack,
            }}
            opacity={modalAnimatedValue}
          />

          <BottomSheet
            ref={sheetRef}
            snapPoints={[700, 700, 0]}
            borderRadius={0}
            renderContent={renderContent}
            onCloseEnd={() => setModalOpen(false)}
            enabledInnerScrolling={true}
            renderHeader={renderHeader}
          />
        </>
      )}

      {visible && (
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          action={{
            label: "Ok",
            onPress: () => {
              // Do something
              setVisible(false);
            },
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              source={icons.alert}
              style={{
                width: 15,
                height: 15,
                tintColor: "yellow",
                marginHorizontal: 5,
              }}
            />
          </View>
          <Text style={{ marginRight: 20 }}>Coming soon!</Text>
        </Snackbar>
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0c6cf2",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default Profile;
