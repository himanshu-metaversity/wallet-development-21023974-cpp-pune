import React, { useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
const { height, width } = Dimensions.get("screen");
import { sortAddress } from "../utils/WalletOperations";

export default function TxList(props) {
  const { item, type, crtWallet } = props;

  const gotToLink = () => {
    const txType = !crtWallet.tokenType
      ? type
      : crtWallet.tokenType === "ERC20"
      ? "ETH"
      : "BNB";
    if (txType === "BNB") {
      Linking.openURL(`https://testnet.bscscan.com/tx/${item.hash}`);
    } else if (txType === "BTC") {
      Linking.openURL(`https://www.blockchain.com/btc/tx/${item.hash}`);
    } else if (txType === "ETH") {
      Linking.openURL(`https://goerli.etherscan.io/tx/${item.hash}`);
    } else if (txType === "AVAX") {
      Linking.openURL(`https://testnet.snowtrace.io/tx/${item.hash}`);
    } else if (txType === "ETC") {
      Linking.openURL(`https://blockscout.com/etc/mordor/tx/${item.hash}`);
    } else if (txType === "SOL") {
      Linking.openURL(`https://explorer.solana.com/tx/${item.hash}`);
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: height * 0.03,
        marginLeft: width * 0.02,
      }}
    >
      <TouchableOpacity
        onPress={gotToLink}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Image
          source={
            item.type === "Incoming"
              ? require("../assets/images/ButtonIcons/receive.png")
              : require("../assets/images/ButtonIcons/Right.png")
          }
        ></Image>
        <View
          style={{ justifyContent: "space-between", height: height * 0.05 }}
        >
          <View
            style={{
              flexDirection: "row",
              height: height * 0.03,
              marginLeft: width * 0.03,
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: width * 0.77,
            }}
          >
            <Text
              style={{
                fontSize: height / 40,
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              {item.type === "Incoming" ? "Receive" : "Send"}
            </Text>
            <Text
              style={{
                fontSize: height / 40,
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              {`${item.value.toFixed(4)} ${type}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginLeft: width * 0.03,
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: width * 0.77,
            }}
          >
            <Text
              style={{
                fontSize: height / 55,
                color: "#A2A2AA",
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
              }}
            >
              {item.type === "Incoming" ? "From" : "To"}{" "}
              {item.type === "Incoming"
                ? sortAddress(item.from)
                : sortAddress(item.to)}
            </Text>
            <Text
              style={{
                fontSize: height / 55,
                color: "#A2A2AA",
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
              }}
            >
              {(item.value * crtWallet.current_price).toFixed(6)} USD
            </Text>
          </View>

          <ImageBackground
            source={require("../assets/images/ButtonIcons/Divider.png")}
            resizeMode="contain"
            style={{
              height: height * 0.01,
              marginTop: height * 0.01,
              width: width * 0.76,
              marginLeft: width * 0.04,
              alignSelf: "center",
            }}
          ></ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
}
