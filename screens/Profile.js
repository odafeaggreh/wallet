import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
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
  const { currentUser, logout } = useAuth();

  return (
    <MainLayout navigation={navigation}>
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
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default Profile;
