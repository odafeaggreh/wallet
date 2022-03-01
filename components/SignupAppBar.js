import { Appbar } from "react-native-paper";
import { SIZES, COLORS, FONTS } from "../constants";

function SignupAppBar({ title, navigation }) {
  const _handleMore = () => console.log("Shown more");

  return (
    <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content
        title={title}
        titleStyle={{ fontSize: 26, fontWeight: "normal" }}
      />
    </Appbar.Header>
  );
}

export default SignupAppBar;
