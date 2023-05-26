import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import axios from "axios";
import Clipboard from "@react-native-community/clipboard";
import { INFURA_URL as erc20Infura } from "../../utils/eth";
import { BNB_URL as bep20Infura } from "../../utils/binance";
import erc20 from "../../utils/erc20.json";
import { getWeb3ContractObject } from "../../utils/erc20";
import { addToken } from "../../utils/WalletOperations";

const { height, width } = Dimensions.get("window");

const ImportAcc = (props) => {
  const walletContext = useContext(WalletContext);
  const { wallets } = walletContext;
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeType, setActiveType] = useState("ERC20");
  const [tokenAdd, setTokenAdd] = useState("");
  const [notValidContract, setNotValidContract] = useState("");
  const [contractDetals, setContractDetals] = useState();

  // useEffect(() => {

  // }, [props.route]);

  const changeToken = (type) => {
    setActiveType(type);
  };

  const getGlobleMarketBTCPrice = async (symbol, decimals) => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list"
      );
      const finalItem = response.data.filter((item) => {
        return item.symbol === symbol.toLowerCase();
      });
      if (finalItem.length === 0) {
        setNotValidContract(`Oops sorry ${symbol} not listed with us`);
        setIsLoading(false);
        return;
      }
      const getCoind = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${finalItem[0].id}`
      );
      setContractDetals({
        name: finalItem[0].name,
        symbol: finalItem[0].symbol,
        id: finalItem[0].id,
        image: getCoind.data[0].image,
        decimals,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setNotValidContract(`Invalid ${activeType} token address`);
      setIsLoading(false);
    }
  };

  const getTokenData = async (contractAdd) => {
    setNotValidContract("");
    try {
      setIsLoading(true);
      const rpcurl = activeType === "ERC20" ? erc20Infura : bep20Infura;
      const tokenContract = getWeb3ContractObject(erc20, contractAdd, rpcurl);
      // console.log("tokenContract", tokenContract);
      const symbol = await tokenContract.methods.symbol().call();
      const decimals = await tokenContract.methods.decimals().call();
      const oldData = wallets.filter((item) => {
        return (
          item.contract &&
          item.contract.toLowerCase() === contractAdd.toLowerCase()
        );
      });
      if (oldData.length === 0) {
        getGlobleMarketBTCPrice(symbol, decimals);
      } else {
        setNotValidContract(`${symbol} token already imported`);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setNotValidContract(`Invalid ${activeType} token address`);
      setIsLoading(false);
    }
  };

  const updateToken = async () => {
    setIsAdding(true);
    await addToken(contractDetals, wallets, activeType, tokenAdd);
    setTimeout(() => {
      setIsAdding(false);
      props.navigation.navigate("Portfolio");
    }, 6000);
  };

  const pasteSeed = async () => {
    const text = await Clipboard.getString();
    setTokenAdd(text);
    getTokenData(text);
  };

  const renderRecoveryPhrase = () => {
    return (
      <View style={styles.seedParentView}>
        <Text style={styles.seedPhraseText}>Import Token</Text>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={
              activeType === "ERC20"
                ? [styles.tabButton, { backgroundColor: "#27378C" }]
                : styles.tabButton
            }
            onPress={() => changeToken("ERC20")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "500",
                fontFamily: "ClashDisplay-Regular",
              }}
            >
              ERC20
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeType === "BEP20"
                ? [styles.tabButton, { backgroundColor: "#27378C" }]
                : styles.tabButton
            }
            onPress={() => changeToken("BEP20")}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "500",
                fontFamily: "ClashDisplay-Regular",
              }}
            >
              BEP20
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const recoveryInput = () => {
    return (
      <View style={{ height: height * 0.2, width: width * 1 }}>
        <View style={styles.inputView}>
          <TextInput
            multiline={true}
            placeholderTextColor="white"
            style={{
              height: height * 0.16,
              width: width * 0.8,
              color: "white",
              fontFamily: "Poppins-Regular",
              fontSize: height / 45,
              fontWeight: "500",
              marginTop: height * 0.01,
            }}
            value={tokenAdd}
          />
        </View>
        <View style={styles.recoveryPhraseView}>
          <Text style={styles.recoveryText}>Token Address</Text>
        </View>
      </View>
    );
  };

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

  const renderPaste = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#0D1541",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.04,
          width: width * 0.3,
          borderRadius: height * 0.02,
        }}
        onPress={pasteSeed}
      >
        <Text style={styles.pasteText}>Paste</Text>
      </TouchableOpacity>
    );
  };

  const renderBtnView = () => {
    return (
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.verifyView}
          onPress={updateToken}
          disabled={!contractDetals}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "500",
              fontFamily: "ClashDisplay-Regular",
            }}
          >
            {isAdding ? <ActivityIndicator size="small" /> : "Import"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCoin = () => {
    return (
      <>
        {notValidContract !== "" ? (
          <View
            style={{
              width: width * 0.9,
              textAlign: "center",
              alignSelf: "center",
              marginTop: height * 0.02,
            }}
          >
            <Text style={styles.recoveryText}>
              {notValidContract}
              {/* {notValidContract && notListed
                ? `Oops sorry not listed with us`
                : `Invalid ${activeType} token address`} */}
            </Text>
          </View>
        ) : (
          <>
            {contractDetals && (
              <View style={styles.coinView}>
                <Image
                  source={{ uri: contractDetals.image }}
                  resizeMode="contain"
                  style={{ height: height * 0.07, width: width * 0.2 }}
                />
                <View style={styles.coinDetails}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: height / 30,
                      fontWeight: "500",
                      fontFamily: "ClashDisplay-Regular",
                    }}
                  >
                    {contractDetals.name}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontSize: height / 40,
                      fontWeight: "500",
                      fontFamily: "ClashDisplay-Regular",
                    }}
                  >
                    {contractDetals.symbol.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderRecoveryPhrase()}
      {recoveryInput()}
      {renderPaste()}
      {isLoading ? (
        <ActivityIndicator size="small" style={{ marginTop: 20 }} />
      ) : (
        renderCoin()
      )}
      {renderBtnView()}
    </View>
  );
};

export default ImportAcc;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  recoveryText: {
    fontSize: height / 53,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "ClashDisplay-Regular",
    textAlign: "center",
  },

  pasteText: {
    fontSize: height / 60,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "ClashDisplay-Regular",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  coinView: {
    width: width * 0.9,
    alignSelf: "center",
    // backgroundColor: "lightpink",
    marginTop: height * 0.04,
    flexDirection: "row",
  },

  cancelView: {
    height: height * 0.08,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },

  btnView: {
    width: width * 0.9,
    position: "absolute",
    bottom: 0,
    height: height * 0.2,
    marginHorizontal: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  coinDetails: {
    height: height * 0.09,
    width: width * 0.6,
    // backgroundColor: "lightblue",
    // justifyContent: "space-between",
    marginLeft: 8,
  },

  verifyView: {
    height: height * 0.08,
    width: width * 0.9,
    borderRadius: height / 10,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    height: height * 0.05,
    width: width * 0.4,
    borderRadius: height / 10,
    justifyContent: "center",
    alignItems: "center",
  },

  recoveryPhraseView: {
    height: height * 0.03,
    width: width * 0.41,
    borderRadius: height / 10,
    backgroundColor: "#0D1541",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // marginTop: 2,
    // position: 'absolute'
  },

  inputView: {
    height: height * 0.2,
    width: width * 0.9,
    borderRadius: height / 20,
    backgroundColor: "#192255",
    alignSelf: "center",
    position: "absolute",
    bottom: height * -0.02,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red"
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
    fontSize: height / 40,
    color: "#FFFFFF",
  },

  seedParentView: {
    justifyContent: "center",
    alignItems: "center",
    margin: height * 0.03,
  },

  seedPhraseText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "normal",
  },

  desText: {
    fontSize: height / 65,
    color: "#FFFAFA",
    marginTop: height * 0.04,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  desTextNew: {
    fontSize: height / 60,
    color: "#FFFAFA",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  securityText: {
    fontSize: height / 52,
    color: "#808080",
  },
});
