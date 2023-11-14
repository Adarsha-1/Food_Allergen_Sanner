import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, Alert } from 'react-native';
import { FIREBASE_DB } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../context/UserContext';


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


const ProductDetailsScreen = ({ route }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const { barcode } = route.params;
  const { loggedInUser } = useContext(UserContext);
  const warningIcon = require('../assets/Allergen/warning.png'); // ensure you have a warning icon in your assets


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const json = await response.json();
        setProductDetails(json.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [barcode]);

  useEffect(() => {
    // Function to save product to Firestore
    const saveProductToFirestore = async (product) => {
      if (loggedInUser) {
        if(product.product_name) {
            const productData = {
              barcode: barcode,
              scannedAt: new Date(),
              imageUrl: product.image_url,
              productName: product.product_name,
              uid: loggedInUser.uid,
          }
          const productsRef = collection(FIREBASE_DB, 'users');
          try {
              await addDoc(productsRef, productData).then(() => {
                      console.log('data submitted')
                    }).catch((error) => {
                      console.log(error);
                    });
            console.log('Product saved to Firestore');
          } catch (error) {
            console.error("Error saving product to Firestore", error);
          }
        }
        
      }
    };

    if (productDetails) {
      saveProductToFirestore(productDetails);
    }
  }, [productDetails, loggedInUser]);

  const containsPreferredAllergen = (userPreferences, productAllergens) => {
    for (const allergen of productAllergens) {
      // Extract the allergen key (removing the "en:" prefix) and replace underscores with hyphens
      // const cleanAllergen = allergen.replace('en:', '').replace('-', '_');
      console.log("Entered preferred allergen")

      if (userPreferences[allergen]) {
        // If the user has this allergen as preferred, return true
        return true;
      }
    }

    // If none of the product allergens match the preferred allergens, return false
    return false;
  };


  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (loggedInUser) {
        try {
          const preferencesRef = doc(FIREBASE_DB, 'preferences', loggedInUser.uid);
          const docSnap = await getDoc(preferencesRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserPreferences(data);
              console.log("user preferences are: ", data)
              
              // Check for allergies if product details are already fetched
                // Check for allergies if product details are already fetched
                if (productDetails && productDetails.allergens_tags) {
                    console.log("Allerges are: ", productDetails.allergens_tags);
                    // Now we need to filter based on the allergy keys that have a true value
                    const matchingAllergens = productDetails.allergens_tags.filter(allergen => 
                    data[allergen] === true
                    );
                    const isPresent = containsPreferredAllergen(data, productDetails.allergens_tags);

                    // If there are matching allergens, show an alert
                    // If there are matching allergens, show an alert
                    if (matchingAllergens.length > 0) {
                        Alert.alert(
                        "Allergy Warning",
                        `You have allergies to some ingredients in this product: ${matchingAllergens.join(', ')}.`,
                        [{ text: "OK" }]
                        );
                    }
                    
                }
              // setAllergenPreferences(data);
            } else {
                console.log('No user preferences found');
            }
        } catch (error) {
          console.error('Error fetching user preferences:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [productDetails, loggedInUser]);


  const renderAllergen = (allergen) => {
    const iconSource = allergenIcons[allergen];
    const isAllergic = userPreferences && userPreferences[allergen] === true;

    // If userPreferences does not exist, we can assume the user is not logged in or preferences are not set
    const isLoggedIn = userPreferences != null; 
    // const isAllergic = containsPreferredAllergen(userPreferences, allergen);
  
    return (
      <View style={styles.allergenItem} key={allergen}>
        <Image source={iconSource} style={styles.allergenIcon} />
        <Text style={styles.allergenText}>{allergen}</Text>
        {isLoggedIn && isAllergic && <Image source={warningIcon} style={styles.warningIcon} />}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!productDetails) {
    return (
      <View style={styles.container}>
        <Text>No product details found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display other product details as needed */}
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.productDetailsContainer}>
            <Image style={styles.productImage} source={{ uri: productDetails.image_url }} />
            <Text style={styles.productName}>{productDetails.product_name}</Text>
            <Text style={styles.barcode}>Barcode: {productDetails.code}</Text>
            {productDetails.allergens_tags.length > 0 ? (
                <View>
                <Text style={styles.details}>Allergen Information</Text>
                {productDetails.allergens_tags.map((allergen) => renderAllergen(allergen))}
                </View>
            ) : (
                <Text style={styles.noDetails}>No allergen information found.</Text>
            )}
            </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
    fontSize: 24, // Increase font size for product name
    fontWeight: 'bold',
    color: '#333', // Dark color for better readability
    marginBottom: 10,
  },
  barcode: {
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    fontSize: 20, // Increase the size for the Allergen title
    fontWeight: 'bold',
    color: '#D32F2F', // Red color to grab attention for allergens
    marginBottom: 5,
    textDecorationLine: 'underline', // Underline to emphasize importance
  },
  noDetails: {
    fontSize: 16,
    color: 'red',
    margin: 10,
  },
  allergenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0', // Light background for the item
    borderRadius: 8, // Rounded corners
    marginBottom: 5,
    padding: 5, // Padding for space around the item
    borderWidth: 1,
    borderColor: '#FFCCBC', // Border to highlight allergen items
  },
  allergenIcon: {
    width: 30, // Increase size of icon for visibility
    height: 30,
    marginRight: 10,
  },
  allergenText: {
    fontSize: 16,
    fontWeight: 'bold', // Bold text for clarity
    color: '#BF360C', // Color that stands out but also related to warning
  },
  warningIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});

export default ProductDetailsScreen;
