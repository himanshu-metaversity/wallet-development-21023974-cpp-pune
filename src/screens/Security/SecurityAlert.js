import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { Component, useState } from "react";
import ToggleSwitch from "toggle-switch-react-native";
const { height, width } = Dimensions.get("window");

const SecurityAlert = (props) => {
  const [toogle, setToggle] = useState(true);
  const [isEnabled, setEnabled] = useState(false);

  function toggleSwitch() {
    if (isEnabled) {
      setEnabled(false);
      setToggle(true);
    } else if (!isEnabled) {
      setEnabled(true);
      setToggle(false);
    }
  }

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
        <Text style={styles.alertText}>Security Alert</Text>
        <Text style={styles.alertTextNew}>
          {" "}
          Your seed or private key give direct access to your account. Never
          give this information to any other users.
        </Text>
        <View style={styles.toggleView}>
          <Switch
            trackColor={{ false: "#192255", true: "#FFFFFF" }}
            thumbColor={isEnabled ? "#353F78" : "#353F78"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={styles.toggleText}>
            I understand that if i share this information, I am putting my{" "}
            account in risk.
          </Text>
        </View>
      </View>
    );
  };

  const renderUnderstand = () => {
    return (
      <TouchableOpacity
        disabled={toogle}
        style={styles.understandView}
        onPress={() => props.navigation.navigate("SecurityNotice")}
      >
        <Text style={styles.understandText}>I Understand</Text>
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

export default SecurityAlert;

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
    fontSize: height / 50,
    color: "#FFFAFA",
    marginTop: height * 0.08,
    marginHorizontal: width * 0.01,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
    textAlign: "center",
  },

  alertTextThird: {
    fontSize: height / 65,
    color: "white",
    marginHorizontal: width * 0.02,
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  toggleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: height * 0.08,
  },

  toggleText: {
    fontSize: height / 48,
    color: "#808080",
    marginLeft: width * 0.02,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    width: width * 0.6,
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
