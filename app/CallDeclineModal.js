// components/CallDeclineModal.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const CallDeclineModal = ({ visible, onDismiss, calleeName }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalView}>
        <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
        <Text style={styles.messageText}>User is not available at the moment</Text>
        <Text style={styles.callerText}>{`${calleeName} is is not available at the moment`}</Text>
        <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={onDismiss}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF8E3',
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 32,
    color: '#272624',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 10,
  },
  dismissButton: {
    backgroundColor: 'orange',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default CallDeclineModal;