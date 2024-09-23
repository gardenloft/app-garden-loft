// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Image,
//   Alert,
// } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { FontAwesome } from "@expo/vector-icons";
// import {
//   collection,
//   addDoc,
//   query,
//   getDocs,
//   doc,
//   setDoc,
// } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const defaultImage = {
//   elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
//   shari: require("../assets/images/portrait2.jpg"),
//   pat: require("../assets/images/portrait4.jpg"),
//   john: require("../assets/images/portrait3.jpg"),
//   matthew: require("../assets/images/portrait5.jpg"),
// };

// const GLClub = () => {
//   const [contacts, setContacts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollViewRef = useRef(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       fetchUserNames();
//     }
//   }, [user]);

//   const fetchUserNames = async () => {
//     const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
//     const fetchedContacts = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().userName,
//       meetingId: doc.data().meetingId || "",
//       imageUrl: defaultImage[doc.data().userName] || defaultImage.john,
//     }));
//     setContacts(fetchedContacts);
//     if (user) {
//       checkContactsInDatabase(user.uid, fetchedContacts);
//     }
//   };

//   const checkContactsInDatabase = async (uid, fetchedContacts) => {
//     const contactsQuery = query(
//       collection(FIRESTORE_DB, `users/${uid}/addedContacts`)
//     );
//     const querySnapshot = await getDocs(contactsQuery);
//     const dbContacts = querySnapshot.docs.map((doc) => doc.data().name);

//     const updatedContacts = fetchedContacts.map((contact) => ({
//       ...contact,
//       isAdded: dbContacts.includes(contact.name),
//     }));

//     setContacts(updatedContacts);
//   };

//   const handleAddContact = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     if (contact.isAdded) {
//       Alert.alert("Contact already added.");
//       return;
//     }

//     try {
//       await setDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/addedContacts`, contact.id),
//         {
//           name: contact.name,
//           meetingId: contact.meetingId,
//           imageUrl: contact.imageUrl,
//         }
//       );
//       Alert.alert("Contact added successfully");
//       fetchUserNames(); // Refresh the contacts list
//     } catch (error) {
//       console.error("Error adding contact: ", error);
//       Alert.alert("Error adding contact.");
//     }
//   };

//   const renderItem = ({ item }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor:
//             item.id === contacts[activeIndex]?.id ? "#f3b718" : "#f09030",
//           transform:
//             item.id === contacts[activeIndex]?.id
//               ? [{ scale: 1 }]
//               : [{ scale: 0.8 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => handleAddContact(item)}>
//       <Image source={item.imageUrl} style={styles.image} />
//       <Text style={styles.cardText}>{item.name}</Text>
//       <FontAwesome
//         name={item.isAdded ? "check-circle" : "plus-circle"}
//         size={24}
//         color={item.isAdded ? "green" : "white"}
//         style={styles.iconStyle}
//       />
//     </Pressable>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           height: viewportWidth > viewportHeight ? 320 : 450,
//         },
//       ]}>
//       <Carousel
//         ref={scrollViewRef}
//         data={contacts}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         scrollAnimationDuration={800}
//         loop
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       <Pressable
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: -1, animated: true });
//         }}>
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//       <Pressable
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: 1, animated: true });
//         }}>
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 20,
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 30,
//     color: "#393939",
//     fontWeight: "700",
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   iconStyle: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//   },
//   arrowLeft: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
// });

// export default GLClub;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Image,
//   Alert,
//   Modal, // Import Modal
//   ScrollView,
// } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { FontAwesome } from "@expo/vector-icons";
// import { collection, getDocs, doc, setDoc } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const defaultImage = {
//   elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
//   shari: require("../assets/images/portrait2.jpg"),
//   pat: require("../assets/images/portrait4.jpg"),
//   john: require("../assets/images/portrait3.jpg"),
//   matthew: require("../assets/images/portrait5.jpg"),
// };

// const GLClub = () => {
//   const [contacts, setContacts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
//   const [selectedContact, setSelectedContact] = useState(null); // Selected contact state
//   const [likedContacts, setLikedContacts] = useState([]); // State to manage liked contacts

//   const scrollViewRef = useRef(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       fetchUserNames();
//     }
//   }, [user]);

//   const fetchUserNames = async () => {
//     const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
//     const fetchedContacts = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().userName,
//       age: doc.data().age || "50", // Added age
//       city: doc.data().city || "Calgary", // Added city
//       hobbies: doc.data().hobbies || ["Reading, Painting"], // Added hobbies
//       clubs: doc.data().clubs || ["Book, Knitting"], // Added clubs
//       meetingId: doc.data().meetingId || "",
//       imageUrl: defaultImage[doc.data().userName] || defaultImage.john,
//     }));
//     setContacts(fetchedContacts);
//     if (user) {
//       checkContactsInDatabase(user.uid, fetchedContacts);
//     }
//   };

//   const checkContactsInDatabase = async (uid, fetchedContacts) => {
//     const contactsQuery = query(
//       collection(FIRESTORE_DB, `users/${uid}/addedContacts`)
//     );
//     const querySnapshot = await getDocs(contactsQuery);
//     const dbContacts = querySnapshot.docs.map((doc) => doc.data().name);

//     const updatedContacts = fetchedContacts.map((contact) => ({
//       ...contact,
//       isAdded: dbContacts.includes(contact.name),
//     }));

//     setContacts(updatedContacts);
//   };
//   const handleLikeContact = (contact) => {
//     if (likedContacts.includes(contact.id)) {
//       setLikedContacts(likedContacts.filter((id) => id !== contact.id));
//     } else {
//       setLikedContacts([...likedContacts, contact.id]);
//     }
//   };

//   const handleAddContact = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     if (contact.isAdded) {
//       Alert.alert("Contact already added.");
//       return;
//     }

//     try {
//       await setDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/addedContacts`, contact.id),
//         {
//           name: contact.name,
//           meetingId: contact.meetingId,
//           imageUrl: contact.imageUrl,
//           isRequestPending: true,
//         }
//       );

//       // Update the contacts state to reflect the added contact
//       setContacts((prevContacts) =>
//         prevContacts.map((c) =>
//           c.id === contact.id ? { ...c, isAdded: true } : c
//         )
//       );

//       // Update the selected contact to reflect the added status
//       setSelectedContact((prevContact) =>
//         prevContact && prevContact.id === contact.id
//           ? { ...prevContact, isAdded: true }
//           : prevContact
//       );

//       Alert.alert("Contact added successfully");
//     } catch (error) {
//       console.error("Error adding contact: ", error);
//       Alert.alert("Error adding contact.");
//     }
//   };

//   const handleCardPress = (contact) => {
//     setSelectedContact(contact); // Set selected contact details
//     setModalVisible(true); // Show modal
//   };

//   const renderItem = ({ item }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor:
//             item.id === contacts[activeIndex]?.id ? "transparent" : "transparent",
//           transform:
//             item.id === contacts[activeIndex]?.id
//               ? [{ scale: 1.1 }]
//               : [{ scale: 1.1 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => handleCardPress(item)} // Handle card press event
//     >
//       <Image source={item.imageUrl} style={styles.image} />
//       <Text style={styles.cardText}>{item.name}</Text>

//       {/* Conditional Rendering for Icon */}
//       {/* {item.isAdded ? (
//         <FontAwesome
//           name="check-circle"
//           size={24}
//           color="green"
//           style={styles.iconStyle}
//         />
//       ) : (
//         <Pressable onPress={() => handleAddContact(item)}>
//           <FontAwesome
//             name="plus-circle"
//             size={24}
//             color="white"
//             style={styles.iconStyle}
//           />
//         </Pressable>
//       )} */}
//     </Pressable>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           height: viewportWidth > viewportHeight ? 320 : 450,
//         },
//       ]}
//     >
//       <Carousel
//         ref={scrollViewRef}
//         data={contacts}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         scrollAnimationDuration={800}
//         loop
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       <Pressable
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: -1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//       <Pressable
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: 1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>

//       {/* Modal for displaying contact details */}
//       {selectedContact && (
//         <Modal
//           visible={modalVisible}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Image
//                 source={selectedContact.imageUrl}
//                 style={styles.modalImage}
//               />
//               <View style={styles.modalInfoContainer}>
//                 <Text style={styles.modalName}>
//                   {selectedContact.name}, {selectedContact.age}
//                 </Text>
//                 <Text style={styles.modalText}>
//                   City: {selectedContact.city}
//                 </Text>
//                 <Text style={styles.modalText}>Hobbies:</Text>
//                 {selectedContact.hobbies.map((hobby, index) => (
//                   <Text key={index} style={styles.modalText}>
//                     - {hobby}
//                   </Text>
//                 ))}
//                 <Text style={styles.modalText}>Clubs:</Text>
//                 {selectedContact.clubs.map((club, index) => (
//                   <Text key={index} style={styles.modalText}>
//                     - {club}
//                   </Text>
//                 ))}

//                 <View style={styles.actionContainer}>
//                   <Pressable onPress={() => handleLikeContact(selectedContact)}>
//                     <Text style={styles.iconText}>Like a friend</Text>
//                     <FontAwesome
//                       name={
//                         likedContacts.includes(selectedContact.id)
//                           ? "heart"
//                           : "heart-o"
//                       }
//                       size={40} // Increased size
//                       color={
//                         likedContacts.includes(selectedContact.id)
//                           ? "red"
//                           : "gray"
//                       }
//                       style={styles.modalIcon}
//                     />
//                   </Pressable>

//                   {/* Check if the contact is added */}
//                   {selectedContact.isAdded ? (
//                     <FontAwesome
//                       name="check-circle"
//                       size={40}
//                       color="green" // Heart color after adding
//                       style={styles.modalIcon}
//                     />
//                   ) : (
//                     <Pressable
//                       onPress={() => handleAddContact(selectedContact)}
//                     >
//                       <Text style={styles.iconText}>Add a friend</Text>
//                       <FontAwesome
//                         name="plus-circle"
//                         size={40}
//                         color="#4169E1"
//                         style={styles.modalIcon}
//                       />
//                     </Pressable>
//                   )}

//                   <Pressable
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Text style={styles.closeButtonText}>Close</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 20,
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 30,
//     color: "#393939",
//     fontWeight: "700",
//   },
//   image: {
//     // this is oval
//     //  width: 120,          // Adjust the width based on your needs
//     // height: 180,         // Adjust the height to create an oval shape
//     // borderRadius: 90,    // Make sure this is half of the height to create the oval effect
//     // borderWidth: 3,      // Optional border for decoration
//     // borderColor: '#FFD700', // Example border color (you can change it)
//     // marginBottom: 10,
//     // shadowColor: "#000", // Optional shadow for depth
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.8,
//     // shadowRadius: 2,
//     // elevation: 5,       // Android shadow
//     // backgroundColor: '#fff' // Optional background color

//     // this is circle
//      width: 170,
//      height: 170,
//      borderRadius: 180,  // Circular shape
//     //  borderWidth: 2,    // Optional border width
//     //  borderColor: '#fff', // Optional border color
//      marginBottom: 10,
//      shadowColor: "#000", // Optional shadow
//      shadowOffset: { width: 0, height: 2 },
//      shadowOpacity: 0.8,
//      shadowRadius: 2,
//      elevation: 5,      // Shadow for Android

//     //this is the square
//     // width: 180,
//     // height: 190,
//     // borderRadius: 20, // This gives the rounded corners
//     // marginBottom: -5,
//     // shadowColor: "#000", // Optional shadow
//     // shadowOffset: { width: 0, height: 2 },
//     // borderWidth: 3,
//     // borderColor: "#FFD700", // Example border color (you can change it)
//     // shadowOpacity: 0.8,
//     // shadowRadius: 2,
//     // elevation: 5, // Shadow for Android
//   },

//   iconStyle: {
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//   },
//   arrowLeft: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   // Modal styles
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background overlay
//   },
//   modalContent: {
//     flexDirection: "row", // Side by side layout
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: viewportWidth * 0.85, // Slightly wider modal for content
//     height: viewportHeight * 0.65,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 8, // Increased shadow for better elevation
//   },
//   modalImage: {
//     //this is oval
//     // width: 120,          // Adjust the width based on your needs
//     // height: 180,         // Adjust the height to create an oval shape
//     // borderRadius: 90,    // Make sure this is half of the height to create the oval effect
//     // borderWidth: 3,      // Optional border for decoration
//     // borderColor: '#FFD700', // Example border color (you can change it)
//     // marginBottom: 10,
//     // marginRight: 40, // Space between the image and text
//     // shadowColor: "#000", // Optional shadow for depth
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.8,
//     // shadowRadius: 2,
//     // elevation: 5,       // Android shadow
//     // backgroundColor: '#fff' // Optional background color

//     // this is circle
//      width: 400,
//      height: 400,
//      borderRadius: 190,  // Circular shape
//      borderWidth: 2,    // Optional border width
//      borderColor: '#FFD700', // Optional border color
//      marginBottom: 10,
//      marginRight: 40, // Space between the image and text
//      shadowColor: "#000", // Optional shadow
//      shadowOffset: { width: 0, height: 2 },
//      shadowOpacity: 0.8,
//      shadowRadius: 2,
//      elevation: 5,

//     //this is the square
//     // width: 300,
//     // height: 500,
//     // borderRadius: 20, // This gives the rounded corners
//     // marginBottom: 10,
//     // marginRight: 40, // Space between the image and text
//     // borderWidth: 3,
//     // borderColor: "#FFD700", // Example border color (you can change it)
//     // shadowColor: "#000", // Optional shadow
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.8,
//     // shadowRadius: 2,
//     // elevation: 5, // Shadow for Android
//   },
//   modalInfoContainer: {
//     flex: 1, // Takes up remaining space
//     justifyContent: "flex-start",
//   },
//   modalName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 20,
//     color: "#666",
//     marginBottom: 9,
//   },

//   actionContainer: {
//     flexDirection: "row", // Align items horizontally
//     justifyContent: "space-evenly", // Distribute space between icons and button
//     alignItems: "center", // Center items vertically
//     marginTop: 20, // Add margin to separate from the content above
//     marginLeft: -120,
//   },
//   modalIcon: {
//     marginHorizontal: 2, // Adjust spacing between icons
//   },
//   closeButton: {
//     backgroundColor: "#f09030",
//     borderRadius: 50,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default GLClub;
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Image,
//   Alert,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   ActivityIndicator
// } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { FontAwesome } from "@expo/vector-icons";
// import {
//   collection,
//   getDocs,
//   doc,
//   setDoc,
//   deleteDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";
// import { useRouter } from "expo-router";
// import * as Notifications from "expo-notifications"; // Import for notifications
// import { callUser } from "../app/VideoSDK2"; // Import from VideoCall

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// const defaultImage = {
//   elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
//   shari: require("../assets/images/portrait2.jpg"),
//   pat: require("../assets/images/portrait4.jpg"),
//   john: require("../assets/images/portrait3.jpg"),
//   matthew: require("../assets/images/portrait5.jpg"),
// };

// const GLClub = () => {
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [friendRequests, setFriendRequests] = useState({});
//   const [friends, setFriends] = useState([]);
//   const [isCalling, setIsCalling] = useState(false); // Add for call logic

//   const carouselRef = useRef(null);

//   const auth = getAuth();
//   const user = auth.currentUser;
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       fetchUserNames();
//       listenToFriendRequests();
//       listenToFriends();
//     }
//   }, [user]);

//   useEffect(() => {
//     filterAndSortContacts();
//   }, [contacts, filter, friendRequests, friends]);

//   const fetchUserNames = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
//       const fetchedContacts = querySnapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           name: data.userName || "Unknown User",
//           city: data.city || "Calgary",
//           hobbies: data.hobbies || ["Reading", "Painting"],
//           clubs: data.clubs || ["Book", "Knitting"],
//           meetingId: data.meetingId || "",
//           imageUrl: defaultImage[data.userName] || defaultImage.john,
//         };
//       });
//       setContacts(fetchedContacts);
//     } catch (error) {
//       console.error("Error fetching user names: ", error);
//     }
//   };

//   const listenToFriendRequests = () => {
//     const friendRequestsRef = collection(
//       FIRESTORE_DB,
//       `users/${user.uid}/friendRequests`
//     );
//     const unsubscribe = onSnapshot(friendRequestsRef, (snapshot) => {
//       const requests = {};
//       snapshot.forEach((doc) => {
//         const request = doc.data();
//         const role = request.senderId === user.uid ? "sender" : "receiver";
//         requests[doc.id] = { ...request, role };
//       });
//       setFriendRequests(requests);
//     });

//     return () => unsubscribe();
//   };

//   const listenToFriends = () => {
//     const friendsRef = collection(FIRESTORE_DB, `users/${user.uid}/friends`);
//     const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
//       const friendsList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setFriends(friendsList);
//     });

//     return () => unsubscribe();
//   };

//   const filterAndSortContacts = () => {
//     let filtered = contacts;
//     if (filter === "friends") {
//       filtered = contacts.filter((contact) =>
//         friends.some((friend) => friend.id === contact.id)
//       );
//     }
//     filtered.sort((a, b) => {
//       const nameA = (a.name || "").toLowerCase();
//       const nameB = (b.name || "").toLowerCase();
//       return nameA.localeCompare(nameB);
//     });
//     setFilteredContacts([...new Set(filtered)]);
//   };

//   const handleAddFriend = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     try {
//       await setDoc(
//         doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
//         {
//           status: "pending",
//           senderName: user.displayName || user.email,
//           senderId: user.uid,
//         }
//       );

//       Alert.alert("Friend request sent successfully");

//       setFriendRequests((prevRequests) => ({
//         ...prevRequests,
//         [contact.id]: { status: "pending", role: "sender" },
//       }));
//     } catch (error) {
//       console.error("Error sending friend request: ", error);
//       Alert.alert("Error sending friend request.");
//     }
//   };

//   const handleAcceptFriend = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     try {
//       await setDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id),
//         { status: "accepted" }
//       );
//       await setDoc(
//         doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
//         { status: "accepted" }
//       );

//       await setDoc(doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id), {
//         name: contact.name,
//         city: contact.city,
//         hobbies: contact.hobbies,
//         clubs: contact.clubs,
//         imageUrl: contact.imageUrl,
//       });

//       await setDoc(doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid), {
//         name: user.userName || user.email,
//         city: "Calgary",
//         hobbies: ["Reading", "Painting"],
//         clubs: ["Book", "Knitting"],
//         imageUrl: defaultImage[user.displayName] || defaultImage.john,
//       });

//       setFriendRequests((prevRequests) => ({
//         ...prevRequests,
//         [contact.id]: "accepted",
//       }));

//       Alert.alert("Friend request accepted");
//     } catch (error) {
//       console.error("Error accepting friend request: ", error);
//       Alert.alert("Error accepting friend request.");
//     }
//   };

//   const handleDeclineFriend = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     try {
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
//       );
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
//       );

//       setFriendRequests((prevRequests) => {
//         const newRequests = { ...prevRequests };
//         delete newRequests[contact.id];
//         return newRequests;
//       });

//       Alert.alert("Friend request declined");
//     } catch (error) {
//       console.error("Error declining friend request: ", error);
//       Alert.alert("Error declining friend request.");
//     }
//   };

//   const handleUnfriend = async (contact) => {
//     if (!user) {
//       Alert.alert("No user signed in");
//       return;
//     }

//     try {
//       // Remove friend from current user's friends subcollection
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id)
//       );

//       // Remove current user from friend's friends subcollection
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid)
//       );

//       // Remove any friend requests between the users
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
//       );
//       await deleteDoc(
//         doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
//       );

//       // Update local friendRequests state
//       setFriendRequests((prevRequests) => {
//         const updatedRequests = { ...prevRequests };
//         delete updatedRequests[contact.id];
//         return updatedRequests;
//       });

//       // Update local friends state
//       setFriends((prevFriends) =>
//         prevFriends.filter((friend) => friend.id !== contact.id)
//       );

//       Alert.alert("Unfriended successfully");
//     } catch (error) {
//       console.error("Error unfriending:", error);
//       Alert.alert("Error unfriending.");
//     }
//   };

//    // Function to initiate a video call (from VideoCall)
//    const startVideoCall = async (calleeUid) => {
//     if (!user) {
//       console.error("User not authenticated");
//       return;
//     }

//     setIsCalling(true); // Show the calling modal

//     await callUser(calleeUid, user); // Use the imported callUser function

//     const notificationListener = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         const { accept, meetingId } = notification.request.content.data;
//         if (accept) {
//           setIsCalling(false); // Hide the calling modal
//           router.push({
//             pathname: "/VideoSDK2",
//             params: { meetingId, autoJoin: true },
//           });
//         }
//       }
//     );

//     return () => {
//       if (notificationListener) {
//         Notifications.removeNotificationSubscription(notificationListener);
//       }
//     };
//   };

//   const handleCall = (contactId) => {
//     // Close modal and initiate video call
//     // setModalVisible(false);
//     // router.push({
//     //   pathname: "/VideoSDK2",
//     //   params: { calleeUid: contactId },
//     // });
//     setModalVisible(false); // Close modal
//     startVideoCall(contactId); // Start the video call using the contact's ID
//   };

//   const handleCardPress = (contact) => {
//     setSelectedContact(contact);
//     setModalVisible(true);
//   };

//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: "transparent",
//           transform: [{ scale: 1.1 }],
//         },
//         {
//           height:
//             SCREEN_WIDTH > SCREEN_HEIGHT
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => handleCardPress(item)}>
//       <Image source={item.imageUrl} style={styles.image} />
//       <Text style={styles.cardText}>
//         {item.name}
//         {friendRequests[item.id]?.status === "accepted" && (
//           <FontAwesome
//             name="check-circle"
//             size={40} // Bigger tick mark
//             color="green"
//             style={styles.nameIconStyle}
//           />
//         )}
//         {friendRequests[item.id]?.status === "pending" && (
//           <FontAwesome
//             name="question-circle"
//             size={40} // Bigger pending icon
//             color="orange"
//             style={styles.nameIconStyle}
//           />
//         )}
//       </Text>
//     </Pressable>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View
//         style={[
//           styles.container,
//           {
//             height: SCREEN_WIDTH > SCREEN_HEIGHT ? 920 : 450,
//             marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : 45
//           },
//         ]}>
//         <View style={styles.filterButtons}>
//           <Pressable
//             style={[
//               styles.filterButton,
//               filter === "all" && styles.activeFilterButton,
//             ]}
//             onPress={() => setFilter("all")}>
//             <Text
//               style={[
//                 styles.filterButtonText,
//                 filter === "all" && styles.activeFilterButtonText,
//               ]}>
//               All
//             </Text>
//           </Pressable>
//           <Pressable
//             style={[
//               styles.filterButton,
//               filter === "friends" && styles.activeFilterButton,
//             ]}
//             onPress={() => setFilter("friends")}>
//             <Text
//               style={[
//                 styles.filterButtonText,
//                 filter === "friends" && styles.activeFilterButtonText,
//               ]}>
//               My Friends
//             </Text>
//           </Pressable>
//         </View>

//         <Carousel
//           ref={carouselRef}
//           data={filteredContacts}
//           renderItem={renderItem}
//           width={SCREEN_WIDTH * 0.3}
//           height={SCREEN_WIDTH * 0.3}
//           style={{
//             width: Math.round(SCREEN_WIDTH * 0.9),
//             height: Math.round(SCREEN_HEIGHT * 0.5),
//           }}
//           loop
//           onSnapToItem={(index) => setActiveIndex(index)}
//           pagingEnabled
//         />

//         <Pressable
//           style={[
//             styles.arrowLeft,
//             {
//               left: SCREEN_WIDTH > SCREEN_HEIGHT ? -17 : -22,
//               top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
//             },
//           ]}
//           onPress={() => {
//             carouselRef.current?.scrollTo({ count: -1, animated: true });
//           }}>
//           <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//         </Pressable>
//         <Pressable
//           style={[
//             styles.arrowRight,
//             {
//               right: SCREEN_WIDTH > SCREEN_HEIGHT ? -25 : -22,
//               top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
//             },
//           ]}
//           onPress={() => {
//             carouselRef.current?.scrollTo({ count: 1, animated: true });
//           }}>
//           <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//         </Pressable>

//         {selectedContact && (
//           <Modal
//             visible={modalVisible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={() => setModalVisible(false)}>
//             <View style={styles.modalContainer}>
//               <ScrollView contentContainerStyle={styles.modalContent}>
//                 <Image
//                   source={selectedContact.imageUrl}
//                   style={styles.modalImage}
//                 />
//                 <View style={styles.modalInfoContainer}>
//                   <Text style={styles.modalName}>{selectedContact.name}</Text>
//                   <Text style={styles.modalText}>
//                     City: {selectedContact.city}
//                   </Text>
//                   <Text style={styles.modalInterestsTitle}>Interests:</Text>
//                   {selectedContact.hobbies.map((hobby, index) => (
//                     <Text key={index} style={styles.modalInterests}>
//                       - {hobby}
//                     </Text>
//                   ))}
//                   <Text style={styles.modalInterestsTitle}>Clubs:</Text>
//                   {selectedContact.clubs.map((club, index) => (
//                     <Text key={index} style={styles.modalInterests}>
//                       - {club}
//                     </Text>
//                   ))}

//                   <View style={styles.actionContainer}>
//                     {!friendRequests[selectedContact.id] && (
//                       <Pressable
//                         onPress={() => handleAddFriend(selectedContact)}
//                         style={styles.actionButton}>
//                         <Text style={styles.actionButtonText}>Add Friend</Text>
//                         <FontAwesome
//                           name="user-plus"
//                           size={24}
//                           color="#4169E1"
//                           style={styles.modalIcon}
//                         />
//                       </Pressable>
//                     )}
//                     {friendRequests[selectedContact.id]?.role === "receiver" &&
//                       friendRequests[selectedContact.id].status ===
//                         "pending" && (
//                         <>
//                           <Pressable
//                             onPress={() => handleAcceptFriend(selectedContact)}
//                             style={styles.actionButton}>
//                             <Text style={styles.actionButtonText}>Accept</Text>
//                             <FontAwesome
//                               name="check-circle"
//                               size={24}
//                               color="green"
//                               style={styles.modalIcon}
//                             />
//                           </Pressable>
//                           <Pressable
//                             onPress={() => handleDeclineFriend(selectedContact)}
//                             style={styles.actionButton}>
//                             <Text style={styles.actionButtonText}>Decline</Text>
//                             <FontAwesome
//                               name="times-circle"
//                               size={24}
//                               color="red"
//                               style={styles.modalIcon}
//                             />
//                           </Pressable>
//                         </>
//                       )}
//                     {friendRequests[selectedContact.id]?.role === "sender" &&
//                       friendRequests[selectedContact.id].status ===
//                         "pending" && (
//                         <Text style={styles.pendingText}>
//                           Friend request sent
//                         </Text>
//                       )}
//                     {friendRequests[selectedContact.id]?.status ===
//                       "accepted" && (
//                       <>
//                         <Pressable
//                           onPress={() => handleCall(selectedContact.id)}
//                           style={styles.actionButton}>
//                           <Text style={styles.actionButtonText}>Call</Text>
//                           <FontAwesome
//                             name="video-camera"
//                             size={24}
//                             color="green"
//                             style={styles.modalIcon}
//                           />
//                         </Pressable>
//                         <Pressable
//                           onPress={() => handleUnfriend(selectedContact)}
//                           style={styles.actionButton}>
//                           <Text style={styles.actionButtonText}>Unfriend</Text>
//                           <FontAwesome
//                             name="user-times"
//                             size={24}
//                             color="red"
//                             style={styles.modalIcon}
//                           />
//                         </Pressable>
//                       </>
//                     )}
//                     <Pressable
//                       style={styles.closeButton}
//                       onPress={() => setModalVisible(false)}>
//                       <Text style={styles.closeButtonText}>Close</Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               </ScrollView>
//             </View>
//           </Modal>
//         )}
//           <Modal visible={isCalling} animationType="fade" transparent={true}>
//           <View style={styles.modalContainer}>
//             <ActivityIndicator size="large" color="#f3b718" />
//             <Text style={styles.modalTextCall}>Calling . . .</Text>
//           </View>
//         </Modal>
      
//       </View>
  
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   container: {
//     // flex: 1,
//     alignItems: "center",
//     // justifyContent: "flex-start",
//     position: "relative",
//   },
//   filterButtons: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: SCREEN_HEIGHT * 0.04,
//     marginTop: SCREEN_HEIGHT * 0.22,
//   },
//   filterButton: {
//     paddingHorizontal: SCREEN_WIDTH * 0.05,
//     paddingVertical: SCREEN_HEIGHT * 0.015,
//     marginHorizontal: SCREEN_WIDTH * 0.02,
//     borderRadius: 20,
//     backgroundColor: "grey",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   activeFilterButton: {
//     backgroundColor: "orange",
//   },
//   filterButtonText: {
//     fontSize: 25,
//     fontWeight: "bold",
//     color: "white",
//   },
//   activeFilterButtonText: {
//     color: "#fff",
//   },
//   arrowLeft: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   cardContainer: {
//     width: SCREEN_WIDTH * 0.25,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 30,
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },

//   cardText: {
//     fontSize: 30,
//     color: "black",
//     fontWeight: "700",
//     // marginBottom: SCREEN_HEIGHT * 0.02,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     borderRadius: 180, // Circular shape
//     //  borderWidth: 2,    // Optional border width
//     //  borderColor: '#fff', // Optional border color
//     marginBottom: 6,
//     shadowColor: "#000", // Optional shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5, // Shadow for Android
//   },

//   iconStyle: {
//     position: "absolute",
//     top: SCREEN_HEIGHT * 0.02,
//     right: SCREEN_WIDTH * 0.03,
//   },

//   nameIconStyle: {
//     marginLeft: 10,
//   },

//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FCF8E3", // Darker background overlay
//   },
//   modalTextCall: {
//     fontSize: 40,
//     color: "black",
//     marginTop: 20,
//   },
//   modalContent: {
//     marginTop: 70,
//     gap: 30,
//     flexDirection: "row", // Side by side layout
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: SCREEN_WIDTH * 0.95, // Slightly wider modal for content
//     height: SCREEN_HEIGHT * 0.8,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 8, // Increased shadow for better
//   },
//   modalImage: {
//     //     // this is circle
//     width: 400,
//     height: 400,
//     borderRadius: 190, // Circular shape
//     borderWidth: 2, // Optional border width
//     borderColor: "#FFD700", // Optional border color
//     marginBottom: 10,
//     marginLeft: 40,
//     marginRight: 40, // Space between the image and text
//     shadowColor: "#000", // Optional shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,

//     //     //this is the square
//     //     // width: 300,
//     //     // height: 500,
//     //     // borderRadius: 20, // This gives the rounded corners
//     //     // marginBottom: 10,
//     //     // marginRight: 40, // Space between the image and text
//     //     // borderWidth: 3,
//     //     // borderColor: "#FFD700", // Example border color (you can change it)
//     //     // shadowColor: "#000", // Optional shadow
//     //     // shadowOffset: { width: 0, height: 2 },
//     //     // shadowOpacity: 0.8,
//     //     // shadowRadius: 2,
//     //     // elevation: 5, // Shadow for Android
//     //   },
//   },
//   modalInfoContainer: {
//     marginTop: 200,
//     flex: 1, // Takes up remaining space
//     justifyContent: "flex-start",
//   },
//   modalName: {
//     fontSize: 50,
//     fontWeight: "bold",
//     color: "#333",
//     // marginBottom: SCREEN_HEIGHT * 0.01,
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 25,
//     color: "#666",
//     marginBottom: SCREEN_HEIGHT * 0.005,
//   },
//   modalInterestsTitle: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: SCREEN_HEIGHT * 0.015,
//     marginBottom: SCREEN_HEIGHT * 0.005,
//   },
//   modalInterests: {
//     fontSize: 23,
//     color: "#666",
//     marginBottom: SCREEN_HEIGHT * 0.005,
//   },
//   actionContainer: {
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: SCREEN_HEIGHT * 0.02,
//     width: "100%",
//     height: "100%",
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//     paddingVertical: SCREEN_HEIGHT * 0.015,
//     paddingHorizontal: SCREEN_WIDTH * 0.05,
//     marginBottom: SCREEN_HEIGHT * 0.01,
//     width: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   actionButtonText: {
//     fontSize: 24,
//     fontWeight: "600",
//     marginRight: SCREEN_WIDTH * 0.02,
//   },
//   modalIcon: {
//     marginLeft: SCREEN_WIDTH * 0.02,
//   },
//   closeButton: {
//     backgroundColor: "#f09030",
//     borderRadius: 20,
//     paddingVertical: SCREEN_HEIGHT * 0.015,
//     paddingHorizontal: SCREEN_WIDTH * 0.08,
//     marginTop: SCREEN_HEIGHT * 0.01,
//     width: "80%",
//     alignItems: "center",
//   },
//   closeButtonText: {
//     fontSize: 24,
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default GLClub;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications"; // Import for notifications
import { callUser } from "../app/VideoSDK2"; // Import from VideoCall

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const defaultImage = {
  elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
  shari: require("../assets/images/portrait2.jpg"),
  pat: require("../assets/images/portrait4.jpg"),
  john: require("../assets/images/portrait3.jpg"),
  matthew: require("../assets/images/portrait5.jpg"),
};

const GLClub = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState("all");
  const [friendRequests, setFriendRequests] = useState({});
  const [friends, setFriends] = useState([]);
  const [isCalling, setIsCalling] = useState(false); // Add for call logic
  const [isDeclined, setIsDeclined] = useState(false); //Add for decline logic

  const carouselRef = useRef(null);
  const notificationListenerRef = useRef(null); // Ref for the notification listener

  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserNames();
      listenToFriendRequests();
      listenToFriends();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortContacts();
  }, [contacts, filter, friendRequests, friends]);

  const fetchUserNames = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
      const fetchedContacts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.userName || "Unknown User",
          city: data.city || "Calgary",
          hobbies: data.hobbies || ["Reading", "Painting"],
          clubs: data.clubs || ["Book", "Knitting"],
          meetingId: data.meetingId || "",
          imageUrl: defaultImage[data.userName] || defaultImage.john,
        };
      });
      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching user names: ", error);
    }
  };

  const listenToFriendRequests = () => {
    const friendRequestsRef = collection(
      FIRESTORE_DB,
      `users/${user.uid}/friendRequests`
    );
    const unsubscribe = onSnapshot(friendRequestsRef, (snapshot) => {
      const requests = {};
      snapshot.forEach((doc) => {
        const request = doc.data();
        const role = request.senderId === user.uid ? "sender" : "receiver";
        requests[doc.id] = { ...request, role };
      });
      setFriendRequests(requests);
    });

    return () => unsubscribe();
  };

  const listenToFriends = () => {
    const friendsRef = collection(FIRESTORE_DB, `users/${user.uid}/friends`);
    const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
      const friendsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriends(friendsList);
    });

    return () => unsubscribe();
  };

  const filterAndSortContacts = () => {
    let filtered = contacts;
    if (filter === "friends") {
      filtered = contacts.filter((contact) =>
        friends.some((friend) => friend.id === contact.id)
      );
    }
    filtered.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
    setFilteredContacts([...new Set(filtered)]);
  };

  const handleAddFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await setDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
        {
          status: "pending",
          senderName: user.displayName || user.email,
          senderId: user.uid,
        }
      );

      Alert.alert("Friend request sent successfully");

      setFriendRequests((prevRequests) => ({
        ...prevRequests,
        [contact.id]: { status: "pending", role: "sender" },
      }));
    } catch (error) {
      console.error("Error sending friend request: ", error);
      Alert.alert("Error sending friend request.");
    }
  };

  const handleAcceptFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await setDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id),
        { status: "accepted" }
      );
      await setDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
        { status: "accepted" }
      );

      await setDoc(doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id), {
        name: contact.name,
        city: contact.city,
        hobbies: contact.hobbies,
        clubs: contact.clubs,
        imageUrl: contact.imageUrl,
      });

      await setDoc(doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid), {
        name: user.userName || user.email,
        city: "Calgary",
        hobbies: ["Reading", "Painting"],
        clubs: ["Book", "Knitting"],
        imageUrl: defaultImage[user.displayName] || defaultImage.john,
      });

      setFriendRequests((prevRequests) => ({
        ...prevRequests,
        [contact.id]: "accepted",
      }));

      Alert.alert("Friend request accepted");
    } catch (error) {
      console.error("Error accepting friend request: ", error);
      Alert.alert("Error accepting friend request.");
    }
  };

  const handleDeclineFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
      );
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
      );

      setFriendRequests((prevRequests) => {
        const newRequests = { ...prevRequests };
        delete newRequests[contact.id];
        return newRequests;
      });

      Alert.alert("Friend request declined");
    } catch (error) {
      console.error("Error declining friend request: ", error);
      Alert.alert("Error declining friend request.");
    }
  };

  const handleUnfriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      // Remove friend from current user's friends subcollection
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id)
      );

      // Remove current user from friend's friends subcollection
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid)
      );

      // Remove any friend requests between the users
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
      );
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
      );

      // Update local friendRequests state
      setFriendRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        delete updatedRequests[contact.id];
        return updatedRequests;
      });

      // Update local friends state
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== contact.id)
      );

      Alert.alert("Unfriended successfully");
    } catch (error) {
      console.error("Error unfriending:", error);
      Alert.alert("Error unfriending.");
    }
  };

  // Function to initiate a video call (from VideoCall)
  const startVideoCall = async (calleeUid) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsCalling(true); // Show the calling modal
    setIsDeclined(false); // Reset the decline state when starting a new call

    await callUser(calleeUid, user); // Use the imported callUser function

    notificationListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { accept, decline, meetingId } = notification.request.content.data;
        if (accept) {
          setIsCalling(false); // Hide the calling modal
          onCalleeAccept(meetingId);
          removeNotificationListener();
        } else if (decline) {
          setIsCalling(false); // Handle call decline
          setIsDeclined(true);
          // Alert.alert("User is not available.");
          removeNotificationListener();
        }
      }
    );
  };

  const onCalleeAccept = (meetingId) => {
    router.push({
      pathname: "/VideoSDK2",
      params: { meetingId, autoJoin: true },
    });
  };

  const removeNotificationListener = () => {
    if (notificationListenerRef.current) {
      Notifications.removeNotificationSubscription(
        notificationListenerRef.current
      );
      notificationListenerRef.current = null;
    }
  };

  const handleCall = (contactId) => {
    setModalVisible(false); // Close modal
    startVideoCall(contactId); // Start the video call using the contact's ID
  };

    // Function to cancel the call and close the calling modal
    const cancelCall = () => {
      setIsCalling(false);
      removeNotificationListener(); // Remove the notification listener
    };

  const handleCardPress = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: "transparent",
          transform: [{ scale: 1.1 }],
        },
        {
          height:
            SCREEN_WIDTH > SCREEN_HEIGHT
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      onPress={() => handleCardPress(item)}>
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.cardText}>
        {item.name}
        {friendRequests[item.id]?.status === "accepted" && (
          <FontAwesome
            name="check-circle"
            size={40} // Bigger tick mark
            color="green"
            style={styles.nameIconStyle}
          />
        )}
        {friendRequests[item.id]?.status === "pending" && (
          <FontAwesome
            name="question-circle"
            size={40} // Bigger pending icon
            color="orange"
            style={styles.nameIconStyle}
          />
        )}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          {
            height: SCREEN_WIDTH > SCREEN_HEIGHT ? 920 : 450,
            marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : 45,
          },
        ]}>
        <View style={styles.filterButtons}>
          <Pressable
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("all")}>
            <Text
              style={[
                styles.filterButtonText,
                filter === "all" && styles.activeFilterButtonText,
              ]}>
              All
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === "friends" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("friends")}>
            <Text
              style={[
                styles.filterButtonText,
                filter === "friends" && styles.activeFilterButtonText,
              ]}>
              My Friends
            </Text>
          </Pressable>
        </View>

        <Carousel
          ref={carouselRef}
          data={filteredContacts}
          renderItem={renderItem}
          width={SCREEN_WIDTH * 0.3}
          height={SCREEN_WIDTH * 0.3}
          style={{
            width: Math.round(SCREEN_WIDTH * 0.9),
            height: Math.round(SCREEN_HEIGHT * 0.5),
          }}
          loop
          onSnapToItem={(index) => setActiveIndex(index)}
          pagingEnabled
        />

        <Pressable
          style={[
            styles.arrowLeft,
            {
              left: SCREEN_WIDTH > SCREEN_HEIGHT ? -17 : -22,
              top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
            },
          ]}
          onPress={() => {
            carouselRef.current?.scrollTo({ count: -1, animated: true });
          }}>
          <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
        </Pressable>
        <Pressable
          style={[
            styles.arrowRight,
            {
              right: SCREEN_WIDTH > SCREEN_HEIGHT ? -25 : -22,
              top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
            },
          ]}
          onPress={() => {
            carouselRef.current?.scrollTo({ count: 1, animated: true });
          }}>
          <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
        </Pressable>

        {selectedContact && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Image
                  source={selectedContact.imageUrl}
                  style={[styles.modalImage, {
                    width: SCREEN_WIDTH > SCREEN_HEIGHT ? 400 : 250,
                    height: SCREEN_WIDTH > SCREEN_HEIGHT ? 400 : 250,
                    
                  }]}
                />
                <View style={[styles.modalInfoContainer, {
                  marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? 200 : 310,
                }]}>
                  <Text style={styles.modalName}>{selectedContact.name}</Text>
                  <Text style={styles.modalText}>
                    City: {selectedContact.city}
                  </Text>
                  <Text style={styles.modalInterestsTitle}>Interests:</Text>
                  {selectedContact.hobbies.map((hobby, index) => (
                    <Text key={index} style={styles.modalInterests}>
                      - {hobby}
                    </Text>
                  ))}
                  <Text style={styles.modalInterestsTitle}>Clubs:</Text>
                  {selectedContact.clubs.map((club, index) => (
                    <Text key={index} style={styles.modalInterests}>
                      - {club}
                    </Text>
                  ))}

                  <View style={[styles.actionContainer, {
                    marginLeft: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : -30,
                  }]}>
                    {!friendRequests[selectedContact.id] && (
                      <Pressable
                        onPress={() => handleAddFriend(selectedContact)}
                        style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Add Friend</Text>
                        <FontAwesome
                          name="user-plus"
                          size={24}
                          color="#4169E1"
                          style={styles.modalIcon}
                        />
                      </Pressable>
                    )}
                    {friendRequests[selectedContact.id]?.role === "receiver" &&
                      friendRequests[selectedContact.id].status ===
                        "pending" && (
                        <>
                          <Pressable
                            onPress={() => handleAcceptFriend(selectedContact)}
                            style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Accept</Text>
                            <FontAwesome
                              name="check-circle"
                              size={24}
                              color="green"
                              style={styles.modalIcon}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => handleDeclineFriend(selectedContact)}
                            style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Decline</Text>
                            <FontAwesome
                              name="times-circle"
                              size={24}
                              color="red"
                              style={styles.modalIcon}
                            />
                          </Pressable>
                        </>
                      )}
                    {friendRequests[selectedContact.id]?.role === "sender" &&
                      friendRequests[selectedContact.id].status ===
                        "pending" && (
                        <Text style={styles.pendingText}>
                          Friend request sent
                        </Text>
                      )}
                    {friendRequests[selectedContact.id]?.status ===
                      "accepted" && (
                      <>
                        <Pressable
                          onPress={() => handleCall(selectedContact.id)}
                          style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>Call</Text>
                          <FontAwesome
                            name="video-camera"
                            size={24}
                            color="green"
                            style={styles.modalIcon}
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => handleUnfriend(selectedContact)}
                          style={styles.actionButton}>
                          <Text style={styles.actionButtonText}>Unfriend</Text>
                          <FontAwesome
                            name="user-times"
                            size={24}
                            color="red"
                            style={styles.modalIcon}
                          />
                        </Pressable>
                      </>
                    )}
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
        )}

        <Modal visible={isCalling} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#f3b718" />
            <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
            <Text style={styles.modalTextCall}>Calling . . .</Text>
             {/* Cancel Call Button */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={cancelCall}
          >
            <Text style={styles.buttonText}>Cancel Call</Text>
          </TouchableOpacity>
          </View>
        </Modal>

          {/* Decline message modal */}
      <Modal animationType="slide" transparent={true} visible={isDeclined}>
        <View style={styles.modalContainer}>
          <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
          <Text style={styles.modalTextCall}>They are not available right now</Text>
          <TouchableOpacity
            style={[styles.button, styles.dismissButton]}
            onPress={() => setIsDeclined(false)}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    position: "relative",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.04,
    marginTop: SCREEN_HEIGHT * 0.22,
  },
  filterButton: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 20,
    backgroundColor: "grey",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeFilterButton: {
    backgroundColor: "orange",
  },
  filterButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 30,
    color: "black",
    fontWeight: "700",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 180,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  iconStyle: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.02,
    right: SCREEN_WIDTH * 0.03,
  },
  nameIconStyle: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
  },
  modalTextCall: {
    fontSize: 40,
    color: "black",
    marginTop: 20,
  },
  modalContent: {
    marginTop: 70,
    gap: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalImage: {
   //width and height edited in-line style for responsiveness
    borderRadius: 190,
    borderWidth: 2,
    borderColor: "#FFD700",
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalInfoContainer: {
    //marginTop in-line style for responsiveness
    flex: 1,
    justifyContent: "flex-start",
  },
  modalName: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 25,
    color: "#666",
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  modalInterestsTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  modalInterests: {
    fontSize: 23,
    color: "#666",
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  actionContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.02,
    width: "100%",
    height: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 24,
    fontWeight: "600",
    marginRight: SCREEN_WIDTH * 0.02,
  },
  modalIcon: {
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  closeButton: {
    backgroundColor: "#f09030",
    borderRadius: 20,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.01,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  dismissButton: {
    backgroundColor: 'orange',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginTop: 30,
  },
  button: {
    padding: 20,
    borderRadius: 10,
  },
});

export default GLClub;


