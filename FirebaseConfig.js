// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAnalytics, isSupported } from "firebase/analytics";
//Required import to use Firebase Authentication
import { getAuth } from "firebase/auth";
//Required import to use Firebase Authentication
import { getFirestore } from "firebase/firestore";
//required for Firebase Messaging
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const FIREBASE_APP = app;
//Needed for Authentication
export const FIREBASE_AUTH = getAuth(app);
//Needed for Firestore database
export const FIRESTORE_DB = getFirestore(app);

// isSupported().then((supported) => {
//   if (supported) {
//     const analytics = getAnalytics(app);
//   } else {
//     console.warn("Firebase Analytics is not supported in this environment.");
//   }
// });

// Initialize Firebase Messaging
// export const MESSAGING = getMessaging(app);
