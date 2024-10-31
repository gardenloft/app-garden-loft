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
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc to update Firestore
import { FIRESTORE_DB } from "../FirebaseConfig"; // Your Firebase Firestore config

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Logout: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputs = useRef([]);

  const navigation = useNavigation();
  const correctPasskey = "112112"; // Correct passkey for example

    // Function to handle user logout and remove pushToken
    const handleLogout = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      try {
        if (currentUser) {
          // Remove the user's pushToken from Firestore
          const userDocRef = doc(FIRESTORE_DB, `users/${currentUser.uid}`);
          await updateDoc(userDocRef, {
            pushToken: null, // Setting the pushToken field to null or you can use deleteField() to remove it completely
          });
  
          // Log the user out and remove any remembered user data
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

  // const handleLogout = async () => {
  //   const auth = getAuth();
  //   try {
  //     await signOut(auth);
  //     await AsyncStorage.removeItem("rememberedUser");
  //     console.log("User signed out!");
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "index" }],
  //     });
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const handlePasskeySubmit = () => {
    const enteredPasskey = digits.join("");
    if (enteredPasskey === correctPasskey) {
      handleLogout();
      setIsModalVisible(false);
    } else {
      setErrorMessage("Incorrect passkey. Please try again or contact support.");
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
        { height: viewportWidth > viewportHeight ? 320 : 500 },
      ]}
    >
      <Pressable onPress={() => setIsModalVisible(true)}>
        <View
          style={[
            styles.logoutButton,
            {
              width:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").width * 0.1)
                  : Math.round(Dimensions.get("window").width * 0.55),
            },
            { marginTop: viewportWidth > viewportHeight ? -30 : -80 },
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
    marginTop: -40,
    position: "relative",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    
    height: viewportHeight * 0.25,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#f09030",
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 28,
    fontFamily: "Arial",
    color: "black",
    marginLeft: 25,
    alignItems: "center",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
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
    width: 40,
    height: 50,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: viewportWidth * 0.6,
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
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default Logout;

