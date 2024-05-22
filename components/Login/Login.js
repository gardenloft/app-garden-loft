import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const GLImage = require("./assets/garden-loft-logo2.png")

export default function Login() {
  return (
    <>
    <View style={styles.wholecontainer}>
    <View style={styles.container}>
      <Image source={GLImage} style={styles.image} />
      <Text style={{color: "darkgrey", fontSize: 50, fontFamily: "Courier" }}>Welcome To</Text>
      <Text style={{color: "orange", fontSize: 50, fontFamily: "Courier" }}>Garden Loft</Text>
      <StatusBar style="auto" />
    </View>
    <View style={styles.container}>
    <Image source={GLImage} style={styles.image} />
    <Text style={{color: "darkgrey", fontSize: 50, fontFamily: "Courier" }}>Welcome To</Text>
    <Text style={{color: "orange", fontSize: 50, fontFamily: "Courier" }}>Garden Loft</Text>
    <StatusBar style="auto" />
  </View>
  </View>
  </>
  );
}

const styles = StyleSheet.create({
  wholecontainer: {
    flex: 1,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: '#FCF8E3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 50,
  }
});
