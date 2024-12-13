import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Logout = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputs = useRef([]);

  const navigation = useNavigation();
  const correctPasskey = "112112";

  const handleLogout = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      if (currentUser) {
        const userDocRef = doc(FIRESTORE_DB, `users/${currentUser.uid}`);
        await updateDoc(userDocRef, {
          pushToken: null,
        });

        await signOut(auth);
        await AsyncStorage.removeItem("rememberedUser");

        console.log("User signed out and pushToken removed!");
        navigation.reset({
          index: 0,
          routes: [{ name: "index" }],
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handlePasskeySubmit = () => {
    const enteredPasskey = digits.join("");
    if (enteredPasskey === correctPasskey) {
      handleLogout();
      setIsModalVisible(false);
    } else {
      setErrorMessage(
        "Incorrect passkey. Please try again or contact support."
      );
    }
  };

  const handleChange = (value, index) => {
    const updatedDigits = [...digits];
    updatedDigits[index] = value;
    setDigits(updatedDigits);
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { height: SCREEN_WIDTH > SCREEN_HEIGHT ? 320 : 500 },
      ]}
    >
      <Pressable onPress={() => setIsModalVisible(true)}>
        <View
          style={[
            styles.logoutButton,
            {
              width:
                SCREEN_WIDTH > SCREEN_HEIGHT
                  ? SCREEN_WIDTH * 0.2
                  : SCREEN_WIDTH * 0.55,
              marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? -30 : -80,
            },
          ]}
        >
          <FontAwesome name="sign-out" size={40} color="black" />
          <Text style={styles.buttonText}>Logout</Text>
        </View>
      </Pressable>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Passkey to Logout</Text>

            <View style={styles.passkeyContainer}>
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.passkeyInput}
                  value={digit}
                  onChangeText={(value) => handleChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(input) => (inputs.current[index] = input)}
                />
              ))}
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLogout]}
                onPress={handlePasskeySubmit}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: -20,
    position: "relative",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    marginTop: 10,
    height: SCREEN_HEIGHT * 0.04,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f09030",
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: SCREEN_WIDTH < 375 ? 16 : 20,
    color: "black",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: SCREEN_WIDTH * 0.85,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 25,
  },
  passkeyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  passkeyInput: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: SCREEN_WIDTH < 375 ? 14 : 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.6,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  buttonCancel: {
    backgroundColor: "#f3b718",
  },
  buttonLogout: {
    backgroundColor: "#d9534f",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: SCREEN_WIDTH < 375 ? 18 : 22,
  },
});

export default Logout;
