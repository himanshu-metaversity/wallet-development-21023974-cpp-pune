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
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { addWallet, changeWallet } from "../../utils/WalletOperations";
const { height, width } = Dimensions.get("screen");

const AddAccount = (props) => {
  const { importedWallet } = props.route.params;
  const walletContext = useContext(WalletContext);
  const { wallets, selectedWallets, updateSalectedWallet } = walletContext;
  //   const selectedWallet = walletContext.selectedWallets[pageType];

  const [coin, setCoin] = useState("ETH");
  const [acc, setAcc] = useState("");
  const [salectedChain, setSalectedChain] = useState();
  const [defaultWallet, setDefaultWallet] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const salected = wallets.filter((item) => {
      return item.showSymbol === coin;
    });
    const coinName = !salected[0].tokenType
      ? salected[0].showSymbol
      : salected[0].tokenType === "ERC20"
      ? "ETH"
      : "BNB";
    setSalectedChain(salected[0]);
    setDefaultWallet(selectedWallets[coinName]);
  }, [coin]);

  const addWalletData = async () => {
    setIsLoading(true);
    const newData = await addWallet(salectedChain, wallets);
    console.log("newData.selectedWallet", newData.selectedWallet);
    // updateSalectedWallet(newData.selectedWallet);
    setSalectedChain(newData.data);
    setDefaultWallet(newData.selectedWallet[coin]);
    setIsLoading(false);
  };

  const selectWallet = async (item) => {
    const coinName = !salectedChain.tokenType
      ? salectedChain.showSymbol
      : salectedChain.tokenType === "ERC20"
      ? "ETH"
      : "BNB";

    changeWallet(coinName, item.address);
    const newSelectedWallets = {
      ...selectedWallets,
      [coinName]: { address: item.address, index: 0 },
    };
    updateSalectedWallet(newSelectedWallets);
    setDefaultWallet(item);
  };

  useEffect(() => {
    if (importedWallet) {
      setSalectedChain(importedWallet.data);
      setDefaultWallet(importedWallet.selectedWallet[coin]);
    }
  }, [props.route]);

  const renderHeader = () => {
    return (
      <View style={styles.headerView}>
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
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>Select Account</Text>
        </View>
      </View>
    );
  };

  function renderItemDetail(item) {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity
          onPress={() => setCoin(item.showSymbol)}
          style={{
            height: height * 0.12,
            width: width * 0.2,
            borderRadius: height * 0.03,
            backgroundColor: coin === item.showSymbol ? "white" : "#192255",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={
              typeof item.image === "string" ? { uri: item.image } : item.image
            }
            resizeMode="contain"
            style={{ height: height * 0.06, width: width * 0.1 }}
          />
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: height / 65,
              color: coin === item.showSymbol ? "#192255" : "white",
            }}
          >
            {item.showSymbol}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderAccDetail(item, index) {
    return (
      <TouchableOpacity
        onPress={() => selectWallet(item)}
        style={styles.accItemViw}
      >
        <View
          style={{
            height: height * 0.09,
            width: width * 0.4,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "ClashDisplay-Bold",
              fontSize: height / 55,
              color: "white",
              paddingBottom: 2,
            }}
          >
            {`Account ${index + 1}`}
          </Text>
          <Text
            style={{
              fontFamily: "ClashDisplay-Regular",
              fontSize: height / 60,
              color: "white",
              paddingBottom: 2,
            }}
          >
            {`${item.balance.toFixed(3)} ${coin}`}
          </Text>
          <Text
            style={{
              fontFamily: "ClashDisplay-Regular",
              fontSize: height / 60,
              color: "white",
            }}
          >
            $ {item.usdPrice.toFixed(3)}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            height: height * 0.09,
            width: width * 0.4,
          }}
        >
          {defaultWallet.address === item.address ? (
            <Image
              source={require("../../assets/images/ButtonIcons/check.png")}
              resizeMode="contain"
              style={{ height: height * 0.06, width: width * 0.06 }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  function renderCoinsList() {
    return (
      <View style={styles.listView}>
        <FlatList
          data={wallets}
          horizontal={true}
          renderItem={({ item }) => renderItemDetail(item)}
        />
      </View>
    );
  }

  function renderAccountList() {
    return (
      <View style={styles.accView}>
        <FlatList
          data={salectedChain.wallets}
          renderItem={({ item, index }) => renderAccDetail(item, index)}
        />
      </View>
    );
  }

  const renderBtnView = () => {
    return (
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.verifyView}
          onPress={() =>
            props.navigation.navigate("ImportAcc", { salectedChain, wallets })
          }
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "normal",
              fontFamily: "ClashDisplay-Regular",
            }}
          >
            Import
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.verifyView} onPress={addWalletData}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "normal",
              fontFamily: "ClashDisplay-Regular",
            }}
          >
            {isLoading ? <ActivityIndicator size="small" /> : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.backgroundView}>
      {renderHeader()}
      {renderCoinsList()}
      {salectedChain && defaultWallet && renderAccountList()}
      {salectedChain && !salectedChain.tokenType && renderBtnView()}
    </SafeAreaView>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },
  headerView: {
    height: height * 0.1,
    width: width * 0.8,
    paddingHorizontal: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red"
  },
  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },
  listView: {
    height: height * 0.2,
    width: width * 0.9,
    // backgroundColor: "green",
    alignSelf: "center",
    alignItems: "center",
  },
  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height / 30,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
  },

  btnView: {
    width: width * 0.9,
    position: "absolute",
    bottom: 0,
    height: height * 0.13,
    marginHorizontal: width * 0.05,
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "red"
  },
  cancelView: {
    height: height * 0.08,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#27378C",
    borderWidth: 2,
    borderColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyView: {
    height: height * 0.08,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },
  accView: {
    height: height * 0.45,
    width: width * 0.9,
    // backgroundColor: "green",
    alignSelf: "center",
  },
  itemView: {
    height: height * 0.15,
    width: width * 0.22,
    alignSelf: "center",
    // backgroundColor: "pink"
  },
  accItemViw: {
    height: height * 0.1,
    width: width * 0.9,
    backgroundColor: "#192255",
    borderRadius: height * 0.04,
    marginTop: height * 0.01,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
