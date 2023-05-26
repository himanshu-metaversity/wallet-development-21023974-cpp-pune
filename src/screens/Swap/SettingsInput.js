import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Dimensions, TextInput } from 'react-native'
import React from 'react'
const { height, width } = Dimensions.get("screen")

const SettingsInput = (props) => {

  function renderHeader() {
    return (
      <View style={styles.securityView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <ImageBackground source={require("../../assets/images/Onbording/Oval.png")} style={styles.imgBack} resizeMode="contain">
            <Image source={require("../../assets/images/ButtonIcons/Back.png")} resizeMode="contain"></Image>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.pinView}>
          <Text style={styles.newPinText}>Swap</Text>
        </View>
      </View>
    )
  }

  function swapSection() {
    return (
      <View>
        <TouchableOpacity onPress={() => props.navigation.navigate("SelectToken")} style={{ height: height * 0.2, width: width * 1, backgroundColor: "#192255", borderRadius: 25, marginTop: height * 0.05 }}>
          <View style={{ flexDirection: "row", marginTop: height * 0.023, marginLeft: width * 0.05 }}>
            <Image source={require("../../assets/images/Bitcoins/Bitcoinof.png")} resizeMode="contain" style={{ height: height * 0.07, width: width * 0.15 }}></Image>
            <View style={{ flexDirection: "row", marginLeft: width * 0.01, alignItems: "center", justifyContent: "space-between", width: width * 0.7 }}>
              <View style={{ justifyContent: "space-between", height: height * 0.06, marginLeft: width * 0.02 }}>
                <Text style={{ fontSize: height / 42, color: "#FFFFFF", fontFamily: "Poppins-Regular", fontWeight: "500" }}>Bitcoin</Text>
                <Text style={{ fontSize: height / 65, color: "#A2A2AA", fontFamily: "Poppins-Regular", fontWeight: "500" }}>1 BTC = $34,377.08</Text>
              </View>
              <View style={{ justifyContent: "space-between", height: height * 0.05, marginRight: width * 0.01 }}>
                <Text style={{ fontSize: height / 60, color: "#FFFFFF", fontFamily: "Poppins-Regular", fontWeight: "500" }}>You Send</Text>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: width * 0.06, marginTop: height * 0.02 }}>
            <TextInput keyboardType="numeric" style={{
              fontSize: height / 35, color: "#FFFFFF", fontFamily: "ClashDisplay-Regular",
              fontWeight: "500"
            }}>0.00</TextInput>
            <Text style={{ fontSize: height / 65, color: "#A2A2AA", fontFamily: "Poppins-Regular", fontWeight: "500" }}>Balance : 1 BTC</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ height: height * 0.2, width: width * 1, backgroundColor: "#192255", borderRadius: 25, marginTop: height * 0.01 }}>
          <View style={{ flexDirection: "row", marginTop: height * 0.023, marginLeft: width * 0.05 }}>
            <Image source={require("../../assets/images/Bitcoins/Ripple.png")} resizeMode="contain" style={{ height: height * 0.07, width: width * 0.15 }}></Image>
            <View style={{ flexDirection: "row", marginLeft: width * 0.01, alignItems: "center", justifyContent: "space-between", width: width * 0.7 }}>
              <View style={{ justifyContent: "space-between", height: height * 0.06, marginLeft: width * 0.02 }}>
                <Text style={{ fontSize: height / 42, color: "#FFFFFF", fontFamily: "Poppins-Regular", fontWeight: "500" }}>Ripple</Text>
                <Text style={{ fontSize: height / 65, color: "#A2A2AA", fontFamily: "Poppins-Regular", fontWeight: "500" }}>1 BTC = $34,377.08</Text>
              </View>
              <View style={{ justifyContent: "space-between", height: height * 0.05, marginRight: width * 0.01 }}>
                <Text style={{ fontSize: height / 60, color: "#FFFFFF", fontFamily: "Poppins-Regular", fontWeight: "500" }}>You Get</Text>
              </View>
            </View>
          </View>
          <View style={{ marginLeft: width * 0.06, marginTop: height * 0.02 }}>
            <TextInput keyboardType="numeric" style={{
              fontSize: height / 35, color: "white", color: "#FFFFFF", fontFamily: "ClashDisplay-Regular",
              fontWeight: "500"
            }}>0.00</TextInput>
            <Text style={{ fontSize: height / 65, color: "#A2A2AA", fontFamily: "Poppins-Regular", fontWeight: "500" }}>Balance : 1 BTC</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", bottom: height * 0.17, alignSelf: "center", marginLeft: width * 0.06, width: "100%", alignItems: "center", paddingLeft: width * 0.30 }}>
          <Image source={require("../../assets/images/Swap/Swap.png")} style={{ width: width * 0.15, height: height * 0.07, borderRadius: height / 20 }}></Image>
        </TouchableOpacity>
      </View>
    )
  }


  function renderSWapButton() {
    return (
      <TouchableOpacity style={styles.continueButton} onPress={() => props.navigation.navigate("Swap")}>
        <Text style={styles.comntinueText}>Swap</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.backgroundView}>
      {renderHeader()}
      {swapSection()}
      {renderSWapButton()}
    </View>
  )
}

export default SettingsInput

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#0D1541',
  },

  securityView: {
    marginTop: height * 0.03,
    flexDirection: "row",
    marginLeft: width * 0.02,
    alignItems: "center",
    justifyContent: "space-between",
    width: "55%"
  },

  imgBack: {
    height: height * 0.08,
    width: width * 0.14,
    justifyContent: "center",
    alignItems: "center"
  },

  comntinueText: {
    fontSize: height / 40,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    fontWeight: "500"
  },

  continueButton: {
    backgroundColor: "#27378C",
    width: width * 0.9,
    height: height * 0.08,
    borderRadius: 50,
    marginTop: height * 0.10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },

  pinView: {
    justifyContent: "center",
    alignItems: "center"
  },

  newPinText: {
    fontSize: height * 0.035,
    color: "#FFFFFF",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400"
  },

})
