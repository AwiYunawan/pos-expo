// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmA2ix0HnSBmGPUEUvLzQPKVzLBNJtOOk",
  authDomain: "react-pos-70843.firebaseapp.com",
  projectId: "react-pos-70843",
  storageBucket: "react-pos-70843.firebasestorage.app",
  messagingSenderId: "126863012663",
  appId: "1:126863012663:web:3ae2effff922ba476ee0b2",
  measurementId: "G-ET0X7F79BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
  }
});
analytics
export const db = getFirestore(app);