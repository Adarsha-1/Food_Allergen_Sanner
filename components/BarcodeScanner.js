import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BarcodeScanner({ onBarcodeScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  const [allergenDetails, setAllergenDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [highlightBarcode, setHighlightBarcode] = useState(false); // State to highlight the barcode area
  const navigation = useNavigation();

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

  // What happens when we scan the barcode
  const handleBarCodeScanned = async ({ type, data }) => {
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
        <ScrollView contentContainerStyle={styles.productDetails}>
          <Text style={styles.title}>Product Details</Text>
          <Image style={styles.productImage} source={{ uri: allergenDetails.image_url }} />
          <Text style={styles.productName}>{allergenDetails.product_name}</Text>
          <Text style={styles.barcode}>Barcode: {text}</Text>
          {allergenDetails.allergens_tags && allergenDetails.allergens_tags.length > 0 ? (
            <View>
              <Text style={styles.details}>Allergen Information:</Text>
              {allergenDetails.allergens_tags.map((allergen, index) => (
                <Text key={index} style={styles.details}>
                  {allergen}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noDetails}>No allergen information found.</Text>
          )}
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
    fontSize: 18,
    marginBottom: 10,
  },
  barcode: {
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
  },
  noDetails: {
    fontSize: 16,
    color: 'red',
    margin: 10,
  },
});
