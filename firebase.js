// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import {getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyXep8dOJvDlNnhsuQWX4tEfgNE-tadU8",
  authDomain: "fir-auth-8c0f6.firebaseapp.com",
  projectId: "fir-auth-8c0f6",
  storageBucket: "fir-auth-8c0f6.appspot.com",
  messagingSenderId: "31785771258",
  appId: "1:31785771258:web:4903ef6fe8294d2ce4a943"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
export const FIREBASE_APP = initializeApp(firebaseConfig);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
export const FIREBASE_DB = getFirestore(FIREBASE_APP);