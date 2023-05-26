import { Text, View, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { decryptPin } from "../../utils/WalletOperations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Splash(props) {
  useEffect(() => {
    setTimeout(async () => {
      //  await AsyncStorage.removeItem("mnemonic");
      //  await AsyncStorage.removeItem("pin");
      const userPin = await decryptPin();
      const privacypolicy = await AsyncStorage.getItem("privacypolicy");
      if (!userPin) {
        if (privacypolicy && privacypolicy === "true") {
          props.navigation.replace("SecurityPin", {
            tx: false,
          });
        }
        props.navigation.replace("PrivacyPolicy");
      } else {
        props.navigation.replace("SecurityPin", {
          tx: false,
          pageName: "splash",
        });
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.splashView}>
      <Image
        source={require("../../assets/images/Splash/Splash.png")}
        style={styles.imgView}
        resizeMode="contain"
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  splashView: {
    flex: 1,
    backgroundColor: "#0D1541",
    justifyContent: "center",
    alignItems: "center",
  },

  imgView: {
    height: 120,
    width: 120,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});
