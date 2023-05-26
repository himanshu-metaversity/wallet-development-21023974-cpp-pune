import React, { Fragment } from "react";
import {
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { height, width } = Dimensions.get("screen");

export default function CoinCard(props) {
  const { item, type, pageType } = props;

  const gotToSendPage = () => {
    if (type === "All") {
      props.navigation.navigate("Wallet", { type: item.showSymbol });
    } else if (type === "Send") {
      props.navigation.navigate("SendDetails", {
        type,
        pageType: item.showSymbol,
      });
    } else if (type === "Receive") {
      props.navigation.navigate("Recieve", { type, pageType: item.showSymbol });
    }
  };

  return (
    <Fragment>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginTop: height * 0.02,
          marginLeft: width * 0.04,
        }}
        onPress={
          gotToSendPage
          // () =>
          // props.navigation.navigate("Wallet", { type: item.showSymbol })
        }
      >
        <Image
          source={
            typeof item.image === "string" ? { uri: item.image } : item.image
          }
          resizeMode="contain"
          style={{ height: height * 0.067, width: width * 0.17 }}
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
              height: height * 0.06,
              marginRight: width * 0.04,
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
              {item.name}
            </Text>

            <Text
              style={{
                fontSize: height / 45,
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
              }}
            >
              {item?.totalBalance?.toFixed(3)} {item.showSymbol}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              height: height * 0.06,
              marginRight: width * 0.01,
            }}
          >
            <Text
              style={{
                fontSize: height / 45,
                color: "white",
                fontFamily: "ClashDisplay-Regular",
                fontWeight: "500",
                textAlign: "right",
                marginRight: 3,
              }}
            >
              $ {item?.totalUSDPrice?.toFixed(2)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: width * 0.2,
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: height / 65,
                  color: "#A2A2AA",
                }}
              >
                {item.price_change_percentage_24h < 0 ? null : "+"}
                {item?.price_change_percentage_24h?.toFixed(3)}%
              </Text>
              {item.price_change_percentage_24h < 0 ? (
                <Image
                  source={require("../assets/images/ButtonIcons/Arrow.png")}
                  style={{
                    height: height * 0.03,
                    width: width * 0.05,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require("../assets/images/ButtonIcons/up.png")}
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
        source={require("../assets/images/ButtonIcons/Divider.png")}
        resizeMode="contain"
        style={{
          height: height * 0.01,
          marginTop: height * 0.02,
          width: width * 0.7,
          alignSelf: "center",
          marginLeft: width * 0.2,
        }}
      ></ImageBackground>
    </Fragment>
  );
}
