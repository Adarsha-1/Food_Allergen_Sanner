import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

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

const AllergenDetails = ({ route }) => {
  const { barcodeData } = route.params;
  const navigation = useNavigation();

  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcodeData}.json`);
        if (response.data.status === 1) {
          setProductDetails(response.data.product);
          setLoading(false);
        } else {
          setError('Product not found.');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching product details.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [barcodeData]);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <View style={styles.productDetailsContainer}>
          <Text style={styles.title}>Product Details</Text>
          <Image style={styles.productImage} source={{ uri: productDetails.image_url }} />
          <Text style={styles.productName}>{productDetails.product_name}</Text>
          <Text style={styles.barcode}>Barcode: {barcodeData}</Text>
          {productDetails.allergens_tags.length > 0 ? (
            <View>
              <Text style={styles.details}>Allergen Information:</Text>
              {productDetails.allergens_tags.map((allergen) => renderAllergen(allergen))}
            </View>
          ) : (
            <Text style={styles.noDetails}>No allergen information found.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    padding: 20,
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

export default AllergenDetails;
