import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import scale, { verticalScale } from "../../utils/Scale";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height, width } = Dimensions.get("screen");

const PrivacyPolicy = (props) => {
  const [toogle, setToggle] = useState(true);
  const [isEnabled, setEnabled] = useState(false);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  function toggleSwitch() {
    if (isEnabled) {
      setEnabled(false);
      setToggle(true);
    } else if (!isEnabled) {
      setEnabled(true);
      setToggle(false);
    }
  }
  const goToNextScreen = async () => {
    AsyncStorage.setItem("privacypolicy", "true");
    props.navigation.navigate("SecurityPin", { tx: false, pageName: "splash" });
  };

  function renderHeader() {
    return (
      <View style={styles.headerTextView}>
        <Text style={styles.privacyText}>PRIVACY POLICY</Text>

        <Text style={styles.mustText}>
          You must read and accept our TnC {"\n"} terms to continue
        </Text>
      </View>
    );
  }

  function renderMiddle() {
    return (
      <View style={{ height: height * 0.6, width: width * 0.94 }}>
        <Text style={styles.middleText}>Privacy Policy</Text>
        <Text style={styles.middleLastText}>Last updated: January 15, 2023</Text>

        <Text style={styles.policyText}>
          Lorem ipsum dolor sit a consectetur adipiscing elit. Aenean
          euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan
          et viverra justocommodo. Proin sodales pulvinar sic tempor. Sociis
          natoque penatibus et magnis dis parturient montes, nascetur ridiculus
          mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus
          mollis orci, sed rhoncus pronin sapien nunc accuan eget.
          {"\n"}
          {"\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan
          et viverra justo commodo.{"\n"}
        </Text>
        <View style={styles.toggleView}>
          <Switch
            trackColor={{ false: "#192255", true: "#FFFFFF" }}
            thumbColor={isEnabled ? "#353F78" : "#353F78"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={styles.toggleText}>
            I have read and agree to the terms.
          </Text>
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <TouchableOpacity
        disabled={toogle}
        style={styles.continueButton}
        onPress={goToNextScreen}
      >
        <Text style={styles.comntinueText}>Continue</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {renderFooter()}
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  headerTextView: {
    justifyContent: "center",
    alignItems: "center",
  },

  privacyText: {
    fontSize: height / 28,
    fontWeight: "500",
    color: "white",
    marginTop: verticalScale(20),
    fontFamily: "ClashDisplay-Regular",
  },

  continueButton: {
    backgroundColor: "#27378C",
    width: width * 0.9,
    height: height * 0.1,
    borderRadius: 50,
    marginTop: height * 0.1,
    alignSelf: "center",
    position: "absolute",
    bottom: height * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },

  middlePrivacyText: {
    fontSize: height / 40,
    fontWeight: "600",
    color: "white",
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
    fontFamily: "ClashDisplay-Regular",
  },

  middleLastText: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "600",
    color: "white",
    marginLeft: width * 0.05,
    fontFamily: "ClashDisplay-Medium",
    marginTop: height * 0.01,
  },

  policyText: {
    fontSize: height / 55,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.03,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  comntinueText: {
    fontSize: height / 35,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  mustText: {
    fontSize: height / 55,
    fontWeight: "500",
    color: "#808080",
    marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  middleText: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "500" : "600",
    color: "white",
    marginLeft: width * 0.05,
    fontFamily: "ClashDisplay-Medium",
    marginTop: height * 0.04,
  },
  toggleText: {
    fontSize: 14,
    color: "#808080",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    marginLeft: 10,
  },

  toggleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: width * 0.05,
    width: "80%",
  },
});
