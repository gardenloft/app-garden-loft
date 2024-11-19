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
//   Dimensions,
// } from "react-native";
// import {
//   collection,
//   addDoc,
//   getDoc,
//   getDocs,
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
// import * as Notifications from "expo-notifications";
// import * as Speech from "expo-speech";
// import { FontAwesome } from "@expo/vector-icons";
// import moment from "moment";

// // Get device dimensions for media queries
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// const TextComponent = ({ friendId, friendName }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [unreadMessages, setUnreadMessages] = useState(0);
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state

//   const flatListRef = useRef(null);

//   useEffect(() => {
//     const chatId = generateChatId(user.uid, friendId);
//     const q = query(
//       collection(FIRESTORE_DB, `chats/${chatId}/messages`),
//       orderBy("timestamp", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const loadedMessages = [];
//       let unreadCount = 0;
//       snapshot.forEach((doc) => {
//         const message = { id: doc.id, ...doc.data() };
//         loadedMessages.push(message);
//         if (message.senderId !== user.uid && !message.isRead) {
//           unreadCount += 1;
//         }
//       });
//       setMessages(loadedMessages);
//       setUnreadMessages(unreadCount);
//       setLoading(false);

//       // Mark messages as read when opening the chat
//       markMessagesAsRead(loadedMessages);
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
//         senderName: user.displayName || user.email,
//         text: newMessage,
//         timestamp: Timestamp.now(),
//         isRead: false,
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

//   const markMessagesAsRead = async (loadedMessages) => {
//     const chatId = generateChatId(user.uid, friendId);
//     loadedMessages.forEach(async (message) => {
//       if (message.senderId !== user.uid && !message.isRead) {
//         await updateDoc(
//           doc(FIRESTORE_DB, `chats/${chatId}/messages`, message.id),
//           {
//             isRead: true,
//           }
//         );
//       }
//     });
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

//     const handleSpeechToggle = async (text) => {
//       const speaking = await Speech.isSpeakingAsync();
//       if (speaking) {
//         Speech.stop(); // Stop speech if currently speaking
//         setIsSpeaking(false);
//       } else {
//         Speech.speak(text, {
//           pitch: 1.0,
//           rate: 1.0,
//           onStart: () => setIsSpeaking(true),
//           onDone: () => setIsSpeaking(false),
//           onStopped: () => setIsSpeaking(false), // Handle stop event
//         });
//       }
//     };

//     return (
//       <View>
//         {/* Display date header if it's the first message of a new day */}
//         {showDateHeader && (
//           <View style={styles.dateHeader}>
//             <Text style={styles.dateHeaderText}>{currentDate}</Text>
//           </View>
//         )}

//         <Pressable
//           style={[
//             styles.messageContainer,
//             isOwnMessage ? styles.ownMessage : styles.friendMessage,
//           ]}
//           onPress={() => handleSpeechToggle(item.text)}>
//           <View style={styles.messageContent}>
//             <Text style={styles.messageText}>{item.text}</Text>
//             <TouchableOpacity
//               onPress={(e) => {
//                 e.stopPropagation(); // Prevent triggering the parent Pressable
//                 handleSpeechToggle(item.text);
//               }}
//               style={styles.speakerIcon}>
//               <FontAwesome name="volume-up" size={16} color="gray" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.timestampText}>
//             {moment(item.timestamp.toDate()).format("h:mm a")}
//           </Text>
//         </Pressable>
//       </View>
//     );
//   };

//   // const renderMessage = ({ item }) => {
//   //   const isOwnMessage = item.senderId === user.uid;

//   //   return (
//   //     <View
//   //       style={[
//   //         styles.messageContainer,
//   //         isOwnMessage ? styles.ownMessage : styles.friendMessage,
//   //       ]}>
//   //       <View style={styles.messageContent}>
//   //         <Text style={styles.messageText}>{item.text}</Text>
//   //         <TouchableOpacity
//   //           onPress={() => Speech.speak(item.text)}
//   //           style={styles.speakerIcon}>
//   //           <FontAwesome name="volume-up" size={18} color="gray" />
//   //         </TouchableOpacity>
//   //       </View>
//   //       <Text style={styles.timestampText}>
//   //         {moment(item.timestamp.toDate()).format("h:mm a")}
//   //       </Text>
//   //     </View>
//   //   );
//   // };

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
//           <FontAwesome name="send" size={24} color="white" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={handleDeleteChat} style={styles.deleteButton}>
//         <FontAwesome name="trash" size={24} color="white" />
//         <Text style={styles.deleteButtonText}>Delete Chat</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: SCREEN_WIDTH > 400 ? 80 : 60,
// //     paddingTop: SCREEN_HEIGHT > 800 ? 20 : 5,
// //     marginBottom: SCREEN_HEIGHT > 800 ? 5 : 5,
// //     backgroundColor: "#f0f0f0",
// //   },
// //   inputContainer: {
// //     flexDirection: "row",
// //     padding: 10,
// //     marginHorizontal: SCREEN_WIDTH > 400 ? -10 : -30,
// //     backgroundColor: "white",
// //     borderRadius: 25,
// //     marginBottom: 10,
// //     alignItems: "center",
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
// //     paddingHorizontal: 15,
// //   },
// //   sendButton: {
// //     backgroundColor: "#f3b718",
// //     padding: 10,
// //     borderRadius: 50,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   messageContainer: {
// //     padding: 10,
// //     marginVertical: 5,
// //     borderRadius: 15,
// //   },
// //   messageContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //   },
// //   speakerIcon: {
// //     marginLeft: 10,
// //   },
// //   ownMessage: {
// //     backgroundColor: "#e1ffc7",
// //     alignSelf: "flex-end",
// //     marginLeft: SCREEN_WIDTH > 400 ? 200 : 100,
// //   },
// //   friendMessage: {
// //     backgroundColor: "#ffffff",
// //     alignSelf: "flex-start",
// //     marginRight: 100,
// //   },
// //   messageText: {
// //     fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
// //   },
// //   timestampText: {
// //     fontSize: SCREEN_WIDTH > 400 ? 12 : 10,
// //     color: "#888",
// //     marginTop: 5,
// //     alignSelf: "flex-end",
// //   },
// //   deleteButton: {
// //     backgroundColor: "#f0f0f0",
// //     borderWidth: 1,
// //     borderColor: "grey",
// //     padding: 10,
// //     borderRadius: 25,
// //     marginTop: 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   deleteButtonText: {
// //     color: "grey",
// //     fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
// //     marginLeft: 10,
// //   },
// //   chatHeader: {
// //     padding: 20,
// //     backgroundColor: "#f3b718",
// //     borderRadius: 10,
// //     marginBottom: 20,
// //     alignItems: "center",
// //   },
// //   messageWrapper: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginVertical: 5,
// //     justifyContent: "flex-end", // Align the speaker icon to the right
// //   },
// //   speakerIcon: {
// //     marginLeft: 10, // Space between the message and the icon
// //   },

// //   chatHeaderText: {
// //     fontSize: SCREEN_WIDTH > 400 ? 22 : 20,
// //     color: "grey",
// //     fontWeight: "bold",
// //   },
// // });

// // export default TextComponent;

// const { width, height } = Dimensions.get("window");
// const isLandscape = width > height;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: isLandscape ? 40 : 20,
//     paddingTop: isLandscape ? 10 : 20,
//     marginBottom: isLandscape ? 10 : 5,
//     backgroundColor: "#f0f0f0",
//   },
//   chatHeader: {
//     padding: isLandscape ? 10 : 20,
//     backgroundColor: "#f3b718",
//     borderRadius: 10,
//     marginBottom: isLandscape ? 10 : 20,
//     alignItems: "center",
//   },
//   chatHeaderText: {
//     fontSize: isLandscape ? 20 : 24,
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
//     fontSize: 14,
//     color: "#555",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: isLandscape ? 5 : 10,
//     marginHorizontal: isLandscape ? -5 : -10,
//     backgroundColor: "white",
//     borderRadius: 25,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     fontSize: isLandscape ? 14 : 18,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     backgroundColor: "#f3b718",
//     padding: isLandscape ? 8 : 10,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteButton: {
//     backgroundColor: "#f0f0f0",
//     borderWidth: 1,
//     borderColor: "grey",
//     padding: isLandscape ? 8 : 10,
//     borderRadius: 25,
//     marginTop: isLandscape ? 5 : 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deleteButtonText: {
//     color: "grey",
//     fontSize: isLandscape ? 14 : 16,
//     marginLeft: 10,
//   },
//   messageWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//     justifyContent: "flex-end",
//   },
//   messageContainer: {
//     padding: isLandscape ? 8 : 12,
//     marginVertical: 5,
//     borderRadius: 15,
//   },
//   ownMessage: {
//     backgroundColor: "#e1ffc7",
//     alignSelf: "flex-end",
//     marginLeft: isLandscape ? 120 : 200,
//   },
//   friendMessage: {
//     backgroundColor: "#ffffff",
//     alignSelf: "flex-start",
//     marginRight: isLandscape ? 120 : 200,
//   },
//   messageText: {
//     fontSize: isLandscape ? 14 : 18,
//   },
//   timestampText: {
//     fontSize: isLandscape ? 10 : 12,
//     color: "#888",
//     marginTop: 5,
//     alignSelf: "flex-end",
//   },
//   speakerIcon: {
//     marginLeft: 10,
//   },
// });

// export default TextComponent;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import * as Speech from "expo-speech";
import * as Notifications from "expo-notifications";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

const TextComponent = ({ friendId, friendName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // delete confirmation modal
  const [isSpeaking, setIsSpeaking] = useState(false); // Track speaking state
  const auth = getAuth();
  const user = auth.currentUser;
  const flatListRef = useRef(null);

  useEffect(() => {
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

    return () => unsubscribe();
  }, [friendId]);

  const generateChatId = (uid1, uid2) => {
    return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const chatId = generateChatId(user.uid, friendId);

    try {
      const messageData = {
        senderId: user.uid,
        text: newMessage,
        timestamp: Timestamp.now(),
      };

      await addDoc(
        collection(FIRESTORE_DB, `chats/${chatId}/messages`),
        messageData
      );
      setNewMessage("");

      // Trigger push notification for new message
      sendNewMessageNotification(friendId, messageData.text);
    } catch (error) {
      console.error("Error sending message: ", error);
      Alert.alert("Error", "Failed to send message. Try again later.");
    }
  };

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
        data: { someData: "goes here" },
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

  // const renderMessage = ({ item, index }) => {
  //   const isOwnMessage = item.senderId === user.uid;

  //   // Check if the current message is the first of a new day
  //   const currentDate = moment(item.timestamp.toDate()).format("DD MMM YYYY");
  //   const previousDate =
  //     index > 0
  //       ? moment(messages[index - 1].timestamp.toDate()).format("DD MMM YYYY")
  //       : null;

  //   const showDateHeader = currentDate !== previousDate;

  //   return (
  //     <View>
  //       {showDateHeader && (
  //         <View style={styles.dateHeader}>
  //           <Text style={styles.dateHeaderText}>{currentDate}</Text>
  //         </View>
  //       )}
  //       <View
  //         style={[
  //           styles.messageContainer,
  //           isOwnMessage ? styles.ownMessage : styles.friendMessage,
  //         ]}>
  //         <View style={styles.messageContent}>
  //           <Text style={styles.messageText}>{item.text}</Text>
  //           <TouchableOpacity
  //             onPress={() => Speech.speak(item.text)}
  //             style={styles.speakerIcon}>
  //             <FontAwesome
  //               name="volume-up"
  //               size={isLandscape ? 20 : 24}
  //               color="gray"
  //             />
  //           </TouchableOpacity>
  //         </View>
  //         <Text style={styles.timestampText}>
  //           {moment(item.timestamp.toDate()).format("h:mm a")}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  const handleSpeechToggle = (text) => {
    if (isSpeaking) {
      // If already speaking, stop the speech and reset the state
      Speech.stop();
      setIsSpeaking(false);
    } else {
      // If not speaking, start speaking and update the state
      Speech.speak(text, {
        pitch: 1.0,
        rate: 1.0,
        onStart: () => setIsSpeaking(true), // Set to true when speaking starts
        onDone: () => setIsSpeaking(false), // Set to false when speaking finishes
        onStopped: () => setIsSpeaking(false), // Set to false when speech is stopped
      });
    }
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
              onPress={() => handleSpeechToggle(item.text)}
              style={styles.speakerIcon}>
              <FontAwesome
                // name={isSpeaking ? "stop" : "volume-up"} // Icon toggles between stop and speaker
                name={"volume-up"}
                size={28}
                color={"gray"}
                // color={isSpeaking ? "gray" : "gray"} // Red for stop, gray for play
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.timestampText}>
            {moment(item.timestamp.toDate()).format("h:mm a")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderText}>{friendName}</Text>
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
          <FontAwesome name="send" size={isLandscape ? 18 : 24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.deleteButton}>
        <FontAwesome name="trash" size={isLandscape ? 18 : 24} color="grey" />
        <Text style={styles.deleteButtonText}>Delete Chat</Text>
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this conversation? There is no way
              to recover it.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteChat}
                style={styles.modalConfirmButton}>
                <Text style={styles.modalButtonText}>Yes, I'm sure</Text>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isLandscape ? 40 : 20,
    backgroundColor: "#f0f0f0",
  },
  chatHeader: {
    padding: isLandscape ? 15 : 20,
    backgroundColor: "#f3b718",
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  chatHeaderText: {
    fontSize: isLandscape ? 24 : 28,
    color: "grey",
    fontWeight: "bold",
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
    fontSize: isLandscape ? 16 : 18,
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    padding: isLandscape ? 12 : 16,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: isLandscape ? 16 : 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#f3b718",
    padding: isLandscape ? 8 : 10,
    borderRadius: 50,
    alignItems: "center",
  },
  deleteButton: {
    // backgroundColor: "lightgrey",
    borderColor: "grey",
    borderWidth: 0.5,
    padding: isLandscape ? 4 : 8,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "grey",
    fontSize: isLandscape ? 14 : 16,
    marginLeft: 10,
  },
  messageContainer: {
    padding: isLandscape ? 10 : 15,
    marginVertical: 5,
    borderRadius: 15,
  },
  ownMessage: {
    backgroundColor: "#e1ffc7",
    alignSelf: "flex-end",
    marginLeft: isLandscape ? 120 : 180,
  },
  friendMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    marginRight: isLandscape ? 120 : 180,
  },
  messageText: {
    fontSize: isLandscape ? 20 : 24,
  },
  timestampText: {
    fontSize: isLandscape ? 12 : 14,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  speakerIcon: {
    marginLeft: 10,
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
});

export default TextComponent;
