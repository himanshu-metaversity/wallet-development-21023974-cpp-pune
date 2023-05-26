import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
const { height, width } = Dimensions.get("screen");

const AboutUs = (props) => {
  function renderHeader() {
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
              resizeMode="contain"
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>About Us</Text>
        </View>
      </View>
    );
  }

  function renderMiddle() {
    return (
      <View
        style={{ marginTop: height * 0.02, marginHorizontal: width * 0.06 }}
      >
        <Text style={styles.lastUpdateText}>About Us</Text>
        <Text style={styles.lastUpdateText}>Last updated: August 7, 2022</Text>
        <ScrollView>
          <Text style={styles.contentText}>
            Wallet is a simple, secure & decentralized p2p curated crypto wallet
            for Bitcoin (BTC), Binance (BNB), Ethereum (ETH) and other top
            coins, tokens and cryptocurrency assets.
            {"\n"}
            {"\n"}
            As a non-custodian crypto wallet, Wallet has no access to your
            funds.
          </Text>
          <Text style={styles.contentText}>
            Our Dapp Browser allows you to connect to thousands of decentralized
            apps such as gaming, finance, etc.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  aboutText: {
    fontSize: height / 38,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  lastUpdateText: {
    fontSize: height / 55,
    color: "#FFFFFF",
    marginTop: height * 0.01,
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
    lineHeight: 24,
  },

  contentText: {
    fontSize: height / 55,
    // marginHorizontal: width * 0.06,
    marginTop: height * 0.03,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",

    lineHeight: 24,
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.04,
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.67,
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height * 0.029,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
