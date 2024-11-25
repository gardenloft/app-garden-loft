// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ImageBackground,
// // //   Image,
// // //   StyleSheet,
// // //   Dimensions,
// // // } from "react-native";
// // // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // // import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // Verify this import path
// // // import { doc, getDoc } from "firebase/firestore";
// // // import * as Linking from "expo-linking";

// // // const { width: viewportWidth } = Dimensions.get("window");

// // // const HelpButton = () => {
// // //   const [userInfo, setUserInfo] = useState(null);

// // //   useEffect(() => {
// // //     const getCurrentUserData = async () => {
// // //       const user = FIREBASE_AUTH.currentUser;
// // //       if (user) {
// // //         const userRef = doc(FIRESTORE_DB, "users", user.uid);
// // //         const userSnap = await getDoc(userRef);
// // //         if (userSnap.exists()) {
// // //           console.log("User data:", userSnap.data());
// // //           console.log("User data: this user name logged in ");
// // //           setUserInfo(userSnap.data());
// // //         } else {
// // //           console.log("No such document");
// // //         }
// // //       }
// // //     };
// // //     getCurrentUserData();
// // //   }, []);

// // //   const image = require("../assets/garden-loft-logo2.png"); // Replace with your logo path

// // //   const handleCallSupport = () => {
// // //     if (!userInfo?.emergencyNumber) {
// // //       alert("No emergency number set for the user.");
// // //       return;
// // //     }

// // //     const link = `tel:${userInfo.emergencyNumber}`;
// // //     Linking.openURL(link).catch((err) => {
// // //       console.error("An error occurred while trying to make the call:", err);
// // //       alert("Failed to make the call");
// // //     });
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Left: User's profile picture */}
// // //       <View style={styles.profileContainer}>
// // //         {userInfo?.imageUrl ? (
// // //           <Image
// // //             source={{ uri: userInfo.imageUrl }}
// // //             style={styles.profileImage}
// // //           />
// // //         ) : (
// // //           <MaterialCommunityIcons
// // //             name="account-circle"
// // //             size={60}
// // //             color="#f3b718"
// // //           />
// // //         )}
// // //       </View>

// // //       {/* Middle: Emergency call button */}
// // //       <TouchableOpacity onPress={handleCallSupport} style={styles.callButton}>
// // //         <Text style={styles.EmergencyButton}>Call Emergency</Text>
// // //         <MaterialCommunityIcons
// // //           name="hospital-box-outline"
// // //           style={styles.iconStyle}
// // //           size={50}
// // //           color="#f3b718"
// // //         />
// // //       </TouchableOpacity>

// // //       {/* Right: Logo */}
// // //       <View style={styles.logoContainer}>
// // //         <Image source={image} style={styles.logoImage} />
// // //       </View>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     width: viewportWidth * 0.92,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //     marginTop: 45,
// // //     marginBottom: 25,
// // //     paddingTop: 12,
// // //     padding: 20,
// // //     alignSelf: "center",
// // //     backgroundColor: "#FCF8E3", //same as background
// // //     // backgroundColor: "#FFDDAA",
// // //     // backgroundColor: "#C0C4C8",
// // //     borderRadius: 10,
// // //     shadowColor: "#000",
// // //     shadowOffset: {
// // //       width: 3,
// // //       height: 7,
// // //     },
// // //     shadowOpacity: 0.25,
// // //     shadowRadius: 6,
// // //     elevation: 8,
// // //   },
// // //   profileContainer: {
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   profileImage: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     borderWidth: 2,
// // //     borderColor: "#f3b718",
// // //   },
// // //   callButton: {
// // //     backgroundColor: "#59ACCE",
// // //     padding: 10,
// // //     borderRadius: 15,
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     shadowColor: "#000",
// // //     shadowOffset: {
// // //       width: 8,
// // //       height: 7,
// // //     },
// // //     shadowOpacity: 0.25,
// // //     shadowRadius: 6,
// // //     elevation: 8,
// // //     marginLeft: 60,
// // //   },
// // //   EmergencyButton: {
// // //     color: "#2E3E5E",
// // //     fontSize: 20,
// // //     paddingRight: 10,
// // //     paddingLeft: 20,
// // //   },
// // //   iconStyle: {
// // //     marginRight: 7,
// // //     paddingTop: 3,
// // //   },
// // //   logoContainer: {
// // //     justifyContent: "center",
// // //     alignItems: "center",

// // //   },
// // //   logoImage: {
// // //     width: 130,
// // //     height: 62,
// // //   },
// // // });

// // // export default HelpButton;
// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   Image,
// //   StyleSheet,
// //   Dimensions,
// //   Platform,
// // } from "react-native";
// // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // Verify this import path
// // import { doc, getDoc } from "firebase/firestore";
// // import * as Linking from "expo-linking";

// // const { width: viewportWidth } = Dimensions.get("window");

// // const HelpButton = () => {
// //   const [userInfo, setUserInfo] = useState(null);

// //   useEffect(() => {
// //     const getCurrentUserData = async () => {
// //       const user = FIREBASE_AUTH.currentUser;
// //       if (user) {
// //         const userRef = doc(FIRESTORE_DB, "users", user.uid);
// //         const userSnap = await getDoc(userRef);
// //         if (userSnap.exists()) {
// //           const data = userSnap.data();
// //           console.log("User data retrieved:", data); // Log retrieved data for debugging
// //           setUserInfo(data);
// //         } else {
// //           console.log("No such document");
// //         }
// //       }
// //     };
// //     getCurrentUserData();
// //   }, []);

// //   const image = require("../assets/garden-loft-logo2.png"); // Replace with your logo path

// //   const handleCallSupport = () => {
// //     if (!userInfo) {
// //       alert("User information is not loaded yet.");
// //       return;
// //     }

// //     if (!userInfo.emergencyNumber) {
// //       alert("No emergency number set for the user.");
// //       return;
// //     }

// //     // Log emergency number for debugging
// //     console.log("Emergency number:", userInfo.emergencyNumber);

// //     // Ensure the emergency number is treated as a string
// //     const phoneNumber = String(userInfo.emergencyNumber);

// //     if (Platform.OS === "ios") {
// //       // Attempt FaceTime for iOS
// //       const facetimeLink = `facetime:${phoneNumber}`;
// //       Linking.openURL(facetimeLink).catch((err) => {
// //         console.error("FaceTime failed, trying phone dialer:", err);
// //         const dialLink = `tel:${phoneNumber}`;
// //         Linking.openURL(dialLink).catch((error) => {
// //           console.error("Phone call failed:", error);
// //           alert("Failed to initiate a call.");
// //         });
// //       });
// //     } else if (Platform.OS === "android") {
// //       // Use the dialer for Android
// //       const dialLink = `tel:${phoneNumber}`;
// //       Linking.openURL(dialLink).catch((error) => {
// //         console.error("Phone call failed:", error);
// //         alert("Failed to initiate a call.");
// //       });
// //     } else {
// //       alert("This feature is only available on mobile devices.");
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Left: User's profile picture */}
// //       <View style={styles.profileContainer}>
// //         {userInfo?.imageUrl ? (
// //           <Image
// //             source={{ uri: userInfo.imageUrl }}
// //             style={styles.profileImage}
// //           />
// //         ) : (
// //           <MaterialCommunityIcons
// //             name="account-circle"
// //             size={60}
// //             color="#f3b718"
// //           />
// //         )}
// //       </View>

// //       {/* Middle: Emergency call button */}
// //       <TouchableOpacity onPress={handleCallSupport} style={styles.callButton}>
// //         <Text style={styles.EmergencyButton}>Call Emergency</Text>
// //         <MaterialCommunityIcons
// //           name="hospital-box-outline"
// //           style={styles.iconStyle}
// //           size={50}
// //           color="#f3b718"
// //         />
// //       </TouchableOpacity>

// //       {/* Right: Logo */}
// //       <View style={styles.logoContainer}>
// //         <Image source={image} style={styles.logoImage} />
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     width: viewportWidth * 0.92,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginTop: 45,
// //     marginBottom: 25,
// //     paddingTop: 12,
// //     padding: 20,
// //     alignSelf: "center",
// //     backgroundColor: "#FCF8E3", // same as background
// //     borderRadius: 10,
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 3,
// //       height: 7,
// //     },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     elevation: 8,
// //   },
// //   profileContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   profileImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     borderWidth: 2,
// //     borderColor: "#f3b718",
// //   },
// //   callButton: {
// //     backgroundColor: "#59ACCE",
// //     padding: 10,
// //     borderRadius: 15,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 8,
// //       height: 7,
// //     },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     elevation: 8,
// //     marginLeft: 60,
// //   },
// //   EmergencyButton: {
// //     color: "#2E3E5E",
// //     fontSize: 20,
// //     paddingRight: 10,
// //     paddingLeft: 20,
// //   },
// //   iconStyle: {
// //     marginRight: 7,
// //     paddingTop: 3,
// //   },
// //   logoContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   logoImage: {
// //     width: 130,
// //     height: 62,
// //   },
// // });

// // export default HelpButton;
// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   Image,
// //   Modal,
// //   StyleSheet,
// //   Dimensions,
// //   ScrollView,
// // } from "react-native";
// // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // Ensure this path is correct
// // import { doc, getDoc } from "firebase/firestore";
// // import Logout from "./Logout"; // Ensure this path is correct

// // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// // const HelpButton = () => {
// //   const [userInfo, setUserInfo] = useState(null);
// //   const [bioModalVisible, setBioModalVisible] = useState(false);

// //   // Fetch user data from Firestore
// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       const user = FIREBASE_AUTH.currentUser;
// //       if (user) {
// //         const userRef = doc(FIRESTORE_DB, "users", user.uid);
// //         const userSnap = await getDoc(userRef);
// //         if (userSnap.exists()) {
// //           setUserInfo(userSnap.data());
// //         } else {
// //           console.log("User document not found");
// //         }
// //       }
// //     };
// //     fetchUserData();
// //   }, []);

// //   const handleProfilePress = () => {
// //     setBioModalVisible(true); // Open bio modal when profile is pressed
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Profile Picture */}
// //       <TouchableOpacity
// //         onPress={handleProfilePress}
// //         style={styles.profileContainer}>
// //         {userInfo?.imageUrl ? (
// //           <Image
// //             source={{ uri: userInfo.imageUrl }}
// //             style={styles.profileImage}
// //           />
// //         ) : (
// //           <MaterialCommunityIcons
// //             name="account-circle"
// //             size={60}
// //             color="#f3b718"
// //           />
// //         )}
// //       </TouchableOpacity>

// //       {/* Emergency call button */}
// //       <TouchableOpacity style={styles.callButton}>
// //         <Text style={styles.EmergencyButton}>Call Emergency</Text>
// //         <MaterialCommunityIcons
// //           name="hospital-box-outline"
// //           style={styles.iconStyle}
// //           size={50}
// //           color="#f3b718"
// //         />
// //       </TouchableOpacity>

// //       {/* Logo */}
// //       <View style={styles.logoContainer}>
// //         <Image
// //           source={require("../assets/garden-loft-logo2.png")}
// //           style={styles.logoImage}
// //         />
// //       </View>

// //       {/* Bio Modal */}
// //       <Modal
// //         visible={bioModalVisible}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setBioModalVisible(false)}>
// //         <View style={styles.modalContainer}>
// //           <ScrollView contentContainerStyle={styles.modalContent}>
// //             <TouchableOpacity
// //               onPress={() => setBioModalVisible(false)}
// //               style={styles.closeButton}>
// //               <MaterialCommunityIcons name="close" size={30} color="black" />
// //             </TouchableOpacity>

// //             {/* Profile Image in Bio Card */}
// //             {userInfo?.imageUrl ? (
// //               <Image
// //                 source={{ uri: userInfo.imageUrl }}
// //                 style={styles.modalProfileImage}
// //               />
// //             ) : (
// //               <MaterialCommunityIcons
// //                 name="account-circle"
// //                 size={100}
// //                 color="#f3b718"
// //               />
// //             )}

// //             {/* User Information */}
// //             <Text style={styles.userName}>{userInfo?.userName || "User"}</Text>
// //             <Text style={styles.userDetails}>
// //               City: {userInfo?.city || "N/A"}
// //             </Text>

// //             <View style={styles.infoSection}>
// //               <Text style={styles.sectionTitle}>Hobbies</Text>
// //               {userInfo?.hobbies?.split(", ").map((hobby, index) => (
// //                 <Text key={index} style={styles.sectionContent}>
// //                   - {hobby}
// //                 </Text>
// //               ))}
// //             </View>
// //             <View style={styles.infoSection}>
// //               <Text style={styles.sectionTitle}>Clubs</Text>
// //               {userInfo?.clubs?.split(", ").map((club, index) => (
// //                 <Text key={index} style={styles.sectionContent}>
// //                   - {club}
// //                 </Text>
// //               ))}
// //             </View>

// //             {/* Embedded Logout Component */}
// //             <View style={styles.logoutContainer}>
// //               <Logout />
// //             </View>
// //           </ScrollView>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     width: SCREEN_WIDTH * 0.92,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginTop: 45,
// //     marginBottom: 25,
// //     paddingTop: 12,
// //     padding: 20,
// //     alignSelf: "center",
// //     backgroundColor: "#FCF8E3",
// //     borderRadius: 10,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 3, height: 7 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     elevation: 8,
// //   },
// //   profileContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   profileImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     borderWidth: 2,
// //     borderColor: "#f3b718",
// //   },
// //   callButton: {
// //     backgroundColor: "#59ACCE",
// //     padding: 10,
// //     borderRadius: 15,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 8, height: 7 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     elevation: 8,
// //     marginLeft: 60,
// //   },
// //   EmergencyButton: {
// //     color: "#2E3E5E",
// //     fontSize: 20,
// //     paddingRight: 10,
// //     paddingLeft: 20,
// //   },
// //   iconStyle: {
// //     marginRight: 7,
// //     paddingTop: 3,
// //   },
// //   logoContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   logoImage: {
// //     width: SCREEN_WIDTH < 380 ? 100 : 130,
// //     height: SCREEN_WIDTH < 380 ? 48 : 62,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0, 0, 0, 0.5)",
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0, 0, 0, 0.5)",
// //   },
// //   modalContent: {
// //     backgroundColor: "#fff",
// //     borderRadius: 20,
// //     padding: 20,
// //     marginTop: 20,
// //     width: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8, // Adapts width to the smaller dimension
// //     height: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8, // Adapts height for consistent sizing
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 5,
// //     elevation: 10,
// //   },
// //   logoutContainer: {
// //     marginTop: -80,
// //     alignSelf: "center",
// //     width: SCREEN_WIDTH * 0.7, // Aadjusted width for better fit
// //     paddingVertical: 12, // Consistent padding for touch area
// //     backgroundColor: "#f09030",
// //     borderRadius: 20,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     transform: [{ scale: SCREEN_WIDTH < 400 ? 0.9 : 1.1 }], // Scale based on width for consistent size
// //   },

// //   closeButton: {
// //     alignSelf: "flex-end",
// //   },
// //   modalProfileImage: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 60,
// //     borderWidth: 2,
// //     borderColor: "#f3b718",
// //     marginBottom: 10,
// //   },
// //   userName: {
// //     fontSize: 30,
// //     fontWeight: "bold",
// //     color: "#333",
// //     textAlign: "center",
// //   },
// //   userDetails: {
// //     fontSize: 18,
// //     color: "#555",
// //     // marginVertical: 5,
// //   },
// //   infoSection: {
// //     width: "100%",
// //     marginTop: 10,
// //   },
// //   sectionTitle: {
// //     fontSize: 21,
// //     fontWeight: "600",
// //     color: "#333",
// //     marginVertical: 5,
// //   },
// //   sectionContent: {
// //     fontSize: 18,
// //     color: "#666",
// //     marginLeft: 10,
// //   },
// //   logoutContainer: {
// //     marginTop: -80,
// //     width: SCREEN_WIDTH * 0.8,
// //     alignSelf: "center",
// //     transform: [{ scale: SCREEN_WIDTH < 400 ? 0.8 : 1.2 }],
// //   },
// // });

// // export default HelpButton;
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Modal,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import Logout from "./Logout";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// const HelpButton = () => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [bioModalVisible, setBioModalVisible] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = FIREBASE_AUTH.currentUser;
//       if (user) {
//         const userRef = doc(FIRESTORE_DB, "users", user.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           setUserInfo(userSnap.data());
//         } else {
//           console.log("User document not found");
//         }
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleProfilePress = () => {
//     setBioModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={handleProfilePress}
//         style={styles.profileContainer}>
//         {userInfo?.imageUrl ? (
//           <Image
//             source={{ uri: userInfo.imageUrl }}
//             style={styles.profileImage}
//           />
//         ) : (
//           <MaterialCommunityIcons
//             name="account-circle"
//             size={50}
//             color="#f3b718"
//           />
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.callButton}>
//         <Text style={styles.emergencyButtonText}>Call Emergency</Text>
//         <MaterialCommunityIcons
//           name="hospital-box-outline"
//           style={styles.iconStyle}
//           size={SCREEN_WIDTH < 375 ? 30 : SCREEN_WIDTH < 430 ? 40 : 50}
//           color="#f3b718"
//         />
//       </TouchableOpacity>

//       <View style={styles.logoContainer}>
//         <Image
//           source={require("../assets/garden-loft-logo2.png")}
//           style={styles.logoImage}
//         />
//       </View>

//       <Modal
//         visible={bioModalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setBioModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <TouchableOpacity
//               onPress={() => setBioModalVisible(false)}
//               style={styles.closeButton}>
//               <MaterialCommunityIcons name="close" size={30} color="black" />
//             </TouchableOpacity>

//             {userInfo?.imageUrl ? (
//               <Image
//                 source={{ uri: userInfo.imageUrl }}
//                 style={styles.modalProfileImage}
//               />
//             ) : (
//               <MaterialCommunityIcons
//                 name="account-circle"
//                 size={100}
//                 color="#f3b718"
//               />
//             )}

//             <Text style={styles.userName}>{userInfo?.userName || "User"}</Text>
//             <Text style={styles.userDetails}>
//               City: {userInfo?.city || "N/A"}
//             </Text>

//             <View style={styles.infoSection}>
//               <Text style={styles.sectionTitle}>Hobbies</Text>
//               {userInfo?.hobbies?.split(", ").map((hobby, index) => (
//                 <Text key={index} style={styles.sectionContent}>
//                   - {hobby}
//                 </Text>
//               ))}
//             </View>

//             <View style={styles.infoSection}>
//               <Text style={styles.sectionTitle}>Clubs</Text>
//               {userInfo?.clubs?.split(", ").map((club, index) => (
//                 <Text key={index} style={styles.sectionContent}>
//                   - {club}
//                 </Text>
//               ))}
//             </View>

//             <View style={styles.logoutContainer}>
//               <Logout />
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: SCREEN_WIDTH * 0.92,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 45,
//     marginBottom: 25,
//     paddingTop: 12,
//     padding: 20,
//     alignSelf: "center",
//     backgroundColor: "#FCF8E3",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 3, height: 7 },
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 8,
//   },
//   profileContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     borderWidth: 2,
//     borderColor: "#f3b718",
//   },
//   callButton: {
//     backgroundColor: "#59ACCE",
//     paddingHorizontal: SCREEN_WIDTH < 375 ? 8 : SCREEN_WIDTH < 430 ? 10 : 20,
//     paddingVertical: 9,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 4, height: 5 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 6,
//     maxWidth: SCREEN_WIDTH < 375 ? 160 : SCREEN_WIDTH < 430 ? 180 : 250,
//   },
//   emergencyButtonText: {
//     color: "#2E3E5E",
//     fontSize: SCREEN_WIDTH < 375 ? 14 : SCREEN_WIDTH < 430 ? 16 : 18,
//     paddingRight: SCREEN_WIDTH < 375 ? 4 : 6,
//     paddingLeft: SCREEN_WIDTH < 375 ? 6 : 10,
//   },
//   iconStyle: {
//     marginRight: 5,
//     paddingTop: 3,
//   },
//   logoContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoImage: {
//     width: SCREEN_WIDTH < 375 ? 90 : SCREEN_WIDTH < 430 ? 110 : 130,
//     height: SCREEN_WIDTH < 375 ? 40 : SCREEN_WIDTH < 430 ? 50 : 60,
//   },
//   modalContainer: {
//     flex: 1,

//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     marginTop: 20,
//     width: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8,
//     height: Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.98,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 10,
//   },
//   logoutContainer: {
//     marginTop: 20,
//     alignSelf: "center",
//     width: SCREEN_WIDTH * 0.9,
//     height: SCREEN_HEIGHT * 0.5,
//     paddingVertical: 12,
//     backgroundColor: "#f09030",
//     borderRadius: 9,
//     justifyContent: "center",
//     alignItems: "center",
//     transform: [{ scale: SCREEN_WIDTH < 413 ? 0.9 : 2 }],
//   },

//   logoutButton: {
//     fontSize: SCREEN_WIDTH < 375 ? 16 : 18, // Smaller font size
//     color: "white",
//     fontWeight: "bold",
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//   },
//   modalProfileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 60,
//     borderWidth: 2,
//     borderColor: "#f3b718",
//     marginBottom: 10,
//   },
//   userName: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#333",
//     textAlign: "center",
//   },
//   userDetails: {
//     fontSize: 18,
//     color: "#555",
//   },
//   infoSection: {
//     width: "100%",
//     marginTop: 10,
//   },
//   sectionTitle: {
//     fontSize: 21,
//     fontWeight: "600",
//     color: "#333",
//     marginVertical: 5,
//   },
//   sectionContent: {
//     fontSize: 18,
//     color: "#666",
//     marginLeft: 10,
//   },
// });

// export default HelpButton;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Dimensions,

} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as Linking from "expo-linking";
import Logout from "./Logout";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const HelpButton = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [bioModalVisible, setBioModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For missing emergency contact

  // FaceTime link
  const FACETIME_LINK = "https://facetime.apple.com/join#v=1&p=XEhJ9qklEe+Nf97v/61Iyg&k=8EJy-2zZvED8dUqzwNbZ_A-h7g0EEzEKTLWTh63K0KU";

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

  const handleProfilePress = () => {
    setBioModalVisible(true);
  };


    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture  */}
      <TouchableOpacity
        onPress={handleProfilePress}
        style={styles.profileContainer}>
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


        <MaterialCommunityIcons
          name="video"
          style={styles.iconStyle}
          size={SCREEN_WIDTH < 375 ? 30 : SCREEN_WIDTH < 430 ? 40 : 50}
          color="#f3b718"
        />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/garden-loft-logo2.png")}
          style={styles.logoImage}
        />
      </View>

      {/* Modal for Missing Emergency Contact */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Emergency contact has not been set.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bio Modal */}
      <Modal
        visible={bioModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBioModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setBioModalVisible(false)}
              style={styles.closeButton}>
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

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Clubs</Text>
              {userInfo?.clubs?.split(", ").map((club, index) => (
                <Text key={index} style={styles.sectionContent}>
                  - {club}
                </Text>
              ))}
            </View>

            <View style={styles.logoutContainer}>
              <Logout />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    paddingHorizontal: SCREEN_WIDTH < 375 ? 8 : SCREEN_WIDTH < 430 ? 10 : 20,
    paddingVertical: 9,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  emergencyButtonText: {
    color: "#2E3E5E",
    fontSize: SCREEN_WIDTH < 375 ? 14 : SCREEN_WIDTH < 430 ? 16 : 18,
    paddingRight: SCREEN_WIDTH < 375 ? 4 : 6,
    paddingLeft: SCREEN_WIDTH < 375 ? 6 : 10,
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
  logoutContainer: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default HelpButton;