// app/home.js
// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Home from "../components/Home/Home";

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Home />
//     </View>
//   );
// }
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Carousel from "../components/CarouselOne/Carousel";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Garden Loft!</Text>
{/* <Carousel /> */}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FCF8E3",
    marginTop: 35,
    // justifyContent: "center",
//     // alignItems: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });

import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "../components/Home/Home";
import HelpButton from "../components/HelpButton";

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <HelpButton />
      <Home />
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;
