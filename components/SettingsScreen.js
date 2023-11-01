import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import { FIREBASE_DB } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';
import { getDoc, setDoc, doc } from 'firebase/firestore'; // Import these Firestore functions


const SettingsScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  //const navigation = useNavigation();
  const { loggedInUser, dispatch} = useContext(UserContext);

  const [allergenPreferences, setAllergenPreferences] = useState({
    "en:fish": false,
    "en:nuts": false,
    "en:peanuts": false,
    "en:milk": false,
    "en:eggs": false,
    "en:glutten": false,
    "en:soybeans": false,
    "en:celery": false,
    "en:sesame-seeds": false,
    "en:mustard": false,
    "en:sulphur-dioxide-and-sulphites": false
  });

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser.uid);
      console.log("authUser is: ", authUser.uid)
    });
  }, []);

  useEffect(() => {
    // Load user's allergen preferences from Firestore if the user is logged in
    if (user) {
      console.log("loggedin User is: ", user)
      const userId = user;
      const userRef = doc(FIREBASE_DB, 'preferences', userId);

      // Fetch the user's document from Firestore
      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setAllergenPreferences(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user preferences:', error);
        });
    }
  }, [user]);

  const handleAllergenToggle = (allergen) => {

    if(user) {
      const updatedPreferences = { ...allergenPreferences, [allergen]: !allergenPreferences[allergen] };

    // Update the state
    setAllergenPreferences(updatedPreferences);

    // Update the Firestore collection
    const userId = user;
    const userRef = doc(FIREBASE_DB, 'preferences', userId);

    // Set the updated preferences in Firestore
    setDoc(userRef, updatedPreferences)
      .catch((error) => {
        console.error('Error updating user preferences:', error);
      });
    }
    
  };
  

  const handleLogout = () => {
    // Clear user context
    dispatch({ type: 'LOGOUT' });

    // Sign out from Firebase
    FIREBASE_AUTH.signOut();
  };

  return (
    <ScrollView >
    <View style={styles.container}>
      <View style={styles.userIconContainer}>
        {user ? (
          <>
            <TouchableOpacity>
              <FontAwesome name="user" size={50} color="blue" />
            </TouchableOpacity>
            <Text style={styles.userInfoText}>Welcome, {user.displayName}</Text>
            <Text style={styles.allergensTitle}>Allergens:</Text>
            <View style={styles.allergensToggle}>
              <Text>Fish:</Text>
              <Switch
                value={allergenPreferences['en:fish']}
                onValueChange={() => handleAllergenToggle('en:fish')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Nuts:</Text>
              <Switch
                value={allergenPreferences['en:nuts']}
                onValueChange={() => handleAllergenToggle('en:nuts')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Peanuts:</Text>
              <Switch
                value={allergenPreferences['en:peanuts']}
                onValueChange={() => handleAllergenToggle('en:peanuts')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Glutten:</Text>
              <Switch
                value={allergenPreferences['en:glutten']}
                onValueChange={() => handleAllergenToggle('en:glutten')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Milk:</Text>
              <Switch
                value={allergenPreferences['en:milk']}
                onValueChange={() => handleAllergenToggle('en:milk')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Soybeans:</Text>
              <Switch
                value={allergenPreferences['en:soybeans']}
                onValueChange={() => handleAllergenToggle('en:soybeans')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Celery:</Text>
              <Switch
                value={allergenPreferences['en:celery']}
                onValueChange={() => handleAllergenToggle('en:celery')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Eggs:</Text>
              <Switch
                value={allergenPreferences['en:eggs']}
                onValueChange={() => handleAllergenToggle('en:eggs')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Mustard:</Text>
              <Switch
                value={allergenPreferences['en:mustard']}
                onValueChange={() => handleAllergenToggle('en:mustard')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Sesame Seeds:</Text>
              <Switch
                value={allergenPreferences['en:sesame-seeds']}
                onValueChange={() => handleAllergenToggle('en:sesame-seeds')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Sulphur Dioxide And Sulphites:</Text>
              <Switch
                value={allergenPreferences['en:sulphur-dioxide-and-sulphites']}
                onValueChange={() => handleAllergenToggle('en:sulphur-dioxide-and-sulphites')}
              />
            </View>
            <Button onPress={handleLogout} title="Logout" />
          </>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <FontAwesome name="user" size={50} color="blue" />
          </TouchableOpacity>
        )}
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconContainer: {
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
  },
  allergensTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  allergensToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default SettingsScreen;
