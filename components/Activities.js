import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Activities = () => {
  return (
    <View style={styles.container}>
      <Text>Activities Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Activities;
