import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { enableScreens } from 'react-native-screens';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Intro1 from './screens/Intro1';
import Intro2 from './screens/Intro2';
import Intro3 from './screens/Intro3';
import CategoriesScreen from './screens/CategoriesScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ScheduleEventScreen from './screens/ScheduleEventScreen';
import EventListScreen from './screens/EventListScreen';

enableScreens();

const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarVisible: false, // this is deprecated but keeping it for older versions when testing
        swipeEnabled: true,
        headerShown: false,
        tabBarStyle: { display: 'none' }, // This hides the tab bar Testing purposes
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Intro1" component={Intro1} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Intro2" component={Intro2} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Intro3" component={Intro3} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="LoginScreen" component={LoginScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Signup" component={SignupScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="SceduleEvent" component={ScheduleEventScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="EventList" component={EventListScreen} options={{ tabBarLabel: () => null }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
