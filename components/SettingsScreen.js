import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

const SettingsScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  //const navigation = useNavigation();
  const { loggedInUser, dispatch} = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
    });
  }, []);

  const handleLogout = () => {
    // Clear user context
    dispatch({ type: 'LOGOUT' });

    // Sign out from Firebase
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.userIconContainer}>
        {user ? (
          <>
            <TouchableOpacity>
              <FontAwesome name="user" size={50} color="blue" />
            </TouchableOpacity>
            <Text style={styles.userInfoText}>Welcome, {user.displayName}</Text>
            <Button onPress={handleLogout} title="Logout" />
          </>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <FontAwesome name="user" size={50} color="blue" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconContainer: {
    alignItems: 'top',
  },
  userInfoText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
