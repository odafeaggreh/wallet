import { useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, icons } from "../constants";
import { Home, Portfolio, Market, Profile } from "../screens";
import { setTradeModalVisibilty } from "../stores/tab/tabActions";
import { TabIcon } from "../components";
import { connect } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Transactions from "../screens/Transactions";

const Tab = createMaterialBottomTabNavigator();

const TabBarCustomButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const MyTabs = ({
  setTradeModalVisibilty,
  isTradeModalVisible,
  navigation,
}) => {
  // FUNCTION TO OPEN MODAL
  function tradeTabButtonOnClickHandler() {
    setTradeModalVisibilty(true);
  }
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        activeColor={COLORS.lightBlueAccent}
        barStyle={{
          backgroundColor: COLORS.white,
          borderTopColor: "transparent",
        }}
        labeled={!isTradeModalVisible ? true : false}
        shifting={false}
        tabBarOptions={{
          safeAreaInsets: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, focused }) => {
              if (!isTradeModalVisible) {
                return <TabIcon focused={focused} icon={icons.home} />;
              }
            },
          }}
          listeners={{
            tabPress: (e) => {
              if (isTradeModalVisible) {
                e.preventDefault();
              }
            },
          }}
        />
        <Tab.Screen
          name="Market"
          component={Market}
          options={{
            tabBarIcon: ({ color, focused }) => {
              if (!isTradeModalVisible) {
                return <TabIcon focused={focused} icon={icons.market} />;
              }
            },
          }}
          listeners={{
            tabPress: (e) => {
              console.log(123);
              if (isTradeModalVisible) {
                e.preventDefault();
              }
            },
          }}
        />
        {/* Trade tab */}

        <Tab.Screen
          name="Trade"
          component={Home}
          options={{
            tabBarLabel: false,
            tabBarIcon: ({ focused }) => {
              if (!isTradeModalVisible) {
                return (
                  <TabIcon focused={focused} icon={icons.plus} isTrade={true} />
                );
              }
            },
          }}
          listeners={{
            tabPress: (e) => {
              tradeTabButtonOnClickHandler();
              e.preventDefault();
            },
          }}
        />

        <Tab.Screen
          name="Portfolio"
          component={Portfolio}
          options={{
            tabBarLabel: "Portfolio",
            tabBarIcon: ({ color, focused }) => {
              if (!isTradeModalVisible) {
                return <TabIcon focused={focused} icon={icons.briefcase} />;
              }
            },
          }}
          listeners={{
            tabPress: (e) => {
              if (isTradeModalVisible) {
                e.preventDefault();
              }
            },
          }}
        />
        <Tab.Screen
          name="Activity"
          component={Transactions}
          options={{
            tabBarLabel: "Activity",
            tabBarIcon: ({ color, focused }) => {
              if (!isTradeModalVisible) {
                return <TabIcon focused={focused} icon={icons.clock} />;
              }
            },
          }}
          listeners={{
            tabPress: (e) => {
              if (isTradeModalVisible) {
                e.preventDefault();
              }
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

function mapStateToProps(state) {
  return {
    isTradeModalVisible: state.tabReducer.isTradeModalVisible,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTradeModalVisibilty: (isVisible) => {
      return dispatch(setTradeModalVisibilty(isVisible));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTabs);
