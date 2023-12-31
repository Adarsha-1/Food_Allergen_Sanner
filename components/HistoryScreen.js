import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet,Alert } from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase';
import { UserContext } from '../context/UserContext';
import ProductDetails from './ProductDetailsCard';
import { useIsFocused } from '@react-navigation/native';

const HistoryScreen = ({ navigation, uid }) => { // Pass the uid as a prop to the component
  const [historyData, setHistoryData] = useState([]);
  const { loggedInUser} = useContext(UserContext);
  const isFocused = useIsFocused();

  const fetchHistoryData = async () => {
    if(loggedInUser) {

      const historyRef = collection(FIREBASE_DB, 'users');
      const q = query(historyRef, where('uid', '==', loggedInUser.uid)); // Filter by 'uid'

      try {
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id }); // Include the Firestore document ID as 'id'
        });
        const dataWithKeys = data.map((item, index) => ({
          ...item,
          key: index + 1, // Generate a unique key starting with 1
        }));
        setHistoryData(dataWithKeys);
        console.log("data from firebase is: ", data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
      } else {
          setHistoryData([]);
      }
    
  };

  useEffect(() => {
    if (isFocused) {
      fetchHistoryData();
    }
    //fetchHistoryData();
  }, [isFocused, loggedInUser]); // Re-fetch when the uid changes



  // Function to handle the card press and navigate to AllergenDetails
  const handleProductPress = (barcode) => {
    console.log("product press barcod is: ", barcode);
    navigation.navigate('Details', { barcodeData: barcode });
  };

  // Function to delete an item from Firebase
const handleDeletePress = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'users', id)); // Assuming 'users' is the collection where items are stored
      // Update the state to remove the item with the matching id
      //setHistoryData(historyData.filter(item => item.id !== id));
      Alert.alert(
        "Item Deleted",
        "The item has been successfully deleted.",
        [{ text: "OK" }]
      );
      fetchHistoryData();
    } catch (error) {
      console.error("Error removing document: ", error);
      Alert.alert(
        "Deletion Failed",
        "There was a problem deleting the item.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductDetails 
            productName={item.productName}
            imageSource={item.imageUrl}
            barcode={item.barcode}
            scannedAt={item.scannedAt}
            onPress={() => handleProductPress(item.barcode)}
            onDeletePress={() => handleDeletePress(item.id)}
            index={item.key}
            />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 24,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HistoryScreen;
