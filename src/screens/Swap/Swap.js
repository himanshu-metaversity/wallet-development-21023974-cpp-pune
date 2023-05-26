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
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
const { height, width } = Dimensions.get("screen");
import CoinCard from "../../components/CoinCard";
import Clipboard from "@react-native-community/clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WalletContext } from "../../contexts/WalletContext";
import Toast from "react-native-toast-message";
import {
  getExchangeAmount,
  createTransaction,
  getStatus,
} from "../../utils/Changly";
import { withdrawBNB } from "../../utils/binance";
import { transferBTC as withdrawBTC } from "../../utils/btc";
import { withdrawAVAX } from "../../utils/avax";
import { withdrawETC } from "../../utils/etc";
import { withdrawSOL, getSolPvtString } from "../../utils/solana";
import { getPrivateKey } from "../../utils/WalletOperations";
import { withdrawETH } from "../../utils/eth";
import {
  getToken,
  userLogin,
  verifyOTP,
  getFee,
  getNativeSwapAmount,
  swapToNative,
  buyCoin,
} from "../../utils/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import Buy from "./Buy";

const Swap = (props) => {
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
  const [txFee, setTxFee] = useState();
  const [txID, setTxID] = useState();
  const [email, setEmail] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [platformFees, setPlatformFees] = useState();
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [tab, setTab] = useState("swap");
  const [byuTxData, setByuTxData] = useState(false);

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

  const copyAddress = async (add) => {
    Clipboard.setString(add);
    Toast.show({
      type: "info",
      text1: "Address copied successfully.",
    });
  };

  const sendToken = {
    BNB: withdrawBNB,
    ETH: withdrawETH,
    AVAX: withdrawAVAX,
    ETC: withdrawETC,
    SOL: withdrawSOL,
    BTC: withdrawBTC,
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      console.log("focused");
      setErrorMessage("");
      setEmail("");
      setFromValue(0);
      setToValue(0);
      setOtpSent(false);
      getLogInData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    // return () => unsubscribe.remove();
  }, [navigation]);

  useEffect(() => {
    const getData = async () => {
      let userToken = await AsyncStorage.getItem("token");
      if (userToken) {
        const fees = await getFee(userToken);
        console.log("fees", fees);
        setTxFee(fees.data.result);
      }
    };
    getData();
  }, [isLogIn, tab]);

  const getLogInData = async () => {
    setCheckingLogin(true);
    let userToken = await AsyncStorage.getItem("token");
    if (!userToken) {
      setIsLogIn(false);
      setCheckingLogin(false);
      setErrorMessage("");
      return;
    }
    setToken(userToken);
    const fees = await getFee(userToken);
    if (fees.data.statusCode !== 200) {
      setCheckingLogin(false);
      setIsLogIn(false);
    } else {
      console.log("fees", userToken);
      setTxFee(fees.data.result);
      setCheckingLogin(false);
      setIsLogIn(true);
    }
  };

  const nativeSwap = async (txt) => {
    let amount = Number(txt);
    if (txt != null && txt != "") {
      setLoadingPrice(true);
      let value = await getNativeSwapAmount(fromData, toData, amount, txFee);
      console.log("final", value);
      if (value.error) {
        setErrorMessage(value.error.message);
      } else {
        setErrorMessage("");
      }
      setToValue(value.value);
      setPlatformFees(value.fees);
      setLoadingPrice(false);
    }
  };

  const changly = async (txt) => {
    let to = fromData.showSymbol.toLowerCase();
    let from = toData.showSymbol.toLowerCase();
    let amount = Number(txt);
    if (txt != null && txt != "") {
      setLoadingPrice(true);
      let value = await getExchangeAmount(to, from, amount);
      if (value.error) {
        setErrorMessage(value.error.message);
      } else {
        setErrorMessage("");
        setToValue(value);
      }
      setLoadingPrice(false);
    }
  };

  // **************change value of swap*********************
  const changeValue = async (txt) => {
    if (swapType === "nativeSwap") {
      nativeSwap(txt);
    } else {
      changly(txt);
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
      changly(fromValue);
    }
  }, [fromData, toData, swapType]);

  const swapCoin = () => {
    const fromTemp = { ...fromData };
    const toTemp = { ...toData };
    setFromData(toTemp);
    setToData(fromTemp);
    setFromValue(toValue);
    setToValue(fromValue);
    changeValue(toValue);
  };

  const changeCoin = (coin) => {
    if (moreVisible.for === "from") {
      setFromSymble(coin);
    } else {
      setToSymble(coin);
    }
    changeValue(fromValue);
    setMoreVisible({ show: false });
  };

  function renderHeader() {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Portfolio")}
        >
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

        <TouchableOpacity
          onPress={() => props.navigation.navigate("SwapHistory")}
        >
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            style={styles.imgBack}
            resizeMode="contain"
          >
            <Image
              source={require("../../assets/images/DappsBrowser/Historyt.png")}
              resizeMode="contain"
              style={{ height: height * 0.05, width: width * 0.09 }}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMiddle = () => {
    return (
      <>
        <View style={[styles.portfolioView, { marginBottom: height * 0.02 }]}>
          <TouchableOpacity
            style={tab === "swap" ? [styles.tab, styles.tabActive] : styles.tab}
            onPress={() => setTab("swap")}
          >
            <Text style={styles.portfolioText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tab === "buy" ? [styles.tab, styles.tabActive] : styles.tab}
            onPress={() => setTab("buy")}
          >
            <Text style={styles.portfolioText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </>
    );
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
                  swapType === "changelly"
                    ? [styles.tab, styles.tabActive2]
                    : styles.tab
                }
                onPress={() => setSwapType("changelly")}
              >
                <Text style={[styles.portfolioText, styles.text15]}>
                  Changelly
                </Text>
              </TouchableOpacity>
            </View>
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
                    onPress={() => setMoreVisible({ show: true, for: "from" })}
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
                          1 {fromData.showSymbol} = $
                          {fromData.current_price.toFixed(3)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        justifyContent: "space-between",
                        height: height * 0.05,
                        marginRight: width * 0.01,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: height / 60,
                          fontFamily: "ClashDisplay-Regular",
                          fontWeight: "500",
                          color: "#ffffff",
                        }}
                      >
                        You Send
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    height: height * 0.08,
                    width: width * 0.9,
                    alignSelf: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                >
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
                  ></TextInput>
                  <Text
                    style={{
                      fontSize: height / 65,
                      color: "#ffffff",
                      fontFamily: "ClashDisplay-Regular",
                      fontWeight: "500",
                      paddingLeft: 5,
                    }}
                  >
                    Balance :{" "}
                    {selectedWallets[fromData.showSymbol] &&
                      selectedWallets[fromData.showSymbol]?.balance?.toFixed(
                        4
                      )}{" "}
                    {fromData.showSymbol}
                  </Text>
                </View>
              </>
            </View>

            <View
              style={{
                // height: height * 0.2,
                width: width * 1,
                borderRadius: 25,
                marginTop: height * 0.01,
                alignItems: "center",
                backgroundColor: "#27378C",
                // marginTop:-5
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: height * 0.023,
                }}
              >
                <TouchableOpacity
                  onPress={() => setMoreVisible({ show: true, for: "to" })}
                  style={{
                    paddingLeft: 5,
                  }}
                >
                  <Image
                    source={toData.image}
                    resizeMode="contain"
                    style={{ height: height * 0.06, width: width * 0.13 }}
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
                    onPress={() => setMoreVisible({ show: true, for: "to" })}
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
                        {toData.name}
                      </Text>

                      <Text
                        style={{
                          fontSize: height / 65,
                          color: "#ffffff",
                          fontFamily: "ClashDisplay-Regular",
                          fontWeight: "500",
                        }}
                      >
                        1 {toData.showSymbol} = $
                        {toData.current_price.toFixed(3)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: "space-between",
                      height: height * 0.05,
                      marginRight: width * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height / 60,
                        fontFamily: "ClashDisplay-Regular",
                        fontWeight: "500",
                        color: "#ffffff",
                      }}
                    >
                      You Get
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: height * 0.12,
                  width: width * 0.9,
                  alignSelf: "center",
                  justifyContent: "flex-start",
                  marginLeft: 10,
                  paddingTop: 10,
                }}
              >
                <TextInput
                  style={{
                    fontSize: height / 35,
                    color: "#ffffff",
                    fontFamily: "ClashDisplay-Regular",
                    fontWeight: "500",
                    padding: 0,
                    paddingLeft: 5,
                  }}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={"#ffffff"}
                  returnKeyType="done"
                  value={toValue}
                  // onChangeText={(txt) => {
                  //   setBalance(txt);
                  //   changeValue(txt);
                  // }}
                />

                <Text
                  style={{
                    fontSize: height / 65,
                    color: "#ffffff",
                    fontFamily: "ClashDisplay-Regular",
                    fontWeight: "500",
                    marginBottom: height * 0.005,
                    paddingLeft: 5,
                  }}
                >
                  Balance :{" "}
                  {selectedWallets[toData.showSymbol] &&
                    selectedWallets[toData.showSymbol]?.balance?.toFixed(
                      4
                    )}{" "}
                  {toData.showSymbol}
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
            </View>

            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: height * 0.17,
                alignSelf: "center",
                alignItems: "center",
                width: 50,
                right: 100,
              }}
              onPress={swapCoin}
            >
              <Image
                source={require("../../assets/images/Swap/Swap.png")}
                style={{
                  width: width * 0.14,
                  height: height * 0.065,
                  borderRadius: height * 0.2,
                }}
              ></Image>
            </TouchableOpacity>
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
            Platform fees: {platformFees.swapTransactionFee}
            {fromData.showSymbol}
          </Text>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={swapFun}
          disabled={errorMessage !== "" || loadingPrice || isLoading}
        >
          <Text style={styles.comntinueText}>
            {isLoading ? "Swapping..." : "Swap"}
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
        {toSymble === item.showSymbol ||
        fromSymble === item.showSymbol ||
        item.tokenType ? null : (
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
    if (fromWallet.balance <= fromValue) {
      alert("Low balance amount+fees");
      return;
    }
    if (errorMessage !== "") {
      alert(errorMessage);
      return;
    }
    const txObject = {
      fromWallet: fromWallet.address,
      toWallet: selectedWallets[toData.showSymbol].address,
      fromSymble: fromData.symbol,
      toSymble: toData.symbol,
      amount: Number(fromValue),
      toAmount: Number(toValue),
    };

    props.navigation.navigate("SecurityPin", {
      tx: true,
      pageName: "Swap",
      pageType: "",
      txData: txObject,
    });
  };

  const swapTxChangelly = async (txData) => {
    changeData(txData.fromSymble.toUpperCase(), txData.toSymble.toUpperCase());
    setFromValue(txData.amount.toString());
    changeValue(txData.amount.toString());
    const changlyTx = await createTransaction(
      txData.fromSymble,
      txData.toSymble,
      txData.toWallet,
      txData.amount
    );
    if (!changlyTx.result) {
      setErrorMessage(changlyTx.error.message);
      return;
    }
    // console.log("changlyTx", changlyTx);
    const changlyData = changlyTx.result;
    // console.log("changlyData", changlyData);
    setIsLoading(true);
    const privateKey = await getPrivateKey(txData.fromWallet);
    const showSymbol = txData.fromSymble.toUpperCase();
    console.log(
      showSymbol,
      txData.fromWallet,
      privateKey,
      changlyData.payinAddress,
      changlyData.amountExpectedFrom
    );
    const tx = await sendToken[showSymbol](
      txData.fromWallet,
      privateKey,
      changlyData.payinAddress,
      changlyData.amountExpectedFrom
    );
    // console.log("TX", tx);
    if (tx.status) {
      // const status = await getStatus(changlyData.id);
      setTxID(changlyData.id);
      setConfirmTx(true);
      // alert(tx.message);
      setIsLoading(false);
      setFromValue("");
    } else {
      alert(tx.message);
      setIsLoading(false);
    }
  };

  const swapTxNative = async (txData) => {
    changeData(txData.fromSymble.toUpperCase(), txData.toSymble.toUpperCase());
    setFromValue(txData.amount.toString());
    changeValue(txData.amount.toString());

    const pvtKey = await getPrivateKey(txData.fromWallet);
    let finalKey;
    if (txData.fromSymble.toUpperCase() === "SOL") {
      const hex = await getSolPvtString(pvtKey);
      finalKey = hex;
    } else if (txData.fromSymble.toUpperCase() === "BTC") {
      finalKey = pvtKey;
    } else {
      finalKey = pvtKey.slice(2);
    }

    const finalData = {
      sendObject: {
        address: txData.fromWallet,
        privateKey: finalKey,
        coinName: txData.fromSymble.toUpperCase(),
        quantity: txData.amount,
      },
      getObject: {
        getCoinAddress: txData.toWallet,
        coinName: txData.toSymble.toUpperCase(),
        quantity: txData.toAmount,
      },
    };
    console.log({ finalData });
    setIsLoading(true);
    const tx = await swapToNative(finalData);
    // if (res.data.statusCode !== 200) {
    //   await AsyncStorage.setItem("token", res.data.result.token);
    // }
    alert(tx.data.responseMessage);
    setIsLoading(false);
    console.log("tx", tx);
  };

  const buyTxNative = async (txData) => {
    const finalData = {
      address: txData.fromWallet,
      coinName: txData.fromSymble.toUpperCase(),
      amount: txData.amount.toString(),
      quantity: txData.toAmount.toString(),
    };

    setByuTxData(true);
    const tx = await buyCoin(finalData);
    if (tx.data.statusCode === 200) {
      Linking.openURL(tx.data.result);
    } else {
      alert(tx.data.responseMessage);
      setByuTxData(false);
    }
    setByuTxData(false);
    console.log("tx", tx);
  };

  useEffect(() => {
    const txData = props?.route?.params?.txData;
    if (txData) {
      if (txData.type) {
        setTab("buy");
        buyTxNative(txData);
      } else {
        if (swapType === "nativeSwap") {
          swapTxNative(txData);
        } else {
          swapTxChangelly(txData);
        }
      }
      props.navigation.setParams({ txData: null });
    } else {
      setIsLoading(false);
    }
  }, [props.route]);

  const LoginFun = async () => {
    console.log("Email", email);
    setErrorMessage("");
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      setErrorMessage("You have entered an invalid email address!");
      return;
    }
    const finalEmail = email.toLowerCase();
    const res = await userLogin(finalEmail);
    if (res.data.statusCode !== 200) {
      setErrorMessage("Something went wrong please try again later!");
      return;
    }
    setOtpSent(true);
  };
  const verifyOTPFun = async () => {
    setErrorMessage("");
    var mailformat = /^\d{4}$/;
    if (!otp.match(mailformat)) {
      setErrorMessage("OTP must be 4 digits");
      return;
    }
    const res = await verifyOTP(email, otp);
    if (res.data.statusCode !== 200) {
      setErrorMessage(res.data.responseMessage);
      return;
    }
    const userToken = res.data.result.token;
    setIsLogIn(true);
    setToken(userToken);
  };

  const renderTxModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={confirmTx}>
        <View style={[styles.modalView1, styles.modalView2]}>
          <View
            style={{ textAlign: "center", alignItems: "center", width: "90%" }}
          >
            <Text style={styles.modalText1}>Swap Successful</Text>
            <View
              style={[
                {
                  width: width * 0.8,
                  marginTop: height * 0.02,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={[styles.textStyle, styles.fontSize55]}>
                Here is your transaction ID
              </Text>
              <View style={[styles.flexBox, styles.flexLeft]}>
                <Text style={[styles.textStyle, styles.fontSize55]}>
                  {txID}
                </Text>
                <TouchableOpacity onPress={() => copyAddress(txID)}>
                  <Image
                    source={require("../../assets/images/Recieve/Copy.png")}
                    style={styles.copyImg1}
                    resizeMode="contain"
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: width * 0.2,
              alignSelf: "flex-end",
              paddingHorizontal: width * 0.04,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setConfirmTx(false);
              }}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLogin = () => {
    return (
      <View
        style={{
          width: width * 0.9,
          alignSelf: "center",
        }}
      >
        <View style={styles.footerView}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={"white"}
            style={styles.inputView}
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
            }}
            editable={!otpSent}
          />
        </View>
        {otpSent && (
          <View
            style={{
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: width * 0.04,
                color: "#ffffff",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
                paddingLeft: 5,
                paddingTop: 5,
              }}
            >
              Enter OTP sent to you email address
            </Text>
            <View style={[styles.footerView, { marginTop: 10 }]}>
              <TextInput
                placeholder="OTP"
                placeholderTextColor={"white"}
                style={styles.inputView}
                value={otp}
                onChangeText={(txt) => {
                  setOtp(txt);
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}
        {errorMessage !== "" && (
          <Text
            style={{
              fontSize: height / 75,
              color: "#ea2323",
              fontFamily: "ClashDisplay-Regular",
              fontWeight: "500",
              paddingLeft: 5,
              paddingTop: 5,
            }}
          >
            {errorMessage}
          </Text>
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={otpSent ? verifyOTPFun : LoginFun}
        >
          <Text style={styles.comntinueText}>
            {otpSent ? "Verify OTP" : "Send OTP"}
          </Text>
        </TouchableOpacity>
        {otpSent && (
          <TouchableOpacity onPress={LoginFun}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: "#ffffff",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
                paddingLeft: 5,
                paddingTop: 10,
                alignSelf: "center",
              }}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {checkingLogin ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : (
        <>
          {!isLogIn && renderLogin()}
          {tab === "swap" && (
            <>
              {isLogIn && (
                <>
                  {swapSection()}
                  {renderSWapButton()}
                  {confirmTx && txID && renderTxModal()}
                  {wallets && renderMoreModal()}
                </>
              )}
            </>
          )}
          {tab === "buy" && isLogIn && (
            <Buy txFee={txFee} {...props} txData={byuTxData} />
          )}
        </>
      )}
    </View>
  );
};

export default Swap;

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
    height: height * 0.07,
    width: width * 0.12,
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
