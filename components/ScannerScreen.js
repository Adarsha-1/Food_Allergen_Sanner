import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // const handleBarCodeScanned = ({ type, data }) => {
  //   setScanned(true);
  //   Alert.alert(
  //     "Scan successful!",
  //     `Bar code with type ${type} and data ${data} has been scanned!`,
  //     [{ text: 'OK', onPress: () => setScanned(false) }]
  //   );
  // };

  // Replace your handleBarCodeScanned function with this:
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      "Scan successful!",
      `Bar code with type ${type} and data ${data} has been scanned!`,
      [{ text: 'OK', onPress: () => {
        navigation.navigate('ProductDetails', { barcode: data });
        setScanned(false);
      }}]
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting for camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScannerScreen;
