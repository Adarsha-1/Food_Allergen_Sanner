import React from 'react';
import { useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import HomeScreen from '../components/HomeScreen';
import HistoryScreen from '../components/HistoryScreen';
import SettingsScreen from '../components/SettingsScreen';
import BarcodeScanner from '../components/BarcodeScanner';
import AllergenDetails from '../components/AllergenDetails';
import LoginScreen from '../components/LoginScreen';
import ProductDetailsScreen from '../components/ProductDetailsScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Lstack = createNativeStackNavigator();

const SettingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name='History' component={HistoryScreen} />
    <Stack.Screen name='AllergenDetails' component={AllergenDetails}/>
  </Stack.Navigator>
)

const BarcodeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
          name='Scanner'
          options={{
            tabBarLabel: 'Scanner',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name='camera' size={size} color={color} />
            ),
          }}>
          {() => <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />} </Stack.Screen>
    <Stack.Screen name='Details' component={ProductDetailsScreen}></Stack.Screen>
  </Stack.Navigator>
)
const AllergenStack = createNativeStackNavigator();

const SettingsTab = createNativeStackNavigator();

const SettingsTabNavigator = () => (
  <SettingsTab.Navigator
    // screenOptions={({ route }) => ({
    //   tabBarIcon: ({ focused, color, size }) => {
    //     if (route.name === 'Settings') {
    //       return <MaterialCommunityIcons name="account" size={size} color={color} />;
    //     }
    //     return null;
    //   },
    // })}
  >
    <SettingsTab.Screen name='Settingscreen' component={SettingsScreen}  options={{ tabBarLabel: null }}/>
    <SettingsTab.Screen name='Login' component={LoginScreen} options={{ tabBarLabel: null }}/>
  </SettingsTab.Navigator>
);


const AppNavigator = () => {

    const [barcodeData, setBarcodeData] = useState('');

  const handleBarcodeScanned = ({ type, data }) => {
    setBarcodeData(data);
  };
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HistoryScreen') {
              iconName = 'history';
            } else if (route.name === 'Scanner') {
              iconName = 'camera';
            } else if (route.name === 'SettingsScreen') {
              iconName = 'cog';
            }

            // You can customize the icon size and color here
            return (
              <FontAwesome
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name='HistoryScreen'
          component={HistoryStack}
          options={{ tabBarLabel: 'History', headerShown: false }}
        />
        <Tab.Screen
          name='Scanner'
          options={{
            tabBarLabel: 'Scanner',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name='camera' size={size} color={color} />
            ),
          }}>
          {() => <BarcodeScanner onBarcodeScanned={handleBarcodeScanned} />}
        </Tab.Screen>


        <Tab.Screen
          name='SettingsScreen'
          component={SettingsStack}
          options={{ tabBarLabel: 'Settings', headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
};

export default AppNavigator;
