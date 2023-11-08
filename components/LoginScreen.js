import { async } from '@firebase/util'
import { useNavigation } from '@react-navigation/core'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { FIREBASE_AUTH } from '../firebase'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from '../context/UserContext'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const { loggedInUser, dispatch} = useContext(UserContext);

  const navigation = useNavigation();

  const signIn = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        console.log(response);
        console.log("uid is: ", response.user.uid);
        //alert('Check your emails!');
        const user = {
          uid: response.user.uid
        }
        dispatch({type: 'LOGIN', payload: user});
        console.log("user details are: ", loggedInUser)
        navigation.goBack();
    } catch (error) {
        console.log(error);
        alert('Registration failed: ' + error.message); 
    } finally {
        setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);
        alert('Check your emails!');
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  }

  

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.logoContainer}>
        <Image
            source={ require('../assets/logo.jpeg') }
            style={styles.logo}
        />
        <Text style={styles.logoText}>LOGIN</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          value={email}
          style={styles.input}
          placeholder="Name"
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput 
          value={password} 
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      marginHorizontal: 20,
      backgroundColor: '#fff', // Assuming a white background
    },
    logo: {
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
        resizeMode: 'contain', // This ensures the image scales within the dimensions without distorting
        marginBottom: 10, // Adjust the space between the logo and the login text
      },      
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoText: {
      // Define your logo styles here
      fontSize: 24,
      fontWeight: 'bold',
      color: 'tomato',
    },
    inputContainer: {
      marginBottom: 20,
    },
    input: {
      height: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#000', // Set border color to match the design
      borderRadius: 25, // Set border radius to match the design
      padding: 15,
      fontSize: 16, // You can adjust this as per your design
    },
    forgotPassword: {
      textAlign: 'right',
      marginRight: 10,
      color: '#0000ff', // Set a color for the forgot password link
    },
    buttonContainer: {
      alignItems: 'center',
    },
    button: {
      width: '100%',
      backgroundColor: 'tomato', // Replace with the color of your login button
      padding: 15,
      borderRadius: 25, // Rounded corners for the button
      alignItems: 'center',
      marginBottom: 20, // Spacing between login button and terms text
    },
    buttonText: {
      color: '#fff', // Button text color
      fontSize: 18, // Button text size
      fontWeight: 'bold',
    },
  });