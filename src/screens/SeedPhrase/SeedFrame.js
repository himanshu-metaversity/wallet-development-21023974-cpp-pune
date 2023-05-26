import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Clipboard from "@react-native-community/clipboard";
import Toast from "react-native-toast-message";
import {
  validateMnemonic,
  encryptMnemonic,
  generateAllWallet,
} from "../../utils/WalletOperations";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const SeedFrame = (props) => {
  const { userMnemonic } = props?.route?.params;
  const navigation = useNavigation();
  const [oldSeed, setOldSeed] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userMnemonic) {
      setOldSeed(userMnemonic);
    }
  }, [userMnemonic, props.route]);

  const pasteSeed = async () => {
    const text = await Clipboard.getString();
    setOldSeed(`${oldSeed}${text}`);
  };

  const copySeed = async () => {
    Clipboard.setString(userMnemonic);
    Toast.show({
      type: "info",
      text1: "Mnemonic copied successfully.",
    });
  };

  const importWallet = async () => {
    const validate = validateMnemonic(oldSeed);
    if (!validate) {
      alert("Please enter valid Mnemonic");
      return;
    }
    setIsLoading(true);
    encryptMnemonic(oldSeed);
    await generateAllWallet();
    setIsLoading(false);
    setTimeout(() => {
      props.navigation.navigate("SecurityAlert");
    }, 100);
  };

  const renderRecoveryPhrase = () => {
    return (
      <View style={styles.seedParentView}>
        <Text style={styles.seedPhraseText}>Recovery</Text>

        <Text style={styles.desText}>
          {" "}
          Your 12 Words Seed and Private Key give direct {"\n"}access to your
          account and funds. do not give this {"\n"}information to anyone. We
          repeat, never give your
        </Text>
        <Text style={styles.desTextNew}>
          word seed and private Key to anyone
        </Text>
      </View>
    );
  };

  const recoveryInput = () => {
    return (
      <View style={{ height: height * 0.2, width: width * 1 }}>
        <View style={styles.inputView}>
          {userMnemonic ? (
            <Text
              style={{
                height: height * 0.16,
                width: width * 0.8,
                color: "white",
                fontFamily: "Poppins-Regular",
                fontSize: height / 45,
                fontWeight: "500",
                marginTop: height * 0.07,
                textAlign: "center",
              }}
            >
              {userMnemonic}
            </Text>
          ) : (
            <TextInput
              multiline={true}
              placeholderTextColor="white"
              editable={false}
              style={{
                height: height * 0.16,
                width: width * 0.8,
                color: "white",
                fontFamily: "Poppins-Regular",
                fontSize: height / 45,
                fontWeight: "500",
                marginTop: height * 0.01,
              }}
              value={oldSeed}
              onChangeText={(text) => setOldSeed(text)}
            />
          )}
        </View>
        <View style={styles.recoveryPhraseView}>
          <Text style={styles.recoveryText}>Recovery Phrase</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity
          onPress={() => {
            if (userMnemonic) {
              navigation.reset({
                index: 0,
                routes: [{ name: "Portfolio" }],
              });
            } else {
              setOldSeed("");
              props.navigation.goBack();
            }
          }}
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
      </View>
    );
  };

  const renderPaste = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#0D1541",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.04,
          width: width * 0.3,
          borderRadius: height * 0.02,
        }}
        onPress={userMnemonic ? copySeed : pasteSeed}
      >
        <Text style={styles.pasteText}>{userMnemonic ? "Copy" : "Paste"}</Text>
      </TouchableOpacity>
    );
  };

  const renderBtnView = () => {
    return (
      <View style={styles.btnView}>
        <TouchableOpacity
          style={styles.cancelView}
          onPress={() => props.navigation.goBack()}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "normal",
              fontFamily: "ClashDisplay-Regular",
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.verifyView} onPress={importWallet}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "500",
              fontFamily: "ClashDisplay-Regular",
            }}
          >
            {isLoading ? <ActivityIndicator size="small" /> : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderRecoveryPhrase()}
      {recoveryInput()}
      {renderPaste()}
      {!userMnemonic && renderBtnView()}
    </View>
  );
};

export default SeedFrame;

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },

  recoveryText: {
    fontSize: height / 53,
    color: "#FFFFFF",
    fontWeight: "400",
    fontFamily: "ClashDisplay-Regular",
  },

  pasteText: {
    fontSize: height / 60,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "ClashDisplay-Regular",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  cancelView: {
    height: height * 0.08,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#1F1F1F",
    justifyContent: "center",
    alignItems: "center",
  },

  btnView: {
    width: width * 0.9,
    position: "absolute",
    bottom: 0,
    height: height * 0.2,
    marginHorizontal: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  verifyView: {
    height: height * 0.08,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },

  recoveryPhraseView: {
    height: height * 0.03,
    width: width * 0.41,
    borderRadius: height / 10,
    backgroundColor: "#0D1541",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // marginTop: 2,
    // position: 'absolute'
  },

  inputView: {
    height: height * 0.2,
    width: width * 0.9,
    borderRadius: height / 20,
    backgroundColor: "#192255",
    alignSelf: "center",
    position: "absolute",
    bottom: height * -0.01,
    alignItems: "center",
    justifyContent: "center",
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center",
  },

  newPinText: {
    fontSize: height / 40,
    color: "#FFFFFF",
  },

  seedParentView: {
    justifyContent: "center",
    alignItems: "center",
    margin: height * 0.03,
  },

  seedPhraseText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "normal",
  },

  desText: {
    fontSize: height / 65,
    color: "#FFFAFA",
    marginTop: height * 0.04,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  desTextNew: {
    fontSize: height / 60,
    color: "#FFFAFA",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  securityText: {
    fontSize: height / 52,
    color: "#808080",
  },
});
