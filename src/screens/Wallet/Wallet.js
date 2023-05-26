import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import SendReceive from "../../components/SendReceive";
import TxList from "../../components/TxList";
import { txListBNB } from "../../utils/binance";
import { txListETH } from "../../utils/eth";
import { txListETC } from "../../utils/etc";
import { txListSOL } from "../../utils/solana";
import { txListAVAX } from "../../utils/avax";
import { txListERC20 } from "../../utils/erc20";
const { height, width } = Dimensions.get("screen");

const Wallet = (props) => {
  const { type } = props.route.params;
  const walletContext = useContext(WalletContext);
  const { wallets, selectedWallets } = walletContext;
  const [crtWallet, setCrtWallet] = useState();
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allTx, setAllTx] = useState();

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
    setRefresh(!refresh);
  }, [props.route]);

  useEffect(() => {
    if (wallets) {
      const filterData = wallets.filter((item) => {
        return item.showSymbol === type;
      });
      setCrtWallet(filterData[0]);
    }
  }, [wallets, type]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      // const selectedAdd = selectedWallets[type].address;
      let tx;
      if (crtWallet) {
        if (crtWallet.tokenType) {
          tx = await txListERC20(
            crtWallet.wallets,
            crtWallet.tokenType,
            crtWallet.decimals
          );
        } else if (type === "BNB") {
          tx = await txListBNB(crtWallet.wallets);
        } else if (type === "BTC") {
          tx = [];
        } else if (type === "ETH") {
          tx = await txListETH(crtWallet.wallets);
        } else if (type === "AVAX") {
          tx = await txListAVAX(crtWallet.wallets);
        } else if (type === "SOL") {
          tx = await txListSOL(crtWallet.wallets);
        } else if (type === "ETC") {
          tx = await txListETC(crtWallet.wallets);
        }
        setAllTx(tx);
        setIsLoading(false);
      }
    };
    getData();
  }, [refresh, type]);

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
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
        <TouchableOpacity
          onPress={() => props.navigation.navigate("AddAccount", { type })}
        >
          <ImageBackground
            source={require("../../assets/images/Onbording/Oval.png")}
            resizeMode="contain"
            style={styles.imgBack}
          >
            <Image
              source={require("../../assets/images/ButtonIcons/plus.png")}
              resizeMode="contain"
              style={{ height: height * 0.09, width: width * 0.09 }}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPortfolio = () => {
    return (
      <View style={styles.portfolioView}>
        <Text style={styles.portfolioText}>My Wallet</Text>
        {!crtWallet ? (
          <ActivityIndicator size="large" style={{ marginTop: 10 }} />
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("SelectCoin", {
                type: "All",
                pageType: "All",
              })
            }
            style={{ alignItems: "center" }}
          >
            <Text style={styles.totalText}>
              Wallet {crtWallet && crtWallet.name}
            </Text>

            <Text style={styles.amtText}>
              {crtWallet && `$${crtWallet.totalUSDPrice.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        )}

        <SendReceive pageType={type} {...props} />
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={styles.transView}>
        <View
          style={{
            flexDirection: "row",
            marginTop: height * 0.04,
            marginLeft: width * 0.04,
            alignItems: "center",
            justifyContent: "space-between",
            width: width * 0.9,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: height / 54,
                color: "white",
                fontFamily: "Poppins-Regular",
                fontWeight: "600",
              }}
            >
              Transactions
            </Text>

            <TouchableOpacity onPress={() => setRefresh(!refresh)}>
              <Image
                source={require("../../assets/images/ButtonIcons/trans.png")}
                style={{
                  marginLeft: width * 0.03,
                  height: height * 0.02,
                  width: width * 0.04,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
          {allTx && allTx.length > 3 && (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("WalletScroll", {
                  allTx,
                  type,
                  crtWallet,
                })
              }
            >
              {/* <Image
                source={require("../../assets/images/ButtonIcons/Forward.png")}
              ></Image> */}
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
        ) : (
          <>
            {allTx && allTx.length == 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: height * 0.02,
                  marginLeft: width * 0.04,
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: width * 0.9,
                }}
              >
                <Text
                  style={{
                    fontSize: height / 54,
                    color: "white",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  There is no transaction
                </Text>
              </View>
            ) : (
              <FlatList
                data={allTx?.slice(0, 10)}
                renderItem={({ item }) => (
                  <TxList
                    item={item}
                    type={type}
                    crtWallet={crtWallet}
                    {...props}
                  />
                )}
              />
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderPortfolio()}
      {renderFlatList()}
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.88,
  },

  portfolioView: {
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

  recieveText: {
    fontSize: height / 56,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  container: {
    height: height * 0.4,
    backgroundColor: "#0D1541",
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "red",
  },

  totalText: {
    fontSize: height / 56,
    color: "white",
    marginTop: height * 0.04,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  sendText: {
    fontSize: height / 56,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    marginLeft: width * 0.03,
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
    height: height * 0.4,
    position: "absolute",
    bottom: 0,
  },

  sendView: {
    height: height * 0.08,
    width: width * 0.17,
    borderRadius: height / 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
  },
});
