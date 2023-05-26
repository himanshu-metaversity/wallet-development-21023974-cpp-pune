import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import QRCode from "react-native-qrcode-svg";
import { WalletContext } from "../../contexts/WalletContext";
import { sortAddress } from "../../utils/WalletOperations";
import Clipboard from "@react-native-community/clipboard";
import Toast from "react-native-toast-message";
const { height, width } = Dimensions.get("screen");

const Recieve = (props) => {
  const { pageType } = props.route.params;
  const walletContext = useContext(WalletContext);
  const { selectedWallets, wallets } = walletContext;
  const coin = wallets.filter((item) => {
    return item.showSymbol === pageType;
  });
  const crtCoin = coin[0];

  const coinName = !crtCoin.tokenType
    ? crtCoin.showSymbol
    : crtCoin.tokenType === "ERC20"
    ? "ETH"
    : "BNB";

  const copyAddress = async (add) => {
    Clipboard.setString(add);
    Toast.show({
      type: "info",
      text1: "Address copied successfully.",
    });
  };

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
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>Recieve</Text>
        <View style={styles.qrImg}>
          <QRCode
            value={selectedWallets[coinName].address}
            backgroundColor="white"
            size={240}
          />
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <KeyboardAvoidingView>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={styles.footerView}>
            {selectedWallets && (
              <TextInput
                editable={false}
                // placeholder="ksdkkjvkjxbfjkbvjkbfvkjbfkvfrgrhytdgb"
                placeholderTextColor={"white"}
                style={styles.inputView}
                value={sortAddress(selectedWallets[coinName].address)}
              />
            )}

            <TouchableOpacity
              onPress={() => copyAddress(selectedWallets[coinName].address)}
            >
              <Image
                source={require("../../assets/images/Recieve/Copy.png")}
                style={styles.copyImg}
                resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {renderFooter()}
    </View>
  );
};

export default Recieve;

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
    width: "65%",
  },

  copyImg: {
    height: height * 0.07,
  },

  qrImg: {
    height: height * 0.4,
    width: width * 0.8,
    marginTop: height * 0.04,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  inputView: {
    height: height * 0.05,
    width: width * 0.6,
    textAlign: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  footerView: {
    height: height * 0.09,
    borderRadius: height / 20,
    alignSelf: "center",
    marginTop: height * 0.05,
    width: width * 0.8,
    backgroundColor: "#192255",
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: height * 0.04,
    color: "#FFFFFF",
  },
});
