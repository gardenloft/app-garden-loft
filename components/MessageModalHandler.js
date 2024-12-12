import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const MessageModalHandler = ({
  visible,
  senderName,
  messageText,
  onOpenChat,
  onClose,
  senderId,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalView}>
      <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
        <Text style={styles.title}>{senderName} sent you a message</Text>
        <Text style={styles.messageText}>{messageText}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.openChatButton]} 
          // onPress={onOpenChat}
          onPress={() => onOpenChat(senderId, senderName)}
          >
            <Text style={styles.buttonText}>Open Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    // width: viewportWidth * 0.8,
    // height: viewportHeight * 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
    padding: 20,
  },

  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  openChatButton: {
    backgroundColor: "green",
  },
  dismissButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default MessageModalHandler;
