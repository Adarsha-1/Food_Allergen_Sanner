import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../components/SettingsScreen';
import ProductDetailsScreen from '../components/ProductDetailsScreen';
import ScannerScreen from '../components/ScannerScreen';
import LoginScreen from '../components/LoginScreen';
import HistoryScreen from '../components/HistoryScreen';
import AllergenDetails from '../components/AllergenDetails';
import Search from '../components/Search';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import ScannerScreen from './ScannerScreen';
// import SettingsScreen from './SettingsScreen';
// import ProductDetailsScreen from './ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner" component={ScannerScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
};

const SettingsNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    );
  };

// Combine Search and AllergenDetails in the same stack
const SearchAllergenStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Searchs" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="AllergenDetails" component={AllergenDetails} options={{ headerShown: true }} />
      </Stack.Navigator>
    );
  };
  

const HistoryNavigator = () => {
return (
    <Stack.Navigator>
    <Stack.Screen name="Histor" component={HistoryScreen} />
    <Stack.Screen name="Details" component={AllergenDetails} options={{ headerShown: true }} />
    </Stack.Navigator>
);
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'History') {
              iconName = focused ? 'history' : 'history';
            } else if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'SettingsScreen') {
              iconName = focused ? 'settings' : 'settings';
            } else if (route.name === 'search') {
              iconName = focused ? 'search' : 'search';
            }

            // You can return any component that you like here!
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="History" component={HistoryNavigator} options={{headerShown: false }} />
        <Tab.Screen name="Home" component={HomeNavigator} options={{headerShown: false }} />
        <Tab.Screen name="SettingsScreen" component={SettingsNavigator} options={{headerShown: false }}/>
        <Tab.Screen name="search" component={SearchAllergenStack}/>
        {/* <Tab.Screen name="Login" component={LoginScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
