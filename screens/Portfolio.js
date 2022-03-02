import React, { useState, useEffect } from "react";
import { Button, Surface, Text as PaperText } from "react-native-paper";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from "../stores/market/marketActions";
import MainLayout from "./MainLayout";
import { BalanceInfo, Charts } from "../components";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import AppBar from "../components/AppBar";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Portfolio = ({ getHoldings, myHoldings, navigation }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [fireHoldings, setFireHoldings] = useState();
  const [topUp, setTopUp] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      var docRef = db
        .collection("users")
        .doc(currentUser.uid)
        .collection("holdings")
        .doc("myHoldings");

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
            const objData = doc.data();
            // const arrData = Object.entries(objData).map((e) => e[1]);
            const arrData = [objData].flat();
            setFireHoldings(arrData);

            setTopUp(true);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

            setTopUp(false);
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
          setFireHoldings(error.message);
          setTopUp(false);
        });
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getHoldings((myHoldings = fireHoldings));
    }, [fireHoldings])
  );

  let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalWallet - valueChange)) * 100;

  function renderCurrentBalanceSection() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}
      >
        <Text
          style={{ marginTop: 50, color: COLORS.white, ...FONTS.largeTitle }}
        >
          Portfolio
        </Text>
        <BalanceInfo
          title="Current Balance"
          displayAmount={totalWallet}
          changePercentage={percChange}
          containerStyle={{
            marginTop: SIZES.radius,
            marginBottom: SIZES.padding,
          }}
        />
      </View>
    );
  }

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
  return (
    <MainLayout navigation={navigation}>
      <AppBar title="Portfolio" />
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
            All your crypto balances will show up here once you buy or receive.
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

      {topUp && (
        <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
          {/* Header section */}
          {/* {renderCurrentBalanceSection()} */}

          {/* Chart section */}
          <Charts
            containerStyle={{ marginTop: SIZES.radius }}
            chartPrices={
              selectedCoin
                ? selectedCoin.sparkline_in_7d?.value
                : myHoldings[0].sparkline_in_7d?.value
            }
          />

          {/* Portfolio section */}
          <FlatList
            data={myHoldings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              marginTop: SIZES.padding,
              paddingHorizontal: SIZES.padding,
            }}
            ListHeaderComponent={
              <View>
                <Text style={{ ...FONTS.h2, color: COLORS.lightGray3 }}>
                  Your Assets
                </Text>

                <View style={{ flexDirection: "row", marginTop: SIZES.radius }}>
                  <Text style={{ flex: 1, color: COLORS.lightGray3 }}>
                    Assets
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: COLORS.lightGray3,
                      textAlign: "right",
                    }}
                  >
                    Price
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: COLORS.lightGray3,
                      textAlign: "right",
                    }}
                  >
                    Holdings
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => {
              let priceColor =
                item.price_change_percentage_7d_in_currency == 0
                  ? COLORS.lightGray3
                  : item.price_change_percentage_7d_in_currency > 0
                  ? COLORS.lightGreen
                  : COLORS.red;
              return (
                <TouchableOpacity
                  style={{ flexDirection: "row", height: 55 }}
                  onPress={() => setSelectedCoin(item)}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text
                      style={{
                        marginLeft: SIZES.radius,
                        color: COLORS.lightGray3,
                        ...FONTS.h4,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.lightGray3,
                        ...FONTS.h4,
                        lineHeight: 15,
                      }}
                    >
                      {numberToMoney(item.current_price)}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {item.price_change_percentage_7d_in_currency != 0 && (
                        <Image
                          source={icons.upArrow}
                          style={{
                            height: 10,
                            width: 10,
                            tintColor: priceColor,
                            transform:
                              item.price_change_percentage_7d_in_currency > 0
                                ? [{ rotate: "45deg" }]
                                : [{ rotate: "125deg" }],
                          }}
                        />
                      )}

                      <Text
                        style={{
                          marginLeft: 5,
                          color: priceColor,
                          ...FONTS.body5,
                          lineHeight: 15,
                        }}
                      >
                        {item.price_change_percentage_7d_in_currency.toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.lightGray3,
                        ...FONTS.h4,
                        lineHeight: 15,
                      }}
                    >
                      {numberToMoney(item.total)}
                    </Text>

                    <Text
                      style={{
                        textAlign: "right",
                        color: COLORS.lightGray3,
                        ...FONTS.body5,
                        lineHeight: 15,
                      }}
                    >
                      {item.qty} {item.symbol.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    myHoldings: state.marketReducer.myHoldings,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
