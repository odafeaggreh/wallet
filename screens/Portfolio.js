import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Surface,
  Text as PaperText,
  TextInput,
} from "react-native-paper";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Animated,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from "../stores/market/marketActions";
import MainLayout from "./MainLayout";
import { BalanceInfo, Charts } from "../components";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import AppBar from "../components/AppBar";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { Divider } from "react-native-paper";
import BottomSheet from "reanimated-bottom-sheet";
import { Modalize } from "react-native-modalize";

const Portfolio = ({ getHoldings, myHoldings, navigation }) => {
  const [selectedCoin, setSelectedCoin] = useState();
  const [fireHoldings, setFireHoldings] = useState();
  const [topUp, setTopUp] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sheetRef = React.useRef(null);

  const modalizeRef = useRef(null);

  const { currentUser, globalCurrency, refreshing, setRefreshing } = useAuth();

  async function getMyHoldings() {
    if (currentUser) {
      const docRef = collection(db, "users", currentUser.uid, "holdings");

      try {
        const qSnap = await getDocs(docRef);
        const objData = qSnap.docs.map((doc) => {
          return doc.data();
        });

        if (objData === undefined) {
          setFireHoldings([]);
          console.log("No holdings");
        } else if (objData.length === 0) {
          setTopUp(false);
        } else if (objData.length > 0) {
          setFireHoldings(objData);
          setTopUp(true);
        }
      } catch (error) {
        setHomeTopUp(false);
        console.log(error);
      }
    }
  }

  useEffect(() => {
    getMyHoldings();
  }, [fireHoldings, currentUser, globalCurrency, refreshing]);

  // Refresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMyHoldings();
    setRefreshing(false);
  });

  // Crypto details bottom sheet

  const openBottomSheet = (item) => {
    setSelectedCoin(item);
    modalizeRef.current.open();
  };

  const renderHeader = (holdings) => {
    console.log("Selected coinssss", holdings);
    return (
      <View style={{ backgroundColor: COLORS.white, padding: 16, height: 150 }}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: holdings?.image }}
            style={{ width: 35, height: 35, marginBottom: 10 }}
          />
          <Text
            style={{
              color: COLORS.lightGray2,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {holdings?.name}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ backgroundColor: COLORS.white }}>
        {myHoldings && (
          <Charts
            containerStyle={{ marginVertical: SIZES.padding }}
            coinData={myHoldings}
            chartPrices={
              selectedCoin
                ? selectedCoin.sparkline_in_7d?.value
                : myHoldings[0]?.sparkline_in_7d?.value
            }
          />
        )}
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getHoldings((myHoldings = fireHoldings), globalCurrency);
    }, [fireHoldings, globalCurrency])
  );

  let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalWallet - valueChange)) * 100;

  // Convert to currency
  var formatter = new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: globalCurrency,
    signDisplay: "always",
  });

  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  }, []);

  return (
    <MainLayout navigation={navigation}>
      {showIndicator && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!showIndicator && (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <AppBar title="Portfolio" />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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
                    onPress={() => navigation.push("Buy")}
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
                    Buy
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.push("Sell")}
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
                    Sell
                  </Button>
                </View>
              </View>
            )}

            {topUp && (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* Portfolio section */}
                <FlatList
                  data={myHoldings}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{
                    marginTop: SIZES.padding,
                  }}
                  ListHeaderComponent={
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: SIZES.padding,
                          marginTop: SIZES.radius,
                          marginBottom: 20,
                        }}
                      >
                        <Text style={{ flex: 1, color: COLORS.black }}>
                          Asset Name
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            color: COLORS.black,
                            textAlign: "right",
                          }}
                        >
                          Price
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            color: COLORS.black,
                            textAlign: "right",
                          }}
                        >
                          Holdings
                        </Text>
                      </View>
                      <Divider style={{ marginBottom: 20 }} />
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
                      <View>
                        {item.qty !== 0 && (
                          <>
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                height: 55,
                                paddingHorizontal: SIZES.padding,
                              }}
                              onPress={() => openBottomSheet(item)}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  alignItems: "flex-start",
                                }}
                              >
                                <Image
                                  source={{ uri: item.image }}
                                  style={{ width: 25, height: 25 }}
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

                              <View
                                style={{ flex: 1, justifyContent: "center" }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: COLORS.lightGray3,
                                    ...FONTS.h4,
                                    lineHeight: 15,
                                  }}
                                >
                                  {formatter.format(item.current_price)}
                                </Text>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {item.price_change_percentage_7d_in_currency !=
                                    0 && (
                                    <Image
                                      source={icons.upArrow}
                                      style={{
                                        height: 10,
                                        width: 10,
                                        tintColor: priceColor,
                                        transform:
                                          item.price_change_percentage_7d_in_currency >
                                          0
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
                                    {item.price_change_percentage_7d_in_currency.toFixed(
                                      2
                                    )}
                                    %
                                  </Text>
                                </View>
                              </View>

                              <View
                                style={{ flex: 1, justifyContent: "center" }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: COLORS.lightGray3,
                                    ...FONTS.h4,
                                    lineHeight: 15,
                                  }}
                                >
                                  {formatter.format(item.total)}
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

                            <Divider style={{ marginBottom: 20 }} />
                          </>
                        )}
                      </View>
                    );
                  }}
                  ListFooterComponent={
                    <View style={{ marginBottom: 50 }}></View>
                  }
                />
              </View>
            )}
          </ScrollView>
        </View>
      )}

      <Modalize
        ref={modalizeRef}
        HeaderComponent={() => renderHeader(selectedCoin)}
        snapPoint={400}
        modalHeight={400}
        threshold={50}
        panGestureComponentEnabled={true}
      >
        {renderContent()}
      </Modalize>
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

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
