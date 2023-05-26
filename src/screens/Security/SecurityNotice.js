import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
const { height, width } = Dimensions.get("window");

const SecurityNotice = (props) => {
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
              source={require("../../assets/images/ButtonIcons/Back.png")}
              resizeMode="contain"
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSecurity = () => {
    return (
      <View style={styles.securityImgView}>
        <Image
          source={require("../../assets/images/Security/Security.png")}
          style={styles.securityImg}
          resizeMode="contain"
        ></Image>
        <Text style={styles.alertText}>
          We will never ask {"\n"} for your seed.
        </Text>
        <Text style={styles.impText}>Important notice!</Text>
        <Text style={styles.alertTextNew}>
          No one on the Pocket team request the user’s seed or private key.{" "}
          {"\n"} Whether through support, promotion,{"\n"} giveaway, website,
          telegram bot or any {"\n"} other type of contact.
        </Text>
      </View>
    );
  };

  const renderUnderstand = () => {
    return (
      <TouchableOpacity
        style={styles.understandView}
        onPress={() => props.navigation.navigate("Portfolio")}
      >
        <Text style={styles.understandText}>Okay, I got it!</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {/* {renderHeader()} */}
      {renderSecurity()}
      {renderUnderstand()}
    </View>
  );
};

export default SecurityNotice;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.02,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  understandText: {
    fontSize: height / 40,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  alertText: {
    fontSize: 30,
    color: "#FFFAFA",
    marginTop: height * 0.02,
    fontFamily: "ClashDisplay-Medium",
    fontWeight: Platform.OS === "ios" ? "500" : "600",
    textAlign: "center",
  },

  understandView: {
    height: height * 0.08,
    width: width * 0.7,
    backgroundColor: "#27378C",
    borderRadius: height / 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: height * 0.02,
  },

  alertTextNew: {
    fontSize: height / 48,
    color: "#FFFAFA",
    marginTop: height * 0.1,
    marginHorizontal: width * 0.02,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
    alignSelf: "center",
    textAlign: "center",
  },

  impText: {
    fontSize: height / 40,
    color: "white",
    marginHorizontal: width * 0.02,
    marginTop: height * 0.01,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  alertTextThird: {
    fontSize: height / 65,
    color: "#FFFAFA",
    marginHorizontal: width * 0.02,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  securityImgView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
  },

  securityImg: {
    height: height * 0.2,
    width: width * 0.3,
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },
});
