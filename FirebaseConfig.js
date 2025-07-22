// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDqo1fvZ8m-SaJhME6M3F86SjKFokKmUA0",
//   authDomain: "appgardenloft.firebaseapp.com",
//   projectId: "appgardenloft",
//   storageBucket: "appgardenloft.appspot.com",
//   messagingSenderId: "561295329634",
//   appId: "1:561295329634:web:1265618de4f030dc50443b",
//   measurementId: "G-RE7THX0CY1",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const FIREBASE_APP = app;
// //Needed for Authentication
// export const FIREBASE_AUTH = getAuth(app);
// //Needed for Firestore database
// export const FIRESTORE_DB = getFirestore(app);

// // isSupported().then((supported) => {
// //   if (supported) {
// //     const analytics = getAnalytics(app);
// //   } else {
// //     console.warn("Firebase Analytics is not supported in this environment.");
// //   }
// // });

// // Initialize Firebase Messaging
// // export const MESSAGING = getMessaging(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // For Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqo1fvZ8m-SaJhME6M3F86SjKFokKmUA0",
  authDomain: "appgardenloft.firebaseapp.com",
  projectId: "appgardenloft",
  storageBucket: "appgardenloft.appspot.com",
  messagingSenderId: "561295329634",
  appId: "1:561295329634:web:1265618de4f030dc50443b",
  measurementId: "G-RE7THX0CY1",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// let auth;

// try {
//   auth = getAuth(); // Avoid re-initializing
// } catch {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// }

const FIREBASE_STORAGE = getStorage(app); // Use the correct 'app' reference here
export const FIREBASE_APP = app;
// Needed for Authentication
export const FIREBASE_AUTH = getAuth(app);

// Needed for Firestore database
export const FIRESTORE_DB = getFirestore(app);

export { FIREBASE_STORAGE };
