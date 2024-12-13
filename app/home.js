import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HelpButton from "../components/HelpButton";
import Carousel from "../components/CarouselOne/Carousel";
import React, { useEffect, useState, useRef } from "react";
import { View, Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as Device from "expo-device";
import CallAlertModal from "../components/CallAlertModal";
import { useLocalSearchParams } from "expo-router";
import VideoCall from "../components/VideoCall"; // Import VideoCall component
import MessageModalHandler from "../components/MessageModalHandler";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const params = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [callerUid, setCallerUid] = useState(params.callerUid || "");
  const [calleeUid, setCalleeUid] = useState(params.calleeUid || "");
  const [callerName, setCallerName] = useState(params.callerName || "");
  const [meetingId, setMeetingId] = useState(params.meetingId || null);
  const [isCallAccepted, setIsCallAccepted] = useState(false); // Track if the call is accepted
  const router = useRouter();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageData, setMessageData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { type, friendId, friendName, text } =
          notification.request.content.data;

        if (type === "text") {
          setMessageData({ senderName: friendName, text, friendId });
          setMessageModalVisible(true);
        }
      });

    // Listener for notification taps
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { type, friendId, friendName } =
          response.notification.request.content.data;
        console.log("Notification tapped:", { type, friendId, friendName });

        if (type === "text") {
          // Navigate directly to OpenedChat when notification is tapped
          setMessageModalVisible(false); // Ensure the modal is closed
          router.push({
            pathname: "/OpenedChat",
            params: { friendId, friendName },
          });
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user, router]);

  // Function to show the CallAlertModal
  const showCallAlertModal = (callerName, callerUid, meetingId, calleeUid) => {
    setCallerName(callerName);
    setCallerUid(callerUid);
    setMeetingId(meetingId);
    setCalleeUid(calleeUid);
    setModalVisible(true); // Show the modal manually
  };

  useEffect(() => {
    // If the necessary parameters are passed, trigger the CallAlertModal
    if (callerName && callerUid && meetingId && calleeUid) {
      showCallAlertModal(callerName, callerUid, meetingId, calleeUid);
    }
  }, [callerName, callerUid, meetingId, calleeUid]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          setDoc(
            doc(FIRESTORE_DB, "users", user.uid),
            { pushToken: token },
            { merge: true }
          );
        }
      });

      Notifications.setNotificationCategoryAsync("incoming_call", [
        {
          identifier: "ACCEPT_CALL",
          buttonTitle: "Accept",
          options: { opensAppToForeground: true },
        },
        {
          identifier: "DECLINE_CALL",
          buttonTitle: "Decline",
          options: { opensAppToForeground: false },
        },
      ]);

      // Notification listener for incoming calls
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          const { caller, callerUid, meetingId, calleeUid } =
            notification.request.content.data;
          setCallerUid(callerUid);
          setCallerName(caller);
          setMeetingId(meetingId);
          setCalleeUid(calleeUid);
        });

      // Response listener for actions (Accept/Decline)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          async (response) => {
            const { meetingId, callerUid, callee, calleeUid } =
              response.notification.request.content.data;
            setCalleeUid(calleeUid);

            if (response.actionIdentifier === "ACCEPT_CALL") {
              // Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}&caller=${callerUid}&autoJoin=true`);
              // await handleAcceptCall(meetingId, callerUid, callee);
            } else if (response.actionIdentifier === "DECLINE_CALL") {
              handleDecline();
            }
          }
        );

      // Notification listener for incoming messages and calls
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          const { type, friendId, friendName, text, callerName, meetingId } =
            notification.request.content.data;

          if (type === "text") {
            setMessageData({
              senderName: friendName,
              text,
              friendId,
            });
            setMessageModalVisible(true);
          } else if (type === "call") {
            setCallData({
              callerName,
              meetingId,
            });
            setCallModalVisible(true);
          }
        });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(
            responseListener.current
          );
        }
      };
    }
  }, [user]);

  const handleAcceptCall = async (meetingId, callerUid, callee) => {
    if (isCallAccepted) {
      return; // Ensure that this is not triggered multiple times
    }

    setIsCallAccepted(true); // Set call as accepted to prevent multiple triggers
    console.log("work work work work");
    try {
      const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerUid));
      if (callerDoc.exists()) {
        const callerData = callerDoc.data();
        const callerPushToken = callerData.pushToken;

        // Send "Call Accepted" notification to the caller
        if (callerPushToken) {
          const acceptMessage = {
            to: callerPushToken,
            sound: "default",
            title: "Call Accepted",
            body: `${callee} accepted the call`,
            data: { accept: true, meetingId },
          };

          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(acceptMessage),
          });

          // Close modal and route to VideoSDK screen
          setModalVisible(false);
          // This opens VideoSDK for the callee when they press accept
          router.push({
            pathname: "/VideoSDK2",
            params: { meetingId, autoJoin: true },
          });
        }
      } else {
        console.error("Caller document not found");
      }
    } catch (error) {
      console.error("Error accepting call or sending notification:", error);
    } finally {
      setIsCallAccepted(false); // Reset flag after navigation
    }
  };

  const handleDecline = async () => {
    setModalVisible(false);

    if (user && callerName && calleeUid) {
      try {
        const calleeDoc = await getDoc(doc(FIRESTORE_DB, "users", calleeUid));
        if (!calleeDoc.exists()) {
          Alert.alert("Callee not found");
          return;
        }

        const callee = calleeDoc.data().userName;

        const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerUid));
        if (callerDoc.exists()) {
          const callerData = callerDoc.data();
          const callerPushToken = callerData.pushToken;

          if (callerPushToken) {
            const message = {
              to: callerPushToken,
              sound: "default",
              title: "Call Declined",
              body: `${callee || "User"} is not available right now.`,
              data: { decline: true },
            };

            await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(message),
            });
          }
        }
      } catch (error) {
        console.error("Error sending decline notification:", error);
      }
    }
    router.push("/home");
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    }

    try {
      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      token = pushToken.data;
    } catch (error) {
      console.error("Error getting push token:", error);
    }

    return token;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FCF8E3" }}>
      <SafeAreaProvider>
        <HelpButton />
        <Carousel />
        <CallAlertModal
          visible={modalVisible}
          callerUId={callerUid}
          callerId={callerName}
          onAccept={() => handleAcceptCall(meetingId, callerUid, callerName)}
          onDecline={() => handleDecline(callerUid)}
        />
        <MessageModalHandler
          visible={messageModalVisible}
          senderName={messageData.senderName}
          messageText={messageData.text}
          senderId={messageData.friendId}
          onOpenChat={(friendId, friendName) => {
            setMessageModalVisible(false);
            // navigation.navigate("Text", {
            //   friendId: messageData.senderId,
            //   friendName: messageData.senderName,
            // });
            router.push({
              pathname: "/OpenedChat",
              params: { friendId, friendName },
            });
          }}
          onClose={() => {
            setMessageModalVisible(false);
            router.push("/home");
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
