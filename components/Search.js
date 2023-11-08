import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const fetchProducts = async () => {
    if (productName.trim() === '') {
      setError('Please enter a product name.');
      return;
    }

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${productName}&search_simple=1&action=process&json=true`);
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setError('No products found.');
      }
    } catch (error) {
      setError('Failed to fetch products.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setProductName('');
    setProducts([]);
    setError('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.searchButton} onPress={fetchProducts}>
          <Text>Search</Text>
        </TouchableOpacity>
        {productName.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        )}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.productContainer}
                onPress={() => navigation.navigate('AllergenDetails', { barcodeData: item.code })} // Use item.code as parameter
                >
                <Text style={styles.title}>{item.product_name}</Text>
                <Image style={styles.productImage} source={{ uri: item.image_url }} />
                <Text>Quantity: {item.code}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  productContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#007bff',
    marginRight: 10, // Added space between search button and clear button
  },
  clearButton: {
    position: 'absolute', // Position it absolutely to float over the TextInput
    right: 20, // Distance from the right edge of searchSection
    top: 25, // Center it vertically
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Search;
