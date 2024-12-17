import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Linking,
  Pressable,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Threshold for detecting phones
const isPhone = SCREEN_WIDTH <= 514;

const HelpButton = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For missing emergency contact
  const [passkeyModalVisible, setPasskeyModalVisible] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputs = useRef([]);
  const navigation = useNavigation();
  const correctPasskey = "112112";

  const FACETIME_LINK =
    "https://facetime.apple.com/join#v=1&p=XEhJ9qklEe+Nf97v/61Iyg&k=8EJy-2zZvED8dUqzwNbZ_A-h7g0EEzEKTLWTh63K0KU";

  useEffect(() => {
    const fetchUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIRESTORE_DB, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserInfo(userSnap.data());
        } else {
          console.log("User document not found");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      if (currentUser) {
        const userDocRef = doc(FIRESTORE_DB, `users/${currentUser.uid}`);
        await updateDoc(userDocRef, { pushToken: null });
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
      setPasskeyModalVisible(false);
    } else {
      setErrorMessage("Incorrect passkey. Please try again.");
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

  const openPasskeyModal = () => {
    setBioModalVisible(false);
    setPasskeyModalVisible(true);
  };

  const handleEmergencyCall = () => {
    if (!userInfo?.emergencyNumber) {
      setModalVisible(true); // Show modal if no emergency number
      return;
    }

    const emergencyNumber = String(userInfo.emergencyNumber);

    if (Platform.OS === "ios") {
      // Use FaceTime for iOS
      const facetimeLink = `facetime:${emergencyNumber}`;
      Linking.openURL(facetimeLink).catch((err) => {
        console.error("FaceTime failed, trying phone dialer:", err);
        // Fallback to phone dialer
        const telLink = `tel:${emergencyNumber}`;
        Linking.openURL(telLink).catch((error) => {
          console.error("Phone call failed:", error);
          Alert.alert("Error", "Failed to initiate a call.");
        });
      });
    } else if (Platform.OS === "android") {
      // Use phone dialer for Android
      const telLink = `tel:${emergencyNumber}`;
      Linking.openURL(telLink).catch((error) => {
        console.error("Phone call failed:", error);
        Alert.alert("Error", "Failed to initiate a call.");
      });
    } else {
      Alert.alert("Error", "This feature is only available on mobile devices.");
    }
  };

  return (
    <View style={[styles.container, phoneStyles.container]}>
      <TouchableOpacity
        onPress={() => setBioModalVisible(true)}
        style={styles.profileContainer}
      >
        {userInfo?.imageUrl ? (
          <Image
            source={{ uri: userInfo.imageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={50}
            color="#f3b718"
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.callButton, phoneStyles.callButton]} onPress={handleEmergencyCall}>
        <Text style={styles.emergencyButtonText}>Call Emergency</Text>
        <MaterialCommunityIcons
          name="hospital-box-outline"
          style={[styles.iconStyle, phoneStyles.iconStyle]}
          size={40}
          color="#f3b718"
        />
      </TouchableOpacity>

      <View style={[styles.logoContainer,phoneStyles.logoContainer]}>
        <Image
          source={require("../assets/garden-loft-logo2.png")}
          style={[styles.logoImage, phoneStyles.logoImage]}
        />
      </View>

      {/* Bio Modal */}
      <Modal
        visible={bioModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBioModalVisible(false)}
      >
        <View style={[styles.modalContainer,phoneStyles.modalContainer]}>
          <ScrollView
            contentContainerStyle={
              isPhone ? phoneStyles2.modalContent : styles.modalContent
            }
          >
            <TouchableOpacity
              onPress={() => setBioModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={30} color="black" />
            </TouchableOpacity>

            {userInfo?.imageUrl ? (
              <Image
                source={{ uri: userInfo.imageUrl }}
                style={styles.modalProfileImage}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle"
                size={100}
                color="#f3b718"
              />
            )}

            <Text style={styles.userName}>{userInfo?.userName || "User"}</Text>
            <Text style={styles.userDetails}>
              City: {userInfo?.city || "N/A"}
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Hobbies</Text>
              {userInfo?.hobbies?.split(", ").map((hobby, index) => (
                <Text key={index} style={styles.sectionContent}>
                  - {hobby}
                </Text>
              ))}
            </View>

            <Pressable onPress={openPasskeyModal} style={styles.logoutButton}>
              <FontAwesome name="sign-out" size={40} color="black" />
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal for Missing Emergency Contact */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Emergency contact has not been set.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Passkey Modal */}
      <Modal
        transparent={true}
        visible={passkeyModalVisible}
        animationType="slide"
        onRequestClose={() => setPasskeyModalVisible(false)}
      >
        <View style={styles.logmodalContainer}>
          <View style={styles.logmodalView}>
            <Text style={styles.logmodalText}>Enter Passkey to Logout</Text>

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
                onPress={() => setPasskeyModalVisible(false)}
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

// Phone-specific styles
const phoneStyles = SCREEN_WIDTH <= 513 ? {
logoImage: {
  width: SCREEN_WIDTH * 0.2,
  resizeMode: "contain",
},
callButton: {},
iconStyle: {
},
container: {
  marginTop: 60,
},
modalContainer: {
}

} : {}
const phoneStyles2 = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 90,
    marginTop: 80,
    width: "100%", // Use 90% of screen width for phones
    height: "75%", // Use 75% of screen height for phones
    maxWidth: 450, // Ensure the modal doesn't become too wide
    alignItems: "center",
    justifyContent: "flex-start", // Align content to the top for phones
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
});
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 45,
    marginBottom: 25,
    paddingTop: 12,
    padding: 20,
    alignSelf: "center",
    backgroundColor: "#FCF8E3",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#f3b718",
  },
  callButton: {
    backgroundColor: "#59ACCE",
    paddingHorizontal: SCREEN_WIDTH < 515 ? 8 : SCREEN_WIDTH < 430 ? 10 : 20,
    paddingVertical: 9,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    maxWidth: SCREEN_WIDTH < 375 ? 160 : SCREEN_WIDTH < 430 ? 180 : 250,
  },
  emergencyButtonText: {
    color: "#2E3E5E",
    fontSize: SCREEN_WIDTH < 375 ? 14 : SCREEN_WIDTH < 430 ? 16 : 18,
    paddingRight: SCREEN_WIDTH < 375 ? 4 : 6,
    paddingLeft: SCREEN_WIDTH < 375 ? 6 : 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: SCREEN_WIDTH * 1.94,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#59ACCE",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  iconStyle: {
    marginRight: 5,
    paddingTop: 3,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: SCREEN_WIDTH < 375 ? 90 : SCREEN_WIDTH < 430 ? 110 : 130,
    height: SCREEN_WIDTH < 375 ? 40 : SCREEN_WIDTH < 430 ? 50 : 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // modalContent: {
  //   backgroundColor: "#fff",
  //   borderRadius: 20,
  //   padding: 20,
  //   marginTop: 20,
  //   width: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8,
  //   height: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.98,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 4 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   elevation: 10,
  // },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: isPhone ? 20 : 50, // Smaller margin for phones
    width: isPhone ? "70%" : Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.98, // Adjust width for phones
    height: isPhone ? "75%" : Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.58, // Adjust height for phones
    maxWidth: 550, // Limit width for smaller devices
    alignItems: "center",
    justifyContent: "flex-start", // Ensure top alignment for phones
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },

  logcontainer: {
    justifyContent: "center",
    marginTop: 10,
    position: "relative",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    marginTop: 30,
    height: SCREEN_HEIGHT * 0.06,
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
  logmodalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  logmodalView: {
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
  logmodalText: {
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

  closeButton: {
    alignSelf: "flex-end",
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#f3b718",
    marginBottom: 10,
  },
  userName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  userDetails: {
    fontSize: 18,
    color: "#555",
  },
  infoSection: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
  },
  sectionContent: {
    fontSize: 18,
    color: "#666",
    marginLeft: 10,
  },
});

export default HelpButton;
