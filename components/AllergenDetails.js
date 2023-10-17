import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AllergenDetails = ({ route }) => {
  const { barcodeData } = route.params;
  const navigation = useNavigation(); // Hook to get navigation object

  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch product details using Open Food Facts API
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcodeData}.json`);
        console.log("Response is retrieved");
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

  const handleGoBack = () => {
    navigation.navigate('Scanner'); // Navigate back to the Scanner screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.goBackButton}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color="black"
          onPress={handleGoBack}
        />
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <View>
          <Text style={styles.title}>Product Details</Text>
          <Image style={styles.productImage} source={{ uri: productDetails.image_url }} />
          <Text style={styles.productName}>{productDetails.product_name}</Text>
          <Text style={styles.barcode}>Barcode: {barcodeData}</Text>
          {productDetails.allergens_tags.length > 0 ? (
            <View>
              <Text style={styles.details}>Allergen Information:</Text>
              {productDetails.allergens_tags.map((allergen, index) => (
                <Text key={index} style={styles.details}>
                  {allergen}
                </Text>
              ))}
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
  goBackButton: {
    alignSelf: 'flex-start',
    margin: 10,
  },
});

export default AllergenDetails;
