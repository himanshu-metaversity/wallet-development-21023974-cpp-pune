import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useRef, useEffect } from "react";
import CodeInput from "react-native-code-input";
import { decryptPin, decryptMnemonic } from "../../utils/WalletOperations";
import RNExitApp from "react-native-exit-app";
const { height, width } = Dimensions.get("screen");

const SecurityPin = (props) => {
  const ipnInput = useRef(null);
  const { tx, pageName, pageType, txData } = props?.route?.params;

  useEffect(() => {
    ipnInput.current.clear();
    setTimeout(() => {
      ipnInput.current.focus();
    }, 100);
  }, [props.route]);

  const goBack = () => {
    if (pageName !== "splash") {
      props.navigation.replace("Portfolio");
    } else {
      RNExitApp.exitApp();
      return;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity onPress={goBack}>
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            style={styles.imgBack}
            resizeMode="contain"
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Back.png")}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>
            {pageName ? "Enter PIN" : "Enter New PIN"}
          </Text>

          <Text style={styles.securityText}>SECURITY CHECK</Text>
        </View>

        {/* <View style={styles.pinView}>
          <Text style={styles.newPinText}>
            {pageName ? "Enter PIN" : "Enter New PIN"}
          </Text>

          <Text style={styles.securityText}>SECURITY CHECK</Text>
        </View> */}
      </View>
    );
  };

  const onFill = async (value) => {
    const userPin = await decryptPin();
    const userMnemonic = await decryptMnemonic();
    if (!userPin) {
      props.navigation.navigate("ReenterPin", { value });
      return;
    }
    if (userPin !== value) {
      alert("PIN does not match");
      ipnInput.current.clear();
      ipnInput.current.focus();
      return;
    }
    if (userPin === value && !userMnemonic) {
      props.navigation.replace("Onboarding");
      return;
    }
    if (tx && pageName === "Swap") {
      props.navigation.replace(pageName, { txData });
      return;
    }
    if (tx) {
      props.navigation.replace(pageName, { pageType, success: true, txData });
      return;
    }
    if (pageName === "SeedFrame") {
      props.navigation.replace("SeedFrame", { userMnemonic });
      return;
    }
    props.navigation.replace("Portfolio");
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
          ref={ipnInput}
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

export default SecurityPin;

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
    width: width * 0.8,
    alignItems: "center",
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
    width: width * 0.75,
  },

  newPinText: {
    fontSize: height / 25,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  securityText: {
    fontSize: height / 52,
    color: "#808080",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    marginTop: height * 0.006,
  },
});
