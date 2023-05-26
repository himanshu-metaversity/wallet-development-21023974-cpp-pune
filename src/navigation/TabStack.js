import * as React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import Portfolio from '../screens/Portfolio/Portfolio';
import Wallet from '../screens/Wallet/Wallet';
import Swap from '../screens/Swap/Swap';
import Settings from '../screens/Settings/Settings';
import DappsBrowser from '../screens/DappsBrowser/DappsBrowser';
const { height, width } = Dimensions.get("screen")

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabBarShowLabel: false
      }}
      initialRouteName="Portfolio"
      activeColor="#f0edf6"
      inactiveColor="#3e2465"
      barStyle={{ paddingBottom: 48 }}

      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          backgroundColor: '#0D1541',
          height: height * 0.09,
          borderTopLeftRadius: height / 30,
          borderTopRightRadius: height / 30,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          <Image>

          </Image>
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? require('../assets/images/BottomTabIcons/GlobeOff.png')
              : require('../assets/images/BottomTabIcons/Hexaon.png');
          } else if (route.name === 'Settings') {
            iconName = focused
              ? require('../assets/images/BottomTabIcons/GlobeOff.png')
              : require('../assets/images/BottomTabIcons/Hexaon.png');
          }

          // You can return any component that you like here!
          return <Image name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Portfolio"
        component={Portfolio}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <View style={{ height: height * 0.07, width: width * 0.18, backgroundColor: '#192255', borderRadius: height / 12, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={
                    focused
                      ? require('../assets/images/BottomTabIcons/WalletOn.png')
                      : require('../assets/images/BottomTabIcons/WalletOff.png')
                  }
                  style={{
                    height: size,
                    width: size,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : <Image
              source={
                focused
                  ? require('../assets/images/BottomTabIcons/GlobeOn.png')
                  : require('../assets/images/BottomTabIcons/WalletOff.png')
              }
              style={{
                height: size,
                width: size,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Swap"
        component={Swap}
        options={{
          headerShown: false,
          tabBarShowLabel: false,

          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <View style={{ height: height * 0.07, width: width * 0.18, backgroundColor: '#192255', borderRadius: height / 12, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={
                    focused
                      ? require('../assets/images/BottomTabIcons/TransOn.png')
                      : require('../assets/images/BottomTabIcons/TransOff.png')
                  }
                  style={{
                    height: size,
                    width: size,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : <Image
              source={
                focused
                  ? require('../assets/images/BottomTabIcons/TransOn.png')
                  : require('../assets/images/BottomTabIcons/TransOff.png')
              }
              style={{
                height: size,
                width: size,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="DappsBrowser"
        component={DappsBrowser}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <View style={{ height: height * 0.07, width: width * 0.18, backgroundColor: '#192255', borderRadius: height / 12, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={
                    focused
                      ? require('../assets/images/BottomTabIcons/GlobeOn.png')
                      : require('../assets/images/BottomTabIcons/GlobeOff.png')
                  }
                  style={{
                    height: size,
                    width: size,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : <Image
              source={
                focused
                  ? require('../assets/images/BottomTabIcons/GlobeOn.png')
                  : require('../assets/images/BottomTabIcons/GlobeOff.png')
              }
              style={{
                height: size,
                width: size,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <View style={{ height: height * 0.07, width: width * 0.18, backgroundColor: '#192255', borderRadius: height / 12, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={
                    focused
                      ? require('../assets/images/BottomTabIcons/Hexaon.png')
                      : require('../assets/images/BottomTabIcons/HexaOff.png')
                  }
                  style={{
                    height: size,
                    width: size,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : <Image
              source={
                focused
                  ? require('../assets/images/BottomTabIcons/Hexaon.png')
                  : require('../assets/images/BottomTabIcons/HexaOff.png')
              }
              style={{
                height: size,
                width: size,
              }}
              resizeMode="contain"
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
}

