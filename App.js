// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, Image } from 'react-native';

// export default function App() {
//   return (
//     <>
//     <View style={styles.container}>
//     <Text style={{color: "darkgrey", fontSize: 50, fontFamily: "Courier" }}>Welcome To</Text>
//     <Text style={{color: "orange", fontSize: 50, fontFamily: "Courier" }}>Garden Loft</Text>
//     <StatusBar style="auto" />
//   </View>
//   </>
//   );
// }

// const styles = StyleSheet.create({
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
// import { register } from "@videosdk.live/react-native-sdk";
// import { registerRootComponent } from "expo";

// // Register VideoSDK services before app component registration
// register();
// registerRootComponent(App);

// export default function App() {}

//WARNING: code below mixes videoSDK registry & expo-router/entry.js
//if  entry.js updates with new code, please modify this file to work accordingly

import { register } from "@videosdk.live/react-native-sdk";
// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import "@expo/metro-runtime";

import { App } from "expo-router/build/qualified-entry";
import { renderRootComponent } from "expo-router/build/renderRootComponent";

// Register VideoSDK services before app component registration
register();

// This file should only import and register the root. No components or exports
// should be added here.
renderRootComponent(App);
