import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
// import Accordion from "react-native-collapsible-accordion";
const { height, width } = Dimensions.get("screen");

const SECTIONS = [
  {
    title: "Why should I use Wallet?",
    content:
      "Wallet is a software product that gives you access to a curated spectrum of decentralized innovation - buy and store ERC-20 tokens, participate in airdrops and ICOs, collect rare digital art and other collectibles, browse decentralized apps (DApps), shop at stores that accept cryptocurrency, and send crypto to anyone around the world. If you’re looking to simply invest in digital currency, Wallet remains the easiest place to buy, sell, and manage your digital currency.",
    // img: require("../assets/images/ButtonIcons/DropDown.png"),
  },
  {
    title:
      "Can I switch from my existing wallet app like Trust Wallet, Klever Wallet, Metamask etc.?",
    content:
      "Yes, you can. Every wallet uses a private key to secure its assets which you can import into Wallet. Just look for the 12 word recovery phrase or mnemonic in the settings menu of your current wallet and then use that same 12 word phrase to sign into Wallet.",
  },
  {
    title: "How do I protect against losing access to my funds?",
    content:
      "Wallet is a user-controlled, non-custodial product. The app generates a 12 word recovery phrase which is what gives you, and only you, access to your account to move received funds. Wallet will never have access to this seed, meaning that we cannot move funds on your behalf even if you lose access to your recovery phrase.",
  },
  {
    title: "What’s my public wallet address?",
    content:
      "This is a wallet address (similar to a bank account number) that other crypto users can send funds through to you. By simply clicking on Receive, then select the crypto you want to receive funds into, you can then copy your wallet address and share it with the person wanting to send you funds or they can scan your wallet address QR code.",
  },
  {
    title: "How do I Send crypto?",
    content:
      "Click the Send button, select the crypto you want to send, paste or scan the wallet address you wish to send to, input the amount, then confirm your transaction.",
  },
  {
    title: "How do I buy crypto?",
    content:
      "Copy the crypto wallet address you wish to buy crypto for, click on the Buy button on the Portfolio screen, input the amount of you wish to spend, select your desired payment method, click on Buy then paste the wallet address and confirm.",
  },
  {
    title: "How do I Swap cryptocurrencies?",
    content:
      "Click on the Swap icon at the bottom of the screen, select the crypto you want to swap and the one you wish to get, the input the amount you want to swap then click on the Swap button.",
  },
  {
    title: "Why did my Swap fail?",
    content: "Possibly you don’t have enough crypto to cover gas fees.",
  },
  {
    title: "How do I connect to a Dapp?",
    content:
      "Click on the Browser icon at the bottom of the Portfolio screen, then enter the Dapp url you wish to connect to, you should find a Connect button on the dapp site you’ve entered. Make sure you are on the correct blockchain network by clicking the network icon (Binance Smart Chain, Ethereum etc.) that the Dapp runs on.",
  },
  {
    title: "What can I do if I have a technical issue?",
    content: "Email support@pocketwallet.app",
  },
];

class Accordian extends Component {
  state = {
    open: true,
    activeSections: [],
  };

  // _renderSectionTitle = (section) => {
  //   return (
  //     <View>
  //       {/ <Text>{section.content}</Text> /}
  //     </View>
  //   );
  // };

  renderButton = () => {
    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  };

  // ************************* Render Header Function *************************
  _renderHeader = (section) => {
    return (
      <View
        style={{
          backgroundColor: "#0D1541",
          borderTopLeftRadius: height * 20,
          borderTopRightRadius: height * 20,
        }}
      >
        <View style={styles.renderHeaderContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleTxt}>{section.title}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={
                this.state.open
                  ? require("../assets/images/ButtonIcons/DropDown.png")
                  : require("../assets/images/ButtonIcons/DropUp.png")
              }
            />
          </View>
        </View>
        <ImageBackground
          source={require("../assets/images/ButtonIcons/Divider.png")}
          resizeMode="contain"
          style={{
            height: height * 0.01,
            width: width * 0.9,
            alignSelf: "center",
          }}
        ></ImageBackground>
      </View>
    );
  };

  // ************************* Render Content Function *************************
  _renderContent = (section) => {
    return (
      <View style={styles.renderContentMainContainer}>
        <View style={styles.contextTxtContainer}>
          <Text style={styles.contextTxt}>{section.content}</Text>
        </View>
      </View>
    );
  };

  // ************************* Update Sections Function *************************
  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.mainContainer}>
          <ScrollView>
            <View style={{ height: height * 1, marginBottom: height * 0.4 }}>
              <View
                style={{
                  height: height / 1.1,
                  borderRadius: 40,
                  backgroundColor: "#0D1541",
                }}
              >
                <Accordion
                  sections={SECTIONS}
                  activeSections={this.state.activeSections}
                  renderSectionTitle={this._renderSectionTitle}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  onChange={this._updateSections}
                  underlayColor={"#000000"}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default Accordian;

const styles = StyleSheet.create({
  mainContainer: {
    height: height * 1,
    width: width,
    backgroundColor: "#0D1541",
    // backgroundColor: "blue",
    borderRadius: height / 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  renderHeaderContainer: {
    height: height / 18,
    width: width,
    backgroundColor: "#0D1541",
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //backgroundColor: "yellow",
  },
  titleContainer: {
    height: height / 11,
    width: width / 1.1,
    justifyContent: "center",
    //backgroundColor: "green",
  },
  titleTxt: {
    fontSize: height / 57,
    color: "#FFFFFF",
    left: height / 35,
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "500",
    paddingRight: 20,
    // fontFamily: "Poppins-Regular",
  },
  imageContainer: {
    height: height / 20,
    width: width / 18,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
    marginRight: width * 0.05,
  },
  renderContentMainContainer: {
    backgroundColor: "#192255",
    justifyContent: "center",
    alignItems: "center",
    width: width / 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  contextTxtContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: width / 1.1,
  },
  contextTxt: {
    fontSize: height / 55,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "ClashDisplay-Regular",
    fontWeight: "400",
  },
});
