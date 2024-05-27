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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
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
