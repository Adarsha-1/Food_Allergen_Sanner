import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { useFocusEffect } from '@react-navigation/native';


export default function BarcodeScanner({ onBarcodeScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');

  //food api requirements
  const [allergenDetails, setAllergenDetails] = useState(null);
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

  // Function to refresh scanner data
  const refreshScannerData = () => {
    console.log("entered refresh")
    setScanned(false);
    setText('Not yet scanned');
  };


  // Use useFocusEffect to refresh scanner data when the screen gains focus
  useFocusEffect(() => {
    refreshScannerData();
  });

  // What happens when we scan the barcode
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log('Type: ' + type + '\nData: ' + data);
    onBarcodeScanned({ type, data });

    //setScanned(false);

    // Navigate to the AllergenDetails screen with the barcode data
    navigation.navigate('AllergenDetails', { barcodeData: data });

    //testing
    console.log("after navigation");
    setScanned(false);


    //calling the open food facts api to get allergen details
    // try {
    //   const response = await axios.get('https://world.openfoodfacts.org/api/v0/product/${data}.json');

    //   if (response.data.status === 1) {
    //     const allergens = response.data.product.allergens_tags;
    //     setAllergenDetails(allergens);
    //   } else {
    //     setAllergenDetails('No Allergen information found.');
    //   }
    // } catch (error) {
    //   console.error("Error fetching allergen details: ", error);
    //   setAllergenDetails('Error fetching allergen details');
    // }


  };

  // Check permissions and return the scanner component
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
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

  // Return the scanner component
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {/* {allergenDetails && <Text style = {styles.allergenText} > {`Allergens: ${allergenDetails}`} </Text>} */}

      {/* {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />} */}
    </View>
  );
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
  allergenText: {
    fontSize: 14,
    margin: 10,
  },
});
