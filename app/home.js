// import "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import HelpButton from "../components/HelpButton";
// import Carousel from "../components/CarouselOne/Carousel";
// //used for deep linking video call
// import React, { useEffect, useState, useRef } from 'react';
// import { View, StyleSheet, Text, Platform, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Linking from 'expo-linking';
// import Constants from 'expo-constants';
// import { useRouter } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as Device from 'expo-device';
// import CallAlertModal from '../components/CallAlertModal';

// export default function Home() {
//   const auth = FIREBASE_AUTH;
//   const user = auth.currentUser;
//   const notificationListener = useRef(null);
//   const responseListener = useRef(null);
//   //modal alert
//   const [modalVisible, setModalVisible] = useState(false);
//   const [callerName, setCallerName] = useState('');
//   const [meetingId, setMeetingId] = useState(null);
//   const router = useRouter();

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
//         const { caller, meetingId } = notification.request.content.data;
//         setCallerName(caller);
//         setMeetingId(meetingId);
//         setModalVisible(true);
//       });

//       notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//         const { callerUid, meetingId } = notification.request.content.data;
//         setCallerName(callerUid);
//         setMeetingId(meetingId);
//         setModalVisible(true);
//       });

//       responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//         const { meetingId, caller, setAutoJoinForCallee } = response.notification.request.content.data;
//         if (response.actionIdentifier === 'ACCEPT_CALL') {

//           Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}?caller=${caller}&autoJoin=true`);

//         } else if (response.actionIdentifier === 'DECLINE_CALL') {
//           // Handle decline action if needed
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

//   // const handleDecline = () => {
//   //   setModalVisible(false);
//   // };

//  const handleDecline = async () => {
//   setModalVisible(false);

//   // Send notification to caller
//   if (user && callerName) {
//     try {
//       // Get the caller's document from Firestore
//       const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerName));
//       if (callerDoc.exists()) {
//         const callerData = callerDoc.data();
//         const callerPushToken = callerData.pushToken;

//         // Prepare the message
//         const message = {
//           to: callerPushToken,
//           sound: "default",
//           title: "Call Declined",
//           body: `${user.displayName || "User"} is not available right now.`,
//         };

//         // Send the notification
//         await fetch("https://exp.host/--/api/v2/push/send", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify(message),
//         });
//       }
//     } catch (error) {
//       console.error("Error sending decline notification:", error);
//     }
//   }
// };
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
//       console.log('Existing status:', existingStatus);
//       console.log('Final status:', finalStatus);
//     }
//       try {
//         let theId = Constants.expoConfig?.extra?.eas?.projectId;
//         console.log("projectId is:", theId);
//         let pushToken = await Notifications.getExpoPushTokenAsync({projectId: theId});
//         console.log("pushToken is:", pushToken);
//         token = pushToken.data;
//         console.log('Token is:', token);
//       } catch (error) {
//         console.error('Error getting push token:', error);
//       }

//     return token;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FCF8E3" }}>
//     <SafeAreaProvider>
//       <HelpButton />
//       <Carousel />
//     </SafeAreaProvider>
//     <CallAlertModal
//         visible={modalVisible}
//         callerId={callerName}
//         onAccept={joinMeeting}
//         onDecline={handleDecline}
//       />
//   </GestureHandlerRootView>
//   )
// }
//////////////////////
// code below is playing with AppState for incoming pop-up call
// import "react-native-gesture-handler";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import HelpButton from "../components/HelpButton";
// import Carousel from "../components/CarouselOne/Carousel";
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Platform, AppState, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Linking from 'expo-linking';
// import Constants from 'expo-constants';
// import { useRouter } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import * as Device from 'expo-device';
// import CallAlertModal from '../components/CallAlertModal';

// export default function Home() {
//   const auth = FIREBASE_AUTH;
//   const user = auth.currentUser;
//   const notificationListener = useRef(null);
//   const responseListener = useRef(null);
//   const appState = useRef(AppState.currentState); // Ref to store the current app state
//   const [appStateVisible, setAppStateVisible] = useState(appState.current);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [callerUid, setCallerUid] = useState('');
//   const [callerName, setCallerName] = useState('');
//   const [meetingId, setMeetingId] = useState(null);
//   const router = useRouter();

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
//         const { caller, callerUid, meetingId } = notification.request.content.data;
//         setCallerUid(callerUid);
//         setCallerName(caller);
//         setMeetingId(meetingId);
//         handleAppStateChange(appState.current); // Handle AppState when notification is received
//       });

//       responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//         const { meetingId, callerUid } = response.notification.request.content.data;
//         if (response.actionIdentifier === 'ACCEPT_CALL') {
//           Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}&caller=${callerUid}&autoJoin=true`);
//         } else if (response.actionIdentifier === 'DECLINE_CALL') {
//           handleDecline();
//         }
//       });

//       const subscription = AppState.addEventListener("change", handleAppStateChange);

//       return () => {
//         if (notificationListener.current) {
//           Notifications.removeNotificationSubscription(notificationListener.current);
//         }
//         if (responseListener.current) {
//           Notifications.removeNotificationSubscription(responseListener.current);
//         }
//         if (subscription) {
//           subscription.remove();
//         }
//       };
//     }
//   }, [user]);

//   const handleAppStateChange = (nextAppState) => {
//     if (appState.current.match(/inactive|background/) && nextAppState === "active") {
//       console.log("App has come to the foreground!");
//     }

//     if (nextAppState === "background" && modalVisible) {
//       console.log("App is in the background but CallAlertModal is active");
//       // Here you could show a system alert, send a local notification, or handle other background logic
//     }

//     appState.current = nextAppState;
//     setAppStateVisible(appState.current);
//   };

//   const joinMeeting = async () => {
//     setModalVisible(false);
//     router.push({
//       pathname: '/VideoSDK2',
//       params: { meetingId, autoJoin: true }
//     });
//   };

//   const handleDecline = async () => {
//     setModalVisible(false);
  
//     if (user && callerName) {
//       try {
//         const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerUid));
//         if (callerDoc.exists()) {
//           const callerData = callerDoc.data();
//           const callerPushToken = callerData.pushToken;

//           const message = {
//             to: callerPushToken,
//             sound: "default",
//             title: "Call Declined",
//             body: `${user.displayName || "User"} is not available right now.`,
//           };

//           await fetch("https://exp.host/--/api/v2/push/send", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//             },
//             body: JSON.stringify(message),
//           });
//         }
//       } catch (error) {
//         console.error("Error sending decline notification:", error);
//       }
//     }
  
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
//           callerId={callerName}
//           onAccept={joinMeeting}
//           onDecline={handleDecline}
//         />
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HelpButton from "../components/HelpButton";
import Carousel from "../components/CarouselOne/Carousel";
import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as Device from 'expo-device';
import CallAlertModal from '../components/CallAlertModal';

export default function Home() {
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [callerUid, setCallerUid] = useState('');
    const [callerName, setCallerName] = useState('');
  const [meetingId, setMeetingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setDoc(doc(FIRESTORE_DB, 'users', user.uid), { pushToken: token }, { merge: true });
        }
      });

      Notifications.setNotificationCategoryAsync('incoming_call', [
        {
          identifier: 'ACCEPT_CALL',
          buttonTitle: 'Accept',
          options: { opensAppToForeground: true },
        },
        {
          identifier: 'DECLINE_CALL',
          buttonTitle: 'Decline',
          options: { opensAppToForeground: false },
        },
      ]);

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        const { caller, callerUid, meetingId } = notification.request.content.data;
        setCallerUid(callerUid);
        setCallerName(caller);
        setMeetingId(meetingId);
        setModalVisible(true);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const { meetingId, callerUid } = response.notification.request.content.data;
        if (response.actionIdentifier === 'ACCEPT_CALL') {
          Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}&caller=${callerUid}&autoJoin=true`);
        } else if (response.actionIdentifier === 'DECLINE_CALL') {
          handleDecline();
        }
      });

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

  const joinMeeting = async () => {
    setModalVisible(false);
    router.push({
      pathname: '/VideoSDK2',
      params: { meetingId, autoJoin: true }
    });
  };

  const handleDecline = async (calleeUid) => {
    setModalVisible(false);
  
    // Send notification to the caller
    if (user && callerName) {
      try {
        //get calleeName
        const calleeDoc = await getDoc(doc(FIRESTORE_DB, "users", calleeUid));
        if (!calleeDoc.exists()) {
          Alert.alert("Callee not found");
          return;
        }
        const calleeData = calleeDoc.data();
        const callee = calleeDoc.data().userName;
        const calleePushToken = calleeData.pushToken;
        // Get the caller's document from Firestore using callerUid
        const callerDoc = await getDoc(doc(FIRESTORE_DB, "users", callerUid));
        if (callerDoc.exists()) {
          const callerData = callerDoc.data();
          const callerPushToken = callerData.pushToken;
          console.log(callee);
  
          if (callerPushToken) {
            // Prepare the decline message
            const message = {
              to: callerPushToken,
              sound: "default",
              title: "Call Declined",
              body: `${callee || "User"} is not available right now.`,
            };

  
            // Send the notification
            const response = await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(message),
            });
  
            // Parse the response
            const data = await response.json();
            console.log("Decline Notification Response:", data);
          } else {
            console.error("Caller push token is missing.");
          }
        } else {
          console.error("Caller document does not exist.");
        }
      } catch (error) {
        console.error("Error sending decline notification:", error);
      }
    }
  
    // Navigate back to the Home screen after declining the call
    router.push('/home');
  };
  

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }

    try {
      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      token = pushToken.data;
    } catch (error) {
      console.error('Error getting push token:', error);
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
          // callerUId={callerUid}
          callerId={callerName}
          onAccept={joinMeeting}
          // onDecline={handleDecline}
          onDecline={() => handleDecline(callerUid)}
          
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
