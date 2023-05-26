import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from "react-native";
import React from "react";
const { height, width } = Dimensions.get("screen");

const SelectToken = (props) => {
  const DATA = [
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "BTC",
      btc: "Bitcoin",
    },
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "ETH",
      btc: "Etherium",
    },
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "DSH",
      btc: "Dash",
    },
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "DSH",
      btc: "Dash",
    },
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "DSH",
      btc: "Dash",
    },
    {
      image: require("../../assets/images/ButtonIcons/trans.png"),
      coin: "DSH",
      btc: "Dash",
    },
  ];

  function renderHeader() {
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
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>Select Token</Text>
        </View>
      </View>
    );
  }

  function renderDetails(item) {
    return (
      <View>
        <TouchableOpacity
          style={{ height: height * 0.1 }}
          onPress={() => props.navigation.navigate("Swap")}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: height * 0.02,
              marginLeft: width * 0.05,
            }}
          >
            <Image
              source={require("../../assets/images/Bitcoins/Bitcoin.png")}
            ></Image>
            <View
              style={{
                flexDirection: "row",
                marginLeft: width * 0.03,
                alignItems: "center",
                justifyContent: "space-between",
                width: width * 0.7,
              }}
            >
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
                    color: "#A2A2AA",
                    fontFamily: "Poppins-Regular",
                    fontWeight: "400",
                  }}
                >
                  {item.item.coin}
                </Text>
                <Text
                  style={{
                    fontSize: height / 47,
                    color: "#FFFFFF",
                    fontFamily: "ClashDisplay-Regular",
                    fontWeight: "500",
                  }}
                >
                  {item.item.btc}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <ImageBackground
          source={require("../../assets/images/ButtonIcons/Divider.png")}
          resizeMode="contain"
          style={{
            height: height * 0.01,
            marginTop: height * 0.001,
            width: width * 0.57,
            alignSelf: "center",
          }}
        ></ImageBackground>
      </View>
    );
  }

  function renderFlatList() {
    return <FlatList data={DATA} renderItem={(item) => renderDetails(item)} />;
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderFlatList()}
    </View>
  );
};

export default SelectToken;

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
    width: width * 0.7,
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height * 0.035,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
