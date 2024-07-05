// components/CallAlertModal.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const CallAlertModal = ({ visible, callerId, onAccept, onDecline }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
     
      <View style={styles.modalView}>
        <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
        <Text style={styles.callerText}>{`${callerId} is calling`}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={onDecline}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF8E3',
    borderRadius: "70px",
    // width: viewportWidth * 0.8 
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  callerText: {
    fontSize: 44,
    color: '#272624',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    padding: 25,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
   
  },
  declineButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
  },
});

export default CallAlertModal;
