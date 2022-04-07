import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { SIZES, FONTS } from "../constants";

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.isLoading,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      isLoading: nextProps.isLoading,
    };
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={"none"}
        visible={this.state.isLoading}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <View>
              <Text style={{ ...FONTS.body2 }}>validating PIN...</Text>
            </View>
            <ActivityIndicator
              animating={this.state.isLoading}
              color="colors.lightblueaccent"
              size="large"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    height: 150,
    width: SIZES.width - 30,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Loader;
