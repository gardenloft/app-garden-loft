import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Entertainment = () => {
  return (
    <View style={styles.container}>
      <Text>Entertainment Component</Text>
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

export default Entertainment;
