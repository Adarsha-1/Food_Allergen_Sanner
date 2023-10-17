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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AllergenStack = createNativeStackNavigator();

const AllergenStackNavigator = () => (
    <AllergenStack.Navigator>
      <AllergenStack.Screen name="AllergenDetails" component={AllergenDetails} />
    </AllergenStack.Navigator>
  );

const AppNavigator = () => {

    const [barcodeData, setBarcodeData] = useState('');

  const handleBarcodeScanned = ({ type, data }) => {
    setBarcodeData(data);
  };
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="History" component={HistoryScreen} />
    //     <Stack.Screen name="Scanner" component={ScannerScreen} />
    //     <Stack.Screen name="Settings" component={SettingsScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    // <Tab.Navigator>
    //     {/* <Tab.Screen name='Home' component={HomeScreen} /> */}
    //     <Tab.Screen name='History' component={HistoryScreen} />
    //     <Tab.Screen name='Scanner' component={ScannerScreen} />
    //     <Tab.Screen name='Settings' component={SettingsScreen} />
    // </Tab.Navigator>

    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'History') {
              iconName = 'history';
            } else if (route.name === 'Scanner') {
              iconName = 'camera';
            } else if (route.name === 'Settings') {
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
          name='History'
          component={HistoryScreen}
          options={{ tabBarLabel: 'History' }}
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
          name='Settings'
          component={SettingsScreen}
          options={{ tabBarLabel: 'Settings' }}
        />
      </Tab.Navigator>

      {/* <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for AllergenDetails
        }}>
        <Stack.Screen name='AllergenDetails' component={AllergenDetails} />
      </Stack.Navigator> */}
    </NavigationContainer>
    
  );
};

export default AppNavigator;
