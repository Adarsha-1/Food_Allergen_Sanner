import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Your App</Text>
      <View style={{ flex: 1 }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          style={buttonStyle}
        >
          <Text>History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Scanner')}
          style={buttonStyle}
        >
          <Text>Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={buttonStyle}
        >
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const buttonStyle = {
  padding: 10,
  backgroundColor: '#3498db',
  borderRadius: 5,
};

export default HomeScreen;
