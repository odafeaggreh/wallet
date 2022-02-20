import { Appbar } from "react-native-paper";
import { SIZES, COLORS, FONTS } from "../constants";

function AppBar({ title }) {
  return (
    <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export default AppBar;
