import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // Verify this import path
import { doc, getDoc } from "firebase/firestore";
import * as Linking from "expo-linking";

const { width: viewportWidth } = Dimensions.get("window");

const HelpButton = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getCurrentUserData = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIRESTORE_DB, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User data:", userSnap.data());
          console.log("User data: this user name logged in ");
          setUserInfo(userSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getCurrentUserData();
  }, []);

  const image = require("../assets/garden-loft-logo2.png"); // Replace with your logo path

  const handleCallSupport = () => {
    if (!userInfo?.emergencyNumber) {
      alert("No emergency number set for the user.");
      return;
    }

    const link = `tel:${userInfo.emergencyNumber}`;
    Linking.openURL(link).catch((err) => {
      console.error("An error occurred while trying to make the call:", err);
      alert("Failed to make the call");
    });
  };

  return (
    <View style={styles.container}>
      {/* Left: User's profile picture */}
      <View style={styles.profileContainer}>
        {userInfo?.imageUrl ? (
          <Image
            source={{ uri: userInfo.imageUrl }}
            style={styles.profileImage}
          />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={60}
            color="#f3b718"
          />
        )}
      </View>

      {/* Middle: Emergency call button */}
      <TouchableOpacity onPress={handleCallSupport} style={styles.callButton}>
        <Text style={styles.EmergencyButton}>Call Emergency</Text>
        <MaterialCommunityIcons
          name="hospital-box-outline"
          style={styles.iconStyle}
          size={50}
          color="#f3b718"
        />
      </TouchableOpacity>

      {/* Right: Logo */}
      <View style={styles.logoContainer}>
        <Image source={image} style={styles.logoImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: viewportWidth * 0.92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 45,
    marginBottom: 20,
    paddingTop: 12,
    padding: 20,
    alignSelf: "center",
    backgroundColor: "#FCF8E3", //same as background 
    // backgroundColor: "#FFDDAA",
    // backgroundColor: "#C0C4C8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f3b718",
  },
  callButton: {
    backgroundColor: "#59ACCE",
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    marginLeft: 60,
  },
  EmergencyButton: {
    color: "#2E3E5E",
    fontSize: 20,
    paddingRight: 10,
    paddingLeft: 20,
  },
  iconStyle: {
    marginRight: 7,
    paddingTop: 3,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",

  },
  logoImage: {
    width: 130,
    height: 62,
  },
});

export default HelpButton;
