import { async } from '@firebase/util'
import { useNavigation } from '@react-navigation/core'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FIREBASE_AUTH } from '../firebase'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from './UserContext'

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
    <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <TextInput value={email} 
                style={styles.input}
                placeholder="Email"
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}></TextInput>
            <TextInput value={password} 
                secureTextEntry={true}
                style={styles.input}
                placeholder="password"
                autoCapitalize='none'
                onChangeText={(text) => setPassword(text)}></TextInput>
            { loading ? (<ActivityIndicator  size={"large"} color="#0000ff"></ActivityIndicator>
            ): (<>
                <Button style={styles.button} title='Login' onPress={signIn}></Button>
                
                <Button style={styles.button} title='Create account' onPress={signUp}></Button>

            </>
            )}
        </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 40, // Add margin to create a gap between buttons
  },
})