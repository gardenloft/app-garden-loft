import React, { useState, useEffect, useRef, useCallback } from "react";
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
  increment,
  writeBatch,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import * as Speech from "expo-speech";
import moment from "moment";
import * as Notifications from "expo-notifications";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { logAppUsageEvent } from "../components/EventLogger";  // Import the logger

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

const TextComponent = (props) => {
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
  const params = useLocalSearchParams(); // Get params from the route
  const friendId = props.friendId || params.friendId; // Use prop if available, else fallback to params
  const friendName = props.friendName || params.friendName;

  //   useEffect(() => {

  // //  Check if the user is blocked
  //     const checkBlockedStatus = async () => {
  //       const userDoc = await getDoc(doc(FIRESTORE_DB, "users", user.uid));
  //       const userData = userDoc.data();
  //       const blockedUsers = userData?.blockedUsers || [];
  //       setIsBlocked(blockedUsers.includes(friendId));
  //     };
  //     checkBlockedStatus();

  //     if (friendId && user) {
  //       const chatId = user.uid > friendId ? `${user.uid}_${friendId}` : `${friendId}_${user.uid}`;
  //       const q = query(
  //         collection(FIRESTORE_DB, `chats/${chatId}/messages`),
  //         orderBy("timestamp", "asc")
  //       );

  //       const unsubscribe = onSnapshot(q, (snapshot) => {
  //         const loadedMessages = snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         setMessages(loadedMessages);
  //         setLoading(false);
  //       });

  //       return () => unsubscribe();
  //     }
  //   }, [friendId, user, isBlocked]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!friendId || !user) return;
  
      const chatId = generateChatId(user.uid, friendId);
      const q = query(
        collection(FIRESTORE_DB, `chats/${chatId}/messages`),
        where("isRead", "==", false),
        where("receiverId", "==", user.uid) // Ensure it's unread messages for the current user
      );
  
      const snapshot = await getDocs(q);
  
      const batch = writeBatch(FIRESTORE_DB);
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true }); // Mark messages as read
      });
  
      await batch.commit();
  
      // Reset unread count for the friend
      const friendRef = doc(FIRESTORE_DB, `users/${user.uid}/friends`, friendId);
      await updateDoc(friendRef, { unreadCount: 0 }); // Reset unread count
    };
  
    markMessagesAsRead();
  }, [friendId, user]);

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

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: moment(doc.data().timestamp.toDate()).format("DD MMM YYYY"),
          formattedTime: moment(doc.data().timestamp.toDate()).format("h:mm a"),
        }));
       
        // ✅ Find new messages received by the user
      const newReceivedMessages = loadedMessages.filter(
        (msg) => msg.receiverId === user.uid && !msg.isRead
      );

      // ✅ Log received messages to Supabase
      for (const message of newReceivedMessages) {
        await logAppUsageEvent(user.uid, "text_message_received", {
          sender_id: message.senderId,
          message_text: message.text,
        });

        // Mark messages as read in Firestore
        await updateDoc(doc(FIRESTORE_DB, `chats/${chatId}/messages`, message.id), {
          isRead: true,
        });
      }
        setMessages(loadedMessages);
        setLoading(false);
        console.log("TextComponent received:", { friendId, friendName });
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

      // ✅ Log message sent to Supabase
    await logAppUsageEvent(user.uid, "text_message_sent", {
      recipient_id: friendId,
      message_text: newMessage,
    });

       // Increment the unread count for the recipient
    const friendRef = doc(FIRESTORE_DB, `users/${friendId}/friends`, user.uid);
    await updateDoc(friendRef, {
      unreadCount: increment(1), // Increment unread count by 1
    });

      setNewMessage("");
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
        data: {
          someData: "goes here",
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
      Alert.alert(
        "Reported",
        currentMessageId
          ? "The message has been reported for review."
          : "The chat has been reported for review."
      );
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
    setCurrentMessageId(messageId); // `null` means it's a chat-level report
    setReportModalVisible(true);
  };


  const renderMessage = useCallback(({ item, index }) => {
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
            <Text style={styles.dateHeaderText}>{item.formattedDate}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessage : styles.friendMessage,
          ]}
        >
          <View style={styles.messageContent}>
            <TouchableOpacity
              onPress={() =>
                Speech.speak(item.text, {
                  onDone: () => setIsSpeaking(false),
                })
              }
              style={styles.speakerIcon}
            >
              <FontAwesome name="volume-up" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onLongPress={() => openReportModal(item.id)} // Trigger report modal on long press
            style={[
              styles.messageContainer,
              isOwnMessage ? styles.ownMessage : styles.friendMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>
              {/* {moment(item.timestamp.toDate()).format("h:mm a")} */}
              {item.formattedTime}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [messages, user.uid]);

  const MemoizedRenderMessage = React.memo(renderMessage); 

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderText}>{friendName}</Text>

        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuButton}
        >
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
          // renderItem={MemoizedMessage}
          keyExtractor={(item) => item.id}
          initialNumToRender={20} // Start with 20 messages
  maxToRenderPerBatch={10} // Render 10 more when scrolling
  windowSize={5} 
  removeClippedSubviews={true}
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
        style={styles.deleteButton}
      >
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this conversation?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteChat}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCancelButton}
              >
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
        onRequestClose={() => setFlagModalVisible(false)}
      >
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
                ]}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleFlagUser}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFlagModalVisible(false)}
                style={styles.modalCancelButton}
              >
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
    padding: 10,
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
    paddingHorizontal: 10,
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
    // width: width > height ? width * 0.7 : width * 0.60,
    marginVertical: 5,
    borderRadius: 15,
  },
  messageContent: {
    width: width > height ? width * 0.70 : width * 0.50,
  },
  ownMessage: {
    backgroundColor: "#e1ffc7",
    alignSelf: "flex-end",
    marginLeft: 60,
  },
  friendMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
    marginRight: 120,
    maxWidth: "70%",  // Limit maximum width to 70% of the screen
    minWidth: "80%", 
  },
  messageText: {
    fontSize: 18,
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    marginHorizontal: 10,
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