import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { connect } from "react-redux";
import { getCoinMarket } from "../stores/market/marketActions";
import MainLayout from "./MainLayout";
import { constants, COLORS, FONTS, SIZES, icons } from "../constants";
import { HeaderBar, TextButton } from "../components";

const Market = ({ getCoinMarket, coins }) => {
  const marketTabs = constants.marketTabs.map((marketTab) => ({
    ...marketTab,
    ref: React.createRef(),
  }));

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const marketTabScrollViewRef = React.useRef();

  const onMarketTabPress = React.useCallback((marketTabIndex) => {
    marketTabScrollViewRef?.current?.csrollToOffset({
      offset: marketTabIndex * SIZES.width,
    });
  });

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

  const TabIndicator = ({ measureLayout, scrollX }) => {
    const inputRange = marketTabs.map((_, i) => i * SIZES.width);

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: measureLayout.map((measure) => measure.x),
    });

    return (
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          height: "100%",
          width: SIZES.width - (SIZES.radius * 2) / 2,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray,
          transform: [
            {
              translateX,
            },
          ],
        }}
      />
    );
  };

  const Tabs = ({ scrollX, onMarketTabPress }) => {
    const [measureLayout, setMeasureLayout] = React.useState([]);
    const containerRef = React.useRef();

    React.useEffect(() => {
      let ml = [];

      marketTabs.forEach((marketTab) => {
        marketTab?.ref?.current?.measureLayout(
          containerRef.current,
          (x, y, width, height) => {
            ml.push({
              x,
              y,
              width,
              height,
            });

            if (ml.length === marketTabs.length) {
              setMeasureLayout(ml);
            }
          }
        );
      });
    }, [containerRef.current]);

    return (
      <View style={{ flexDirection: "row" }} ref={containerRef}>
        {/* Tabs Indicator */}

        {measureLayout.length > 0 && (
          <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />
        )}

        {marketTabs.map((item, index) => {
          return (
            <TouchableOpacity
              key={`MarketTab-${index}`}
              style={{ flex: 1 }}
              onPress={() => onMarketTabPress(index)}
            >
              <View
                ref={item.ref}
                style={{
                  paddingHorizontal: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                }}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    getCoinMarket();
  });

  function renderTabBar() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray,
        }}
      >
        <Tabs scrollX={scrollX} onMarketTabPress={onMarketTabPress} />
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
        }}
      >
        <TextButton lable="USD" />
        <TextButton
          lable="% (7d)"
          containerStyle={{ marginLeft: SIZES.base }}
        />
        <TextButton lable="Top" containerStyle={{ marginLeft: SIZES.base }} />
      </View>
    );
  }

  function renderList() {
    return (
      <Animated.FlatList
        ref={marketTabScrollViewRef}
        data={marketTabs}
        contentContainerStyle={{ marginTop: SIZES.padding }}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        renderItem={({ item, index }) => {
          return (
            <View style={{ flex: 1, width: SIZES.width }}>
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
                            color: COLORS.white,
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
                          chartConfig={{ color: () => priceColor }}
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
                        <Text style={{ color: COLORS.white, ...FONTS.h4 }}>
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
                            }}
                          >
                            {item.price_change_percentage_7d_in_currency.toFixed(
                              2
                            )}
                            %
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          );
        }}
      />
    );
  }
  return (
    <MainLayout>
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        {/* Header */}
        <HeaderBar title="Market" />

        {/* Tab bar */}
        {renderTabBar()}

        {/* Buttons */}
        {renderButtons()}

        {/* Market List */}
        {renderList()}
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Market);
