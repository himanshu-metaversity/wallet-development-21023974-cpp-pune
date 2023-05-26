import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import React, { Component } from "react";
import TxList from "../../components/TxList";
const { height, width } = Dimensions.get("screen");

const WalletScroll = (props) => {
  const { allTx, type, crtWallet } = props.route.params;

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            resizeMode="contain"
            style={styles.imgBack}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Back.png")}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>My Wallet</Text>
        </View>
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.middleView}>
        <Text style={styles.etheriumText}>Wallet {crtWallet.name}</Text>
        <Text style={styles.amtText}>{`$${crtWallet.totalUSDPrice.toFixed(
          2
        )}`}</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={styles.transView}>
        <View
          style={{
            flexDirection: "row",
            marginTop: height * 0.02,
            marginLeft: width * 0.06,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: height / 54,
              color: "white",
              fontFamily: "ClashDisplay-Regular",
              fontWeight: "600",
            }}
          >
            Transactions
          </Text>
          {/* <TouchableOpacity>
            <Image
              source={require("../../assets/images/ButtonIcons/trans.png")}
              style={{ marginLeft: 10 }}
            ></Image>
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={allTx}
          renderItem={({ item }) => (
            <TxList item={item} type={type} crtWallet={crtWallet} {...props} />
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {allTx && renderFlatList()}
    </View>
  );
};

export default WalletScroll;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  middleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: height * 0.04,
    marginHorizontal: width * 0.04,
  },

  flatListView: {
    height: height * 0.05,
    width: width * 0.03,
    borderRadius: height / 20,
    backgroundColor: "#192255",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: height * 0.005,
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  etheriumText: {
    fontSize: height * 0.02,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  amtText: {
    fontSize: height * 0.04,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },

  transView: {
    width: "100%",
    backgroundColor: "#192255",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: height * 0.04,
    height: height * 0.8,
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  newPinText: {
    fontSize: height * 0.04,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
