import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
const { height, width } = Dimensions.get("screen");

const Settings = (props) => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

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

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>Settings</Text>
      </View>
    );
  };

  // const fredView = () => {
  //   return (
  //     <View
  //       style={{
  //         justifyContent: "center",
  //         backgroundColor: "#192255",
  //         marginTop: height * 0.07,
  //         height: height * 0.1,
  //         width: width * 1,
  //         borderRadius: height / 25,
  //         flexDirection: "row",
  //       }}
  //     >
  //       <View
  //         style={{
  //           justifyContent: "center",
  //           height: height * 0.1,
  //           width: width * 0.7,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontSize: height / 35,
  //             color: "#FFFFFF",
  //             fontFamily: "Poppins-Regular",
  //             fontWeight: "500",

  //             textAlign: "center",
  //           }}
  //         >
  //           Freddy
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: height / 65,
  //             color: "#A2A2AA",
  //             fontFamily: "Poppins-Regular",
  //             fontWeight: "500",

  //             textAlign: "center",
  //           }}
  //         >
  //           an21vnvnvok2vvaxm396
  //         </Text>
  //       </View>
  //       <View
  //         style={{
  //           alignItems: "center",

  //           backgroundColor: "#0D1541",
  //           height: height * 0.06,
  //           width: width * 0.15,
  //           borderRadius: height / 30,
  //           justifyContent: "center",
  //           alignSelf: "center",
  //         }}
  //       >
  //         <Image
  //           source={require("../../assets/images/ButtonIcons/Forward.png")}
  //           resizeMode="contain"
  //         ></Image>
  //       </View>
  //     </View>
  //   );
  // };

  const features = () => {
    return (
      <View style={styles.transView}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("SettingsWallet")}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: height * 0.04,
            marginHorizontal: width * 0.05,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: width * 0.4,
              justifyContent: "space-between",
            }}
          >
            <ImageBackground
              source={require("../../assets/images/Settings/Wallet.png")}
              style={{
                height: height * 0.1,
                width: width * 0.18,
                borderRadius: height / 45,
                justifyContent: "center",
                alignItems: "center",
              }}
              resizeMode="contain"
            >
              <Image
                source={require("../../assets/images/Settings/WalletIcon.png")}
                style={styles.imgWallet}
                resizeMode="contain"
              ></Image>
            </ImageBackground>
            <Text
              style={{
                fontSize: height / 40,
                color: "#FFFFFF",
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
              }}
            >
              Wallet
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
              resizeMode="contain"
            ></Image>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("SettingsSupport")}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: height * 0.04,
            marginHorizontal: width * 0.05,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: width * 0.4,
              justifyContent: "space-between",
            }}
          >
            <Image
              source={require("../../assets/images/Settings/Lock.png")}
              style={{
                height: height * 0.1,
                width: width * 0.18,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
              resizeMode="contain"
            ></Image>
            <Text
              style={{
                fontSize: height / 40,
                color: "#FFFFFF",
                marginLeft: width * 0.04,
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
              }}
            >
              Support
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
            onPress={() => props.navigation.navigate("SettingsSupport")}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Forward.png")}
              resizeMode="contain"
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
      {/* {fredView()} */}
      {features()}
    </View>
  );
};

export default Settings;

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
    width: "55%",
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  imgWallet: {
    height: height * 0.04,
    width: width * 0.09,
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
  },

  transView: {
    width: "100%",
    backgroundColor: "#192255",
    borderTopLeftRadius: height / 20,
    borderTopRightRadius: height / 20,
    marginTop: height * 0.1,
    height: height * 0.8,
  },

  portfolioView: {
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    marginTop: height * 0.03,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },
});
