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
import Accordian from "../../components/Accordian";
const { height, width } = Dimensions.get("screen");

const Faq = (props) => {
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
          <Text style={styles.newPinText}>FAQs</Text>
        </View>
      </View>
    );
  }

  function renderMiddle() {
    return (
      <View style={styles.transView}>
        <Accordian />
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

export default Faq;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.04,
    alignItems: "center",
    justifyContent: "space-between",
    width: "58%",
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
    fontSize: height * 0.035,
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  transView: {
    width: "100%",
    backgroundColor: "#192255",
    borderTopLeftRadius: height / 20,
    borderTopRightRadius: height / 20,
    marginTop: height * 0.04,
    height: height * 1,
  },
});
