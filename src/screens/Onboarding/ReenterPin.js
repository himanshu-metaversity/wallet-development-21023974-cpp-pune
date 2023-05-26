import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
import CodeInput from "react-native-code-input";
import { encryptPin } from "../../utils/WalletOperations";
const { height, width } = Dimensions.get("screen");

const ReenterPin = (props) => {
  const { value } = props.route.params;
  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity
        // onPress={() => props.navigation.goBack()}
        >
          <ImageBackground
            // source={require("../../assets/images/Onbording/Oval.png")}
            style={styles.imgBack}
            resizeMode="contain"
          >
            {/* <Image
              source={require("../../assets/images/ButtonIcons/Back.png")}
              resizeMode="contain"
            ></Image> */}
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>Re-Enter PIN</Text>
          <Text style={styles.securityText}>SECURITY CHECK</Text>
        </View>
      </View>
    );
  };

  const onFill = (pin) => {
    if (pin !== value) {
      alert("PIN does not match");
    } else {
      encryptPin(value);
      props.navigation.navigate("Onboarding");
    }
  };

  const renderMiddle = () => {
    return (
      <View>
        <CodeInput
          secureTextEntry
          space={20}
          borderType="circle"
          size={width * 0.09}
          codeInputStyle={{
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: Platform.OS === "ios" ? height / 25 : height / 32,
            backgroundColor: "grey",
            color: "#fff",
          }}
          inputPosition="center"
          keyboardType="number-pad"
          codeLength={6}
          // borderType="border-circle"
          autoFocus={true}
          containerStyle={{ marginTop: height * 0.2 }}
          onFulfill={onFill}
        />
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
    </View>
  );
};

export default ReenterPin;

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
    width: width * 0.7,
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height / 25,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
  },

  securityText: {
    fontSize: height / 52,
    color: "#808080",
    fontFamily: "ClashDisplay-Regular",
    marginTop: height * 0.006,
  },
});
