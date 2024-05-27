import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
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
          setUserInfo(userSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getCurrentUserData();
  }, []);

  const image = require("../assets/garden loft-logo-outline-yellow.png");

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
      <View style={styles.container2}>
        <ImageBackground
          source={image}
          resizeMode={"contain"}
          style={styles.image}>
          <Text style={styles.Welcome}>Hello {userInfo?.name}</Text>
        </ImageBackground>
      </View>
      <TouchableOpacity onPress={handleCallSupport} style={styles.callButton}>
        <Text style={styles.EmergencyButton}>Call Emergency</Text>
        <MaterialCommunityIcons
          name="hospital-box-outline"
          style={styles.iconStyle}
          size={50}
          color="#f3b718"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: viewportWidth * 0.95,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 12,
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callButton: {
    backgroundColor: "#59ACCE",
    padding: 4,
    paddingLeft: 10,
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
  },
  EmergencyButton: {
    color: "#2E3E5E",
    fontSize: 28,
    padding: 9,
    shadowColor: "#000",
    shadowOffset: {
      width: 12,
      height: 7,
    },
    shadowOpacity: 0.8,
    shadowRadius: 26,
    elevation: 10,
  },
  iconStyle: {
    marginRight: 7,
    paddingTop: 3,
  },
  Welcome: {
    color: "#2E3E5E",
    fontSize: 30,
    paddingTop: "3%",
    marginStart: 25,
    width: "100%",
    borderRadius: 7,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "105%",
    height: "100%",
    opacity: 0.95,
    shadowColor: "goldenRod",
    shadowOffset: {
      width: 5,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 26,
    elevation: 10,
  },
});

export default HelpButton;
