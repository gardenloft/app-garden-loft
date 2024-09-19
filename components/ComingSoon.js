import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const ComingSoon = () => {
  return (
    <View style={[styles.containercs,
      {height: viewportWidth > viewportHeight ? viewportHeight * 0.35 : viewportHeight * 0.25,
        marginBottom: viewportWidth > viewportHeight ? 0: 150
       }
    ]}>
      <Text style={styles.text}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containercs: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    borderRadius: 30,
    width: viewportWidth * 0.8, 
    height: viewportHeight * 0.35,
    marginBottom: 40,
  },
  text: {
    fontSize: 48, // Big text size
    color: '#000', // Black color
    fontWeight: 'bold', // Bold text
    letterSpacing: 2, // Spacing between letters for modern look
    textTransform: 'uppercase', // Uppercase letters
    textAlign: 'center',
  },
});

export default ComingSoon;