import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  BackHandler,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import React, { useEffect, useRef, useState, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import * as Progress from "react-native-progress";
import { dappsProvider } from "../../utils/DappsProvider";
import {
  JS_POST_MESSAGE_TO_PROVIDER,
  SET_NETWORK_ID,
} from "../../utils/browserScripts";
var Web3 = require("web3");
import WebView from "react-native-webview";
import { ethers } from "ethers";
import { getWeb3Obj } from "../../utils/erc20";
import { browserTx, getCurrentGasPrices } from "../../utils/binance";
import { getCoinIcon } from "../../utils/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sortAddress } from "../../utils/WalletOperations";
import Clipboard from "@react-native-community/clipboard";
import { INFURA_URL as ethInfura } from "../../utils/eth";
import { BNB_URL as bnbInfura } from "../../utils/binance";
import { RPCURL as avaxInfura } from "../../utils/binance";
import { saveHistory, saveFav } from "../../utils/browser";

const { height, width } = Dimensions.get("screen");
const chainList = [
  {
    name: "Goerli Test Network",
    chainId: 42,
    rpcURL: ethInfura,
    image: getCoinIcon("ETH"),
    symbol: "ETH",
  },
  {
    name: "Smart Chain - Testnet",
    chainId: 97,
    rpcURL: bnbInfura,
    image: getCoinIcon("BNB"),
    symbol: "BNB",
  },
  {
    name: "Avalanche - Testnet",
    chainId: 43113,
    rpcURL: avaxInfura,
    image: getCoinIcon("AVAX"),
    symbol: "AVAX",
  },
];

const Browser = (props) => {
  const walletContext = useContext(WalletContext);
  const { selectedWallets } = walletContext;
  const webViewRef = useRef(null);
  const serchInput = useRef(null);
  const [entryScriptWeb3, setEntryScriptWeb3] = useState();
  const [search, setSearch] = useState("");
  const [isSearching, setisSearching] = useState(false);
  const [pageUrl, setPageUrl] = useState("https://www.google.com/");
  const [urlTitle, seturlTitle] = useState("");
  const [pageProgress, setPageProgress] = useState(0);
  const [connectWallet, setConnectWallet] = useState(false);
  const [confirmTx, setConfirmTx] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [selectedChian, setSelectedChian] = useState();
  const [jsonRPCProvider, setJsonRPCProvider] = useState();
  const [backEnabled, setBackEnabled] = useState(false);
  const [forwardEnabled, setForwardEnabled] = useState(false);
  const [currentMsgData, setCurrentMsgData] = useState();
  const [currentPageData, setCurrentPageData] = useState();
  const [feesAmount, setFeesAmount] = useState();
  const [totalAmount, setTotalAmount] = useState();

  useEffect(() => {
    if (props.route.params) {
      const { url } = props.route.params;
      setPageUrl(url);
    }
  }, [props.route]);

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

  useEffect(() => {
    const getData = async () => {
      const entryWeb3 = await dappsProvider.get();
      setEntryScriptWeb3(SET_NETWORK_ID(selectedChian.chainId) + entryWeb3);
      const provider = new Web3.providers.HttpProvider(selectedChian.rpcURL);
      const jsonRPCProvider = new ethers.providers.Web3Provider(provider);
      setJsonRPCProvider(jsonRPCProvider);
    };
    if (selectedChian) {
      getData();
    }
  }, [selectedChian]);

  useEffect(() => {
    if (serchInput !== null && isSearching) {
      serchInput.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    const getData = async () => {
      const getOldChain = await AsyncStorage.getItem("selectedChain");
      const selected = getOldChain ? getOldChain : "BNB";
      const data = chainList.filter((item) => {
        return item.symbol === selected;
      });
      setSelectedChian(data[0]);
    };
    getData();
    setSelectedChian();
  }, []);

  const changeNetwork = (symble) => {
    AsyncStorage.setItem("selectedChain", symble);
    const data = chainList.filter((item) => {
      return item.symbol === symble;
    });
    setSelectedChian(data[0]);
    reloadWebView();
  };

  useEffect(() => {
    const urlData =
      pageUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").slice(0, 15) + "...";
    seturlTitle(urlData);
  }, [pageUrl]);

  const searcPage = () => {
    const hasProtocol = search.match(/^[a-z]*:\/\//);
    const sanitizedURL = hasProtocol ? search : `${"https://"}${search}`;
    setPageUrl(sanitizedURL.toLowerCase());
    setisSearching(false);
  };

  const reloadWebView = async () => {
    try {
      webViewRef.current.reload();

      postMessage({
        type: "networkChanged",
        data: selectedChian.chainId,
      });
      postMessage({
        type: "accountsChanged",
        data: selectedWallets[selectedChian?.symbol]?.address,
      });
    } catch (e) {
      console.log("ERROR", e);
    }
  };

  const navChanged = (nav) => {
    console.log("nav", nav);
  };

  const postAsyncCallbackMessage = ({
    result = {},
    data,
    error = undefined,
  }) => {
    postMessage({
      messageId: data.messageId,
      type: "web3-send-async-callback",
      beta: true,
      result: { result },
      error,
    });
  };

  const getGasPrice = async (data) => {
    const web3 = getWeb3Obj(selectedChian.rpcURL);
    const gas = await web3.eth.estimateGas({
      to: data.payload.params[0].to,
      data: data.payload.params[0].data,
      value: data.payload.params[0].value,
      from: data.payload.params[0].from,
    });
    console.log(gas);
    postAsyncCallbackMessage({
      result: gas,
      data,
    });
  };
  const getLatestBlock = async (data) => {
    const web3 = getWeb3Obj(selectedChian.rpcURL);
    const latest = await web3.eth.getBlock("latest");
    console.log("latest.number", latest.number);
    postAsyncCallbackMessage({
      result: await jsonRPCProvider.getBlock(latest.number),
      data,
    });
  };

  const onMessage = async ({ nativeEvent }) => {
    let data = nativeEvent.data;
    console.log("data", data, jsonRPCProvider);

    try {
      data = typeof data === "string" ? JSON.parse(data) : data;
      if (!data || !data.type) {
        return;
      }
      setCurrentMsgData(data);
      if (data.type === "history-state-changed") {
        await saveHistory(data);
        console.log("chaged URL", data);
        setCurrentPageData(data);
      }
      if (data.permission === "web3") {
        setConnectWallet(true);
      }
      if (data.type === "web3-send-async-read-only") {
        switch (data.payload.method) {
          case "eth_blockNumber":
            postAsyncCallbackMessage({
              result: await jsonRPCProvider.getGasPrice(),
              data,
            });
            break;
          case "eth_getBlockByNumber": {
            await getLatestBlock(data);
            break;
          }

          case "eth_gasPrice":
            postAsyncCallbackMessage({
              result: await jsonRPCProvider.getGasPrice(),
              data,
            });

          case "eth_accounts":
          case "eth_coinbase":
            postAsyncCallbackMessage({
              result: [selectedWallets[selectedChian?.symbol]?.address],
              data,
            });
            break;

          case "eth_call":
            postAsyncCallbackMessage({
              result: await jsonRPCProvider.call(data.payload.params[0]),
              data,
            });
            break;
          case "eth_estimateGas":
            getGasPrice(data);
            break;
          case "eth_sendTransaction": {
            calcFee(data.payload.params[0]);
            calcAmount(data.payload.params[0]);
            setConnectWallet(false);
            setConfirmTx(true);
            break;
          }
          case "eth_getTransactionReceipt": {
            jsonRPCProvider
              .getTransactionReceipt(data.payload.params[0])
              .then(function (transactionReceipt) {
                // console.log(transactionReceipt);
                postAsyncCallbackMessage({
                  result: transactionReceipt,
                  data,
                });
              });
            break;
          }
        }
      }
    } catch (e) {
      console.log("message error", e.message);
    }
  };

  const onLoadEnd = ({ nativeEvent }) => {
    if (nativeEvent.loading) return;
    // console.log("END-LOADING");
    setPageProgress(1);
    webViewRef.current.injectJavaScript(
      JS_POST_MESSAGE_TO_PROVIDER(JSON.stringify({ type: "getPageInfo" }))
    );
    postMessage({
      type: "networkChanged",
      data: selectedChian.chainId,
    });
    postMessage({
      type: "accountsChanged",
      data: selectedWallets[selectedChian?.symbol]?.address,
    });
    changeUrl({ ...nativeEvent });
    setConnectWallet(false);
    setConfirmTx(false);
  };

  const changeUrl = (siteInfo) => {
    setBackEnabled(siteInfo.canGoBack);
    setForwardEnabled(siteInfo.canGoForward);
  };

  const onConnect = (status) => {
    setConnectWallet(false);
    const selectedAddress = selectedWallets[selectedChian?.symbol]?.address;
    const data = { ...currentMsgData };
    if (status) {
      postMessage({
        messageId: data.messageId,
        type: "api-response",
        permission: "web3",
        data: [selectedAddress],
        isAllowed: true,
      });
    } else {
      postMessage({
        messageId: data.messageId,
        type: "api-response",
        permission: "web3",
        isAllowed: false,
      });
    }
  };

  const onConfTx = async (status) => {
    const data = { ...currentMsgData };
    setConfirmTx(false);
    if (status) {
      const tx = await browserTx(data.payload.params[0], selectedChian.symbol);
      if (!tx) {
        postAsyncCallbackMessage({
          data,
          error: "Error send transaction",
        });
      } else {
        postAsyncCallbackMessage({
          result: tx.transactionHash,
          data,
        });
      }
    } else {
      postAsyncCallbackMessage({
        data,
        error: { code: 4001, message: "User rejected request" },
      });
    }
  };

  const goBack = () => {
    if (!backEnabled) return;
    webViewRef?.current?.goBack();
  };

  const goForward = () => {
    if (!forwardEnabled) return;
    webViewRef?.current?.goForward();
  };

  const postMessage = (msg) => {
    const js = JS_POST_MESSAGE_TO_PROVIDER(JSON.stringify(msg));
    webViewRef.current.injectJavaScript(js);
  };

  const onProgress = ({ nativeEvent: { progress } }) => {
    setPageProgress(Number(progress));
  };

  const renderConnectModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={connectWallet}>
        <View style={styles.modalView1}>
          <View
            style={{ textAlign: "center", alignItems: "center", width: "90%" }}
          >
            <Text style={styles.modalText1}>Connect Wallet</Text>
            <Text
              style={[
                styles.modalText1,
                {
                  fontSize: height / 55,
                  textAlign: "center",
                  marginTop: 5,
                },
              ]}
            >
              {currentPageData.navState.url}?
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: width * 0.45,
              alignSelf: "flex-end",
              paddingHorizontal: width * 0.04,
            }}
          >
            <TouchableOpacity onPress={() => onConnect(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConnect(true)}>
              <Text style={styles.textStyle}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const copyAddress = async (add) => {
    Clipboard.setString(add);
    Toast.show({
      type: "info",
      text1: "Address copied successfully.",
    });
  };

  const calcFee = async (data) => {
    const web3 = getWeb3Obj(selectedChian.rpcURL);
    const currentGasPrice = await getCurrentGasPrices();
    const gas = await web3.utils.hexToNumberString(data.gas);
    const finalGas = Number(gas) / Math.pow(10, 9);
    setFeesAmount(Number(finalGas) * Number(currentGasPrice.low));
  };
  const calcAmount = async (data) => {
    const web3 = getWeb3Obj(selectedChian.rpcURL);
    let finalAmount;
    if (data.value) {
      const amount = await web3.utils.hexToNumberString(data.value);
      finalAmount = await web3.utils.fromWei(amount, "ether");
    }
    setTotalAmount(finalAmount);
  };

  const renderTxModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={confirmTx}>
        <View style={[styles.modalView1, styles.modalView2]}>
          <View
            style={{ textAlign: "center", alignItems: "center", width: "90%" }}
          >
            <Text style={styles.modalText1}>Confirm Transaction</Text>
            <View style={[{ width: width * 0.8, marginTop: height * 0.02 }]}>
              {currentMsgData.payload.params[0].from && (
                <View style={[styles.flexBox, styles.flexLeft]}>
                  <Text
                    style={[
                      styles.textStyle,
                      styles.width20,
                      styles.fontSize55,
                    ]}
                  >
                    From:
                  </Text>
                  <View style={[styles.flexBox, styles.flexLeft]}>
                    <Text style={[styles.textStyle, styles.fontSize55]}>
                      {sortAddress(currentMsgData.payload.params[0].from)}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        copyAddress(currentMsgData.payload.params[0].from)
                      }
                    >
                      <Image
                        source={require("../../assets/images/Recieve/Copy.png")}
                        style={styles.copyImg1}
                        resizeMode="contain"
                      ></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {currentMsgData.payload.params[0].to && (
                <View style={[styles.flexBox, styles.flexLeft]}>
                  <Text
                    style={[
                      styles.textStyle,
                      styles.width20,
                      styles.fontSize55,
                    ]}
                  >
                    To:
                  </Text>
                  <View style={[styles.flexBox, styles.flexLeft]}>
                    <Text style={[styles.textStyle, styles.fontSize55]}>
                      {sortAddress(currentMsgData.payload.params[0].to)}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        copyAddress(currentMsgData.payload.params[0].to)
                      }
                    >
                      <Image
                        source={require("../../assets/images/Recieve/Copy.png")}
                        style={styles.copyImg1}
                        resizeMode="contain"
                      ></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {totalAmount && (
                <View
                  style={[
                    styles.flexBox,
                    styles.flexLeft,
                    { marginTop: height * 0.01 },
                  ]}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      styles.width20,
                      styles.fontSize55,
                    ]}
                  >
                    Amount:
                  </Text>
                  <Text style={[styles.textStyle, styles.fontSize55]}>
                    {totalAmount} {selectedChian.symbol}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.flexBox,
                  styles.flexLeft,
                  { marginTop: height * 0.01 },
                ]}
              >
                <Text
                  style={[styles.textStyle, styles.width20, styles.fontSize55]}
                >
                  Fee:
                </Text>
                <Text style={[styles.textStyle, styles.fontSize55]}>
                  {feesAmount && feesAmount} {selectedChian.symbol}
                </Text>
              </View>
              <View
                style={[
                  styles.flexBox,
                  styles.flexLeft,
                  { width: width * 0.8 },
                ]}
              >
                <Text
                  style={[styles.textStyle, styles.width20, styles.fontSize55]}
                >
                  {" "}
                </Text>
                <Text style={[styles.textStyle, { fontSize: height / 65 }]}>
                  Estimated gas fee
                </Text>
              </View>
              {feesAmount && totalAmount && (
                <>
                  <View
                    style={[
                      styles.flexBox,
                      styles.flexLeft,
                      { marginTop: height * 0.01 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textStyle,
                        styles.width20,
                        styles.fontSize55,
                      ]}
                    >
                      Total:
                    </Text>
                    <Text style={[styles.textStyle, styles.fontSize55]}>
                      {feesAmount &&
                        totalAmount &&
                        (Number(feesAmount) + Number(totalAmount)).toFixed(
                          5
                        )}{" "}
                      {selectedChian.symbol}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.flexBox,
                      styles.flexLeft,
                      { width: width * 0.8 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textStyle,
                        styles.width20,
                        styles.fontSize55,
                      ]}
                    >
                      {" "}
                    </Text>
                    <Text style={[styles.textStyle, { fontSize: height / 65 }]}>
                      Amount + gas fee
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: width * 0.49,
              alignSelf: "flex-end",
              paddingHorizontal: width * 0.04,
            }}
          >
            <TouchableOpacity onPress={() => onConfTx(false)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfTx(true)}
              // disabled={!totalAmount}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        {isSearching ? (
          <>
            <TouchableOpacity onPress={() => setisSearching(false)}>
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
            <View
              style={{
                width: width * 0.61,
                paddingLeft: 10,
                backgroundColor: "#232949",
                height: height * 0.05,
                borderRadius: height / 20,
                flexDirection: "row",
                alignItems: "center",
                marginLeft: width * 0.03,
                marginRight: width * 0.03,
              }}
            >
              <TextInput
                ref={serchInput}
                placeholder="Enter a URL"
                placeholderTextColor={"#808080"}
                style={styles.inputView}
                value={search}
                onChangeText={(text) => setSearch(text)}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={searcPage}>
              <ImageBackground
                source={require("../../assets/images/Onbording/Oval.png")}
                resizeMode="contain"
                style={styles.imgBack}
              >
                <Image
                  source={require("../../assets/images/DappsBrowser/Search.png")}
                  style={styles.copyImg}
                  resizeMode="contain"
                ></Image>
              </ImageBackground>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Portfolio")}
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
            <TouchableOpacity onPress={() => setisSearching(true)}>
              <View
                style={{
                  width: width * 0.58,
                  paddingLeft: 10,
                }}
              >
                <Text style={styles.pageTitle}>
                  <Text style={{ fontSize: 11 }}>
                    {pageUrl.includes("https://") && "🔒"}
                  </Text>{" "}
                  {urlTitle}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setMoreVisible(true)}>
                <Image
                  source={selectedChian.image}
                  resizeMode="contain"
                  style={{ height: width * 0.08, width: width * 0.08 }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMoreVisible(true)}>
                <View style={styles.avtar}>
                  <Image
                    source={require("../../assets/images/Settings/more.png")}
                    resizeMode="contain"
                    style={{ height: height * 0.06, width: width * 0.06 }}
                  ></Image>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  function renderMoreModal() {
    return (
      <Modal animationType="slide" transparent={true} visible={moreVisible}>
        <View style={styles.modalView}>
          <View style={styles.flexBox}>
            <Text style={styles.simplexText}>More Options</Text>
            <TouchableOpacity onPress={() => setMoreVisible(false)}>
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
          <TouchableOpacity
            onPress={() => {
              setMoreVisible(false);
              reloadWebView();
            }}
          >
            <View style={[styles.flexBox, styles.flexLeft]}>
              <ImageBackground
                source={require("../../assets/images/Onbording/Oval.png")}
                resizeMode="contain"
                style={[
                  styles.imgBack,
                  { width: width * 0.1, height: height * 0.05 },
                ]}
              >
                <Image
                  style={{
                    width: width * 0.06,
                  }}
                  source={require("../../assets/images/ButtonIcons/Vector.png")}
                  resizeMode="contain"
                ></Image>
              </ImageBackground>
              <Text style={styles.modalText}>Refresh</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMoreVisible(false);
              goBack();
            }}
            style={{ marginTop: height * 0.008 }}
          >
            <View style={[styles.flexBox, styles.flexLeft]}>
              <ImageBackground
                source={require("../../assets/images/Onbording/Oval.png")}
                resizeMode="contain"
                style={[
                  styles.imgBack,
                  { width: width * 0.1, height: height * 0.05 },
                ]}
              >
                <Image
                  style={{
                    width: width * 0.06,
                  }}
                  source={require("../../assets/images/ButtonIcons/Back.png")}
                  resizeMode="contain"
                ></Image>
              </ImageBackground>
              <Text style={styles.modalText}>Back</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMoreVisible(false);
              goForward();
            }}
          >
            <View style={[styles.flexBox, styles.flexLeft]}>
              <ImageBackground
                source={require("../../assets/images/Onbording/Oval.png")}
                resizeMode="contain"
                style={[styles.imgBack, { width: width * 0.1 }]}
              >
                <Image
                  style={{
                    transform: [{ rotate: "180deg" }],
                    width: width * 0.06,
                  }}
                  source={require("../../assets/images/ButtonIcons/Back.png")}
                  resizeMode="contain"
                ></Image>
              </ImageBackground>
              <Text style={styles.modalText}>Forward</Text>
            </View>
          </TouchableOpacity>
          {currentPageData && (
            <TouchableOpacity
              style={{ marginTop: height * 0.006 }}
              onPress={() => {
                saveFav(currentPageData);
              }}
            >
              <View style={[styles.flexBox, styles.flexLeft]}>
                <Image
                  source={require("../../assets/images/DappsBrowser/Favourites.png")}
                  resizeMode="contain"
                  style={{ width: width * 0.1 }}
                ></Image>
                <Text style={styles.modalText}>Add to Favourites</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              setMoreVisible(false);
              props.navigation.navigate("AddAccount", { type: "BNB" });
            }}
          >
            <View style={[styles.flexBox, styles.flexLeft]}>
              <ImageBackground
                source={require("../../assets/images/Settings/Wallet.png")}
                resizeMode="contain"
                style={[
                  styles.imgBack,
                  {
                    width: width * 0.09,
                    marginTop: height * 0.007,
                    marginLeft: width * 0.01,
                  },
                ]}
              >
                <Image
                  source={{
                    uri: `https://avatars.dicebear.com/api/identicon/${
                      selectedWallets[selectedChian?.symbol]?.address
                    }.png`,
                  }}
                  resizeMode="contain"
                  style={{ width: width * 0.05, height: width * 0.13 }}
                />
              </ImageBackground>

              <Text style={styles.modalText}>Change Wallet</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{ marginTop: height * 0.04, marginBottom: height * 0.015 }}
          >
            <Text style={styles.simplexText}>Select Network</Text>
          </View>

          {chainList.map((item, index) => {
            return (
              <TouchableOpacity
                key={`network${index}`}
                onPress={() => {
                  setMoreVisible(false);
                  changeNetwork(item.symbol);
                }}
              >
                <View style={[styles.flexBox, styles.flexLeft]}>
                  <Image
                    source={item.image}
                    resizeMode="contain"
                    style={{ width: width * 0.1 }}
                  ></Image>
                  <View>
                    <Text style={styles.modalText}>{item.name}</Text>
                    <Text style={[styles.modalText, { fontSize: height / 60 }]}>
                      {selectedWallets[item.symbol] &&
                        sortAddress(selectedWallets[item.symbol].address)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    );
  }
  return (
    <View style={styles.backgroundView}>
      {selectedChian && selectedWallets && jsonRPCProvider && (
        <>
          {connectWallet && renderConnectModal()}
          {confirmTx && renderTxModal()}
          {renderHeader()}
          {renderMoreModal()}
          {pageProgress < 1 && (
            <Progress.Bar
              progress={pageProgress}
              width={width}
              color={"#fae35f"}
              borderWidth={0}
              borderRadius={0}
            />
          )}
          <View style={{ height: height * 0.82 }}>
            {entryScriptWeb3 && (
              <WebView
                testID={"browserWebView"}
                ref={webViewRef}
                javaScriptEnabled
                bounces={false}
                localStorageEnabled
                setSupportMultipleWindows={false}
                onNavigationStateChange={navChanged}
                onPermissionRequest={(req) => console.log("PERM", req)}
                onMessage={onMessage}
                onLoad={(v) => console.log("LOADING-STARTED")}
                onLoadEnd={onLoadEnd}
                onLoadProgress={onProgress}
                // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
                source={{ uri: pageUrl }}
                onError={(err) => {
                  console.log("Error", err);
                }}
                renderError={(err) => (
                  <View
                    style={{
                      height: height * 0.82,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.exploreText}>
                      Ooops! something went wrong...
                    </Text>
                    <Text
                      style={[
                        styles.exploreText,
                        { fontSize: height / 55, marginTop: 10 },
                      ]}
                    >
                      We weren't able to load that page.
                    </Text>
                    <TouchableOpacity
                      style={styles.swapView}
                      onPress={() => props.navigation.navigate("Portfolio")}
                    >
                      <Text style={styles.swpText}>Go to home</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default Browser;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  /* model 2 */
  modalView1: {
    height: height * 0.25,
    width: width * 0.9,
    borderRadius: height / 35,
    backgroundColor: "#192255",
    justifyContent: "space-between",
    paddingVertical: height * 0.04,
    alignItems: "center",
    marginTop: height * 0.22,
    alignSelf: "center",
  },
  modalView2: {
    height: height * 0.4,
  },

  modalText1: {
    fontSize: height / 40,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
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

  /* /modal2*/

  /*  modal */
  flexLeft: {
    justifyContent: "flex-start",
  },
  width20: {
    width: width * 0.2,
  },
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  simplexText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "600",
  },

  modalView: {
    height: height * 0.91,
    width: width,
    backgroundColor: "#192255",
    marginTop: height * 0.05,
    padding: width * 0.05,
    paddingTop: width * 0.03,
  },

  modalText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    marginLeft: width * 0.05,
  },

  /*  /modal */
  copyImg: {
    height: height * 0.07,
  },
  copyImg1: {
    width: width * 0.06,
    height: height * 0.04,
  },
  swpText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  swapView: {
    height: height * 0.07,
    width: width * 0.8,
    borderRadius: 40,
    alignSelf: "center",
    marginTop: height * 0.04,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },
  exploreText: {
    fontSize: height / 45,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    alignSelf: "center",
    textAlign: "center",
  },
  inputView: {
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
    paddingRight: 8,
    paddingLeft: 3,
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  avtar: {
    height: width * 0.1,
    width: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#98a1d1",
    borderRadius: height * 0.03,
    marginLeft: 10,
  },
  pageTitle: {
    fontSize: height / 50,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "center",
  },

  securityView: {
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.88,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
  },
});
