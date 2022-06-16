import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import MainLayout from "./MainLayout";
import AppBar from "../components/AppBar";
import { COLORS, FONTS, icons, SIZES } from "../constants";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";

const Transactions = () => {
  const {
    currentUser,
    globalCurrency,
    getTransactions,
    topUp,
    transactions,
    refreshing,
    setRefreshing,
  } = useAuth();

  var formatter = new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: globalCurrency,
    signDisplay: "always",
  });

  //   Get transactions from DB

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);

  // onRefresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getTransactions();
    setRefreshing(false);
  });

  useEffect(() => {
    getTransactions();
  }, [refreshing]);

  return (
    <MainLayout>
      {/* <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#fff" />
      </View> */}

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppBar title="Activity" />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {topUp && (
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: SIZES.height,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                You Have No Activity
              </Text>
              <Text style={{ fontSize: 16 }}>
                All your transactions will show up here
              </Text>
            </View>
          )}

          {!topUp && (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <FlatList
                data={transactions}
                keyExtractor={(item, index) => index}
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
                      <Text
                        style={{ flex: 1, color: COLORS.black, ...FONTS.h3 }}
                      >
                        Date
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: COLORS.black,
                          textAlign: "right",
                          ...FONTS.h3,
                        }}
                      >
                        Amount
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: COLORS.black,
                          textAlign: "right",
                          ...FONTS.h3,
                        }}
                      >
                        Type
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          color: COLORS.black,
                          textAlign: "right",
                          ...FONTS.h3,
                        }}
                      >
                        Status
                      </Text>
                    </View>
                  </View>
                }
                renderItem={(item) => {
                  return (
                    <>
                      <Divider />
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          height: 55,
                          paddingHorizontal: SIZES.padding,
                        }}
                        onPress={() => console.log(item)}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{ color: COLORS.lightGray3, lineHeight: 15 }}
                          >
                            {item.item.date}
                          </Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text
                            style={{
                              textAlign: "right",
                              color: COLORS.lightGray3,
                              lineHeight: 15,
                            }}
                          >
                            {formatter.format(item.item.amount)}
                          </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                padding: 3,
                                marginRight: 5,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#BFDAFF",
                                borderRadius: 50,
                              }}
                            >
                              <Image
                                source={
                                  item.item.type === "Swap"
                                    ? icons.side_arrow
                                    : item.item.type === "Send"
                                    ? icons.right_arrow
                                    : item.item.type === "Receive"
                                    ? icons.arrow_bottom
                                    : item.item.type === "Buy"
                                    ? icons.upArrow
                                    : icons.downArrow
                                }
                                style={{
                                  width: 13,
                                  height: 13,
                                  tintColor: COLORS.lightBlueAccent,
                                }}
                              />
                            </View>
                            <Text
                              style={{
                                textAlign: "right",
                                color: COLORS.lightGray3,
                                lineHeight: 15,
                              }}
                            >
                              {item.item.type}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "flex-end",
                          }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                item.item.status === "Pending"
                                  ? "#FFCD00"
                                  : item.item.status === "Success"
                                  ? "#00C853"
                                  : "#D50000",
                              paddingVertical: 3,
                              borderRadius: 15,
                              width: "70%",
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: COLORS.white,
                                lineHeight: 15,
                                ...FONTS.h5,
                              }}
                            >
                              {item.item.status}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <Divider />
                    </>
                  );
                }}
                ListFooterComponent={<View style={{ marginBottom: 50 }}></View>}
              ></FlatList>
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
};

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

export default Transactions;
