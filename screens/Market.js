import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { connect } from "react-redux";
import { getCoinMarket } from "../stores/market/marketActions";
import MainLayout from "./MainLayout";
import { constants, COLORS, FONTS, SIZES, icons } from "../constants";
import { HeaderBar, TextButton } from "../components";
import AppBar from "../components/AppBar";

const Market = ({ getCoinMarket, coins, navigation }) => {
  const marketTabs = constants.marketTabs.map((marketTab) => ({
    ...marketTab,
    ref: React.createRef(),
  }));

  useEffect(() => {
    getCoinMarket();
  }, [getCoinMarket]);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const marketTabScrollViewRef = React.useRef();

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

  function renderList() {
    return (
      <View style={{ flex: 1, width: SIZES.width, marginTop: 30 }}>
        <FlatList
          data={coins}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            let priceColor =
              item.price_change_percentage_7d_in_currency == 0
                ? COLORS.lightGray3
                : item.price_change_percentage_7d_in_currency > 0
                ? COLORS.lightGreen
                : COLORS.red;

            return (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: SIZES.padding,
                  marginBottom: SIZES.radius,
                }}
              >
                {/* COIN SECTION */}
                <View
                  style={{
                    flex: 1.5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ height: 20, width: 20 }}
                  />

                  <Text
                    style={{
                      marginLeft: SIZES.radius,
                      color: COLORS.black,
                      ...FONTS.h3,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>

                {/* CHART SECTION */}
                <View style={{ flex: 1, alignItems: "center" }}>
                  <LineChart
                    withVerticalLabels={false}
                    withHorizontalLabels={false}
                    withDots={false}
                    withInnerLines={false}
                    withVerticalLines={false}
                    withOuterLines={false}
                    data={{
                      datasets: [
                        {
                          data: item.sparkline_in_7d.price,
                        },
                      ],
                    }}
                    width={100}
                    height={60}
                    chartConfig={{
                      color: () => priceColor,
                      backgroundGradientFrom: "#f8f8fa",
                      backgroundGradientTo: "#f8f8fa",
                      strokeWidth: 1,
                    }}
                    bezier
                    style={{ paddingRight: 0 }}
                  />
                </View>

                {/* FIGURES SECTION */}
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: COLORS.black, ...FONTS.h4 }}>
                    {numberToMoney(item.current_price)}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
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
                      }}
                    >
                      {item.price_change_percentage_7d_in_currency.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={<View style={{ marginBottom: 50 }}></View>}
        />
      </View>
    );
  }

  // Activity indicator state
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowIndicator(false);
    }, 5000);
  });

  return (
    <MainLayout navigation={navigation}>
      {showIndicator && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!showIndicator && (
        <View style={{ flex: 1 }}>
          <AppBar title="Market Prices" />
          <View style={{ flex: 1, backgroundColor: "#f8f8fa" }}>
            {/* Header */}

            {/* Tab bar */}

            {/* Market List */}
            {renderList()}
          </View>
        </View>
      )}
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Market);
