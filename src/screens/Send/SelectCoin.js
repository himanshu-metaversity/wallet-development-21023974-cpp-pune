import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useContext } from "react";
import CoinCard from "../../components/CoinCard";
import { WalletContext } from "../../contexts/WalletContext";
const { height, width } = Dimensions.get("screen");

const SelectCoin = (props) => {
  const walletContext = useContext(WalletContext);
  const { wallets } = walletContext;
  const { type, pageType } = props.route.params;

  // const type = props.type ? props.type : props.route.parems.type;
  // const pageType = props.pageType
  //   ? props.pageType
  //   : props.route.parems.pageType;

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
          <Text style={styles.newPinText}>Send</Text>
        </View>
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>My Coin</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        data={wallets}
        style={styles.transView}
        renderItem={(item) => (
          <CoinCard
            key={item.item.showSymbol}
            item={item.item}
            type={type}
            pageType={pageType}
            {...props}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {!wallets ? (
        <ActivityIndicator size="large" style={{ marginTop: 10 }} />
      ) : (
        <>{renderFlatList()}</>
      )}
    </View>
  );
};

export default SelectCoin;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: "55%",
  },

  transView: {
    width: "100%",
    marginTop: height * 0.1,
    height: height * 0.35,
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioView: {
    justifyContent: "center",
    alignItems: "center",
  },

  portfolioText: {
    fontSize: height / 20,
    color: "white",
    marginTop: height * 0.03,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  newPinText: {
    fontSize: height * 0.04,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
