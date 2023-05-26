import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  encryptMnemonic,
  generateAllWallet,
} from "../../utils/WalletOperations";
const { height, width } = Dimensions.get("window");

export default function SeedGiven(props) {
  const { mnemonic, seed } = props.route.params;
  const [copiedText, setCopiedText] = useState("");
  const [rendomSeed, setRendomSeed] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const shuffledSeed = seed.sort(() => Math.random() - 0.5);
    setRendomSeed(shuffledSeed);
  }, []);

  const renderHeader = () => {
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
      </View>
    );
  };
  const renderSeedPhrae = () => {
    return (
      <View style={styles.seedParentView}>
        <Text style={styles.seedPhraseText}>Recovery</Text>
        <View
          style={{
            height: height / 32,
            justifyContent: "center",
            width: width * 0.66,
            alignItems: "center",
            alignSelf: "center",
            overflow: "hidden",
          }}
        ></View>
        <View style={{ width: width * 0.85 }}>
          <Text style={styles.desText}>
            Please write down your 12 Words Back-Up Seed on a paper, {""} in the
            exact same order as shown below,and store the paper with the Seed in
            a safe place. Your 12
            {/* </Text>
        <Text style={styles.desTextNew}> */}
            Words Seed and Private Key give direct access to your account and
            funds. Do NOT give this information to ANYONE.
          </Text>
        </View>
        {/* <Text style={styles.desTextNew}></Text> */}
      </View>
    );;
  };

  const remove = (item) => {
    let temp = [...rendomSeed];
    const index = temp.indexOf(item);
    if (index !== -1) {
      temp.splice(index, 1);
    }
    setRendomSeed(temp);
  };

  const pasteTxtFun = async (item) => {
    setCopiedText(`${copiedText}${item}${rendomSeed.length > 1 ? " " : ""}`);
  };

  const verifySeed = async () => {
    if (copiedText !== mnemonic) {
      alert("Entered Seed doesn't match.");
    } else {
      setIsLoading(true);
      encryptMnemonic(mnemonic);
      await generateAllWallet();
      setIsLoading(false);
      setTimeout(() => {
        props.navigation.navigate("SecurityAlert");
      }, 100);
    }
    // props.navigation.navigate("SecurityAlert");
  };

  const recoveryInput = () => {
    return (
      <View style={{ height: 130, width: width * 1 }}>
        <View style={styles.inputView}>
          <TextInput
            numberOfLines={3}
            textAlignVertical="top"
            placeholderTextColor="#FFFFFF"
            value={copiedText}
            style={{
              width: width * 0.8,
              color: "white",
              fontFamily: "ClashDisplay-Regular",
              fontSize: height / 45,
              fontWeight: "500",
              marginTop: 15,
            }}
            multiline={true}
            blurOnSubmit={true}
          />
        </View>
        <View style={styles.recoveryPhraseView}>
          <Text style={styles.recoveryText}>Recovery Phrase</Text>
        </View>
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.flatListView}
        onPress={() => {
          pasteTxtFun(item?.item);
          remove(item.item);
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "500",
            fontFamily: "ClashDisplay-Regular",
            marginLeft: width * 0.02,
            fontSize: height / 54,
          }}
        >
          {item.item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={{ height: 217 }}>
        <FlatList
          data={rendomSeed}
          numColumns={3}
          style={{
            marginLeft: width * 0.04,
            marginTop: 30,
          }}
          renderItem={(item) => renderItem(item)}
        />
      </View>
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
        {/* <TouchableOpacity style={styles.verifyView} onPress={verifySeed}> */}
        <TouchableOpacity style={styles.verifyView} onPress={verifySeed}>
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
      {renderSeedPhrae()}
      {recoveryInput()}
      {rendomSeed && renderFlatList()}
      {renderBtnView()}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: "#0D1541",
  },
  seedParentView: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.07,
  },
  lineimg: {
    height: height * 0.022,
    width: width * 0.64,
  },
  desText: {
    fontSize: height / 65,
    color: "#FFFAFA",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },
  // seedPhraseText: {
  //   fontSize: height / 30,
  //   color: "#FFFFFF",
  //   fontFamily: "ClashDisplay-Regular",
  //   fontWeight: "400",
  // },
  recoveryText: {
    fontSize: height / 67,
    color: "#FFFFFF",
    fontWeight: "500",
    fontFamily: "ClashDisplay-Regular",
  },
  gradientViewThree: {
    width: width * 0.47,
    borderColor: "#fff",
    borderRadius: height * 0.05,
    height: height * 0.05,
    alignSelf: "center",
    justifyContent: "center",
    // marginTop: -height * 0.07,
    alignItems: "center",
    justifyContent: "center",
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
    height: height * 0.09,
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
    bottom: 10,
    height: height * 0.1,
    marginHorizontal: width * 0.05,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
  },

  verifyView: {
    height: height * 0.09,
    width: width * 0.4,
    borderRadius: height / 10,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
  },

  flatListView: {
    height: 58,
    width: width * 0.3,
    borderRadius: height / 20,
    backgroundColor: "#27378C",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: height * 0.003,
  },

  recoveryPhraseView: {
    height: height * 0.03,
    width: width * 0.45,
    borderRadius: height / 10,
    backgroundColor: "#0D1541",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // marginTop: 2,
    // position: 'absolute'
  },

  inputView: {
    height: 130,
    width: width * 0.9,
    borderRadius: height / 20,
    backgroundColor: "#27378C",
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

  desTextNew: {
    fontSize: height / 85,
    color: "#FFFAFA",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },

  securityText: {
    fontSize: height / 62,
    color: "#808080",
  },
  button: {
    width: width / 2.6,
    height: height / 12,
    alignItems: "center",
    borderRadius: 40,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
  },
});
