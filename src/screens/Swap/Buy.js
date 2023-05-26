import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Dimensions,
  ActivityIndicator,
  DeviceEventEmitter,
  Modal,
  FlatList,
} from "react-native";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
const { height, width } = Dimensions.get("screen");

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WalletContext } from "../../contexts/WalletContext";
import { withdrawSOL, getSolPvtString } from "../../utils/solana";
import { getPrivateKey, sortAddress } from "../../utils/WalletOperations";
import {
  getFee,
  getNativeSwapAmount,
  swapToNative,
} from "../../utils/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const Buy = (props) => {
  const { txFee, txData } = props;
  const navigation = useNavigation();
  const [fromData, setFromData] = useState();
  const [toData, setToData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [moreVisible, setMoreVisible] = useState({ show: false });
  const walletContext = useContext(WalletContext);
  const { wallets, selectedWallets } = walletContext;
  const [errorMessage, setErrorMessage] = useState("");
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [fromSymble, setFromSymble] = useState("ETH");
  const [toSymble, setToSymble] = useState("AVAX");
  const [confirmTx, setConfirmTx] = useState(false);
  const [swapType, setSwapType] = useState("nativeSwap");
  const [token, setToken] = useState();
  const [platformFees, setPlatformFees] = useState();
  const [loadingPrice, setLoadingPrice] = useState(false);

  const convertPrice = (value) => {
    return Number(value / fromData.current_price).toFixed(
      fromData.decimals ? fromData.decimals : 10
    );
  };

  const nativeSwap = async (txt) => {
    setErrorMessage("");
    let amount = Number(txt);
    if (txt != null && txt != "") {
      const usdPrice = convertPrice(amount);
      setToValue(usdPrice);
      const swapFromFees = txFee.filter((item) => {
        return item.coinName === fromData.showSymbol;
      });
      const feeData = swapFromFees[0];
      setPlatformFees(feeData);

      if (amount < feeData.buyMin) {
        setErrorMessage(
          `Invalid amount: minimal amount for ${fromData.showSymbol} is $${feeData.buyMin}`
        );
      }

      if (amount > feeData.buyMax) {
        setErrorMessage(
          `Invalid amount: Max amount for ${fromData.showSymbol} is $${feeData.buyMax}`
        );
      }
    }
  };

  // **************change value of swap*********************
  const changeValue = async (txt) => {
    if (swapType === "nativeSwap") {
      nativeSwap(txt);
    } else {
      //   changly(txt);
    }
  };

  const changeData = (swapFrom, swapTo) => {
    if (wallets) {
      const fromData = wallets.filter((item) => {
        return item.showSymbol === swapFrom;
      });
      const toData = wallets.filter((item) => {
        return item.showSymbol === swapTo;
      });
      setFromData(fromData[0]);
      setToData(toData[0]);
    }
  };

  useEffect(() => {
    changeData(fromSymble, toSymble);
  }, [fromSymble, toSymble]);

  useEffect(() => {
    if (swapType === "nativeSwap") {
      nativeSwap(fromValue);
    } else {
      //   changly(fromValue);
    }
  }, [fromData, toData, swapType]);

  const changeCoin = (coin) => {
    if (moreVisible.for === "from") {
      setFromSymble(coin);
    } else {
      setToSymble(coin);
    }
    changeValue(fromValue);
    setMoreVisible({ show: false });
  };

  function swapSection() {
    return (
      <View>
        {wallets && fromData && toData && selectedWallets && (
          <>
            <View style={styles.portfolioView}>
              <Text style={[styles.portfolioText, styles.text15]}>
                Best rate via:
              </Text>
              <TouchableOpacity
                style={
                  swapType === "nativeSwap"
                    ? [styles.tab, styles.tabActive2]
                    : styles.tab
                }
                onPress={() => setSwapType("nativeSwap")}
              >
                <Text style={[styles.portfolioText, styles.text15]}>
                  Native
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  swapType === "onramper"
                    ? [styles.tab, styles.tabActive2]
                    : styles.tab
                }
                onPress={() => setSwapType("onramper")}
              >
                <Text style={[styles.portfolioText, styles.text15]}>
                  Onramper
                </Text>
              </TouchableOpacity>
            </View>
            {swapType === "nativeSwap" && (
              <View
                style={{
                  height: height * 0.2,
                  width: width * 1,
                  backgroundColor: "#27378C",
                  borderRadius: 25,
                }}
              >
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: height * 0.023,
                      marginLeft: width * 0.05,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        setMoreVisible({ show: true, for: "from" })
                      }
                      style={{
                        paddingLeft: 5,
                      }}
                    >
                      <Image
                        source={fromData.image}
                        resizeMode="contain"
                        style={{ height: height * 0.06, width: width * 0.14 }}
                      ></Image>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: width * 0.03,
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: width * 0.7,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          setMoreVisible({ show: true, for: "from" })
                        }
                      >
                        <View
                          style={{
                            justifyContent: "space-between",
                            height: height * 0.052,
                            marginRight: width * 0.01,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: height / 47,
                              fontFamily: "ClashDisplay-Regular",
                              fontWeight: "500",
                              color: "#ffffff",
                            }}
                          >
                            {fromData.name}
                          </Text>

                          <Text
                            style={{
                              fontSize: height / 65,
                              color: "#ffffff",
                              fontFamily: "ClashDisplay-Regular",
                              fontWeight: "500",
                            }}
                          >
                            {sortAddress(
                              selectedWallets[fromData.showSymbol].address
                            )}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      width: width * 0.9,
                      alignSelf: "center",
                      justifyContent: "center",
                      marginLeft: 10,
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flexDirection: "row",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: height / 35,
                          fontFamily: "ClashDisplay-Regular",
                          fontWeight: "500",
                          padding: 0,
                          paddingLeft: 5,
                          color: "#ffffff",
                        }}
                      >
                        $
                      </Text>
                      <TextInput
                        style={{
                          fontSize: height / 35,
                          fontFamily: "ClashDisplay-Regular",
                          fontWeight: "500",
                          padding: 0,
                          paddingLeft: 5,
                          color: "#ffffff",
                        }}
                        placeholder="0.00"
                        keyboardType="numeric"
                        placeholderTextColor={"#ffffff"}
                        returnKeyType="done"
                        value={fromValue}
                        onChangeText={(txt) => {
                          setFromValue(txt);
                          changeValue(txt);
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: height / 65,
                        color: "#ffffff",
                        fontFamily: "ClashDisplay-Regular",
                        fontWeight: "500",
                        paddingLeft: 5,
                        marginBottom: height * 0.005,
                      }}
                    >
                      You get : ~{toValue} {fromData.showSymbol}
                    </Text>
                    {errorMessage !== "" && (
                      <Text
                        style={{
                          fontSize: height / 75,
                          color: "#ea2323",
                          fontFamily: "ClashDisplay-Regular",
                          fontWeight: "500",
                          paddingLeft: 5,
                        }}
                      >
                        {errorMessage}
                      </Text>
                    )}
                  </View>
                </>
              </View>
            )}

            {swapType === "onramper" && (
              <View style={{ height: height * 0.6 }}>
                <WebView
                  source={{
                    uri: "https://widget.onramper.com?color=266677&apiKey=pk_test_dYaOXCCHhiF29aaujU96cwosaW3dSPeb9Ivvti9iLhc0",
                  }}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  }

  const renderSWapButton = () => {
    return (
      <View style={styles.bottomButton}>
        {swapType === "nativeSwap" && platformFees && fromData && (
          <Text
            style={{
              fontSize: height / 65,
              color: "#ffffff",
              fontFamily: "ClashDisplay-Regular",
              fontWeight: "500",
            }}
          >
            Platform fees: ${platformFees.buyTransactionFee}
          </Text>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={swapFun}
          disabled={errorMessage !== "" || txData}
        >
          <Text style={styles.comntinueText}>
            {txData ? "Buying..." : "Buy"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  function renderMoreModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={moreVisible.show}
      >
        <SafeAreaView style={styles.modalView}>
          <View style={styles.flexBox}>
            <Text style={styles.simplexText}>Select Chain</Text>
            <TouchableOpacity onPress={() => setMoreVisible({ show: false })}>
              <ImageBackground
                source={require("../../assets/images/Onbording/Oval.png")}
                resizeMode="contain"
                style={styles.imgBack}
              >
                <Image
                  source={require("../../assets/images/ButtonIcons/Close.png")}
                  resizeMode="contain"
                ></Image>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={wallets}
              style={styles.transView}
              renderItem={(item) => renderCoinItem(item)}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  const renderCoinItem = (data) => {
    const item = data.item;
    return (
      <>
        {fromSymble === item.showSymbol || item.tokenType ? null : (
          <>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                marginTop: height * 0.02,
              }}
              onPress={() => {
                changeCoin(item.showSymbol);
              }}
            >
              <Image
                source={item.image}
                resizeMode="contain"
                style={{ height: height * 0.077, width: width * 0.17 }}
              ></Image>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: width * 0.01,
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: width * 0.75,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    marginLeft: width * 0.02,
                    height: height * 0.063,
                    marginRight: width * 0.04,
                  }}
                >
                  <Text
                    style={{
                      fontSize: height / 62,
                      color: "#A2A2AA",
                      fontFamily: "ClashDisplay-Regular",
                      fontWeight: "400",
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: height / 55,
                      color: "white",
                      fontFamily: "ClashDisplay-Regular",
                      fontWeight: "500",
                    }}
                  >
                    {item.totalBalance.toFixed(3)} {item.showSymbol}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-between",
                    height: height * 0.063,
                    marginRight: width * 0.01,
                  }}
                >
                  <Text
                    style={{
                      fontSize: height / 55,
                      color: "white",
                      fontFamily: "ClashDisplay-Regular",
                      fontWeight: "500",
                      textAlign: "right",
                      width: width * 0.28,
                      marginRight: width * 0.04,
                    }}
                  >
                    $ {item.totalUSDPrice.toFixed(2)}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: width * 0.25,
                      alignSelf: "flex-end",
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height / 80,
                        color: "#A2A2AA",
                        fontFamily: "ClashDisplay-Regular",
                        textAlign: "right",
                        marginRight: 8,
                      }}
                    >
                      {item.price_change_percentage_24h < 0 ? null : "+"}
                      {item.price_change_percentage_24h.toFixed(3)}%
                    </Text>
                    {item.price_change_percentage_24h < 0 ? (
                      <Image
                        source={require("../../assets/images/ButtonIcons/Arrow.png")}
                        style={{
                          height: height * 0.03,
                          width: width * 0.05,
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/ButtonIcons/up.png")}
                        style={{
                          height: height * 0.03,
                          width: width * 0.05,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <ImageBackground
              source={require("../../assets/images/ButtonIcons/Divider.png")}
              resizeMode="contain"
              style={{
                height: height * 0.01,
                marginTop: height * 0.02,
                width: width * 0.7,
                alignSelf: "center",
                marginLeft: width * 0.2,
              }}
            ></ImageBackground>
          </>
        )}
      </>
    );
  };

  const swapFun = async () => {
    const fromWallet = selectedWallets[fromData.showSymbol];
    if (fromValue <= 0) {
      alert("Please enter amount");
      return;
    }

    const txObject = {
      fromWallet: fromWallet.address,
      fromSymble: fromData.symbol,
      amount: Number(fromValue),
      toAmount: Number(toValue),
      type: "buy",
    };
    console.log("txObject", txObject);

    props.navigation.navigate("SecurityPin", {
      tx: true,
      pageName: "Swap",
      pageType: "",
      txData: txObject,
    });
  };

  return (
    <View style={styles.backgroundView}>
      {swapSection()}
      {swapType === "nativeSwap" && renderSWapButton()}
      {wallets && renderMoreModal()}
    </View>
  );
};

export default Buy;

const styles = StyleSheet.create({
  footerView: {
    height: height * 0.09,
    borderRadius: height / 20,
    alignSelf: "center",
    marginTop: height * 0.05,
    width: width * 0.9,
    backgroundColor: "#192255",
    flexDirection: "row",
    alignItems: "center",
  },
  inputView: {
    height: height * 0.05,
    width: width * 0.6,
    marginLeft: width * 0.05,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#27378C",
    width: width * 0.9,
    height: height * 0.08,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  /*  modal */
  /* model 2 */
  modalView1: {
    height: height * 0.25,
    width: width * 0.9,
    borderRadius: height / 35,
    backgroundColor: "#0D1541",
    justifyContent: "space-between",
    paddingVertical: height * 0.04,
    alignItems: "center",
    marginTop: height * 0.22,
    alignSelf: "center",
  },
  modalView2: {
    height: height * 0.28,
    marginTop: height * 0.35,
  },
  modalText1: {
    fontSize: height / 40,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  flexLeft: {
    justifyContent: "flex-start",
  },
  simplexText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "600",
  },

  modalView: {
    height: Platform.OS === "ios" ? height - 70 : height,
    width: width,
    backgroundColor: "#0D1541",
    // marginTop: height * 0.05,
    padding: width * 0.05,
    top: Platform.OS === "ios" ? 44 : 0,
  },

  /*  /modal */

  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },
  portimg: {
    height: "100%",
    width: "100%",
  },

  securityView: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 1,
    height: height * 0.08,
    paddingHorizontal: width * 0.04,
    // backgroundColor: "red",
    justifyContent: "space-between",
  },
  copyImg1: {
    width: width * 0.06,
    height: height * 0.04,
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

    flexDirection: "row",
  },
  tab: {
    borderBottomColor: "#0D1541",
    borderBottomWidth: 3,
    padding: 10,
  },
  tabActive: {
    borderBottomColor: "#27378C",
    borderBottomWidth: 3,
  },
  tabActive2: {
    borderBottomColor: "#ffcb00",
    borderBottomWidth: 3,
  },

  comntinueText: {
    fontSize: height / 40,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },
  textStyle: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    marginRight: width * 0.04,
  },
  fontSize55: {
    fontSize: height / 55,
  },

  continueButton: {
    backgroundColor: "#27378C",
    width: width * 0.9,
    height: 60,
    borderRadius: 50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  bottomButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 90,
  },

  portfolioText: {
    fontSize: 20,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
  text15: {
    fontSize: 15,
  },
  policyconfirm: {
    alignItems: "center",
    height: height / 5,
    width: width,
    justifyContent: "center",
  },
  customButtonContainer: {
    height: height / 12,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
});
