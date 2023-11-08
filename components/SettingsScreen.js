import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import { FIREBASE_DB } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
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
      setUser(authUser);
      //console.log("authUser is: ", authUser)
    });
  }, []);

  useEffect(() => {
    // Load user's allergen preferences from Firestore if the user is logged in
    if (user) {
      console.log("loggedin User is: ", user.uid)
      const userId = user.uid;
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
    const userId = user.uid;
    const userRef = doc(FIREBASE_DB, 'preferences', userId);

    // Set the updated preferences in Firestore
    setDoc(userRef, updatedPreferences)
      .catch((error) => {
        console.error('Error updating user preferences:', error);
      });
    }
    
  };
  

  const handleLogout = () => {

    console.log("entered logout");
    // Clear user context
    dispatch({ type: 'LOGOUT' });

    // Sign out from Firebase
    FIREBASE_AUTH.signOut();
    console.log("out");
    setAllergenPreferences({
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
  };

  const switchColors = {
    trackFalse: "#767577",
    trackTrue: "tomato",
    thumbFalse: "#f4f3f4",
    thumbTrue: "#f4f3f4",
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.userIconContainer}>
          <TouchableOpacity 
            onPress={() => !user && navigation.navigate('Login')} // Navigate to Login only if user does not exist
            style={styles.loginSignupContainer}
          >
            <Text style={styles.loginSignupText}>
              {user ? "Welcome" : 'Login/Signup'}
            </Text>
          </TouchableOpacity>
        </View>

        
      </View>

      {/* ... the rest of your render code ... */}

      <Text style={styles.allergensTitle}>Allergens:</Text>
            <View style={styles.allergensToggle}>
              <Text>Fish:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:fish'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:fish']}
                onValueChange={() => handleAllergenToggle('en:fish')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Nuts:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:nuts'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:nuts']}
                onValueChange={() => handleAllergenToggle('en:nuts')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Peanuts:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:peanuts'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:peanuts']}
                onValueChange={() => handleAllergenToggle('en:peanuts')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Glutten:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:glutten'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:glutten']}
                onValueChange={() => handleAllergenToggle('en:glutten')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Milk:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:milk'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:milk']}
                onValueChange={() => handleAllergenToggle('en:milk')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Soybeans:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:soybeans'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:soybeans']}
                onValueChange={() => handleAllergenToggle('en:soybeans')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Celery:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:celery'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:celery']}
                onValueChange={() => handleAllergenToggle('en:celery')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Eggs:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:eggs'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:eggs']}
                onValueChange={() => handleAllergenToggle('en:eggs')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Mustard:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:mustard'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:mustard']}
                onValueChange={() => handleAllergenToggle('en:mustard')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Sesame Seeds:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:sesame-seeds'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:sesame-seeds']}
                onValueChange={() => handleAllergenToggle('en:sesame-seeds')}
              />
            </View>
            <View style={styles.allergensToggle}>
              <Text>Sulphur Dioxide And Sulphites:</Text>
              <Switch
                trackColor={{ false: switchColors.trackFalse, true: switchColors.trackTrue }}
                thumbColor={allergenPreferences['en:sulphur-dioxide-and-sulphites'] ? switchColors.thumbTrue : switchColors.thumbFalse}
                value={allergenPreferences['en:sulphur-dioxide-and-sulphites']}
                onValueChange={() => handleAllergenToggle('en:sulphur-dioxide-and-sulphites')}
              />
            </View>
            {
              user ? (<Button onPress={handleLogout} title="Logout" />) : (<></>)
            }
            
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 50, // Add padding to the top to push the content down
    backgroundColor: 'white', // Assuming a white background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loginSignupText: {
    fontSize: 16,
    color: 'black',
  },
  userIconContainer: {
    alignItems: 'center',
    marginBottom: 30, // Add some space before the next section
    padding: 20, // Adding padding around the user icon container
    backgroundColor: '#98A0A3', // The color in your sketch looks like a purple variant
    width: '100%', // Make sure it fills the width
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20, // Rounded corners at the bottom
    borderBottomRightRadius: 20,
  },
  userInfoText: {
    fontSize: 16,
    color: 'white', // Text color for better contrast against the purple background
    marginVertical: 10, // Give some vertical space
  },
  allergensTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20, // Increased top margin
    marginLeft: 20, // Add margin to align with the switches
  },
  allergensToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This will push the switch to the right
    marginVertical: 10,
    paddingHorizontal: 20, // Horizontal padding to align with the title
  },
  logoutButton: {
    backgroundColor: 'tomato', // A grey color for the button
    color: 'black', // Text color for the button
    borderRadius: 20, // Rounded corners for the button
    paddingVertical: 10, // Vertical padding for the button
    paddingHorizontal: 30, // Horizontal padding
    marginTop: 30, // Top margin to separate it from the toggles
    alignSelf: 'center', // Center the button in the container
  },
});




export default SettingsScreen;
