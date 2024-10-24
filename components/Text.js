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
// // } from "react-native";
// // import {
// //   collection,
// //   addDoc,
// //   query,
// //   orderBy,
// //   onSnapshot,
// //   updateDoc,
// //   doc,
// //   where,
// //   deleteDoc,
// // } from "firebase/firestore";
// // import { getAuth } from "firebase/auth";
// // import { FIRESTORE_DB } from "../FirebaseConfig"; // Ensure this points to your Firebase config
// // import * as Notifications from "expo-notifications"; // For sending notifications
// // import { FontAwesome } from "@expo/vector-icons";
// // import moment from "moment";

// // const TextComponent = ({ friendId, friendName }) => {
// //   const [messages, setMessages] = useState([]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [loading, setLoading] = useState(true);
// //   const [unreadMessages, setUnreadMessages] = useState(0); // To track unread messages
// //   const auth = getAuth();
// //   const user = auth.currentUser;

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

// //   // Function to generate unique chatId for each user-pair
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
// //         timestamp: new Date(),
// //         isRead: false, // Initially mark as unread
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

// //   // Function to send a notification to the friend about a new message
// //   const sendNewMessageNotification = async (recipientId, messageText) => {
// //     // Retrieve friend's push token from Firestore
// //     const friendDoc = await getDoc(doc(FIRESTORE_DB, `users`, recipientId));
// //     const pushToken = friendDoc.data()?.pushToken; // Assuming you store the user's Expo Push Token

// //     if (pushToken) {
// //       await Notifications.scheduleNotificationAsync({
// //         content: {
// //           title: `New message from ${user.displayName || user.email}`,
// //           body: messageText,
// //           sound: true,
// //         },
// //         trigger: { seconds: 1 },
// //         to: pushToken, // Send to the recipient's push token
// //       });
// //     }
// //   };

// //   // Mark all messages as read when chat is opened
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
// //     const q = query(collection(FIRESTORE_DB, `chats/${chatId}/messages`));

// //     try {
// //       const snapshot = await getDocs(q);
// //       snapshot.forEach(async (doc) => {
// //         await deleteDoc(doc.ref);
// //       });

// //       Alert.alert("Chat deleted successfully");
// //     } catch (error) {
// //       console.error("Error deleting chat: ", error);
// //       Alert.alert("Error", "Failed to delete chat. Try again later.");
// //     }
// //   };

// //   const renderMessage = ({ item }) => {
// //     const isOwnMessage = item.senderId === user.uid;
// //     return (
// //       <View
// //         style={[
// //           styles.messageContainer,
// //           isOwnMessage ? styles.ownMessage : styles.friendMessage,
// //         ]}>
// //         <Text style={styles.messageText}>{item.text}</Text>
// //         <Text style={styles.timestampText}>
// //           {moment(item.timestamp.toDate()).format("h:mm a")}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   return (
// //     <KeyboardAvoidingView behavior="padding" style={styles.container}>
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

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: "#f0f0f0",
// //   },
// //   inputContainer: {
// //     flexDirection: "row",
// //     padding: 10,
// //     backgroundColor: "white",
// //     borderRadius: 25,
// //     marginBottom: 10,
// //     alignItems: "center",
// //   },
// //   input: {
// //     flex: 1,
// //     fontSize: 18,
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
// //   ownMessage: {
// //     backgroundColor: "#e1ffc7",
// //     alignSelf: "flex-end",
// //     marginLeft: 50,
// //   },
// //   friendMessage: {
// //     backgroundColor: "#ffffff",
// //     alignSelf: "flex-start",
// //     marginRight: 50,
// //   },
// //   messageText: {
// //     fontSize: 18,
// //   },
// //   timestampText: {
// //     fontSize: 12,
// //     color: "#888",
// //     marginTop: 5,
// //     alignSelf: "flex-end",
// //   },
// //   deleteButton: {
// //     backgroundColor: "red",
// //     padding: 10,
// //     borderRadius: 25,
// //     marginTop: 10,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   deleteButtonText: {
// //     color: "white",
// //     fontSize: 16,
// //     marginLeft: 10,
// //   },
// // });

// // export default TextComponent;

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
  Dimensions,
} from "react-native";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import * as Notifications from "expo-notifications";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";

// Get device dimensions for media queries
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const TextComponent = ({ friendId, friendName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
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
      const loadedMessages = [];
      let unreadCount = 0;
      snapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() };
        loadedMessages.push(message);
        if (message.senderId !== user.uid && !message.isRead) {
          unreadCount += 1;
        }
      });
      setMessages(loadedMessages);
      setUnreadMessages(unreadCount);
      setLoading(false);

      // Mark messages as read when opening the chat
      markMessagesAsRead(loadedMessages);
    });

    return () => unsubscribe();
  }, [friendId]);

  // Generate unique chatId for user-pair
  const generateChatId = (uid1, uid2) => {
    return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const chatId = generateChatId(user.uid, friendId);

    try {
      const messageData = {
        senderId: user.uid,
        senderName: user.displayName || user.email,
        text: newMessage,
        timestamp: Timestamp.now(),
        isRead: false,
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

  // Send notification to the receiver
  // const sendNewMessageNotification = async (recipientId, messageText) => {
  //   const friendDoc = await getDoc(doc(FIRESTORE_DB, `users`, recipientId));
  //   const pushToken = friendDoc.data()?.pushToken;
  //   const senderName = user.displayName || user.email;

  //   if (pushToken) {
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: `New message from ${friendName}`,
  //         body: messageText,
  //         sound: true,
  //       },
  //       trigger: { seconds: 1 },
  //       to: pushToken,
  //     });
  //   }
  // };
  // Send notification to the receiver
  // Send notification to the receiver (friend) based on the shared structure
  const sendNewMessageNotification = async (recipientId, messageText) => {
    try {
      // Fetch the recipient's (friend's) data using their uid
      const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", recipientId));
      const friendData = friendDoc.data();
      const pushToken = friendData?.pushToken;

      if (!friendData || !pushToken) {
        console.error("Recipient's data or push token is not available");
        return;
      }

      // Prevent notification from being sent to yourself (the sender)
      if (recipientId === user.uid) {
        console.log("Notification not sent to self.");
        return; // Exit early if trying to send notification to yourself
      }

      const senderName = user.displayName || user.email; // Sender's details

      // POST request to Expo Push API
      const message = {
        to: pushToken,
        sound: "default",
        title: `New message from ${friendName}`,
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

  const markMessagesAsRead = async (loadedMessages) => {
    const chatId = generateChatId(user.uid, friendId);
    loadedMessages.forEach(async (message) => {
      if (message.senderId !== user.uid && !message.isRead) {
        await updateDoc(
          doc(FIRESTORE_DB, `chats/${chatId}/messages`, message.id),
          {
            isRead: true,
          }
        );
      }
    });
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
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === user.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.friendMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestampText}>
          {moment(item.timestamp.toDate()).format("h:mm a")}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {/* Heading for chat */}
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
          <FontAwesome name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleDeleteChat} style={styles.deleteButton}>
        <FontAwesome name="trash" size={24} color="white" />
        <Text style={styles.deleteButtonText}>Delete Chat</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH > 400 ? 80 : 60,
    paddingTop: SCREEN_HEIGHT > 800 ? 20 : 5,
    marginBottom: SCREEN_HEIGHT > 800 ? 5 : 5,
    backgroundColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    marginHorizontal: SCREEN_WIDTH > 400 ? -10 : -30,
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#f3b718",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
  },
  ownMessage: {
    backgroundColor: "#e1ffc7",
    alignSelf: "flex-end",
    marginLeft: SCREEN_WIDTH > 400 ? 200 : 100,
  },
  friendMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    marginRight: 50,
  },
  messageText: {
    fontSize: SCREEN_WIDTH > 400 ? 18 : 16,
  },
  timestampText: {
    fontSize: SCREEN_WIDTH > 400 ? 12 : 10,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  deleteButton: {
    // backgroundColor: "red",
    backgroundColor: "#f0f0f0", //same as background
    // backgroundColor: "#FFDDAA",
    // backgroundColor: "#C0C4C8",
    // borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 3,
    //   height: 7,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 6,
    // elevation: 8,
    borderWidth: 1,
    borderColor: "grey",

    padding: 10,
    borderRadius: 25,
    marginTop: 10,
    marginBottom: SCREEN_HEIGHT > 800 ? 8 : 8,
    marginHorizontal: SCREEN_WIDTH > 400 ? 20 : 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "grey",
    fontSize: SCREEN_WIDTH > 400 ? 16 : 14,
    marginLeft: 10,
  },
  chatHeader: {
    padding: 20,
    backgroundColor: "#f3b718",
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,

    borderWidth: 8,
    borderColor: "grey",
    marginHorizontal: SCREEN_WIDTH > 400 ? -22 : -20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  chatHeaderText: {
    fontSize: SCREEN_WIDTH > 400 ? 22 : 20,
    color: "grey",
    fontWeight: "bold",
  },
});

export default TextComponent;

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
//   doc,
//   deleteDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import * as Notifications from "expo-notifications";
// import { FontAwesome } from "@expo/vector-icons";
// import moment from "moment";

// const TextComponent = ({ friendId, friendName }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [unreadMessages, setUnreadMessages] = useState(0);
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

//   // Generate unique chatId for user-pair
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

//   // Send notification for new message
//   const sendNewMessageNotification = async (recipientId, messageText) => {
//     const friendDoc = await getDoc(doc(FIRESTORE_DB, `users`, recipientId));
//     const pushToken = friendDoc.data()?.pushToken;

//     if (pushToken) {
//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: `New message from ${user.displayName || user.email}`,
//           body: messageText,
//           sound: true,
//         },
//         trigger: { seconds: 1 },
//         to: pushToken,
//       });
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

//   const renderMessage = ({ item }) => {
//     const isOwnMessage = item.senderId === user.uid;
//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isOwnMessage ? styles.ownMessage : styles.friendMessage,
//         ]}>
//         <Text style={styles.messageText}>{item.text}</Text>
//         <Text style={styles.timestampText}>
//           {moment(item.timestamp.toDate()).format("h:mm a")}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView behavior="padding" style={styles.container}>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 140,
//     paddingTop: 130,
//     backgroundColor: "#f0f0f0",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 10,
//     marginHorizontal: -80,
//     backgroundColor: "white",
//     borderRadius: 25,
//     marginBottom: 10,
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     backgroundColor: "#f3b718",
//     padding: 10,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   messageContainer: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 15,
//   },
//   ownMessage: {
//     backgroundColor: "#e1ffc7",
//     alignSelf: "flex-end",
//     marginLeft: 200,
//   },
//   friendMessage: {
//     backgroundColor: "#ffffff",
//     alignSelf: "flex-start",
//     marginRight: 50,
//   },
//   messageText: {
//     fontSize: 18,
//   },
//   timestampText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 5,
//     alignSelf: "flex-end",
//   },
//   deleteButton: {
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 25,
//     marginTop: 10,
//     marginHorizontal: 2,
//     // flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   deleteButtonText: {
//     color: "white",
//     fontSize: 16,
//     marginLeft: 10,
//   },
// });

// export default TextComponent;
