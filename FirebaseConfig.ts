// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1fDxosZN5D47FCS6fW5y77bWj3Kfu0xY",
  authDomain: "aplikasi-kasir-94c93.firebaseapp.com",
  projectId: "aplikasi-kasir-94c93",
  storageBucket: "aplikasi-kasir-94c93.firebasestorage.app",
  messagingSenderId: "532168021359",
  appId: "1:532168021359:web:117598cbf462d3b107849a",
  measurementId: "G-QB2B7EXYL8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const analytics = getAnalytics(app);
const db = getFirestore(app);
