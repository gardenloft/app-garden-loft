// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ImageBackground,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // Verify this import path
// import { doc, getDoc } from "firebase/firestore";
// import * as Linking from "expo-linking";

// const { width: viewportWidth } = Dimensions.get("window");

// const HelpButton = () => {
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     const getCurrentUserData = async () => {
//       const user = FIREBASE_AUTH.currentUser;
//       if (user) {
//         const userRef = doc(FIRESTORE_DB, "users", user.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           console.log("User data:", userSnap.data());
//           setUserInfo(userSnap.data());
//         } else {
//           console.log("No such document!");
//         }
//       }
//     };
//     getCurrentUserData();
//   }, []);

//   const image = require("../assets/garden loft-logo-outline-yellow.png");

//   const handleCallSupport = () => {
//     if (!userInfo?.emergencyNumber) {
//       alert("No emergency number set for the user.");
//       return;
//     }

//     const link = `tel:${userInfo.emergencyNumber}`;
//     Linking.openURL(link).catch((err) => {
//       console.error("An error occurred while trying to make the call:", err);
//       alert("Failed to make the call");
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* <View style={styles.container2}> */}
//         {/* <ImageBackground
//           source={image}
//           resizeMode={"contain"}
//           style={styles.image}> */}
//         {/* <Text style={styles.Welcome}>Hello {userInfo?.userName}</Text> */}
//         {/* </ImageBackground> */}
//       {/* </View> */}
//       <TouchableOpacity onPress={handleCallSupport} style={styles.callButton}>
//         <Text style={styles.EmergencyButton}>Call Emergency</Text>
//         <MaterialCommunityIcons
//           name="hospital-box-outline"
//           style={styles.iconStyle}
//           size={50}
//           color="#f3b718"
//           // color="red"
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: viewportWidth * 0.92,
//     justifyContent: "space-around",
//     flexDirection: "row",
//     marginTop: 45,
//     marginBottom: 45,
//     paddingTop: 12,
//     alignSelf: "center",
//     backgroundColor: "#FCF8E3",
//   },
//   // container2: {
//   //   flex: 1,
//   //   justifyContent: "center",
//   //   alignItems: "center",
//   // },
//   callButton: {
//     backgroundColor: "#59ACCE",
//     padding: 4,
//     paddingLeft: 10,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 8,
//       height: 7,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   EmergencyButton: {
//     color: "#2E3E5E",
//     fontSize: 28,
//     padding: 9,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 12,
//       height: 7,
//     },
//     shadowOpacity: 0.8,
//     shadowRadius: 26,
//     elevation: 10,
//   },
//   iconStyle: {
//     marginRight: 7,
//     paddingTop: 3,
//   },
//   Welcome: {
//     color: "#2E3E5E",
//     fontSize: 30,
//     paddingTop: "3%",
//     marginStart: 25,
//     width: "100%",
//     borderRadius: 7,
//   },
//   image: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "105%",
//     height: "100%",
//     opacity: 0.95,
//     shadowColor: "goldenRod",
//     shadowOffset: {
//       width: 5,
//       height: 1,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 26,
//     elevation: 10,
//   },
// });

// export default HelpButton;


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
    backgroundColor: "#FCF8E3",
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
