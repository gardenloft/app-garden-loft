// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   Pressable,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Alert,
// //   KeyboardAvoidingView,
// //   TouchableOpacity,
// //   Dimensions,
// // } from "react-native";
// // import {
// //   collection,
// //   addDoc,
// //   getDoc,
// //   getDocs,
// //   query,
// //   orderBy,
// //   onSnapshot,
// //   updateDoc,
// //   deleteDoc,
// //   doc,
// //   Timestamp,
// // } from "firebase/firestore";
// // import { getAuth } from "firebase/auth";
// // import { FIRESTORE_DB } from "../FirebaseConfig";
// // import * as Notifications from "expo-notifications";
// // import * as Speech from "expo-speech";
// // import { FontAwesome } from "@expo/vector-icons";
// // import moment from "moment";

// // // Get device dimensions for media queries
// // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// // const TextComponent = ({ friendId, friendName }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [unreadMessages, setUnreadMessages] = useState(0);
// //   const auth = getAuth();
// //   const user = auth.currentUser;
// //   const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state

// //   const flatListRef = useRef(null);

// //   useEffect(() => {
// //     const chatId = generateChatId(user.uid, friendId);
// //     const q = query(
// //       collection(FIRESTORE_DB, `chats/${chatId}/messages`),
// //       orderBy("timestamp", "asc")
// //     );

// //     const unsubscribe = onSnapshot(q, (snapshot) => {
// //       const loadedMessages = [];
// //       let unreadCount = 0;
// //       snapshot.forEach((doc) => {
// //         const message = { id: doc.id, ...doc.data() };
// //         loadedMessages.push(message);
// //         if (message.senderId !== user.uid && !message.isRead) {
// //           unreadCount += 1;
// //         }
// //       });
// //       setMessages(loadedMessages);
// //       setUnreadMessages(unreadCount);
// //       setLoading(false);

// //       // Mark messages as read when opening the chat
// //       markMessagesAsRead(loadedMessages);
// //     });

// //     return () => unsubscribe();
// //   }, [friendId]);

// //   const generateChatId = (uid1, uid2) => {
// //     return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
// //   };

// //   const handleSendMessage = async () => {
// //     if (newMessage.trim() === "") return;

// //     const chatId = generateChatId(user.uid, friendId);

// //     try {
// //       const messageData = {
// //         senderId: user.uid,
// //         senderName: user.displayName || user.email,
// //         text: newMessage,
// //         timestamp: Timestamp.now(),
// //         isRead: false,
// //       };

// //       await addDoc(
// //         collection(FIRESTORE_DB, `chats/${chatId}/messages`),
// //         messageData
// //       );
// //       setNewMessage("");

// //       // Trigger push notification for new message
// //       sendNewMessageNotification(friendId, messageData.text);
// //     } catch (error) {
// //       console.error("Error sending message: ", error);
// //       Alert.alert("Error", "Failed to send message. Try again later.");
// //     }
// //   };

// //   const sendNewMessageNotification = async (recipientId, messageText) => {
// //     try {
// //       const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", recipientId));
// //       const friendData = friendDoc.data();
// //       const pushToken = friendData?.pushToken;

// //       if (!friendData || !pushToken) {
// //         console.error("Recipient's data or push token is not available");
// //         return;
// //       }

// //       const senderName = user.displayName || user.email;

// //       const message = {
// //         to: pushToken,
// //         sound: "default",
// //         title: `New message from ${senderName}`,
// //         body: messageText,
// //         data: { someData: "goes here" },
// //       };

// //       const response = await fetch("https://exp.host/--/api/v2/push/send", {
// //         method: "POST",
// //         headers: {
// //           Accept: "application/json",
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(message),
// //       });

// //       const data = await response.json();
// //       console.log(
// //         "Notification sent to",
// //         friendData.userName,
// //         "response:",
// //         data
// //       );
// //     } catch (error) {
// //       console.error("Error sending notification:", error);
// //     }
// //   };

// //   const markMessagesAsRead = async (loadedMessages) => {
// //     const chatId = generateChatId(user.uid, friendId);
// //     loadedMessages.forEach(async (message) => {
// //       if (message.senderId !== user.uid && !message.isRead) {
// //         await updateDoc(
// //           doc(FIRESTORE_DB, `chats/${chatId}/messages`, message.id),
// //           {
// //             isRead: true,
// //           }
// //         );
// //       }
// //     });
// //   };

// //   const handleDeleteChat = async () => {
// //     const chatId = generateChatId(user.uid, friendId);
// //     try {
// //       const snapshot = await getDocs(
// //         collection(FIRESTORE_DB, `chats/${chatId}/messages`)
// //       );
// //       snapshot.forEach(async (doc) => {
// //         await deleteDoc(doc.ref);
// //       });

// //       Alert.alert("Chat deleted successfully");
// //     } catch (error) {
// //       console.error("Error deleting chat: ", error);
// //       Alert.alert("Error", "Failed to delete chat. Try again later.");
// //     }
// //   };

// //   const renderMessage = ({ item, index }) => {
// //     const isOwnMessage = item.senderId === user.uid;

// //     // Check if the current message is the first of a new day
// //     const currentDate = moment(item.timestamp.toDate()).format("DD MMM YYYY");
// //     const previousDate =
// //       index > 0
// //         ? moment(messages[index - 1].timestamp.toDate()).format("DD MMM YYYY")
// //         : null;

// //     const showDateHeader = currentDate !== previousDate;

// //     const handleSpeechToggle = async (text) => {
// //       const speaking = await Speech.isSpeakingAsync();
// //       if (speaking) {
// //         Speech.stop(); // Stop speech if currently speaking
// //         setIsSpeaking(false);
// //       } else {
// //         Speech.speak(text, {
// //           pitch: 1.0,
// //           rate: 1.0,
// //           onStart: () => setIsSpeaking(true),
// //           onDone: () => setIsSpeaking(false),
// //           onStopped: () => setIsSpeaking(false), // Handle stop event
// //         });
// //       }
// //     };

// //     return (
// //       <View>
// //         {/* Display date header if it's the first message of a new day */}
// //         {showDateHeader && (
// //           <View style={styles.dateHeader}>
// //             <Text style={styles.dateHeaderText}>{currentDate}</Text>
// //           </View>
// //         )}

// //         <Pressable
// //           style={[
// //             styles.messageContainer,
// //             isOwnMessage ? styles.ownMessage : styles.friendMessage,
// //           ]}
// //           onPress={() => handleSpeechToggle(item.text)}>
// //           <View style={styles.messageContent}>
// //             <Text style={styles.messageText}>{item.text}</Text>
// //             <TouchableOpacity
// //               onPress={(e) => {
// //                 e.stopPropagation(); // Prevent triggering the parent Pressable
// //                 handleSpeechToggle(item.text);
// //               }}
// //               style={styles.speakerIcon}>
// //               <FontAwesome name="volume-up" size={16} color="gray" />
// //             </TouchableOpacity>
// //           </View>
// //           <Text style={styles.timestampText}>
// //             {moment(item.timestamp.toDate()).format("h:mm a")}
// //           </Text>
// //         </Pressable>
// //       </View>
// //     );
// //   };

// //   // const renderMessage = ({ item }) => {
// //   //   const isOwnMessage = item.senderId === user.uid;

// //   //   return (
// //   //     <View
// //   //       style={[
// //   //         styles.messageContainer,
// //   //         isOwnMessage ? styles.ownMessage : styles.friendMessage,
// //   //       ]}>
// //   //       <View style={styles.messageContent}>
// //   //         <Text style={styles.messageText}>{item.text}</Text>
// //   //         <TouchableOpacity
// //   //           onPress={() => Speech.speak(item.text)}
// //   //           style={styles.speakerIcon}>
// //   //           <FontAwesome name="volume-up" size={18} color="gray" />
// //   //         </TouchableOpacity>
// //   //       </View>
// //   //       <Text style={styles.timestampText}>
// //   //         {moment(item.timestamp.toDate()).format("h:mm a")}
// //   //       </Text>
// //   //     </View>
// //   //   );
// //   // };

// //   return (
// //     <KeyboardAvoidingView behavior="padding" style={styles.container}>
// //       <View style={styles.chatHeader}>
// //         <Text style={styles.chatHeaderText}>{friendName}</Text>
// //       </View>

// //       {loading ? (
// //         <ActivityIndicator size="large" color="#f3b718" />
// //       ) : (
// //         <FlatList
// //           ref={flatListRef}
// //           data={messages}
// //           renderItem={renderMessage}
// //           keyExtractor={(item) => item.id}
// //           onContentSizeChange={() =>
// //             flatListRef.current.scrollToEnd({ animated: true })
// //           }
// //           onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
// //         />
// //       )}

// //       <View style={styles.inputContainer}>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChangeText={setNewMessage}
// //         />
// //         <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
// //           <FontAwesome name="send" size={24} color="white" />
// //         </TouchableOpacity>
// //       </View>

// //       <TouchableOpacity onPress={handleDeleteChat} style={styles.deleteButton}>
// //         <FontAwesome name="trash" size={24} color="white" />
// //         <Text style={styles.deleteButtonText}>Delete Chat</Text>
// //       </TouchableOpacity>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: SCREEN_WIDTH > 400 ? 80 : 60,
// // //     paddingTop: SCREEN_HEIGHT > 800 ? 20 : 5,
// // //     marginBottom: SCREEN_HEIGHT > 800 ? 5 : 5,
// // //     backgroundColor: "#f0f0f0",
// // //   },
// // //   inputContainer: {
// // //     flexDirection: "row",
// // //     padding: 10,
// // //     marginHorizontal: SCREEN_WIDTH > 400 ? -10 : -30,
// // //     backgroundColor: "white",
// // //     borderRadius: 25,
// // //     marginBottom: 10,
// // //     alignItems: "center",
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
// // //     paddingHorizontal: 15,
// // //   },
// // //   sendButton: {
// // //     backgroundColor: "#f3b718",
// // //     padding: 10,
// // //     borderRadius: 50,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   messageContainer: {
// // //     padding: 10,
// // //     marginVertical: 5,
// // //     borderRadius: 15,
// // //   },
// // //   messageContent: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "space-between",
// // //   },
// // //   speakerIcon: {
// // //     marginLeft: 10,
// // //   },
// // //   ownMessage: {
// // //     backgroundColor: "#e1ffc7",
// // //     alignSelf: "flex-end",
// // //     marginLeft: SCREEN_WIDTH > 400 ? 200 : 100,
// // //   },
// // //   friendMessage: {
// // //     backgroundColor: "#ffffff",
// // //     alignSelf: "flex-start",
// // //     marginRight: 100,
// // //   },
// // //   messageText: {
// // //     fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
// // //   },
// // //   timestampText: {
// // //     fontSize: SCREEN_WIDTH > 400 ? 12 : 10,
// // //     color: "#888",
// // //     marginTop: 5,
// // //     alignSelf: "flex-end",
// // //   },
// // //   deleteButton: {
// // //     backgroundColor: "#f0f0f0",
// // //     borderWidth: 1,
// // //     borderColor: "grey",
// // //     padding: 10,
// // //     borderRadius: 25,
// // //     marginTop: 10,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //   },
// // //   deleteButtonText: {
// // //     color: "grey",
// // //     fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
// // //     marginLeft: 10,
// // //   },
// // //   chatHeader: {
// // //     padding: 20,
// // //     backgroundColor: "#f3b718",
// // //     borderRadius: 10,
// // //     marginBottom: 20,
// // //     alignItems: "center",
// // //   },
// // //   messageWrapper: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginVertical: 5,
// // //     justifyContent: "flex-end", // Align the speaker icon to the right
// // //   },
// // //   speakerIcon: {
// // //     marginLeft: 10, // Space between the message and the icon
// // //   },

// // //   chatHeaderText: {
// // //     fontSize: SCREEN_WIDTH > 400 ? 22 : 20,
// // //     color: "grey",
// // //     fontWeight: "bold",
// // //   },
// // // });

// // // export default TextComponent;

// // const { width, height } = Dimensions.get("window");
// // const isLandscape = width > height;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: isLandscape ? 40 : 20,
// //     paddingTop: isLandscape ? 10 : 20,
// //     marginBottom: isLandscape ? 10 : 5,
// //     backgroundColor: "#f0f0f0",
// //   },
// //   chatHeader: {
// //     padding: isLandscape ? 10 : 20,
// //     backgroundColor: "#f3b718",
// //     borderRadius: 10,
// //     marginBottom: isLandscape ? 10 : 20,
// //     alignItems: "center",
// //   },
// //   chatHeaderText: {
// //     fontSize: isLandscape ? 20 : 24,
// //     color: "grey",
// //     fontWeight: "bold",
// //   },
// //   dateHeader: {
// //     alignSelf: "center",
// //     backgroundColor: "#e0e0e0",
// //     borderRadius: 10,
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     marginVertical: 10,
// //   },
// //   dateHeaderText: {
// //     fontSize: 14,
// //     color: "#555",
// //   },
// //   inputContainer: {
// //     flexDirection: "row",
// //     padding: isLandscape ? 5 : 10,
// //     marginHorizontal: isLandscape ? -5 : -10,
// //     backgroundColor: "white",
// //     borderRadius: 25,
// //     marginBottom: 10,
// //     alignItems: "center",
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: isLandscape ? 14 : 18,
// //     paddingHorizontal: 15,
// //   },
// //   sendButton: {
// //     backgroundColor: "#f3b718",
// //     padding: isLandscape ? 8 : 10,
// //     borderRadius: 50,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   deleteButton: {
// //     backgroundColor: "#f0f0f0",
// //     borderWidth: 1,
// //     borderColor: "grey",
// //     padding: isLandscape ? 8 : 10,
// //     borderRadius: 25,
// //     marginTop: isLandscape ? 5 : 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   deleteButtonText: {
// //     color: "grey",
// //     fontSize: isLandscape ? 14 : 16,
// //     marginLeft: 10,
// //   },
// //   messageWrapper: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginVertical: 5,
// //     justifyContent: "flex-end",
// //   },
// //   messageContainer: {
// //     padding: isLandscape ? 8 : 12,
// //     marginVertical: 5,
// //     borderRadius: 15,
// //   },
// //   ownMessage: {
// //     backgroundColor: "#e1ffc7",
// //     alignSelf: "flex-end",
// //     marginLeft: isLandscape ? 120 : 200,
// //   },
// //   friendMessage: {
// //     backgroundColor: "#ffffff",
// //     alignSelf: "flex-start",
// //     marginRight: isLandscape ? 120 : 200,
// //   },
// //   messageText: {
// //     fontSize: isLandscape ? 14 : 18,
// //   },
// //   timestampText: {
// //     fontSize: isLandscape ? 10 : 12,
// //     color: "#888",
// //     marginTop: 5,
// //     alignSelf: "flex-end",
// //   },
// //   speakerIcon: {
// //     marginLeft: 10,
// //   },
// // });

// // export default TextComponent;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   Modal,
//   Dimensions,
// } from "react-native";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   getDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   deleteDoc,
//   doc,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import * as Speech from "expo-speech";
// import * as Notifications from "expo-notifications";
// import { FontAwesome } from "@expo/vector-icons";
// import moment from "moment";

// const { width, height } = Dimensions.get("window");
// const isLandscape = width > height;

// const TextComponent = ({ friendId, friendName }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false); // delete confirmation modal
//   const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const chatId = generateChatId(user.uid, friendId);
//     const q = query(
//       collection(FIRESTORE_DB, `chats/${chatId}/messages`),
//       orderBy("timestamp", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const loadedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(loadedMessages);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [friendId]);

//   const generateChatId = (uid1, uid2) => {
//     return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "") return;

//     const chatId = generateChatId(user.uid, friendId);

//     try {
//       const messageData = {
//         senderId: user.uid,
//         text: newMessage,
//         timestamp: Timestamp.now(),
//       };

//       await addDoc(
//         collection(FIRESTORE_DB, `chats/${chatId}/messages`),
//         messageData
//       );
//       setNewMessage("");

//       // Trigger push notification for new message
//       sendNewMessageNotification(friendId, messageData.text);
//     } catch (error) {
//       console.error("Error sending message: ", error);
//       Alert.alert("Error", "Failed to send message. Try again later.");
//     }
//   };

//   const sendNewMessageNotification = async (recipientId, messageText) => {
//     try {
//       const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", recipientId));
//       const friendData = friendDoc.data();
//       const pushToken = friendData?.pushToken;

//       if (!friendData || !pushToken) {
//         console.error("Recipient's data or push token is not available");
//         return;
//       }

//       const senderName = user.displayName || user.email;

//       const message = {
//         to: pushToken,
//         sound: "default",
//         title: `New message from ${senderName}`,
//         body: messageText,
//         data: { someData: "goes here" },
//       };

//       const response = await fetch("https://exp.host/--/api/v2/push/send", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(message),
//       });

//       const data = await response.json();
//       console.log(
//         "Notification sent to",
//         friendData.userName,
//         "response:",
//         data
//       );
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   };

//   const handleDeleteChat = async () => {
//     const chatId = generateChatId(user.uid, friendId);
//     try {
//       const snapshot = await getDocs(
//         collection(FIRESTORE_DB, `chats/${chatId}/messages`)
//       );
//       snapshot.forEach(async (doc) => {
//         await deleteDoc(doc.ref);
//       });
//       Alert.alert("Chat deleted successfully");
//     } catch (error) {
//       console.error("Error deleting chat: ", error);
//       Alert.alert("Error", "Failed to delete chat. Try again later.");
//     }
//     setModalVisible(false);
//   };

//   // const renderMessage = ({ item, index }) => {
//   //   const isOwnMessage = item.senderId === user.uid;

//   //   // Check if the current message is the first of a new day
//   //   const currentDate = moment(item.timestamp.toDate()).format("DD MMM YYYY");
//   //   const previousDate =
//   //     index > 0
//   //       ? moment(messages[index - 1].timestamp.toDate()).format("DD MMM YYYY")
//   //       : null;

//   //   const showDateHeader = currentDate !== previousDate;

//   //   return (
//   //     <View>
//   //       {showDateHeader && (
//   //         <View style={styles.dateHeader}>
//   //           <Text style={styles.dateHeaderText}>{currentDate}</Text>
//   //         </View>
//   //       )}
//   //       <View
//   //         style={[
//   //           styles.messageContainer,
//   //           isOwnMessage ? styles.ownMessage : styles.friendMessage,
//   //         ]}>
//   //         <View style={styles.messageContent}>
//   //           <Text style={styles.messageText}>{item.text}</Text>
//   //           <TouchableOpacity
//   //             onPress={() => Speech.speak(item.text)}
//   //             style={styles.speakerIcon}>
//   //             <FontAwesome
//   //               name="volume-up"
//   //               size={isLandscape ? 20 : 24}
//   //               color="gray"
//   //             />
//   //           </TouchableOpacity>
//   //         </View>
//   //         <Text style={styles.timestampText}>
//   //           {moment(item.timestamp.toDate()).format("h:mm a")}
//   //         </Text>
//   //       </View>
//   //     </View>
//   //   );
//   // };

//   const handleSpeechToggle = (text) => {
//     if (isSpeaking) {
//       // If already speaking, stop the speech and reset the state
//       Speech.stop();
//       setIsSpeaking(false);
//     } else {
//       // If not speaking, start speaking and update the state
//       Speech.speak(text, {
//         pitch: 1.0,
//         rate: 1.0,
//         onStart: () => setIsSpeaking(true), // Set to true when speaking starts
//         onDone: () => setIsSpeaking(false), // Set to false when speaking finishes
//         onStopped: () => setIsSpeaking(false), // Set to false when speech is stopped
//       });
//     }
//   };

//   const renderMessage = ({ item, index }) => {
//     const isOwnMessage = item.senderId === user.uid;

//     // Check if the current message is the first of a new day
//     const currentDate = moment(item.timestamp.toDate()).format("DD MMM YYYY");
//     const previousDate =
//       index > 0
//         ? moment(messages[index - 1].timestamp.toDate()).format("DD MMM YYYY")
//         : null;

//     const showDateHeader = currentDate !== previousDate;

//     return (
//       <View>
//         {showDateHeader && (
//           <View style={styles.dateHeader}>
//             <Text style={styles.dateHeaderText}>{currentDate}</Text>
//           </View>
//         )}
//         <View
//           style={[
//             styles.messageContainer,
//             isOwnMessage ? styles.ownMessage : styles.friendMessage,
//           ]}>
//           <View style={styles.messageContent}>
//             <Text style={styles.messageText}>{item.text}</Text>
//             <TouchableOpacity
//               onPress={() => handleSpeechToggle(item.text)}
//               style={styles.speakerIcon}>
//               <FontAwesome
//                 // name={isSpeaking ? "stop" : "volume-up"} // Icon toggles between stop and speaker
//                 name={"volume-up"}
//                 size={28}
//                 color={"gray"}
//                 // color={isSpeaking ? "gray" : "gray"} // Red for stop, gray for play
//               />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.timestampText}>
//             {moment(item.timestamp.toDate()).format("h:mm a")}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView behavior="padding" style={styles.container}>
//       <View style={styles.chatHeader}>
//         <Text style={styles.chatHeaderText}>{friendName}</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#f3b718" />
//       ) : (
//         <FlatList
//           ref={flatListRef}
//           data={messages}
//           renderItem={renderMessage}
//           keyExtractor={(item) => item.id}
//           onContentSizeChange={() =>
//             flatListRef.current.scrollToEnd({ animated: true })
//           }
//           onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
//         />
//       )}

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message..."
//           value={newMessage}
//           onChangeText={setNewMessage}
//         />
//         <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
//           <FontAwesome name="send" size={isLandscape ? 18 : 24} color="white" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.deleteButton}>
//         <FontAwesome name="trash" size={isLandscape ? 18 : 24} color="grey" />
//         <Text style={styles.deleteButtonText}>Delete Chat</Text>
//       </TouchableOpacity>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>
//               Are you sure you want to delete this conversation? There is no way
//               to recover it.
//             </Text>
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 onPress={handleDeleteChat}
//                 style={styles.modalConfirmButton}>
//                 <Text style={styles.modalButtonText}>Yes, I'm sure</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//                 style={styles.modalCancelButton}>
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: isLandscape ? 40 : 20,
//     backgroundColor: "#f0f0f0",
//   },
//   chatHeader: {
//     padding: isLandscape ? 15 : 20,
//     backgroundColor: "#f3b718",
//     borderRadius: 10,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   chatHeaderText: {
//     fontSize: isLandscape ? 24 : 28,
//     color: "grey",
//     fontWeight: "bold",
//   },
//   dateHeader: {
//     alignSelf: "center",
//     backgroundColor: "#e0e0e0",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginVertical: 10,
//   },
//   dateHeaderText: {
//     fontSize: isLandscape ? 16 : 18,
//     color: "#555",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: isLandscape ? 12 : 16,
//     backgroundColor: "white",
//     borderRadius: 25,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     fontSize: isLandscape ? 16 : 20,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     backgroundColor: "#f3b718",
//     padding: isLandscape ? 8 : 10,
//     borderRadius: 50,
//     alignItems: "center",
//   },
//   deleteButton: {
//     // backgroundColor: "lightgrey",
//     borderColor: "grey",
//     borderWidth: 0.5,
//     padding: isLandscape ? 4 : 8,
//     borderRadius: 25,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deleteButtonText: {
//     color: "grey",
//     fontSize: isLandscape ? 14 : 16,
//     marginLeft: 10,
//   },
//   messageContainer: {
//     padding: isLandscape ? 10 : 15,
//     marginVertical: 5,
//     borderRadius: 15,
//   },
//   ownMessage: {
//     backgroundColor: "#e1ffc7",
//     alignSelf: "flex-end",
//     marginLeft: isLandscape ? 120 : 180,
//   },
//   friendMessage: {
//     backgroundColor: "#ffffff",
//     alignSelf: "flex-start",
//     marginRight: isLandscape ? 120 : 180,
//   },
//   messageText: {
//     fontSize: isLandscape ? 20 : 24,
//   },
//   timestampText: {
//     fontSize: isLandscape ? 12 : 14,
//     color: "#888",
//     marginTop: 5,
//     alignSelf: "flex-end",
//   },
//   speakerIcon: {
//     marginLeft: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   modalText: {
//     fontSize: 20,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//   },
//   modalConfirmButton: {
//     backgroundColor: "lightblue",
//     padding: 10,
//     borderRadius: 10,
//     width: "40%",
//     alignItems: "center",
//   },
//   modalCancelButton: {
//     backgroundColor: "#ccc",
//     padding: 10,
//     borderRadius: 10,
//     width: "40%",
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "black",
//     fontSize: 16,
//   },
// });

// export default TextComponent;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import * as Speech from "expo-speech";
import moment from "moment";
import * as Notifications from "expo-notifications";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

const TextComponent = ({ friendId, friendName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Delete chat modal
  const [menuVisible, setMenuVisible] = useState(false);
  const [flagModalVisible, setFlagModalVisible] = useState(false); // Flag user modal
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [currentMessageId, setCurrentMessageId] = useState("");
  const [isBlocked, setIsBlocked] = useState(false); // Check if user is blocked
  const [selectedFlagReason, setSelectedFlagReason] = useState(""); // Reason for flagging
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const flatListRef = useRef(null);


  

  useEffect(() => {
    
    // Check if the user is blocked
    const checkBlockedStatus = async () => {
      const userDoc = await getDoc(doc(FIRESTORE_DB, "users", user.uid));
      const userData = userDoc.data();
      const blockedUsers = userData?.blockedUsers || [];
      setIsBlocked(blockedUsers.includes(friendId));
    };
    checkBlockedStatus();

 // Fetch messages
    if (!isBlocked) {
      const chatId = generateChatId(user.uid, friendId);
      const q = query(
        collection(FIRESTORE_DB, `chats/${chatId}/messages`),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(loadedMessages);
        setLoading(false);
});

  

    }
  }, [friendId, isBlocked]);

  const generateChatId = (uid1, uid2) => {
    return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  const handleSendMessage = async () => {
    if (isBlocked) {
      Alert.alert("Blocked", "You cannot send messages to this user.");
      return;
    }

    if (newMessage.trim() === "") return;

    const chatId = generateChatId(user.uid, friendId);

    try {
      const messageData = {
        senderId: user.uid,
        receiverId: friendId,
        text: newMessage,
        timestamp: Timestamp.now(),
        isRead: false, // Unread initially
      };

      await addDoc(
        collection(FIRESTORE_DB, `chats/${chatId}/messages`),
        messageData
      );
      
      setNewMessage("");
      sendNewMessageNotification(friendId, messageData.text);
    } catch (error) {
      console.error("Error sending message: ", error);
      Alert.alert("Error", "Failed to send message. Try again later.");
    }
  };
     // Trigger push notification for new message
      
  
  const sendNewMessageNotification = async (recipientId, messageText) => {
    try {
      const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", recipientId));
      const friendData = friendDoc.data();
      const pushToken = friendData?.pushToken;

      if (!friendData || !pushToken) {
        console.error("Recipient's data or push token is not available");
        return;
      }

      const senderName = user.displayName || user.email;

      const message = {
        to: pushToken,
        sound: "default",
        title: `New message from ${senderName}`,
        body: messageText,
        data: { someData: "goes here"
          ,
          type: "text", // Specify this is a text notification
          friendId: user.uid, // Sender's ID
          friendName: senderName, // Sender's Name
         },
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      console.log(
        "Notification sent to",
        friendData.userName,
        "response:",
        data
      );
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };


  const handleDeleteChat = async () => {
    const chatId = generateChatId(user.uid, friendId);
    try {
      const snapshot = await getDocs(
        collection(FIRESTORE_DB, `chats/${chatId}/messages`)
      );
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      Alert.alert("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting chat: ", error);
      Alert.alert("Error", "Failed to delete chat. Try again later.");
    }
    setModalVisible(false);
  };

  const handleBlockUser = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
      const update = isBlocked
        ? { blockedUsers: arrayRemove(friendId) }
        : { blockedUsers: arrayUnion(friendId) };

      await updateDoc(userDocRef, update);
      setIsBlocked(!isBlocked);
      Alert.alert(
        isBlocked ? "Unblocked" : "Blocked",
        `${friendName} has been ${isBlocked ? "unblocked" : "blocked"}.`
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      Alert.alert("Error", "Failed to update block status. Try again later.");
    }
  };


  const handleReportMessage = async () => {
    if (!selectedReportReason) {
      Alert.alert("Error", "Please select a reason for reporting.");
      return;
    }

    try {
      await addDoc(collection(FIRESTORE_DB, "reportedMessages"), {
        reportedBy: user.uid,
        messageId: currentMessageId,
        flaggedUser: friendId,
        reason: selectedReportReason,
        timestamp: Timestamp.now(),
        resolved: false,
      });
      Alert.alert("Reported",
        currentMessageId
          ? "The message has been reported for review."
          : "The chat has been reported for review.");
      setReportModalVisible(false);
      setSelectedReportReason("");
    } catch (error) {
      console.error("Error reporting message: ", error);
      Alert.alert("Error", "Failed to report the message. Try again later.");
    }
  };

  const handleFlagUser = async () => {
    if (!selectedFlagReason) {
      Alert.alert("Error", "Please select a reason for flagging.");
      return;
    }

    try {
      await addDoc(collection(FIRESTORE_DB, "flaggedUsers"), {
        flaggedBy: user.uid,
        flaggedUser: friendId,
        reason: selectedFlagReason,
        timestamp: Timestamp.now(),
      });
      Alert.alert("Success", `${friendName} has been flagged.`);
      setFlagModalVisible(false);
    } catch (error) {
      console.error("Error flagging user:", error);
      Alert.alert("Error", "Failed to flag user. Try again later.");
    }
  };

  const openReportModal = (messageId = null) => {
    setCurrentMessageId(messageId);// `null` means it's a chat-level report
    setReportModalVisible(true);
  };

  const renderMessage = ({ item, index }) => {
    const isOwnMessage = item.senderId === user.uid;

    // Check if the current message is the first of a new day
    const currentDate = moment(item.timestamp.toDate()).format("DD MMM YYYY");
    const previousDate =
      index > 0
        ? moment(messages[index - 1].timestamp.toDate()).format("DD MMM YYYY")
        : null;

    const showDateHeader = currentDate !== previousDate;

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{currentDate}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessage : styles.friendMessage,
          ]}>
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{item.text}</Text>
            <TouchableOpacity
              onPress={() =>
                Speech.speak(item.text, {
                  onDone: () => setIsSpeaking(false),
                })
              }
              style={styles.speakerIcon}>
              <FontAwesome name="volume-up" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <Text style={styles.timestampText}>
            {moment(item.timestamp.toDate()).format("h:mm a")}
          </Text>
          <TouchableOpacity
        onLongPress={() => openReportModal(item.id)} // Trigger report modal on long press
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.friendMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestampText}>
          {moment(item.timestamp.toDate()).format("h:mm a")}
        </Text>
      </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderText}>{friendName}</Text>
      
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuButton}>
          <FontAwesome name="ellipsis-v" size={24} color="grey" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => {
                openReportModal(); // Report chat
                setMenuVisible(false);
              }}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Report Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFlagModalVisible(true);
                setMenuVisible(false);
              }}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>Flag User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleBlockUser();
                setMenuVisible(false);
              }}
              style={styles.menuOption}
            >
              <Text style={styles.menuOptionText}>
                {isBlocked ? "Unblock User" : "Block User"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>



      {loading ? (
        <ActivityIndicator size="large" color="#f3b718" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.deleteButton}>
        <FontAwesome name="trash" size={24} color="grey" />
        <Text style={styles.deleteButtonText}>Delete Chat</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => setFlagModalVisible(true)}
        style={styles.flagButton}>
        <Text style={styles.flagText}>Flag User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleBlockUser}
        style={[styles.blockButton, isBlocked && styles.unblockButton]}>
        <Text style={styles.blockText}>
          {isBlocked ? "Unblock User" : "Block User"}
        </Text>
      </TouchableOpacity> */}

           {/* Report Message Modal */}
           <Modal
        visible={reportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select a reason for reporting:</Text>
            {["Spam", "Harassment", "Inappropriate Content"].map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReportReason(reason)}
                style={[
                  styles.reasonOption,
                  selectedReportReason === reason && styles.selectedReason,
                ]}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleReportMessage}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setReportModalVisible(false)}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Chat Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this conversation?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteChat}
                style={styles.modalConfirmButton}>
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Flag User Modal */}
      <Modal
        visible={flagModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFlagModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select a reason for flagging:</Text>
            {["Inappropriate Behavior", "Spam", "Harassment"].map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedFlagReason(reason)}
                style={[
                  styles.reasonOption,
                  selectedFlagReason === reason && styles.selectedReason,
                ]}>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleFlagUser}
                style={styles.modalConfirmButton}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFlagModalVisible(false)}
                style={styles.modalCancelButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  chatHeader: {
    flexDirection: "row", // Place name and menu inline
    justifyContent: "space-between", // Space out name and menu
    alignItems: "center", // Vertically align items
    padding: 20,
    backgroundColor: "#f3b718",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  chatHeaderText: {
    fontSize: 26,
    color: "grey",
    fontWeight: "bold",
    flex: 1, 
    marginLeft: 10,
  },

  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    elevation: 10, // For Android
    zIndex: 1000,
  },
  menuButton: {
    padding: 25, // Add padding to make it easier to tap
  },
  menuOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  menuOptionText: {
    fontSize: 16,
    color: "grey",
  },


 
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
    paddingVertical: 8, // Reduce vertical padding
    borderWidth: 1, // Optional: Add a border for visual balance
    borderColor: "#ddd", // Subtle border color
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#f3b718",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  deleteButton: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 8,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "grey",
    fontSize: 16,
    marginLeft: 10,
  },
  blockButton: {
    backgroundColor: "lightgrey",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  unblockButton: {
    backgroundColor: "lightgreen",
  },
  blockText: {
    fontSize: 16,
    color: "black",
  },
  flagButton: {
    backgroundColor: "orange",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  flagText: {
    fontSize: 16,
    color: "white",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
  },
  ownMessage: {
    backgroundColor: "#e1ffc7",
    alignSelf: "flex-end",
    marginLeft: 120,
  },
  friendMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    marginRight: 120,
  },
  messageText: {
    fontSize: 18,
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  speakerIcon: {
    marginLeft: 10,
  },
  dateHeader: {
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 16,
    color: "#555",
  },

  reportButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportButtonText: {
    fontSize: 12,
    color: "red",
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalConfirmButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "black",
    fontSize: 16,
  },
  reasonOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedReason: {
    backgroundColor: "#d3d3d3",
  },
  reasonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default TextComponent;
