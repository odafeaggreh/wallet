import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Text } from "react-native";
import { connect } from "react-redux";
import ModalButtons from "../components/ModalButtons";
import { COLORS, SIZES, icons } from "../constants";
import { Divider } from "react-native-paper";
import BottomSheet from "reanimated-bottom-sheet";
import { setTradeModalVisibilty } from "../stores/tab/tabActions";
import { Button } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

const MainLayout = ({
  children,
  isTradeModalVisible,
  navigation,
  setTradeModalVisibilty,
}) => {
  const modalAnimatedValue = useRef(new Animated.Value(0)).current;
  const [ShowComment, setShowModelComment] = useState(false);
  const [animateModal, setanimateModal] = useState(false);

  const linkTo = useLinkTo();

  const ModalSquareButtons = () => {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ width: "45%" }}>
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => linkTo("/Sell")}
            style={{ padding: 3, elevation: 0 }}
            labelStyle={{ fontSize: 14 }}
            color={COLORS.lightGray}
          >
            Sell
          </Button>
        </View>
        <View style={{ width: "45%" }}>
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => linkTo("/Buy")}
            style={{ padding: 3, elevation: 0 }}
            labelStyle={{ fontSize: 14 }}
            color={COLORS.lightBlueAccent}
          >
            Buy
          </Button>
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <View style={{ backgroundColor: COLORS.white, padding: 16, height: 450 }}>
      <View
        style={{
          width: 30,
          height: 3,
          backgroundColor: COLORS.lightGray3,
          alignSelf: "center",
          marginBottom: 30,
          borderRadius: SIZES.radius,
        }}
      />
      <ModalButtons
        icon={icons.side_arrow}
        heading="Swap"
        text="Exchange for Another Crypto"
        route="/Swap"
      />
      <Divider style={{ marginTop: 20 }} />

      <ModalButtons
        icon={icons.right_arrow}
        heading="Send"
        text="Send to Any Wallet or Bank"
        route="/Send"
      />
      <Divider style={{ marginTop: 20 }} />

      <ModalButtons
        icon={icons.arrow_bottom}
        heading="Recieve"
        text="Copy your wallet address"
        route="/BuyCrypto"
      />

      <Divider style={{ marginTop: 20 }} />

      <ModalSquareButtons />
    </View>
  );

  const sheetRef = React.useRef(null);

  const closeShowModal = (setTradeModalVisibilty) => {
    setTradeModalVisibilty(!isTradeModalVisible);
  };

  useEffect(() => {
    if (isTradeModalVisible) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
      sheetRef.current.snapTo(0);
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [isTradeModalVisible]);

  const modalY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SIZES.height, SIZES.height - 340],
  });
  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Dim the background */}
      {isTradeModalVisible && (
        <>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: COLORS.transparentBlack,
            }}
            opacity={modalAnimatedValue}
          />

          <BottomSheet
            ref={sheetRef}
            snapPoints={[400, 400, 0]}
            borderRadius={10}
            renderContent={renderContent}
            onCloseEnd={() => closeShowModal(setTradeModalVisibilty)}
            enabledInnerScrolling={false}
          />
        </>
      )}
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
