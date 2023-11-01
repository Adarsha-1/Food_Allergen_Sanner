import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button, Image, ScrollView, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from './UserContext';
import { FIREBASE_DB } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

const allergenIcons = {
  'en:gluten': require('../assets/Allergen/gluten.png'),
  'en:milk': require('../assets/Allergen/milk.png'),
  'en:peanuts': require('../assets/Allergen/peanuts.png'),
  'en:soybeans': require('../assets/Allergen/soy.png'),
  'en:fish': require('../assets/Allergen/fish.png'),
  'en:celery': require('../assets/Allergen/celery.png'),
  'en:eggs': require('../assets/Allergen/eggs.png'),
  'en:sesame-seeds': require('../assets/Allergen/sesame-seeds.png'),
  'en:sulphur-dioxide-and-sulphites': require('../assets/Allergen/sulphur-dioxide-and-sulphites.png'),
  'en:mustard': require('../assets/Allergen/mustard.png'),
  // Add more allergens and their corresponding icons as needed
};

export default function BarcodeScanner({ onBarcodeScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [allergenDetails, setAllergenDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [highlightBarcode, setHighlightBarcode] = useState(false); // State to highlight the barcode area
  const navigation = useNavigation();
  const [productName, setProductName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [userAllergens, setUserAllergens] = useState('');

  //const productAllergens = ['en:fish', 'en:sesame-foods', 'en:mustard', 'en:sulphur-dioxide-and-sulphites', 'en:eggs'];

  //const {state} = useUser();
  //const user = state.loginUser;
  const { loggedInUser, dispatch} = useContext(UserContext);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  

  // Function to check if a product contains preferred allergens
  const containsPreferredAllergen = (userPreferences, productAllergens) => {
    for (const allergen of productAllergens) {
      // Extract the allergen key (removing the "en:" prefix) and replace underscores with hyphens
      // const cleanAllergen = allergen.replace('en:', '').replace('-', '_');
      console.log("clean Allergens are: ", allergen)
      console.log("clean Allergens peanuts: ", userPreferences["en:peanuts"])
      console.log("user preferences are: ", userPreferences)

      if (userPreferences["en:peanuts"]) {
        // If the user has this allergen as preferred, return true
        return true;
      }
    }

    // If none of the product allergens match the preferred allergens, return false
    return false;
  };

  // What happens when we scan the barcode
  const handleBarCodeScanned = async ({ type, data }) => {
    if(scanned) {
      return;
    }
    setScanned(true);
    setText(data);
    onBarcodeScanned({ type, data });

    // Highlight the barcode area
    setHighlightBarcode(true);

    //calling the open food facts API to get allergen details
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);

      if (response.data.status === 1) {
        const productDetails = response.data.product;
        setAllergenDetails(productDetails);
        setShowDetails(true); // Show allergen details
        //flag = true;

        //added firebase code
        console.log("user uid inside console is: ", loggedInUser.uid);
      //console.log("inside flag: ", allergenDetails)
        if(loggedInUser) {
          //console.log("allergenDetails are: ", productDetails);
          const productData = {
            barcode: data,
            //productName: allergenDetails.product_name,
            scannedAt: new Date(),
            imageUrl: productDetails.image_url,
            productName: productDetails.product_name,
            uid: loggedInUser.uid,
          }

          // const todoRef = FIREBASE_DB.collection('products');

          // todoRef.add(productData);

          const productsRef = collection(FIREBASE_DB, 'users');
          const userRef = doc(FIREBASE_DB, 'preferences', loggedInUser.uid);

          try {
            const [addProductResponse, userPreferencesSnapshot] = await Promise.all([
              addDoc(productsRef, productData),
              getDoc(userRef),
            ]);
            console.log('data submitted')
            if (userPreferencesSnapshot.exists()) {
              const userAllergens = userPreferencesSnapshot.data();
              console.log('User allergens are:', userAllergens);
        
              // Check if the product contains preferred allergens
              const allergies = productDetails.allergens_tags;
              const hasPreferredAllergens = containsPreferredAllergen(userAllergens, allergies);
              console.log('Allergies are:', hasPreferredAllergens);
        
              if (hasPreferredAllergens) {
                // Display an alert with red text to indicate an emergency or danger
                setTimeout(() => {
                  Alert.alert(
                    'Allergen Alert',
                    'This product contains your preferred allergens.',
                    [
                      { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    {
                      titleStyle: {
                        color: 'red', // Set the title text color to red
                      },
                      messageStyle: {
                        color: 'red', // Set the message text color to red
                      },
                    }
                  );
                }, 1300);
              }
            } else {
              console.log("User preferences document doesn't exist.");
            }
          } catch (error) {
            console.error('Error adding product data to Firestore or fetching user preferences:', error);
          }

          // Add the product data to the collection
          // try {
          //   await addDoc(productsRef, productData).then(() => {
          //     console.log('data submitted')
          //   }).catch((error) => {
          //     console.log(error);
          //   });
          //   console.log("Product data added to Firestore:", productData);
          // } catch (error) {
          //   console.error("Error adding product data to Firestore:", error);
          // }

          // try {
          //   const docSnap = await getDoc(userRef);

          //   if (docSnap.exists()) {
          //     const data = docSnap.data();
          //     console.log("User allergens are: ", data);
          //     setUserAllergens(data);
          //     // setAllergenPreferences(data);
          //   } else {
          //     console.log("User preferences document doesn't exist.");
          //   }
          // } catch (error) {
          //   console.error('Error fetching user preferences:', error);
          // }

          // //console.log("allergens are: ", containsPreferredAllergen(userAllergens, productDetails.allergens_tags));

          // // Check if the product contains preferred allergens
          // const allergies = productDetails.allergens_tags;
          // const a = containsPreferredAllergen(userAllergens, allergies);
          // console.log("Allergies are: ", a);
          // if (a) {
          //   // Display an alert with red text
          //   setTimeout(() => {
          //     Alert.alert('Allergen Alert', 'This product contains your preferred allergens.', [
          //       { text: 'OK', onPress: () => console.log('OK Pressed') },
          //     ]);
          //   }, 2000);
          // }
        }
        //navigation.navigate('ProductDetails', { productDetails: productDetails, userAllergens: userAllergens });
      } else {
        setAllergenDetails('No product information found.');
        setShowDetails(true); // Show allergen details
      }
    } catch (error) {
      console.error("Error fetching product details: ", error);
      setAllergenDetails('Error fetching product details');
      setShowDetails(true); // Show allergen details
    }
  };

  const handleGoBack = () => {
    setScanned(false);
    setText('Not yet scanned');
    setAllergenDetails(null);
    setShowDetails(false); // Hide allergen details
    setHighlightBarcode(false);
  };

  const renderAllergen = (allergen) => {
    if (allergenIcons[allergen]) {
      const iconSource = allergenIcons[allergen];
      return (
        <View style={styles.allergenItem} key={allergen}>
          <Image source={iconSource} style={styles.allergenIcon} />
          <Text style={styles.allergenText}>{allergen}</Text>
        </View>
      );
    }
    return null;
  };

  // Check permissions and return the scanner component or allergen details
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  if (!showDetails) {
    return (
      <View style={styles.container}>
        <View style={[styles.barcodebox, highlightBarcode && styles.highlightedBarcode]}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Text style={styles.maintext}>{text}</Text>
      </View>
  )} else {
    return (
      <View style={styles.container}>
        <View style={styles.goBackButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="black"
            onPress={handleGoBack}
          />
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.productDetailsContainer}>
            <Text style={styles.title}>Product Details</Text>
            <Image style={styles.productImage} source={{ uri: allergenDetails.image_url }} />
            <Text style={styles.productName}>{allergenDetails.product_name}</Text>
            <Text style={styles.barcode}>Barcode: {allergenDetails.code}</Text>
            {allergenDetails.allergens_tags.length > 0 ? (
              <View>
                <Text style={styles.details}>Allergen Information:</Text>
                {allergenDetails.allergens_tags.map((allergen) => renderAllergen(allergen))}
              </View>
            ) : (
              <Text style={styles.noDetails}>No allergen information found.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
  },
  highlightedBarcode: {
    borderColor: 'lime', // Highlight the barcode area with a green border
    borderWidth: 2,
  },
  goBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  productDetails: {
    alignItems: 'center',
  },
  productDetailsContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  productName: {
    fontSize: 20, // Changed font size
    marginBottom: 10,
  },
  barcode: {
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    fontSize: 18, // Highlighted "Allergen Information" with a larger font size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noDetails: {
    fontSize: 16,
    color: 'red',
    margin: 10,
  },
  allergenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  allergenIcon: {
    width: 24,
    height: 24,
  },
  allergenText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
