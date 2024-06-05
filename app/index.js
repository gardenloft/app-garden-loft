import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Login from '../components/Login/Login';
// import { register } from "@videosdk.live/react-native-sdk";
// register();
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
    alignItems: 'center'
  },
});



