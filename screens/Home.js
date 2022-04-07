import React, { useEffect, useState } from "react";
import { Button, Surface, Text as PaperText } from "react-native-paper";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import MainLayout from "./MainLayout";
import { connect } from "react-redux";
import { getHoldings, getCoinMarket } from "../stores/market/marketActions";
import { useFocusEffect } from "@react-navigation/native";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { BalanceInfo, IconTextButton, Charts } from "../components";
import AppBar from "../components/AppBar";
import "intl";
import "intl/locale-data/jsonp/en";
import ConDisplay from "../components/ConDisplay";
import { LineChart } from "react-native-chart-kit";
import DonutChart from "../components/DonutChart";
import ChartPie from "../components/ChartPie";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = ({
  getHoldings,
  getCoinMarket,
  myHoldings,
  coins,
  navigation,
}) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const { currentUser, verifiyUserEmail, loading } = useAuth();

  const [fireHoldings, setFireHoldings] = useState();
  const [topUp, setTopUp] = useState(true);

  useEffect(() => {
    console.log("current user", currentUser);
    if (currentUser) {
      const docRef = collection(db, "users", currentUser.uid, "holdings");

      const qSnap = getDocs(docRef)
        .then((snap) => {
          const objData = snap.docs.map((doc) => {
            return doc.data();
          });

          setFireHoldings(objData);
          setTopUp(true);
        })
        .catch((err) => {
          console.log(err);
          console.log("No such document!");

          setTopUp(false);
        });
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getHoldings((myHoldings = fireHoldings));
      getCoinMarket();
    }, [fireHoldings])
  );

  let priceColor =
    myHoldings[0]?.price_change_percentage_7d_in_currency[0] == 0
      ? COLORS.lightGray3
      : myHoldings[0]?.price_change_percentage_7d_in_currency > 0
      ? COLORS.lightGreen
      : COLORS.red;

  let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalWallet - valueChange)) * 100;
  function numberToMoney(
    amount,
    simbol = "$",
    decimalCount = 2,
    decimal = ".",
    thousands = ","
  ) {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    const i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      simbol +
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  }

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Percentage color changer

  // Activity indicator state
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  });

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {showIndicator && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!showIndicator && (
        <View style={{ flex: 1 }}>
          <AppBar title="Home" navigation={navigation} />

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
              {/* top crypto */}

              {!currentUser.emailVerified && (
                <View style={{}}>
                  <Surface
                    style={{
                      marginTop: 50,
                      marginBottom: 20,
                      marginLeft: 10,
                      marginRight: 10,
                      padding: SIZES.padding,
                      elevation: 3,
                    }}
                  >
                    <View style={{ marginBottom: 10 }}>
                      <Image
                        source={icons.padlock}
                        style={{
                          height: 25,
                          width: 25,
                          tintColor: COLORS.lightBlueAccent,
                          alignItems: "flex-start",
                        }}
                      />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          ...FONTS.h2,
                          color: COLORS.lightGray,
                          marginBottom: 10,
                        }}
                      >
                        verify your email address
                      </Text>
                      <Text>
                        In order to start using your blockchain wallet you need
                        to confirm your email address
                      </Text>
                    </View>
                    <View>
                      <Button
                        mode="contained"
                        onPress={verifiyUserEmail}
                        style={{
                          width: "100%",
                          marginTop: 10,
                          paddingVertical: 5,
                          elevation: 0,
                        }}
                        labelStyle={{
                          ...FONTS.h3,
                        }}
                        color={COLORS.lightBlueAccent}
                        uppercase={false}
                      >
                        Verify Email Address
                      </Button>
                    </View>
                  </Surface>
                </View>
              )}

              {!topUp && (
                <View
                  style={{
                    flex: 1,
                    width: SIZES.width,
                    height: SIZES.height / 2,
                    padding: SIZES.padding,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Welcome */}
                  <Text
                    style={{
                      width: SIZES.width,
                      ...FONTS.h2,
                      textAlign: "center",
                      padding: SIZES.padding,
                      color: COLORS.gray1,
                    }}
                  >
                    Welcome to Blockchain.com!
                  </Text>

                  {/* Subheading */}
                  <Text
                    style={{
                      width: SIZES.width,
                      ...FONTS.body3,
                      textAlign: "center",
                      paddingHorizontal: SIZES.padding,
                      color: COLORS.lightGray3,
                    }}
                  >
                    All your crypto balances will show up here once you buy or
                    receive.
                  </Text>

                  {/* Buy crypto */}
                  <Button
                    mode="contained"
                    onPress={() => navigation.push("BuyCrypto")}
                    style={{
                      width: "100%",
                      margin: 10,
                      paddingVertical: 5,
                    }}
                    labelStyle={{
                      ...FONTS.h3,
                    }}
                    color={COLORS.lightBlueAccent}
                    uppercase={false}
                  >
                    Add Crypto
                  </Button>

                  {/* Receive / Deposit btn */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      borderWidth: 1,
                      borderRadius: 2,
                      borderColor: "#d7dce1",
                      width: "100%",
                    }}
                  >
                    <Button
                      mode="outlined"
                      onPress={() => navigation.push("BuyCrypto")}
                      style={{
                        width: "50%",
                        margin: 3,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        borderRadius: 0,
                        borderColor: "#d7dce1",
                      }}
                      labelStyle={{
                        ...FONTS.h4,
                      }}
                      color={COLORS.lightBlueAccent}
                      uppercase={false}
                    >
                      Transfer
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => navigation.push("Withdraw")}
                      style={{
                        width: "50%",
                        margin: 3,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        borderRightWidth: 0,
                        borderRadius: 0,
                      }}
                      labelStyle={{
                        ...FONTS.h4,
                      }}
                      color={COLORS.lightBlueAccent}
                      uppercase={false}
                    >
                      Withdraw
                    </Button>
                  </View>
                </View>
              )}

              {/* If user has active coins */}

              {topUp && (
                <View style={{ flex: 1 }}>
                  <Surface
                    style={{
                      height: 190,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 0,
                      padding: SIZES.padding,
                      width: SIZES.width,
                      elevation: 0,
                    }}
                  >
                    {/* Figures */}

                    <View>
                      <PaperText
                        style={{ color: COLORS.lightGray3, ...FONTS.h4 }}
                      >
                        Total Balance
                      </PaperText>
                      <PaperText
                        style={{ color: COLORS.lightGray3, ...FONTS.h2 }}
                      >
                        {numberToMoney(totalWallet)}
                      </PaperText>
                      <PaperText style={{ color: priceColor, ...FONTS.h5 }}>
                        {" "}
                        {formatter.format(valueChange)}{" "}
                        {`(${percChange.toFixed(2)})`}% 7Days
                      </PaperText>
                    </View>

                    {/* Chart */}
                    <View>
                      <DonutChart percentage={percChange} color={priceColor} />
                    </View>
                  </Surface>

                  {/* Display Portfolio */}
                  <View style={{ flex: 1 }}>
                    <ConDisplay coins={coins} />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    myHoldings: state.marketReducer.myHoldings,
    coins: state.marketReducer.coins,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHoldings: (
      holdings,
      currency,
      coinList,
      orderBy,
      sparkLine,
      priceChangePerc,
      perPage,
      page
    ) => {
      return dispatch(
        getHoldings(
          holdings,
          currency,
          coinList,
          orderBy,
          sparkLine,
          priceChangePerc,
          perPage,
          page
        )
      );
    },
    getCoinMarket: (
      currency,
      coinList,
      orderBy,
      sparkLine,
      priceChangePerc,
      perPage,
      page
    ) => {
      return dispatch(
        getCoinMarket(
          currency,
          coinList,
          orderBy,
          sparkLine,
          priceChangePerc,
          perPage,
          page
        )
      );
    },
  };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
