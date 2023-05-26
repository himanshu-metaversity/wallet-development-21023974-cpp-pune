import { Text, View } from "react-native";
import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../screens/Splash/Splash";
import PrivacyPolicy from "../screens/Privacy/PrivacyPolicy";
import Onboarding from "../screens/Onboarding/Onboarding";
import SecurityPin from "../screens/Onboarding/SecurityPin";
import SeedGiven from "../screens/SeedPhrase/SeedGiven";
import ReenterPin from "../screens/Onboarding/ReenterPin";
import SeedPhrase from "../screens/SeedPhrase/SeedPhrase";
import SeedFrame from "../screens/SeedPhrase/SeedFrame";
import SecurityAlert from "../screens/Security/SecurityAlert";
import SecurityNotice from "../screens/Security/SecurityNotice";
import Portfolio from "../screens/Portfolio/Portfolio";
import Wallet from "../screens/Wallet/Wallet";
import WalletScroll from "../screens/Wallet/WalletScroll";
import SelectCoin from "../screens/Send/SelectCoin";
import SendDetails from "../screens/Send/SendDetails";
import Recieve from "../screens/Send/Recieve";
import TabStack from "./TabStack";
import DappsBrowser from "../screens/DappsBrowser/DappsBrowser";
import Browser from "../screens/DappsBrowser/Browser";
import Favourites from "../screens/DappsBrowser/Favourites";
import History from "../screens/DappsBrowser/History";
import Swap from "../screens/Swap/Swap";
import SwapHistory from "../screens/Swap/SwapHistory";
import SelectToken from "../screens/Swap/SelectToken";
import SettingsInput from "../screens/Swap/SettingsInput";
import Settings from "../screens/Settings/Settings";
import SettingsWallet from "../screens/Settings/SettingsWallet";
import SettingsSupport from "../screens/Settings/SettingsSupport";
import AboutUs from "../screens/Settings/AboutUs";
import Faq from "../screens/Settings/Faq";
import AddAccount from "../screens/Wallet/AddAccount";
import ImportAcc from "../screens/Wallet/ImportAcc";
import ImportAccount from "../screens/Portfolio/ImportAccount";

const stack = createNativeStackNavigator();

export default class Stack extends Component {
  render() {
    return (
      <stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <stack.Screen name='WalletScroll' component={WalletScroll} /> */}
        <stack.Screen name="Splash" component={Splash} />
        <stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SecurityPin"
          component={SecurityPin}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="ReenterPin"
          component={ReenterPin}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SeedPhrase"
          component={SeedPhrase}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SeedFrame"
          component={SeedFrame}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SecurityAlert"
          component={SecurityAlert}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SecurityNotice"
          component={SecurityNotice}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Wallet"
          component={Wallet}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="AddAccount"
          component={AddAccount}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="ImportAcc"
          component={ImportAcc}
          options={{ headerShown: false }}
        />
        <stack.Screen name="WalletScroll" component={WalletScroll} />
        <stack.Screen
          name="SelectCoin"
          component={SelectCoin}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SendDetails"
          component={SendDetails}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SeedGiven"
          component={SeedGiven}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Recieve"
          component={Recieve}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="DappsBrowser"
          component={DappsBrowser}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Browser"
          component={Browser}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Favourites"
          component={Favourites}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="History"
          component={History}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Swap"
          component={Swap}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SwapHistory"
          component={SwapHistory}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SelectToken"
          component={SelectToken}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SettingsInput"
          component={SettingsInput}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SettingsWallet"
          component={SettingsWallet}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SettingsSupport"
          component={SettingsSupport}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Faq"
          component={Faq}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="ImportAccount"
          component={ImportAccount}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Portfolio"
          component={TabStack}
          options={{ headerShown: false }}
        />
      </stack.Navigator>
    );
  }
}
