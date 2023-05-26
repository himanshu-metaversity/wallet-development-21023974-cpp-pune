import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
const { height, width } = Dimensions.get("screen");

const Favourites = (props) => {
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
          <Text style={styles.newPinText}>Favorites</Text>
        </View>
      </View>
    );
  }

  function renderFavourites() {
    return (
      <View>
        <Text style={styles.favrtText}>You don't have any favourites yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {renderFavourites()}
    </View>
  );
};

export default Favourites;

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
    width: "58%",
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

  favrtText: {
    fontSize: height / 45,
    color: "white",
    alignSelf: "center",
    marginTop: height * 0.05,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
  },
});
