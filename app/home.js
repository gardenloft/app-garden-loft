// import "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import HelpButton from "../components/HelpButton";
// import Carousel from "../components/CarouselOne/Carousel";
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Platform, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Linking from 'expo-linking';
// import Constants from 'expo-constants';
// import { useRouter } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as Device from 'expo-device';
// import CallAlertModal from '../components/CallAlertModal';
// import { useLocalSearchParams } from "expo-router"; 

// export default function Home() {
//   const auth = FIREBASE_AUTH;
//   const user = auth.currentUser;
//   const notificationListener = useRef(null);
//   const responseListener = useRef(null);
//   const params = useLocalSearchParams(); // Retrieve parameters
//   const [modalVisible, setModalVisible] = useState(false);
//   const [callerUid, setCallerUid] = useState(params.callerUid || '');
//   const [calleeUid, setCalleeUid] = useState(params.calleeUid || ''); 
//   const [callerName, setCallerName] = useState(params.callerName || '');
//   const [calleeName, setCalleeName] = useState('');
//   const [meetingId, setMeetingId] = useState(params.meetingId || null);
//   const router = useRouter();

//     // Function to show the CallAlertModal
//     const showCallAlertModal = (callerName, callerUid, meetingId, calleeUid) => {
//       setCallerName(callerName);
//       setCallerUid(callerUid);
//       setMeetingId(meetingId);
//       setCalleeUid(calleeUid);
//       setModalVisible(true);  // Show the modal manually
//     };
  
//     useEffect(() => {
//       // If the necessary parameters are passed, trigger the CallAlertModal
//       if (callerName && callerUid && meetingId && calleeUid) {
//         showCallAlertModal(callerName, callerUid, meetingId, calleeUid);
//       }
//     }, [callerName, callerUid, meetingId, calleeUid]);


//   useEffect(() => {
//     if (user) {
//       registerForPushNotificationsAsync().then(token => {
//         if (token) {
//           setDoc(doc(FIRESTORE_DB, 'users', user.uid), { pushToken: token }, { merge: true });
//         }
//       });

//       Notifications.setNotificationCategoryAsync('incoming_call', [
//         {
//           identifier: 'ACCEPT_CALL',
//           buttonTitle: 'Accept',
//           options: { opensAppToForeground: true },
//         },
//         {
//           identifier: 'DECLINE_CALL',
//           buttonTitle: 'Decline',
//           options: { opensAppToForeground: false },
//         },
//       ]);

//       notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//         const { caller, callerUid, meetingId, calleeUid} = notification.request.content.data;
//         setCallerUid(callerUid);
//         setCallerName(caller);
//         setMeetingId(meetingId);
//         setCalleeUid(calleeUid); 

//       });

//       responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//         const { meetingId, callerUid, callee, calleeUid} = response.notification.request.content.data;
//         setCalleeUid(calleeUid);
//         if (response.actionIdentifier === 'ACCEPT_CALL') {
//           Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}&caller=${callerUid}&autoJoin=true`);
//         } else if (response.actionIdentifier === 'DECLINE_CALL') {
//           handleDecline();

    
//         }
//       });

//       return () => {
//         if (notificationListener.current) {
//           Notifications.removeNotificationSubscription(notificationListener.current);
//         }
//         if (responseListener.current) {
//           Notifications.removeNotificationSubscription(responseListener.current);
//         }
//       };
//     }
//   }, [user]);

//   const joinMeeting = async () => {
//     setModalVisible(false);
//     router.push({
//       pathname: '/VideoSDK2',
//       params: { meetingId, autoJoin: true }
//     });
//   };

//   const handleDecline = async () => {
//     console.log("Decline triggered for calleeUid:", calleeUid);
//     setModalVisible(false);
  
//     // const calleeUid = callerUid; 
    
//     // Send notification to the caller
//     if (user && callerName && calleeUid) {
//       try {
//         //get calleeName
//         const calleeDoc = await getDoc(doc(FIRESTORE_DB, "users", calleeUid));
//         if (!calleeDoc.exists()) {
//           Alert.alert("Callee not found");
//           return;
//         }
//         // const calleeData = calleeDoc.data();
//         const callee = calleeDoc.data().userName;
//         // const calleePushToken = calleeData.pushToken;

//         // Get the caller's document from Firestore using callerUid
//         const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerUid));
//         if (callerDoc.exists()) {
//           const callerData = callerDoc.data();
//           const callerPushToken = callerData.pushToken;
//           console.log(callee);
  
//           if (callerPushToken) {
//             // Prepare the decline message
//             const message = {
//               to: callerPushToken,
//               sound: "default",
//               title: "Call Declined",
//               body: `${callee || "User"} is not available right now.`,
//               data: {
//                 decline: true, // Custom field to indicate decline
//               },
//             }
//             ;

  
//             // Send the notification
//             const response = await fetch("https://exp.host/--/api/v2/push/send", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//               },
//               body: JSON.stringify(message),
//             });
//             // Parse the response
//             const data = await response.json();
//             console.log("Decline Notification Response:", data);
//           } else {
//             console.error("Caller push token is missing.");
//           }
//         } else {
//           console.error("Caller document does not exist.");
//         }
//       } catch (error) {
//         console.error("Error sending decline notification:", error);
//       }
//     }
  
//     // Navigate back to the Home screen after declining the call
//     router.push('/home');
//   };
  

//   async function registerForPushNotificationsAsync() {
//     let token;

//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }

//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') {
//         alert('Failed to get push token for push notification!');
//         return;
//       }
//     }

//     try {
//       const pushToken = await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig?.extra?.eas?.projectId,
//       });
//       token = pushToken.data;
//     } catch (error) {
//       console.error('Error getting push token:', error);
//     }

//     return token;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FCF8E3" }}>
//       <SafeAreaProvider>
//         <HelpButton />
//         <Carousel />
//         <CallAlertModal
//           visible={modalVisible}
//           callerUId={callerUid}
//           callerId={callerName}
//           onAccept={joinMeeting}
//           onDecline={() => handleDecline(callerUid)}
          
//         />
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }




//working loading call before opening

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
  const router = useRouter();

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
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          const { caller, callerUid, meetingId, calleeUid } =
            notification.request.content.data;
            setCallerUid(callerUid);
                    setCallerName(caller);
                    setMeetingId(meetingId);
                    setCalleeUid(calleeUid); 
        }
      );

      // Response listener for actions (Accept/Decline)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const { meetingId, callerUid, callee, calleeUid } = response.notification.request.content.data;
          setCalleeUid(calleeUid);

          if (
            response.actionIdentifier === "ACCEPT_CALL") {
            await handleAcceptCall(meetingId, callerUid, callee);
          } else if (
            response.actionIdentifier === "DECLINE_CALL") {
            handleDecline();
          }
        }
      );

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, [user]);

  const handleAcceptCall = async (meetingId, callerUid, callee) => {
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
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}