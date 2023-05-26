import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { generateMnemonic } from "../../utils/binance";
const { height, width } = Dimensions.get("screen");

const SeedPhrase = (props) => {
  const [seed, setSeed] = useState();
  const [mnemonic, setMnemonic] = useState();

  useEffect(() => {
    getMnemonic();
  }, []);

  const getMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    setSeed(mnemonic.split(" "));
  };
  const renderItem = (item) => {
    return (
      <TouchableOpacity style={styles.flatListView}>
        <Text
          style={{
            color: "white",
            fontWeight: "500",
            fontFamily: "Poppins-Regular",
            // marginLeft: width * 0.03,
            fontSize: height / 50,
          }}
        >
          {item.index + 1}. {item.item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        data={seed}
        numColumns={3}
        style={{ marginLeft: width * 0.04, marginTop: height * 0.05 }}
        renderItem={renderItem}
      />
    );
  };

  const renderSeedPhrae = () => {
    return (
      <View style={styles.seedParentView}>
        <Text style={styles.seedPhraseText}>Seed Phrase</Text>
        <Text style={styles.desText}>
          Please write down your 12 Words Back-Up Seed on a {"\n"}paper, in the
          exact same order as shown below,and {"\n"}store the paper with the
          Seed in a safe place. Your 12
        </Text>
        <Text style={styles.desTextNew}>
          Words Seed and Private Key give direct access to {"\n"}your account
          and funds.Do NOT give this information
        </Text>
        <Text style={styles.desTextNew}>to ANYONE.</Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Onboarding")}
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

  const renderBtn = () => {
    return (
      <TouchableOpacity
        style={styles.btnView}
        onPress={() =>
          props.navigation.navigate("SeedGiven", { seed, mnemonic })
        }
      >
        <Text style={styles.btnViewtext}>I've written it down</Text>
      </TouchableOpacity>
    );
  };

  const renderNewSeed = () => {
    return (
      <TouchableOpacity style={styles.newSeedView} onPress={getMnemonic}>
        <Image
          source={require("../../assets/images/ButtonIcons/Vector.png")}
          style={{ height: 16, width: 16 }}
          resizeMode="contain"
        ></Image>
        <Text
          style={{
            color: "#707070",
            fontSize: height / 54,
            marginLeft: width * 0.03,
            fontFamily: "ClashDisplay-Regular",
            fontWeight: "500",
          }}
        >
          GET NEW SEED
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderSeedPhrae()}
      {seed && renderFlatList()}
      {renderBtn()}
      {renderNewSeed()}
    </View>
  );
};

export default SeedPhrase;

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

  newSeedView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: height * 0.02,
    alignSelf: "center",
  },

  seedPhraseText: {
    fontSize: height / 20,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },

  flatListView: {
    height: height * 0.07,
    width: width * 0.29,
    borderRadius: height / 20,
    backgroundColor: "#192255",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: height * 0.004,
  },

  btnView: {
    height: height * 0.09,
    width: width * 0.7,
    borderRadius: height / 20,
    backgroundColor: "#27378C",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: height * 0.08,
  },

  btnViewtext: {
    fontSize: height / 38,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },

  desText: {
    fontSize: height / 70,
    color: "#FFFAFA",
    marginTop: height * 0.02,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  desTextNew: {
    fontSize: height / 70,
    color: "#FFFAFA",
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.02,
    alignItems: "center",
    justifyContent: "space-between",
    width: "65%",
  },

  imgBack: {
    height: height * 0.07,
    width: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
  },
});
