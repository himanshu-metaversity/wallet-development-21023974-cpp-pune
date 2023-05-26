import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { WalletContext } from "../../contexts/WalletContext";
import Clipboard from "@react-native-community/clipboard";
import { sortAddress, getPrivateKey } from "../../utils/WalletOperations";
import { withdrawBNB, isValidAddress } from "../../utils/binance";
import { withdrawETH } from "../../utils/eth";
import { withdrawAVAX } from "../../utils/avax";
import { withdrawETC } from "../../utils/etc";
import { withdrawSOL } from "../../utils/solana";
import { transferBTC as withdrawBTC } from "../../utils/btc";
import { withdrawERC20 } from "../../utils/erc20";
const { height, width } = Dimensions.get("screen");

const SendDetails = (props) => {
  const { pageType, success, txData } = props?.route?.params;
  const walletContext = useContext(WalletContext);
  const coin = walletContext.wallets.filter((item) => {
    return item.showSymbol === pageType;
  });
  const crtCoin = coin[0];

  const coinName = !crtCoin.tokenType
    ? crtCoin.showSymbol
    : crtCoin.tokenType === "ERC20"
    ? "ETH"
    : "BNB";

  const selectedWallet = walletContext.selectedWallets[coinName];

  const [toAdd, setToAdd] = useState("");
  const [amountInUSD, setAmountInUSD] = useState("");
  const [amountInWei, setAmountInWei] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sendToken = {
    BNB: withdrawBNB,
    ETH: withdrawETH,
    AVAX: withdrawAVAX,
    ETC: withdrawETC,
    SOL: withdrawSOL,
  };

  const pasteAdd = async () => {
    const text = await Clipboard.getString();
    setToAdd(text);
  };

  const convertPrice = (value) => {
    return Number(value / crtCoin.current_price).toFixed(
      crtCoin.decimals ? crtCoin.decimals : 18
    );
  };

  const onChangeValue = (value) => {
    if (value < 0) {
      setAmountInUSD("");
      setAmountInWei("");
    } else {
      setAmountInUSD(value);
      const usdPrice = convertPrice(value);
      setAmountInWei(usdPrice);
    }
  };

  const sendData = () => {
    if (toAdd === "") {
      alert("Please paste to address");
      return;
    }
    const checkAdd = isValidAddress(toAdd, pageType);
    if (!checkAdd) {
      alert("Please paste valid address");
      return;
    }

    if (toAdd.toLowerCase() === selectedWallet.address.toLowerCase()) {
      alert("You can't send to yourself");
      return;
    }

    if (amountInUSD === "" || amountInUSD == 0) {
      alert("Please enter value in USD");
      return;
    }

    if (amountInUSD >= selectedWallet.usdPrice) {
      alert("Low Balance");
      return;
    }
    props.navigation.navigate("SecurityPin", {
      tx: true,
      pageName: "SendDetails",
      pageType: pageType,
      txData: { toAdd, amountInWei, amountInUSD },
    });
  };
  useEffect(() => {
    if (txData) {
      setToAdd(txData.toAdd);
      setAmountInUSD(txData.amountInUSD);
      confirmTx(txData.toAdd, txData.amountInWei);
    } else {
      setToAdd("");
      setAmountInUSD("");
      setAmountInWei("");
    }
  }, [txData, props.route]);

  const confirmTx = async (toAdd, amountInWei) => {
    setIsLoading(true);
    const privateKey = await getPrivateKey(selectedWallet.address);
    let tx;
    if (!crtCoin.tokenType) {
      tx = await sendToken[pageType](
        selectedWallet.address,
        privateKey,
        toAdd,
        amountInWei
      );
    } else {
      tx = await withdrawERC20(
        selectedWallet.address,
        privateKey,
        toAdd,
        amountInWei,
        crtCoin.contract,
        crtCoin.decimals,
        crtCoin.tokenType
      );
    }
    // console.log("tx", tx);

    alert(tx.message);
    setIsLoading(false);
    if (tx.status) {
      props.navigation.navigate("Wallet", { type: pageType });
      return;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Wallet", { type: pageType });
          }}
          disabled={isLoading}
        >
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
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Wallet", { type: pageType });
          }}
          disabled={isLoading}
        >
           <Image
              source={require("../../assets/images/Portfolio/scanner.png")}
              resizeMode="contain"
            ></Image>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMiddle = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>
          ${selectedWallet?.usdPrice?.toFixed(2)}
        </Text>
        <Text
          style={{
            fontSize: height / 35,
            color: "white",
            marginTop: height * 0.01,
            fontFamily: "ClashDisplay-Regular",
            fontWeight: "600",
          }}
        >
          {Number(selectedWallet?.balance)?.toFixed(3)} {pageType}
        </Text>
      </View>
    );
  };

  const renderAmountView = () => {
    return (
      <View style={styles.amtView}>
        <TouchableOpacity onPress={() => onChangeValue("50")}>
          <ImageBackground
            source={require("../../assets/images/Send-Details/Rectangle.png")}
            style={styles.amtImgBac}
            resizeMode="contain"
          >
            <Text
              style={{
                fontSize: height / 45,
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
                color: "black",
              }}
            >
              $50
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChangeValue("150")}>
          <ImageBackground
            source={require("../../assets/images/Send-Details/RectanglePink.png")}
            style={styles.amtImgBac}
            resizeMode="contain"
          >
            <Text
              style={{
                fontSize: height / 45,
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
                color: "black",
              }}
            >
              $150
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChangeValue("250")}>
          <ImageBackground
            source={require("../../assets/images/Send-Details/Rectangle.png")}
            style={styles.amtImgBac}
            resizeMode="contain"
          >
            <Text
              style={{
                fontSize: height / 45,
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
                color: "black",
              }}
            >
              $250
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChangeValue("350")}>
          <ImageBackground
            source={require("../../assets/images/Send-Details/RectangleGreen.png")}
            style={styles.amtImgBac}
            resizeMode="contain"
          >
            <Text
              style={{
                fontSize: height / 45,
                fontFamily: "Poppins-Regular",
                fontWeight: "400",
                color: "black",
              }}
            >
              $350
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInput = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#192255",
            display: "flex",
            alignItems: "center",
            borderRadius: height * 0.05,
            marginTop: height * 0.02,
            height: height * 0.1,
            width: width * 0.8,
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: height / 40 }}>To: </Text>
          <TextInput
            style={{
              height: height * 0.05,
              width: width * 0.5,
              fontSize: height / 45,
              color: "#FFFFFF",
              flex: 1,
            }}
            value={toAdd}
            // disabled={false}
            editable={false}
            keyboardType=""
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "#0D1541",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            height: height * 0.04,
            width: width * 0.3,
            borderRadius: height * 0.02,
            top: -height * 0.02,
          }}
          onPress={pasteAdd}
        >
          <Text style={styles.pasteText}>Paste</Text>
        </TouchableOpacity>
        <Text style={styles.estimateText}>Please enter amount in USD</Text>
        <View
          style={{
            backgroundColor: "#192255",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: height * 0.05,
            marginTop: height * 0.02,
            height: height * 0.1,
            width: width * 0.8,
            alignSelf: "center",
          }}
        >
          <TextInput
            style={{
              height: height * 0.05,
              width: width * 0.6,
              fontSize: height / 45,
              color: "#FFFFFF",
            }}
            value={amountInUSD}
            onChangeText={onChangeValue}
            keyboardType="numeric"
          />
        </View>
        {amountInWei !== "" && (
          <Text style={styles.estimateText}>
            Estimated {amountInWei} {pageType}
            {/* Estimated {selectedWallet.balance.toFixed(3)} {pageType} */}
          </Text>
        )}
      </View>
    );
  };

  const renderSwap = () => {
    return (
      <TouchableOpacity
        style={styles.swapView}
        onPress={sendData}
        disabled={isLoading}
        // onPress={() => props.navigation.navigate("Wallet")}
      >
        <Text style={styles.swpText}>
          {isLoading ? <ActivityIndicator size="small" /> : "Send"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {renderInput()}
      {renderAmountView()}
      {renderSwap()}
    </View>
  );
};

export default SendDetails;

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
    width: "90%",
  },
  pasteText: {
    fontSize: height / 60,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "ClashDisplay-Regular",
  },

  swpText: {
    fontSize: height / 40,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  swapView: {
    height: height * 0.09,
    width: width * 0.8,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: height * 0.04,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },

  amtImgBac: {
    height: height * 0.07,
    width: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },

  amtView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 1,
    paddingHorizontal: width * 0.04,
    marginTop: height * 0.05,
  },

  estimateText: {
    fontSize: height / 65,
    color: "#A2A2AA",
    marginTop: height * 0.01,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height * 0.04,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
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
    fontWeight: "600",
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },
});
