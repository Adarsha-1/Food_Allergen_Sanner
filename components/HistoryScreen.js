import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase';
import { UserContext } from './UserContext';
import ProductDetails from './ProductDetailsCard';

const HistoryScreen = ({ navigation, uid }) => { // Pass the uid as a prop to the component
  const [historyData, setHistoryData] = useState([]);
  const { loggedInUser} = useContext(UserContext);

  useEffect(() => {
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
        }
      
    };

    fetchHistoryData();
  }, [loggedInUser]); // Re-fetch when the uid changes

  // Function to handle the card press and navigate to AllergenDetails
  const handleProductPress = (barcode) => {
    console.log("product press barcod is: ", barcode);
    navigation.navigate('AllergenDetails', { barcodeData: barcode });
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
            index={item.key}
            />
          // <View style={styles.historyItem}>
          //   <Text>Barcode: {item.barcode}</Text>
          //   <Text>Scanned At: {item.scannedAt.toDate().toLocaleString()}</Text>
          // </View>
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
