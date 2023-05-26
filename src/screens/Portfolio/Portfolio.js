import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";

import { WalletContext } from "../../contexts/WalletContext";
import { ScrollView } from "react-native-gesture-handler";
import CoinCard from "../../components/CoinCard";
import SendReceive from "../../components/SendReceive";
// import {Picker} from '@react-native-picker/picker';

const { height, width } = Dimensions.get("screen");

const Portfolio = (props) => {
  const walletContext = useContext(WalletContext);
  const { wallets, totalUSDPrice } = walletContext;

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

  // console.log("wallets", wallets);

  const renderHeader = () => {


    return (
      <View style={styles.securityView}>
        <Image
          source={require("../../assets/images/Portfolio/Portfolio.png")}
          // style={{ marginLeft: width * 0.03 }}
          resizeMode="contain"
        ></Image>
        <View>
          <View>
            <Text style={styles.centerWallet}>Wallet</Text>

          </View>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("ImportAccount")}
        >
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            style={styles.imgBack}
            resizeMode="contain"
          >
            <Image
              source={require("../../assets/images/ButtonIcons/plus.png")}
              resizeMode="contain"
              style={{ height: height * 0.08, width: width * 0.08 }}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPortfolio = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>Portfolio</Text>
        <Text style={styles.totalText}>Total Balance</Text>
        {totalUSDPrice === undefined ? (
          <ActivityIndicator size="large" style={{ marginTop: 10 }} />
        ) : (
          <Text style={styles.amtText}>
            {`$${totalUSDPrice.toFixed(2)}`
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Text>
        )}

        <SendReceive pageType="All" {...props} />
      </View>
    );
  };

  const renderDetails = () => {
    return (
      <View style={styles.transView}>
        <ScrollView
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          {!wallets ? (
            <ActivityIndicator size="large" style={{ marginTop: 10 }} />
          ) : (
            <>
              {wallets &&
                wallets.map((item) => {
                  return (
                    <CoinCard
                      key={item.showSymbol}
                      item={item}
                      type={"All"}
                      pageType={"All"}
                      {...props}
                    />
                  );
                })}
              <View style={{ paddingBottom: height * 0.08 }}></View>
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderPortfolio()}
      {renderDetails()}
    </View>
  );
};

export default Portfolio;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  securityView: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 1,
    height: height * 0.08,
    paddingHorizontal: width * 0.04,
    // backgroundColor: "red",
    justifyContent: "space-between",
    alignSelf: "center"
  },

  portfolioView: {
    justifyContent: "center",
    alignItems: "center",
  },
  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioText: {
    color: "white",
    marginTop: height * 0.03,
    fontSize: 42,
    fontFamily: "ClashDisplay-Medium",
    fontWeight: Platform.OS === "ios" ? "500" : "600",
    textAlign: "center",
  },

  totalText: {
    fontSize: height / 52,
    color: "white",
    marginTop: height * 0.04,
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  amtText: {
    fontSize: 42,
    fontFamily: "ClashDisplay-Medium",
    fontWeight: Platform.OS === "ios" ? "500" : "600",
    marginTop: height * 0.01,
    color: "white",
  },

  transView: {
    width: "100%",
    backgroundColor: "#192255",
    borderTopLeftRadius: height / 20,
    borderTopRightRadius: height / 20,
    marginTop: height * 0.05,
    height: height - 460,
    position: "absolute",
    bottom: 0,
  },
  centerWallet: {
    color: "white",
    fontSize: 16,
    fontFamily: "ClashDisplay-Medium",
    fontWeight: Platform.OS === "ios" ? "500" : "700",
    textAlign: "center",
  }
});
