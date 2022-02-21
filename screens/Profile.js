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

const SectionTitle = ({ title }) => {
  return (
    <View style={{ marginTop: SIZES.padding }}>
      <Text style={{ color: COLORS.lightGray3, ...FONTS.h4 }}>{title}</Text>
    </View>
  );
};

const Setting = ({ title, value, type, onPress }) => {
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
              source={icons.rightArrow}
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

const Profile = () => {
  const [faceId, setFaceId] = React.useState(true);
  return (
    <MainLayout>
      <AppBar title="Profile" />
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
                {dummyData.profile.email}
              </Text>
              <Text style={{ color: COLORS.black, ...FONTS.body4 }}>
                {dummyData.profile.id}
              </Text>
            </View>

            {/* Status */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={icons.verified}
                style={{ height: 25, width: 25 }}
              />
              <Text
                style={{
                  marginLeft: SIZES.base,
                  color: COLORS.lightGreen,
                  ...FONTS.body4,
                }}
              >
                Verified
              </Text>
            </View>
          </View>

          {/* App */}

          <SectionTitle title="App" />

          <Setting
            title="Appearance"
            value="Home"
            type="Button"
            onPress={() => console.log("Pressed")}
          />
          <Setting
            title="Launch Screen"
            value="Dark"
            type="Button"
            onPress={() => console.log("Pressed")}
          />

          {/* Account */}

          <SectionTitle title="Account" />

          <Setting
            title="Payment Currency"
            value="USD"
            type="Button"
            onPress={() => console.log("Pressed")}
          />
          <Setting
            title="Language"
            value="English"
            type="Button"
            onPress={() => console.log("Pressed")}
          />

          <SectionTitle title="Security" />

          <Setting
            title="FaceID"
            value={faceId}
            type="switch"
            onPress={(value) => setFaceId(value)}
          />

          <Setting
            title="Password Settings"
            value=""
            type="Button"
            onPress={() => console.log("Pressed")}
          />

          <Setting
            title="Change Password"
            value=""
            type="Button"
            onPress={() => console.log("Pressed")}
          />

          <Setting
            title="2-Factor Authentication"
            value=""
            type="Button"
            onPress={() => console.log("Pressed")}
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default Profile;
