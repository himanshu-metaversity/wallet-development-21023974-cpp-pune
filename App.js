/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { SafeAreaView } from "react-native";
import React, { Component } from "react";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import Stack from "./src/navigation/Stack";
import { RefreshContextProvider } from "./src/contexts/RefreshContext";
import { WalletContextProvider } from "./src/contexts/WalletContext";
import Toast from "react-native-toast-message";
export class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <RefreshContextProvider>
            <WalletContextProvider>
              <Stack />
            </WalletContextProvider>
          </RefreshContextProvider>
          <Toast position="top" bottomOffset={20} />
        </SafeAreaView>
      </NavigationContainer>
    );
  }
}

export default App;
