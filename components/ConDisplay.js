import { Text, View, FlatList, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Surface } from "react-native-paper";
import { SIZES, COLORS, FONTS, icons } from "../constants";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getHoldings } from "../stores/market/marketActions";
import { LineChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import "intl";
import "intl/locale-data/jsonp/en";
import { collection, getDocs } from "firebase/firestore";

const ConDisplay = ({ getHoldings, myHoldings }) => {
  const { currentUser, globalCurrency } = useAuth();

  const [fireHoldings, setFireHoldings] = useState();
  const [topUp, setTopUp] = useState(true);

  useEffect(() => {
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
    }, [])
  );

  let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalWallet - valueChange)) * 100;

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: globalCurrency,
  });

  return (
    <View
      style={{
        width: SIZES.width,
      }}
    >
      <FlatList
        data={myHoldings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let priceColor =
            item.price_change_percentage_7d_in_currency == 0
              ? COLORS.lightGray3
              : item.price_change_percentage_7d_in_currency > 0
              ? COLORS.lightGreen
              : COLORS.red;

          return (
            <View>
              {item.qty !== 0 ? (
                <Surface
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                    padding: SIZES.padding,
                    width: SIZES.width,
                    elevation: 0,
                  }}
                >
                  {/* coin details */}
                  <View style={{ flexDirection: "row" }}>
                    {/* crypto */}
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 30, height: 30 }}
                      />
                    </View>

                    <View
                      style={{
                        marginLeft: SIZES.radius,
                      }}
                    >
                      {/* coin  */}

                      {/* Name */}
                      <Text
                        style={{
                          color: COLORS.black,
                          ...FONTS.h4,
                        }}
                      >
                        {item.name}
                      </Text>

                      {/* price */}
                      <Text>{formatter.format(item.total)}</Text>
                      {/* amount owned */}
                      <Text>
                        {(Math.round(item.qty * 100) / 100).toFixed(2)}{" "}
                        {item.symbol.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* chart */}
                  <View>
                    {/* chart */}
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <LineChart
                        withVerticalLabels={false}
                        withShadow={false}
                        withHorizontalLabels={false}
                        withDots={false}
                        withInnerLines={false}
                        withVerticalLines={false}
                        withOuterLines={false}
                        data={{
                          datasets: [
                            {
                              data: item.sparkline_in_7d.value,
                            },
                          ],
                        }}
                        width={100}
                        height={60}
                        chartConfig={{
                          backgroundGradientFrom: "#fff",
                          backgroundGradientTo: "#fff",
                          color: () => priceColor,
                          strokeWidth: 1,
                        }}
                        bezier
                        style={{ paddingRight: 0 }}
                      />
                    </View>
                    {/* crypto price */}
                    <Text>{formatter.format(item.current_price)}</Text>
                    {/* percentage */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
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
                          lineHeight: 15,
                        }}
                      >
                        {item.price_change_percentage_7d_in_currency.toFixed(2)}
                        %
                      </Text>
                    </View>
                  </View>
                </Surface>
              ) : null}
            </View>
          );
        }}
        ListFooterComponent={<View style={{ marginBottom: 50 }}></View>}
      />
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConDisplay);
