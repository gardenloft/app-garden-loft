// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, Image } from 'react-native';

// const GLImage = require("./assets/garden-loft-logo2.png")

// export default function Login() {
//   return (
//     <>
//     <View style={styles.wholecontainer}>
//     <View style={styles.container}>
//       <Image source={GLImage} style={styles.image} />
//       <Text style={{color: "darkgrey", fontSize: 50, fontFamily: "Courier" }}>Welcome To</Text>
//       <Text style={{color: "orange", fontSize: 50, fontFamily: "Courier" }}>Garden Loft</Text>
//       <StatusBar style="auto" />
//     </View>
//     <View style={styles.container}>
//     <Image source={GLImage} style={styles.image} />
//     <Text style={{color: "darkgrey", fontSize: 50, fontFamily: "Courier" }}>Welcome To</Text>
//     <Text style={{color: "orange", fontSize: 50, fontFamily: "Courier" }}>Garden Loft</Text>
//     <StatusBar style="auto" />
//   </View>
//   </View>
//   </>
//   );
// }

// const styles = StyleSheet.create({
//   wholecontainer: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#FCF8E3',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: 400,
//     height: 200,
//     marginBottom: 50,
//   }
// });
// components/LoginComponent.js

// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, StatusBar, Image } from 'react-native';
// import { useRouter } from 'expo-router';

// // const GLImage = require("../assets/garden-loft-logo2.png")

// export default function Login() {
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleLogin = () => {
//     if (name === 'Sally') { // Replace 'correctName' with the actual correct name
//       router.push('/home');
//     } else {
//       setError('Incorrect name');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* <Image source={GLImage} style={styles.image} /> */}
//       <Text style={{color: "darkgrey", fontSize: 40, fontFamily: "Courier" }}>Welcome To</Text>
//       <Text style={{color: "orange", fontSize: 40, fontFamily: "Courier", marginBottom: 30 }}>Garden Loft</Text>
//       <StatusBar style="auto" />

//       {/* <Text style={styles.label}>Enter your name:</Text> */}
//       <TextInput 
//         style={styles.input} 
//         value={name} 
//         onChangeText={setName} 
//         placeholder="Enter Your Name"
//       />
//       {error ? <Text style={styles.error}>{error}</Text> : null}
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FCF8E3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 30,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   input: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     borderRadius: 7,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     width: '40%',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 12,
//   },
//   image: {
//     width: 300,
//     height: 150,
//     marginBottom: 30,
//   }
// });

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import CheckBox from 'expo-checkbox'; // Import CheckBox from expo-checkbox
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "expo-router/build/useNavigation";



const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const Login = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Remember Me state
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();



  useEffect(() => {
    const checkRememberedUser = async () => {
      const rememberedUser = await AsyncStorage.getItem("rememberedUser");
      if (rememberedUser) {
        setLoading(true);
        try {
          const user = JSON.parse(rememberedUser);
          await signInWithEmailAndPassword(auth, user.email, user.password);
          navigation.navigate("home"); // Navigate to CarouselOne screen
        } catch (error) {
          console.log("Auto sign in failed:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    checkRememberedUser();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (rememberMe) {
        await AsyncStorage.setItem("rememberedUser", JSON.stringify({ email, password }));
      }
      console.log(response);
      navigation.navigate("home"); // Navigate to CarouselOne screen
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = response.user;
      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        email: email,
        // name: name,
      });
      alert('Account created successfully! Check your email.');
      // navigation.navigate("Home"); // Navigate to home  screen
    } catch (error) {
      console.error(error);
      alert("Sign up failed: " + error.message); // Show error message
    } finally {
      setLoading(false); // Stop loading irrespective of success or failure
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="orange" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button title="Create Account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#FCF8E3",
    width: viewportWidth * 1,
    height: viewportHeight * 1,
    alignSelf: 'center',
  },
  input: {
    borderColor: "black",
    backgroundColor: "white",
    padding: 30,
    width: viewportWidth * 0.4,
    height: viewportHeight * 0.1,
    alignSelf: 'center',
    borderRadius: 30,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 40,
    color: "#f09030",
    alignSelf: 'center',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: 'center',
  },
  checkbox: {
    alignSelf: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 18,
  },
});