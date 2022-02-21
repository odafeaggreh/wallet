import React, { useState } from "react";
import { Button, Surface, Text as PaperText } from "react-native-paper";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
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

const Home = ({ getHoldings, getCoinMarket, myHoldings, coins }) => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [topUp, setTopUp] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      getHoldings((myHoldings = dummyData.holdings));
      getCoinMarket();
    }, [])
  );

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
  let priceColor =
    coins.price_change_percentage_7d_in_currency == 0
      ? COLORS.lightGray3
      : coins.price_change_percentage_7d_in_currency > 0
      ? COLORS.lightGreen
      : COLORS.red;

  function renderWalletInfoSection() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.lightBlueAccent,
        }}
      >
        {/* Balance info section  */}
        <BalanceInfo
          title="your Wallet"
          displayAmount={totalWallet}
          changePercentage={percChange}
          containerStyle={{
            marginTop: 50,
          }}
        />
        {/* Button section */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            marginBottom: -15,
            paddingHorizontal: SIZES.radius,
          }}
        >
          <IconTextButton
            label="Transfer"
            icon={icons.send}
            containerStyle={{ flex: 1, height: 40, marginRight: SIZES.radius }}
            onPress={() => console.log("Transer")}
          />
          <IconTextButton
            label="Withdraw"
            icon={icons.withdraw}
            containerStyle={{ flex: 1, height: 40 }}
            onPress={() => console.log("Withdraw")}
          />
        </View>
      </View>
    );
  }
  return (
    <MainLayout>
      <AppBar title="Home" />
      <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
        {/* Header section - wallet info */}
        {/* {renderWalletInfoSection()} */}

        {/* chart */}
        {/* <Charts
          containerStyle={{ marginTop: SIZES.padding * 2 }}
          chartPrices={
            selectedCoin
              ? selectedCoin.sparkline_in_7d?.price
              : coins[0]?.sparkline_in_7d?.price
          }
        /> */}

        {/* top crypto */}
        {topUp && (
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
              onPress={() => console.log("Pressed")}
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
              Buy Crypto
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
                onPress={() => console.log("Pressed")}
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
                Receicve
              </Button>
              <Button
                mode="outlined"
                onPress={() => console.log("Pressed")}
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
                Deposit
              </Button>
            </View>
          </View>
        )}

        {/* If user has active coins */}

        {!topUp && (
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
                <PaperText style={{ color: COLORS.lightGray3, ...FONTS.h4 }}>
                  Total Balance
                </PaperText>
                <PaperText style={{ color: COLORS.lightGray3, ...FONTS.h2 }}>
                  {numberToMoney(totalWallet)}
                </PaperText>
                <PaperText style={{ color: priceColor, ...FONTS.h5 }}>
                  {" "}
                  {formatter.format(valueChange)} {`(${percChange.toFixed(2)})`}
                  % 7Days
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
