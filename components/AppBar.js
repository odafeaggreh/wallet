import { Appbar } from "react-native-paper";
import { SIZES, COLORS, FONTS } from "../constants";

function AppBar({ title }) {
  const _handleMore = () => console.log("Shown more");

  return (
    <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
      <Appbar.Content title={title} />

      <Appbar.Action icon="account" onPress={_handleMore} />
      <Appbar.Action icon="qrcode-scan" onPress={_handleMore} />
    </Appbar.Header>
  );
}

export default AppBar;
