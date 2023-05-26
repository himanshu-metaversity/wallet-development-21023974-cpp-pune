import React, { useEffect } from "react";
import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const { height, width } = Dimensions.get("screen");

export default function SendReceive(props) {
  const { pageType } = props;

  const gotToSendPage = (type) => {
    if (pageType === "All") {
      props.navigation.navigate("SelectCoin", { type, pageType });
    } else if (pageType !== "All" && type === "Send") {
      props.navigation.navigate("SendDetails", { type, pageType });
    } else if (pageType !== "All" && type === "Receive") {
      props.navigation.navigate("Recieve", { type, pageType });
    }
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          width: width * 0.45,
          justifyContent: "space-between",
          marginTop: height * 0.02,
        }}
      >
        <TouchableOpacity
          style={styles.sendView}
          onPress={() => gotToSendPage("Send")}
        >
          <Image
            source={require("../assets/images/ButtonIcons/Send.png")}
            resizeMode="contain"
            style={{ height: 40, width: 40 }}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendView}
          onPress={() => gotToSendPage("Receive")}
          //   onPress={() => props.navigation.navigate("Recieve")}
        >
          <Image
            source={require("../assets/images/ButtonIcons/Down.png")}
            resizeMode="contain"
            style={{ height: 40, width: 40 }}
          ></Image>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: width * 0.45,
          justifyContent: "space-between",
          marginTop: height * 0.01,
          alignSelf: "center",
        }}
      >
        <Text style={styles.sendText}>Send</Text>
        <Text style={styles.recieveText}>Receive</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sendText: {
    fontSize: height / 56,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    marginLeft: width * 0.03,
  },

  recieveText: {
    fontSize: height / 56,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  sendView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
  },
});
