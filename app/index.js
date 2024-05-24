// // app/index.js
// import React, { useState } from 'react';
// import { View, TextInput, Button, Text, StyleSheet, StatusBar, Image } from 'react-native';
// import { useRouter } from 'expo-router';

// // const GLImage = require("../assets/garden-loft-logo2.png")

// export default function LoginScreen() {
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
//     <Text style={{color: "darkgrey", fontSize: 40, fontFamily: "Courier" }}>Welcome To</Text>
//     <Text style={{color: "orange", fontSize: 40, fontFamily: "Courier", marginBottom: 30 }}>Garden Loft</Text>
//     <StatusBar style="auto" />

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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Login from '../components/Login/Login';

export default function App() {
  return (
    <View style={styles.container}>
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



