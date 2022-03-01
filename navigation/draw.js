import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SignedInSack } from "./nav";
import NavigationDrawer from "../components/NavigationDrawer";
import { Title } from "react-native-paper";

const Drawer = createDrawerNavigator();

export const DrawerNavStack = () => (
  <NavigationContainer>
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"MainLayout"}
      drawerContent={() => <NavigationDrawer />}
    >
      <Drawer.Screen name="MainLayout" component={SignedInSack} />
    </Drawer.Navigator>
  </NavigationContainer>
);
