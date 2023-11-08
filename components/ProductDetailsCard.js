import React, { useState } from 'react';
import { View, StyleSheet, Button, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductDetailsCard = ({ productName, imageSource, barcode, scannedAt, onPress, index, onDeletePress }) => {
  const entryColors = ['#CCCCFF', '#9FE2BF']; // Define your background colors
  const cardBackgroundColor = entryColors[index % entryColors.length]; // Randomly select a color

  return (
    <TouchableOpacity onPress={onPress}>
        <View style={{ ...styles.card, backgroundColor: cardBackgroundColor }}>
        <View style={styles.entryContainer}>
            <View style={styles.imageContainer}>
            {/* <Text style={styles.transparentBackground}>{productName}</Text> */}
            <Image source={{ uri: imageSource }} style={styles.thumbnail} />
            </View>
            <View style={styles.detailsContainer}>
            <View style={styles.gradeInfo}>
                <Text style={styles.grade}>{productName}</Text>
                <Text />
                <Text style={styles.absences}>Barcode: {barcode}</Text>
            </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={onDeletePress}>
                <Icon name="close" size={20} color="#FF0000" />
            </TouchableOpacity>
        </View>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    margin: 8,
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    backgroundColor: '#CCCCFF'
  },
  entryContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    width: '70%',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  transparentBackground: {
    backgroundColor: 'transparent', // Make the background of Text component transparent
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  gradeInfo: {
    marginTop: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  grade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flex: 1,
  },
  absencesContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 4,
  },
  absences: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#626567',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    // style your delete button here
    padding: 1,
    position: 'right',
    right: 15,
    top: 27,
    borderRadius: 20, // Half of the width and height to make it a circle
    width: 40, // Width of the button
    height: 40, // Height of the button
  },
});

export default ProductDetailsCard;
