import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { history } from "../../utils/apiConfig";
import moment from "moment";

import React, { useState, useContext, useEffect } from "react";
const { height, width } = Dimensions.get("screen");
import Clipboard from "@react-native-community/clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sortAddress } from "../../utils/WalletOperations";
const SwapHistory = (props) => {
  const [tab, setTab] = useState("swap");
  const [historyData, setHistoryData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getHistory = async (type) => {
    setIsLoading(true);
    const historyData = await history(type);
    if (historyData.data.statusCode === 200) {
      setHistoryData(historyData.data.result);
    } else {
      setHistoryData();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (tab === "swap") {
      getHistory("swapHistory");
    } else {
      getHistory("buyHistory");
    }
  }, [tab]);

  console.log("historyData", historyData);

  function renderHeader() {
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
          <Text style={styles.newPinText}>History</Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
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

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderMiddle()}
      {isLoading && <ActivityIndicator style={{ marginTop: 50 }} />}
      {tab === "swap" && !isLoading && historyData && (
        <ScrollView>
          {historyData &&
            historyData[0].sendObject &&
            historyData.map((item) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    paddingLeft: 20,
                    width: "100%",
                    paddingRight: 20,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                          }}
                        >
                          {item?.sendObject?.coinName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                          }}
                        >
                          {sortAddress(item?.sendObject?.address)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                          }}
                        >
                          {`${item?.sendObject?.quantity} ${item?.sendObject?.coinName}`}
                        </Text>
                      </View>

                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={require("../../assets/images/Swap/Swap.png")}
                          style={{
                            width: 25,
                            height: 25,
                            transform: [{ rotate: "90deg" }],
                          }}
                        ></Image>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                            marginTop: 5,
                            textAlign: "center",
                            width: 100,
                          }}
                        >
                          {moment(item?.createdAt).format("LLL")}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                            textAlign: "right",
                          }}
                        >
                          {item?.getObject?.coinName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                            textAlign: "right",
                          }}
                        >
                          {sortAddress(item?.swapHistory[1]?.toAddress)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                            textAlign: "right",
                          }}
                        >
                          {`${item?.getObject?.quantity} ${item?.getObject?.coinName}`}
                        </Text>
                      </View>
                    </View>

                    <ImageBackground
                      source={require("../../assets/images/ButtonIcons/Divider.png")}
                      resizeMode="contain"
                      style={{
                        height: height * 0.01,
                        marginTop: 10,
                        width: width * 0.89,
                        alignSelf: "center",
                      }}
                    ></ImageBackground>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      )}
      {tab === "buy" && !isLoading && historyData && (
        <ScrollView>
          {historyData &&
            !historyData[0].sendObject &&
            historyData.map((item) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    paddingLeft: 20,
                    width: "100%",
                    paddingRight: 20,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                          }}
                        >
                          {item?.coinName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                          }}
                        >
                          {sortAddress(item?.toAddress)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                          }}
                        >
                          {`${item?.quantity} ${item?.coinName}`}
                        </Text>
                      </View>

                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                            marginTop: 5,
                            textAlign: "right",
                            width: 120,
                          }}
                        >
                          {moment(item?.createdAt).format("LLL")}
                        </Text>
                      </View>

                      {/* <View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "white",
                            fontFamily: "ClashDisplay-Regular",
                            fontWeight: "500",
                            textAlign: "right",
                          }}
                        >
                          {item?.getObject?.coinName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                            textAlign: "right",
                          }}
                        >
                          {sortAddress(item?.swapHistory[1]?.toAddress)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#A2A2AA",
                            fontFamily: "Poppins-Regular",
                            fontWeight: "400",
                            textAlign: "right",
                          }}
                        >
                          {`${item?.getObject?.quantity} ${item?.getObject?.coinName}`}
                        </Text>
                      </View> */}
                    </View>

                    <ImageBackground
                      source={require("../../assets/images/ButtonIcons/Divider.png")}
                      resizeMode="contain"
                      style={{
                        height: height * 0.01,
                        marginTop: 10,
                        width: width * 0.89,
                        alignSelf: "center",
                      }}
                    ></ImageBackground>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
};

export default SwapHistory;

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
    width: "80%",
  },
  pinView: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  newPinText: {
    fontSize: 25,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
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

  portfolioText: {
    fontSize: 20,
    color: "white",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
