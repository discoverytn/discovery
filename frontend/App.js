import 'react-native-gesture-handler';
import React from 'react' ; 
import { StatusBar } from 'expo-status-bar' ;
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { enableScreens } from 'react-native-screens';
import AuthProvider from './context/AuthContext'; 
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Intro1 from './screens/Intro1';
import Intro2 from './screens/Intro2';
import Intro3 from './screens/Intro3';
import CategoriesScreen from './screens/CategoriesScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ExplorerAddPostScreen from "./screens/ExplorerAddPostScreen";
import FavoritesScreen from './screens/FavoritesScreen';
import ScheduleEventScreen from './screens/ScheduleEventScreen';
import EventListScreen from './screens/EventListScreen';
import MainScreen from './screens/MainScreen';
import OnepostScreen from './screens/Onepost';
import BusinessddPostScreen from "./screens/BusinessAddPostScreen"
import ExplorerEditProfileScreen from "./screens/ExplorerEditProfilScreen"
import explorerProfil from "./screens/explorerProfil"
import BusinessEditProfileScreen from "./screens/BusinessEditProfileScreen"
import BusinessProfileScreen from "./screens/BusinessProfileScreen"
import NotificationScreen from "./screens/NotificationScreen"
import OneEventScreen from "./screens/OneEventScreen"
import Chat from "./screens/Chat";
import Chats from './screens/Chats';
import ChatScreen from "./screens/ChatScreen"
import PaymentScreen from './screens/PaymentScreen';
import { StripeProvider } from '@stripe/stripe-react-native'; 




enableScreens();

const Tab = createMaterialTopTabNavigator();

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}

      
    >
      <Tab.Screen name="PaymentScreen" component={PaymentScreen} options={{ tabBarLabel: () => null }} />
                  <Tab.Screen name="Chat" component={Chat} options={{ tabBarLabel: () => null }} />
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: () => null }} />
            {/* <Tab.Screen name="AllChats" component={AllChats} options={{ tabBarLabel: () => null }} /> */}
      {/* <Tab.Screen name="ChatCopie" component={ChatCopie} options={{ tabBarLabel: () => null }} /> */}
      {/* <Tab.Screen name="ChatScreen" component={ChatScreen} options={{ tabBarLabel: () => null }} /> */}

       <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: () => null }} />
       <Tab.Screen name="Intro1" component={Intro1} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Intro2" component={Intro2} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Intro3" component={Intro3} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Signup" component={SignupScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Login" component={LoginScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Main" component={MainScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="BusinessProfileScreen" component={BusinessProfileScreen} options={{ tabBarLabel: () => null }} />
     <Tab.Screen name="BusinessEditProfileScreen" component={BusinessEditProfileScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="explorerProfil" component={explorerProfil} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="ExplorerEditProfilScreen" component={ExplorerEditProfileScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="ExplorerAddPostScreen" component={ExplorerAddPostScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="BusinessddPostScreen" component={BusinessddPostScreen} options={{ tabBarLabel: () => null }} />
     <Tab.Screen name="Onepost" component={OnepostScreen} options={{ tabBarLabel: () => null }} />
     <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: () => null }} />
     <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="ScheduleEvent" component={ScheduleEventScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="EventList" component={EventListScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="NotificationScreen" component={NotificationScreen} options={{ tabBarLabel: () => null }} />
      <Tab.Screen name="OneEvent" component={OneEventScreen} options={{ tabBarLabel: () => null }} />
     

    </Tab.Navigator>
    
  );
}

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51PaKMsRq04W7hPlS4uFB3GuEOnDwEfu97rBTdVw5PmuXh2PVGpTGu1W0E6VPAEGziD59DnVhHNJ7UkKkDQLh5rj600hdyekUS3">
    <NavigationContainer>
      <AuthProvider>
        <MainNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </NavigationContainer>
  </StripeProvider>
  );
}