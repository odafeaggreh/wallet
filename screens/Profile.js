import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MainLayout from "./MainLayout";
import { HeaderBar } from "../components";
import { FONTS, COLORS, SIZES, dummyData, icons } from "../constants";
import AppBar from "../components/AppBar";
import { useAuth } from "../context/AuthContext";

const SectionTitle = ({ title }) => {
  return (
    <View style={{ marginTop: SIZES.padding }}>
      <Text style={{ color: COLORS.lightGray3, ...FONTS.h4 }}>{title}</Text>
    </View>
  );
};

const Setting = ({ title, value, type, onPress, icon, navigation }) => {
  if (type === "Button") {
    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row", height: 50, alignItems: "center" }}
          onPress={onPress}
        >
          <Text style={{ flex: 1, color: COLORS.black, ...FONTS.h3 }}>
            {title}
          </Text>

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
              style={{ height: 15, width: 15, tintColor: COLORS.black }}
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
  const { logout, currentUser, deleteUserPin } = useAuth();

  // Activity indicator state
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  });

  return (
    <MainLayout navigation={navigation}>
      {showIndicator && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!showIndicator && (
        <View style={{ flex: 1 }}>
          <AppBar title="Profile" navigation={navigation} />
          <View
            style={{
              flex: 1,
              paddingHorizontal: SIZES.padding,
              backgroundColor: "#f8f8fa",
            }}
          >
            {/* Header */}
            {/* <HeaderBar
          title="Profile
        "
        /> */}

            {/* Details */}
            <ScrollView>
              {/* email & userID */}
              <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
                {/* Email & ID */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: COLORS.black, ...FONTS.h3 }}>
                    {currentUser?.email}
                  </Text>
                  <Text style={{ color: COLORS.black, ...FONTS.body4 }}>
                    {currentUser.uid}
                  </Text>
                </View>

                {/* Status */}
              </View>

              {/* App */}

              <SectionTitle title="Security" />

              <Setting
                title="Logout"
                value=""
                type="Button"
                onPress={logout}
                icon={icons.power}
              />

              <Setting
                title="Delete Pin"
                value=""
                type="Button"
                onPress={deleteUserPin}
                icon={icons.power}
              />
            </ScrollView>
          </View>
        </View>
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
