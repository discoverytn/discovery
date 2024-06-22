import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { enableScreens } from 'react-native-screens';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Intro1 from './screens/Intro1'
import Intro2 from './screens/Intro2'

enableScreens();

const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarVisible: false, 
        swipeEnabled: true,
        headerShown: false,
      }}
    >
      <Tab.Screen name=" " component={HomeScreen} />
      <Tab.Screen name="  " component={LoginScreen} />
      <Tab.Screen name="   " component={SignupScreen} />
      <Tab.Screen name="    " component={Intro1} />
      <Tab.Screen name="     " component={Intro2} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
