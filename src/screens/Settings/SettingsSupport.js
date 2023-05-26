import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
const { height, width } = Dimensions.get("screen");

const SettingsWallet = (props) => {
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
              resizeMode="contain"
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>Settings</Text>
        </View>
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>Support</Text>
      </View>
    );
  };

  const features = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Faq")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#192255",
            marginTop: height * 0.07,
            height: height * 0.1,
            width: width * 1,
            borderRadius: height / 25,
            flexDirection: "row",
            paddingHorizontal: width * 0.04,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: width * 0.35,
              justifyContent: "space-between",
            }}
          >
            <ImageBackground
              source={require("../../assets/images/Settings/BlueRec.png")}
              resizeMode="contain"
              style={{
                height: height * 0.073,
                width: width * 0.13,
                borderRadius: height / 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/images/Settings/file.png")}
                style={styles.imgWallet}
              ></Image>
            </ImageBackground>
            <Text
              style={{
                fontSize: height / 40,
                color: "white",
                marginLeft: width * 0.04,
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              FAQs
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0D1541",
              height: height * 0.06,
              width: width * 0.15,
              borderRadius: height / 30,
            }}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Forward.png")}
            ></Image>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("AboutUs")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#192255",
            marginTop: height * 0.01,
            height: height * 0.1,
            width: width * 1,
            borderRadius: height / 25,
            flexDirection: "row",
            paddingHorizontal: width * 0.04,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: width * 0.35,
              justifyContent: "space-between",
            }}
          >
            <Image
              source={require("../../assets/images/Settings/ResetWallet.png")}
              resizeMode="contain"
              style={{ height: height * 0.073, width: width * 0.13 }}
            ></Image>
            <Text
              style={{
                fontSize: height / 40,
                color: "white",
                marginLeft: width * 0.04,
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              About
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0D1541",
              height: height * 0.06,
              width: width * 0.15,
              borderRadius: height / 30,
            }}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Forward.png")}
            ></Image>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {features()}
    </View>
  );
};

export default SettingsWallet;

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
    width: "605%",
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
    marginTop: height * 0.05,
  },

  portfolioText: {
    fontSize: height / 20,
    color: "white",
    marginTop: height * 0.03,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height * 0.035,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
