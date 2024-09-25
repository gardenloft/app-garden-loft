import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Ensure onAuthStateChanged is imported
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { callUser } from "../app/VideoSDK2";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
const VideoCall = () => {
  const [userNames, setUserNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [user, setUser] = useState(null); // Track the authenticated user state
  const auth = getAuth();
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const notificationListenerRef = useRef(null); // Ref for the notification listener

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
        fetchFriends(authenticatedUser.uid); // Fetch friends only after authentication
      } else {
        setUser(null); // Reset user state on logout
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Function to fetch friends from the Firestore friends collection
  const fetchFriends = async (userId) => {
    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, `users/${userId}/friends`)
      );
      const fetchedUserNames = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        pushToken: doc.data().pushToken,
        uid: doc.id,
        imageUrl: doc.data().imageUrl,
      }));
      setUserNames(fetchedUserNames);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  // Function to initiate a video call
  const startVideoCall = async (calleeUid) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsCalling(true);
    setIsDeclined(false); // Reset the decline state when starting a new call

    await callUser(calleeUid, user); // Pass the authenticated user

    // Set up notification listener to listen for call acceptance or decline
    notificationListenerRef.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { accept, decline, meetingId } =
          notification.request.content.data;
        if (accept) {
          setIsCalling(false);
          onCalleeAccept(meetingId);
          removeNotificationListener(); // Ensure listener is removed after being triggered
        } else if (decline) {
          setIsCalling(false);
          setIsDeclined(true);
          removeNotificationListener(); // Ensure listener is removed after decline
        }
      });
  };

  // Function to handle the callee accepting the call
  const onCalleeAccept = (meetingId) => {
    router.push({
      pathname: "/VideoSDK2",
      params: { meetingId, autoJoin: true },
    });
  };

  // Function to remove the notification listener to prevent multiple triggers
  const removeNotificationListener = () => {
    if (notificationListenerRef.current) {
      Notifications.removeNotificationSubscription(
        notificationListenerRef.current
      );
      notificationListenerRef.current = null; // Reset the listener reference
    }
  };

  // Function to cancel the call and close the calling modal
  const cancelCall = () => {
    setIsCalling(false);
    removeNotificationListener(); // Remove the notification listener
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.cardContainer,
        {
          // backgroundColor: index === activeIndex ? "#f09030" : "#f09030",
          backgroundColor: "transparent",
          transform:
            index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }],
          height:
            viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.32)
              : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      onPress={() => startVideoCall(item.uid)}>
      {/* <Image source={item.imageUrl} style={styles.image} /> */}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}>
      {/* Calling message modal */}
      <Modal animationType="fade" transparent={true} visible={isCalling}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#f3b718" />
          <Text style={styles.modalText}>Calling...</Text>
          {/* Cancel Call Button */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={cancelCall}>
            <Text style={styles.buttonText}>Cancel Call</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Decline message modal */}
      <Modal animationType="slide" transparent={true} visible={isDeclined}>
        <View style={styles.modalContainer}>
          <Image
            source={require("../assets/garden-loft-logo2.png")}
            style={styles.logo}
          />
          <Text style={styles.modalText}>They are not available right now</Text>
          <TouchableOpacity
            style={[styles.button, styles.dismissButton]}
            onPress={() => setIsDeclined(false)}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }}
        onSnapToItem={handleSnapToItem}
        snapEnabled
        scrollAnimationDuration={800}
        ref={scrollViewRef}
      />
      <TouchableOpacity
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -17 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() =>
          scrollViewRef.current?.scrollTo({ count: -1, animated: true })
        }>
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() =>
          scrollViewRef.current?.scrollTo({ count: 1, animated: true })
        }>
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    position: "relative",
    alignItems: "center",
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginLeft: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.05,
    shadowRadius: 5.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 30,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 180,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
  },
  modalText: {
    fontSize: 40,
    color: "black",
    marginTop: 20,
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  button: {
    padding: 20,
    borderRadius: 10,
  },
  dismissButton: {
    backgroundColor: "orange",
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: "red",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
};

export default VideoCall;
