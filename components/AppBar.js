import { Appbar, Menu } from "react-native-paper";
import { View } from "react-native";
import { useLinkTo } from "@react-navigation/native";

function AppBar({ title, navigation, showBackButton = false }) {
  const linkTo = useLinkTo();
  const qrScan = () => {
    console.log("Scanner");
  };

  return (
    <View>
      <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
        {showBackButton && (
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        )}
        <Appbar.Content title={title} />

        <Appbar.Action icon="qrcode-scan" onPress={qrScan} />
        <Appbar.Action icon="account" onPress={() => linkTo("/Profile")} />
      </Appbar.Header>
    </View>
  );
}

export default AppBar;
