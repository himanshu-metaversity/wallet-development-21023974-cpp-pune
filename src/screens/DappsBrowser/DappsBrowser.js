import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

/* eslint-disable-next-line */
// import DAppBrowser from "../../../Libs/react-native-golden-dweb-browser";

const { height, width } = Dimensions.get("screen");

const DappsBrowser = (props) => {
  const serchFer = useRef(null);
  // let url = '' ;
  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            style={styles.imgBack}
            resizeMode="contain"
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Close.png")}
              resizeMode="contain"
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>Browser</Text>
      </View>
    );
  };

  const renderInput = () => {
    return (
      <View
        style={{
          height: height * 0.2,
          justifyContent: "center",
        }}
      >
        <Text style={styles.exploreText}>Explore the Crypto world</Text>
        <View style={styles.footerView}>
          <TextInput
            placeholder="Enter a URL"
            placeholderTextColor={"#808080"}
            style={styles.inputView}
            ref={serchFer}
            onFocus={() => {
              serchFer.current.blur();
              props.navigation.navigate("Browser");
            }}
          ></TextInput>
          <TouchableOpacity
          // onPress={() =>}
          >
            <Image
              source={require("../../assets/images/DappsBrowser/Search.png")}
              style={styles.copyImg}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRecents = () => {
    return (
      <View>
        <Text style={styles.recentText}>Recents</Text>
        <View style={{ flexDirection: "row", marginTop: height * 0.02 }}>
          <View style={styles.coinView}>
            <Image
              source={require("../../assets/images/Bitcoins/Bitcoin.png")}
              resizeMode="contain"
            ></Image>
            <Text
              style={{
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              BTC
            </Text>
          </View>
          <View style={styles.coinView}>
            <Image
              source={require("../../assets/images/Bitcoins/Peercoin.png")}
              resizeMode="contain"
            ></Image>
            <Text
              style={{
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              PFC
            </Text>
          </View>
        </View>
        <View style={styles.borderView}></View>
      </View>
    );
  };

  const renderHistory = () => {
    return (
      <View style={styles.favrtView}>
        <TouchableOpacity
          style={styles.historyView}
          onPress={() => {
            props.navigation.navigate("History", { type: "History" });
          }}
        >
          <Image
            source={require("../../assets/images/DappsBrowser/Historyt.png")}
            resizeMode="contain"
            style={{ height: height * 0.05, width: width * 0.09 }}
          ></Image>
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historyView}
          onPress={() => {
            props.navigation.navigate("History", { type: "Favourites" });
          }}
          // onPress={() => props.navigation.navigate("Favourites")}
        >
          <Image
            source={require("../../assets/images/DappsBrowser/Favourites.png")}
            resizeMode="contain"
          ></Image>
          <Text style={styles.historyText}>Favourites</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {renderInput()}
      {/* {renderRecents()} */}
      {renderHistory()}
    </View>
  );
};

export default DappsBrowser;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  historyView: {
    height: height * 0.14,
    backgroundColor: "#192255",
    width: width * 0.43,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: height / 45,
  },

  historyText: {
    marginTop: height * 0.02,
    fontSize: height / 50,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  favrtView: {
    flexDirection: "row",
    marginTop: height * 0.03,
    justifyContent: "space-between",
    width: width * 0.9,
    alignSelf: "center",
  },

  coinView: {
    marginLeft: width * 0.05,
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.12,
  },

  borderView: {
    height: height * 0.001,
    width: width * 0.9,
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: height * 0.04,
  },

  exploreText: {
    fontSize: height / 45,
    color: "white",
    marginTop: height * 0.02,
    marginLeft: width * 0.06,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  recentText: {
    fontSize: height / 45,
    color: "white",
    marginTop: height * 0.02,
    marginLeft: width * 0.06,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioView: {
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    marginTop: height * 0.01,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    alignSelf: "center",
  },

  footerView: {
    height: height * 0.09,
    borderRadius: height / 20,
    alignSelf: "center",
    marginTop: height * 0.02,
    width: width * 0.9,
    backgroundColor: "#232949",
    flexDirection: "row",
    alignItems: "center",
  },

  inputView: {
    height: height * 0.05,
    width: width * 0.7,
    marginLeft: width * 0.05,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },

  copyImg: {
    height: height * 0.07,
  },
});
