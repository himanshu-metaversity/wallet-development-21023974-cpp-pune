import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { decryptPin } from "../../utils/WalletOperations";
const { height, width } = Dimensions.get("window");

const slides = [
  {
    key: 1,
    image: require("../../assets/images/Onbording/Onboard.png"),
  },
  {
    key: 2,
    image: require("../../assets/images/Onbording/Onboard.png"),
  },
  {
    key: 3,
    image: require("../../assets/images/Onbording/Onboard.png"),
  },
];

const Onboarding = (props) => {
  const checkLogIn = async () => {
    const userPin = await decryptPin();
    if (!userPin) {
      props.navigation.navigate("SecurityPin", { tx: false });
    } else {
      props.navigation.navigate("SeedFrame", { userMnemonic: null });
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.welcomeView}>
        <Text style={styles.welcomeText}>
          Welcome to the{"\n"} safest Crypto{"\n"} Wallet
        </Text>
      </View>
    );
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={[styles.imgContainer]}>
          <Image source={item.image} />
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footerView}>
        <TouchableOpacity onPress={checkLogIn}>
          <Text style={styles.walletText}>I have a wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("SeedPhrase")}
        >
          <ImageBackground
            source={require("../../assets/images/Onbording/Arrow.png")}
            style={styles.btnBack}
            resizeMode="contain"
          >
            <Image
              source={require("../../assets/images/ButtonIcons/Forward.png")}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.backgroundView}>
      {renderHeader()}
      <View style={styles.mainContainer}>
        <AppIntroSlider
          renderItem={_renderItem}
          data={slides}
          showSkipButton={false}
          showNextButton={false}
          dotStyle={{
            backgroundColor: "#232949",
            marginTop: -height * 1,
          }}
          activeDotStyle={{
            backgroundColor: "#FFFFFF",
            marginTop: -height * 1,
          }}
        />
      </View>
      {renderFooter()}
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  mainContainer: {
    // height: height * 0.97,
    height: height * 1,
    width: width * 1,
    // backgroundColor: 'rgba(90,26,153,255)',
  },
  slide: {
    height: height * 1,
    width: width * 1,
    // justifyContent: 'center',
    alignItems: "center",
  },
  titleContainer: {
    height: height * 0.1,
    width: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'red',
  },
  title: {
    color: "rgb(255,255,255)",
    fontSize: height / 35,
    fontWeight: "700",
  },
  imgContainer: {
    // height: height * 0.4,
    height: height * 0.4,
    width: width * 1,
    alignItems: "center",
    justifyContent: "center",
  },
  txtContainer: {
    // height: height * 0.25,
    height: height * 0.16,
    width: width * 0.85,
    alignItems: "center",
    // backgroundColor: 'cyan',
  },
  txtView: {
    color: "rgb(255,255,255)",
    fontSize: height / 55,
  },

  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
    height: height * 1,
  },

  welcomeView: {
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.3,
    width: width * 1,
  },

  middleView: {
    height: height * 0.3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },

  welcomeText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    letterSpacing: 1,
    alignSelf: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    textAlign: "center",
  },

  btnBack: {
    height: height * 0.1,
    width: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'red'
  },

  footerView: {
    flexDirection: "row",
    marginHorizontal: width * 0.07,
    width: "90%",
    alignItems: "center",
    marginTop: height * 0.01,
    justifyContent: "space-between",
    position: "absolute",
    bottom: height * 0.02,
    // backgroundColor:'red'
  },

  walletText: {
    textDecorationLine: "underline",
    fontSize: height / 30,
    color: "#808080",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },

  onBoardImg: {
    height: 30,
    width: 30,
  },
});
