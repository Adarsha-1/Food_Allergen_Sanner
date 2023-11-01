import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

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
const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const productDetails = route.params.productDetails;
  const userAllergens = route.params.userAllergens;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAlert = (allergen) => {
    Alert.alert(
      'Allergic Reaction Warning',
      `This product contains ${allergen} which you are allergic to!`,
      [
        { text: 'OK', onPress: () => handleGoBack() }
      ],
      { cancelable: false }
    );
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

  // Check if user has preferred allergens and if any match the product allergens
  useEffect(() => {
    if (userAllergens && userAllergens.length > 0) {
      const productAllergens = productDetails.allergens_tags || [];

      const allergenMatch = userAllergens.find(allergen => {
        const allergenKey = `en:${allergen}`;
        return productAllergens.includes(allergenKey);
      });

      if (allergenMatch) {
        handleAlert(allergenMatch);
      }
    }
  }, [userAllergens, productDetails]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.productDetailsContainer}>
          <Text style={styles.title}>Product Details</Text>
          <Image style={styles.productImage} source={{ uri: productDetails.image_url }} />
          <Text style={styles.productName}>{productDetails.product_name}</Text>
          <Text style={styles.barcode}>Barcode: {productDetails.code}</Text>
          {productDetails.allergens_tags.length > 0 ? (
            <View>
              <Text style={styles.details}>Allergen Information:</Text>
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
    backgroundColor: '#fff',
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
    fontSize: 20,
    marginBottom: 10,
  },
  barcode: {
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    fontSize: 18,
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

export default ProductDetailsScreen;
