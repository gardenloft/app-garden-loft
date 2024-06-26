// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList,
//   Dimensions
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from './api';
// import { collection, addDoc, getDocs, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";

// // ui incoming call imports
// import RNCallKeep from 'react-native-callkeep';
// import BackgroundTimer from 'react-native-background-timer';
// import uuid from 'react-native-uuid';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// // ICE servers configuration
// const servers = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// // CallKeep setup
// RNCallKeep.setup({
//   ios: {
//     appName: 'app-garden-loft',
//   },
//   android: {
//     alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'OK',
//   },
// });

// const getNewUuid = () => uuid.v4().toLowerCase();

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   // const handleCreateMeeting = async () => {
//   //   const newMeetingId = await createMeeting({ token });
//   //   setMeetingId(newMeetingId);
//   //   props.getMeetingId(newMeetingId);
//   // }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
//       }}>
//       {/* <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity> */}

//       <TouchableOpacity
//         onPress={() => {
//           props.getMeetingId();
//         }}
//         style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10 }}>
//         <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
//           Create Meeting
//         </Text>
//       </TouchableOpacity>
//       <Text
//         style={{
//           alignSelf: 'center',
//           fontSize: 26,
//           marginVertical: 20,
//           fontStyle: 'italic',
//           color: 'grey',
//         }}>
//         ---------- OR ----------
//       </Text>
//       <TextInput
//         value={meetingVal}
//         onChangeText={setMeetingVal}
//         placeholder={'XXXX-XXXX-XXXX'}
//         style={{
//           padding: 16,
//           borderWidth: 1,
//           borderRadius: 10,
//           fontSize: 18,
//           fontStyle: 'italic',
//         }}
//       />
//       <TouchableOpacity
//         style={{
//           backgroundColor: '#1178F8',
//           padding: 20,
//           marginTop: 20,
//           borderRadius: 10,
//         }}
//         onPress={() => {
//           props.getMeetingId(meetingVal);
//         }}>
//         <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
//           Join Meeting
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// //button design
// const Button = ({ onPress, buttonText, backgroundColor }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         backgroundColor: backgroundColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 18,
//         borderRadius: 20,
//         marginBottom: 40,
//       }}>
//       <Text style={{ color: 'white', fontSize: 23 }}>{buttonText}</Text>
//     </TouchableOpacity>
//   );
// };

// function ControlsContainer({ join, leave, toggleWebcam, toggleMic }) {
//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: viewportWidth * 0.88,
//         height: viewportHeight * 0.2
//       }}>
//       <Button
//         onPress={() => {
//           join();
//         }}
//         buttonText={'Join'}
//         backgroundColor={'#1178F8'}
//       />
//       <Button
//         onPress={() => {
//           toggleWebcam();
//         }}
//         buttonText={'Toggle Webcam'}
//         backgroundColor={'#1178F8'}
//       />
//       <Button
//         onPress={() => {
//           toggleMic();
//         }}
//         buttonText={'Toggle Mic'}
//         backgroundColor={'#1178F8'}
//       />
//       <Button
//         onPress={() => {
//           leave();
//         }}
//         buttonText={'Leave'}
//         backgroundColor={'#FF0000'}
//       />
//     </View>
//   );
// }

// function ParticipantView({ participantId }) {
//   const { webcamStream, webcamOn } = useParticipant(participantId);

//   if (webcamOn && webcamStream) {
//     return (
//       <RTCView
//         streamURL={new MediaStream([webcamStream.track]).toURL()}
//         objectFit={'cover'}
//         style={{
//           flex: 1,
//           height: 250,
//           marginVertical: 8,
//           marginHorizontal: 8,
//         }}
//       />
//     );
//   } else {
//     return (
//       <View
//         style={{
//           height: 400,
//           marginVertical: 8,
//           marginHorizontal: 8,
//           backgroundColor: '#cccccc',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text style={{ fontSize: 18 }}>Webcam is off</Text>
//       </View>
//     );
//   }
// }

// function ParticipantList({ participants }) {
//   return participants.length > 0 ? (
//     <FlatList
//       data={participants}
//       renderItem={({ item }) => {
//         return <ParticipantView participantId={item} />;
//       }}
//     />
//   ) : (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text style={{ fontSize: 24 }}>Press Join button to enter meeting.</Text>
//     </View>
//   );
// }

// function MeetingView({ autoJoin, setAutoJoin }) {
//   const { join, leave, toggleWebcam, toggleMic, meetingId, participants } =
//     useMeeting({});
//   const participantsArrId = [...participants.keys()];

//   useEffect(() => {
//     if (autoJoin) {
//       join();
//       toggleWebcam();
//       setAutoJoin(false);
//     }
//   }, [autoJoin, join, toggleWebcam, setAutoJoin]);

//   return (
//     <View style={{ flex: 1 }}>
//       {meetingId ? (
//         <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text>
//       ) : null}
//       <ParticipantList participants={participantsArrId} />
//       <ControlsContainer
//         join={join}
//         leave={leave}
//         toggleWebcam={toggleWebcam}
//         toggleMic={toggleMic}
//       />
//     </View>
//   );
// }

// export default function VideoSDK() {
//   const [meetingId, setMeetingId] = useState(null);
//   const [autoJoin, setAutoJoin] = useState(false);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [pc, setPc] = useState(new RTCPeerConnection(servers));

//   //video ui incoming
//   const [calls, setCalls] = useState({});

//   useEffect(() => {
//     RNCallKeep.addEventListener('answerCall', answerCall);
//     RNCallKeep.addEventListener('endCall', endCall);

//     return () => {
//       RNCallKeep.removeEventListener('answerCall', answerCall);
//       // RNCallKeep.removeEventListener('endCall', endCall);r
//     };
//   }, []);

//   const log = (text) => {
//     console.info(text);
//   };

//   const addCall = (callUUID, number) => {
//     setCalls({ ...calls, [callUUID]: number });
//   };

//   const removeCall = (callUUID) => {
//     const { [callUUID]: _, ...updated } = calls;
//     setCalls(updated);
//   };

//   const displayIncomingCall = (number) => {
//     const callUUID = getNewUuid();
//     addCall(callUUID, number);
//     log(`[displayIncomingCall] ${callUUID}, number: ${number}`);
//     RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
//   };

//   const handleCreateMeeting = async () => {
//     // const newMeetingId = await createMeeting({ token });
//     const newMeetingId = "2eir-4xus-3ygn";
//     setMeetingId(newMeetingId);
//     await setDoc(doc(FIRESTORE_DB, 'calls', newMeetingId), { caller: 'John', callee: 'Matt', meetingId: newMeetingId });
//     displayIncomingCall(newMeetingId);
//   };

//   const answerCall = async ({ callUUID }) => {
//     // const meetingId = calls[callUUID];

//     // setMeetingId(meetingId);

//       //  const newMeetingId = await createMeeting({ token });
//       const meetingIDVSDK = "2eir-4xus-3ygn";
//       //  const newMeetingId = "2eir-4xus-3ygn"
//        console.log("newMeetingId", meetingIDVSDK);
//        log(`[answerCall] ${callUUID}, meetingId: ${meetingIDVSDK}`);
//     RNCallKeep.startCall(callUUID, meetingIDVSDK, meetingIDVSDK);
//        setMeetingId(meetingIDVSDK);  // Update the meeting ID in state
//          setAutoJoin(true);
//     RNCallKeep.setCurrentCallActive(callUUID);

//      const callsSnapshot = await getDocs(collection(FIRESTORE_DB, "calls"));
//      for (const callDoc of callsSnapshot.docs) {
//        const callData = callDoc.data();
//        if (callData.offer && !callData.answer) {
//          const offerDescription = new RTCSessionDescription(callData.offer);
//          await pc.setRemoteDescription(offerDescription);

//          const answerDescription = await pc.createAnswer();
//          await pc.setLocalDescription(answerDescription);

//          const answer = {
//            type: answerDescription.type,
//            sdp: answerDescription.sdp,
//            meetingIDVSDK: "2eir-4xus-3ygn"
//          };

//          await setDoc(callDoc.ref, { answer }, { merge: true });

//          const offerCandidates = collection(callDoc.ref, "offerCandidates");
//          onSnapshot(offerCandidates, snapshot => {
//            snapshot.docChanges().forEach(change => {
//              if (change.type === "added") {
//                const candidate = new RTCIceCandidate(change.doc.data());
//                pc.addIceCandidate(candidate);
//              }
//            });
//          });

//          setMeetingId(`${callDoc.id}_answer_${callDoc.meetingIDVSDK}`);
//          setAutoJoin(true);
//          break;
//        }
//      }
//   };

//   const endCall = ({ callUUID }) => {
//     log(`[endCall] ${callUUID}`);
//     removeCall(callUUID);
//   };

//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);
//   };

//   useEffect(() => {
//     if (localStream) {
//       localStream.getTracks().forEach(track => {
//         pc.addTrack(track, localStream);
//       });

//       pc.ontrack = event => {
//         const newRemoteStream = new MediaStream();
//         event.streams[0].getTracks().forEach(track => {
//           newRemoteStream.addTrack(track);
//         });
//         setRemoteStream(newRemoteStream);
//       };

//       pc.onicecandidate = event => {
//         if (event.candidate) {
//           console.log("New ICE candidate: ", event.candidate);
//         }
//       };
//     }
//   }, [localStream, pc]);

//   // const getMeetingId = id => {
//   //   setMeetingId(id);
//   //   setAutoJoin(true);
//   // };

//   const callUser = async (caller, callee) => {

//     // Update Firestore documents
//     await setDoc(elizabethContactRef, { meetingId: newMeetingId }, { merge: true });
//     await setDoc(tracyContactRef, { calleeId: newMeetingId, status: 'initiated' }, { merge: true });
//     };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);
//   };

//   const createOffer = async () => {
//     //  const newMeetingId = await createMeeting({ token });
//     const meetingIDVSDK = "2eir-4xus-3ygn";
//     //  const newMeetingId = "2eir-4xus-3ygn"
//      console.log("newMeetingId", meetingIDVSDK);
//      setMeetingId(meetingIDVSDK);  // Update the meeting ID in state

//     const callDoc = doc(collection(FIRESTORE_DB, "calls"));
//     const offerCandidates = collection(callDoc, "offerCandidates");
//     const answerCandidates = collection(callDoc, "answerCandidates");

//     // const setCalleeCaller =
//     // await setDoc(offerCandidates, { meetingId: newMeetingId }, { merge: true });
//     // await setDoc(answerCandidates, { calleeId: newMeetingId, status: 'initiated' }, { merge: true });

//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//       meetingIDVSDK: "2eir-4xus-3ygn"
//     };

//     await setDoc(callDoc, { offer });

//     onSnapshot(callDoc, snapshot => {
//       const data = snapshot.data();
//       if (!pc.currentRemoteDescription && data?.answer) {
//         const answerDescription = new RTCSessionDescription(data.answer);
//         pc.setRemoteDescription(answerDescription);
//       }
//     });

//     onSnapshot(offerCandidates, snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           pc.addIceCandidate(candidate);
//         }
//       });
//     });

//     return callDoc.id;
//   };

//   const answerCall2 = async () => {

//      //  const newMeetingId = await createMeeting({ token });
//      const meetingIDVSDK = "2eir-4xus-3ygn";
//      //  const newMeetingId = "2eir-4xus-3ygn"
//       console.log("newMeetingId", meetingIDVSDK);
//       setMeetingId(meetingIDVSDK);  // Update the meeting ID in state

//     const callsSnapshot = await getDocs(collection(FIRESTORE_DB, "calls"));
//     for (const callDoc of callsSnapshot.docs) {
//       const callData = callDoc.data();
//       if (callData.offer && !callData.answer) {
//         const offerDescription = new RTCSessionDescription(callData.offer);
//         await pc.setRemoteDescription(offerDescription);

//         const answerDescription = await pc.createAnswer();
//         await pc.setLocalDescription(answerDescription);

//         const answer = {
//           type: answerDescription.type,
//           sdp: answerDescription.sdp,
//           meetingIDVSDK: "2eir-4xus-3ygn"
//         };

//         await setDoc(callDoc.ref, { answer }, { merge: true });

//         const offerCandidates = collection(callDoc.ref, "offerCandidates");
//         onSnapshot(offerCandidates, snapshot => {
//           snapshot.docChanges().forEach(change => {
//             if (change.type === "added") {
//               const candidate = new RTCIceCandidate(change.doc.data());
//               pc.addIceCandidate(candidate);
//             }
//           });
//         });

//         setMeetingId(`${callDoc.id}_answer_${callDoc.meetingIDVSDK}`);
//         setAutoJoin(true);
//         break;
//       }
//     }
//   };

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//       <MeetingProvider
//         config={{
//           meetingId,
//           micEnabled: false,
//           webcamEnabled: true,
//           name: 'Test User',
//         }}
//         token={token}>
//         <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin} />
//       </MeetingProvider>
//     </SafeAreaView>
//   ) : (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//          <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={startLocalStream}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Start Local Stream
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={createOffer}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Create Offer
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={answerCall}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Answer Call
//         </Text>
//       </TouchableOpacity>
//       <JoinScreen getMeetingId={getMeetingId} />
//     </SafeAreaView>
//   );
// }


/////// MESSI FCM TOKEN INIT

// const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log("Authorization status:", authStatus);
//   }
// };

// useEffect(() => {
//   if (requestUserPermission()) {
//     messaging()
//       .getToken()
//       .then((token) => console.log(token));
//   }
// }, []);

// // Set up the notification handler for the app
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// // Handle user clicking on a notification and open the screen
// const handleNotificationClick = async (response) => {
//   const screen = response?.notification?.request?.content?.data?.screen;
//   if (screen !== null) {
//     navigation.navigate(screen);
//   }
// };

// // Listen for user clicking on a notification
// const notificationClickSubscription =
//   Notifications.addNotificationResponseReceivedListener(
//     handleNotificationClick
//   );

// // Handle user opening the app from a notification (when the app is in the background)
// messaging().onNotificationOpenedApp((remoteMessage) => {
//   console.log(
//     "Notification caused app to open from background state:",
//     remoteMessage.data.screen,
//     navigation
//   );
//   if (remoteMessage?.data?.screen) {
//     navigation.navigate(`${remoteMessage.data.screen}`);
//   }
// });

// // Check if the app was opened from a notification (when the app was completely quit)
// messaging()
//   .getInitialNotification()
//   .then((remoteMessage) => {
//     if (remoteMessage) {
//       console.log(
//         "Notification caused app to open from quit state:",
//         remoteMessage.notification
//       );
//       if (remoteMessage?.data?.screen) {
//         navigation.navigate(`${remoteMessage.data.screen}`);
//       }
//     }
//   });

// // Handle push notifications when the app is in the background
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("Message handled in the background!", remoteMessage);
//   const notification = {
//     title: remoteMessage.notification.title,
//     body: remoteMessage.notification.body,
//     data: remoteMessage.data, // optional data payload
//   };

//   // Schedule the notification with a null trigger to show immediately
//   await Notifications.scheduleNotificationAsync({
//     content: notification,
//     trigger: null,
//   });
// });

// // Handle push notifications when the app is in the foreground
// const handlePushNotification = async (remoteMessage) => {
//   const notification = {
//     title: remoteMessage.notification.title,
//     body: remoteMessage.notification.body,
//     data: remoteMessage.data, // optional data payload
//   };

//   // Schedule the notification with a null trigger to show immediately
//   await Notifications.scheduleNotificationAsync({
//     content: notification,
//     trigger: null,
//   });
// };

// // Listen for push notifications when the app is in the foreground
// const unsubscribe = messaging().onMessage(handlePushNotification);

// Clean up the event listeners
// return () => {
//   unsubscribe();
//   notificationClickSubscription.remove();
// };
// }, []);

//////////////////////
//Sally's working firestore connection
//////////////////////

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from './api';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
// import RNCallKeep from 'react-native-callkeep';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function JoinScreen(props) {
  const [meetingVal, setMeetingVal] = useState('');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        paddingHorizontal: 60,
        width: viewportWidth * 0.8,
      }}>
        <Text>Hello</Text>
      {/* <TouchableOpacity
        onPress={() => {
          props.getMeetingId();
        }}
        style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10 }}>
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
          Create Meeting
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          alignSelf: 'center',
          fontSize: 26,
          marginVertical: 20,
          fontStyle: 'italic',
          color: 'grey',
        }}>
        ---------- OR ----------
      </Text>
      <TextInput
        value={meetingVal}
        onChangeText={setMeetingVal}
        placeholder={'XXXX-XXXX-XXXX'}
        style={{
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
          fontSize: 18,
          fontStyle: 'italic',
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#1178F8',
          padding: 20,
          marginTop: 20,
          borderRadius: 10,
        }}
        onPress={() => {
          props.getMeetingId(meetingVal);
        }}>
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
          Join Meeting
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const Button = ({ onPress, buttonText, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 40,
      }}>
      <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

function ControlsContainer({ join, leave, toggleWebcam, toggleMic }) {
  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: viewportWidth * 0.8,
        height: viewportHeight * 0.2,
      }}>
      <Button
        onPress={() => {
          join();
        }}
        buttonText={'Join'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          toggleWebcam();
        }}
        buttonText={'Toggle Webcam'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          toggleMic();
        }}
        buttonText={'Toggle Mic'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          leave();
        }}
        buttonText={'Leave'}
        backgroundColor={'#FF0000'}
      />
    </View>
  );
}

function ParticipantView({ participantId }) {
  const { webcamStream, webcamOn } = useParticipant(participantId);

  if (webcamOn && webcamStream) {
    return (
      <RTCView
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit={'cover'}
        style={{
          height: 400,
          marginVertical: 16,
          marginHorizontal: 16,
        }}
      />
    );
  } else {
    return (
      <View
        style={{
          height: 400,
          marginVertical: 16,
          marginHorizontal: 16,
          backgroundColor: '#cccccc',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 18 }}>Webcam is off</Text>
      </View>
    );
  }
}

function ParticipantList({ participants }) {
  return participants.length > 0 ? (
    <FlatList
      data={participants}
      renderItem={({ item }) => {
        return <ParticipantView participantId={item} />;
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ fontSize: 24 }}>Press Join button to enter meeting.</Text>
    </View>
  );
}

function MeetingView() {
  const { join, leave, toggleWebcam, toggleMic, meetingId, participants } =
    useMeeting({});
  const participantsArrId = [...participants.keys()];

  return (
    <View style={{ flex: 1 }}>
      {meetingId ? (
        <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text>
      ) : null}
      <ParticipantList participants={participantsArrId} />
      <ControlsContainer
        join={join}
        leave={leave}
        toggleWebcam={toggleWebcam}
        toggleMic={toggleMic}
      />
    </View>
  );
}

export default function VideoSDK() {
  const [meetingId, setMeetingId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  
  const [expoPushToken, setExpoPushToken] = useState(undefined);
  const [notification, setNotification] = useState(undefined);

  const notificationListener = useRef();
  const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);


  const getMeetingId = async id => {
    const meetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(meetingId);
  };

  const callUser = async () => {
    const meetingId = await createMeeting({ token });

    // Get caller information
    const callerDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
    const caller = callerDoc.data().userName;

    // Get callee information from contacts
    const contactsSnapshot = await getDocs(collection(FIRESTORE_DB, 'users', user.uid, 'contacts'));
   
    const calleeDoc = contactsSnapshot.docs[0]; // Assuming you want to call the first contact for simplicity
    console.log(calleeDoc.id)
    const callee = calleeDoc.id

    // Update Firestore with callerId and calleeId
    await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: meetingId }, { merge: true });
    await setDoc(doc(FIRESTORE_DB, 'users', user.uid, 'contacts', callee), { calleeId: meetingId }, { merge: true });

    // Send notification to the callee
    const calleeDocSnapshot = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
    const calleePushToken = calleeDocSnapshot.data().pushToken;
    console.log(calleePushToken);

    const message = {
      to: calleePushToken,
      sound: 'default',
      title: 'Incoming Call',
      body: `${caller} is calling you`,
      data: { meetingId: meetingId },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    });

    // Join the meeting
    setMeetingId(meetingId);
  };

  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          setDoc(doc(FIRESTORE_DB, 'users', user.uid), { pushToken: token }, { merge: true });
          // setExpoPushToken(token);
          // setDoc(doc(FIRESTORE_DB, 'users', user.uid, 'contacts', callee), { pushToken: token }, { merge: true });
        }
      });

      Notifications.addNotificationResponseReceivedListener(response => {
        const { meetingId } = response.notification.request.content.data;
        setMeetingId(meetingId);
      });
    }
  }, [user]);

  async function registerForPushNotificationsAsync() {
    let token;


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
   
      // token = (await Notifications.getExpoPushTokenAsync()).data;
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId
      });
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
   if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;

    
  }

  // useEffect(() => {
  //   if (user) {
  //     registerForPushNotificationsAsync().then(token => {
  //       if (token) {
  //         setDoc(doc(FIRESTORE_DB, 'users', user.uid), { pushToken: token }, { merge: true });
  //         setExpoPushToken(token);
  //       }
  //     });

  //     notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });


  //     Notifications.addNotificationResponseReceivedListener(response => {
  //       const { meetingId } = response.notification.request.content.data;
  //       setMeetingId(meetingId);
  //     });
  //     return () => {
  //       Notifications.removeNotificationSubscription(notificationListener.current);
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     };
      
  //   }
  // }, [user]);

  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: 'Test User',
        }}
        token={token}>
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <JoinScreen getMeetingId={getMeetingId} />
      <Text>
    {expoPushToken}
    {notification}
</Text>
      <TouchableOpacity
        onPress={callUser}
        style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10, marginTop: 20 }}>
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
          Call Contact
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}



/////
//end of working recent
/////



// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   View,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from './api';
// import { FIRESTORE_DB } from '../FirebaseConfig';
// import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 60,
//         width: viewportWidth * 0.8,
//       }}>
//         <Text>Hello</Text>
//     </SafeAreaView>
//   );
// }

// const Button = ({ onPress, buttonText, backgroundColor }) => (
//   <TouchableOpacity
//     onPress={onPress}
//     style={{
//       backgroundColor: backgroundColor,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 40,
//     }}>
//     <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
//   </TouchableOpacity>
// );

// function ControlsContainer({ join, leave, toggleWebcam, toggleMic }) {
//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: viewportWidth * 0.8,
//         height: viewportHeight * 0.2,
//       }}>
//       <Button onPress={join} buttonText="Join" backgroundColor="#1178F8" />
//       <Button onPress={toggleWebcam} buttonText="Toggle Webcam" backgroundColor="#1178F8" />
//       <Button onPress={toggleMic} buttonText="Toggle Mic" backgroundColor="#1178F8" />
//       <Button onPress={leave} buttonText="Leave" backgroundColor="#FF0000" />
//     </View>
//   );
// }

// function ParticipantView({ participantId }) {
//   const { webcamStream, webcamOn } = useParticipant(participantId);

//   if (webcamOn && webcamStream) {
//     return (
//       <RTCView
//         streamURL={new MediaStream([webcamStream.track]).toURL()}
//         objectFit="cover"
//         style={{
//           height: 400,
//           marginVertical: 16,
//           marginHorizontal: 16,
//         }}
//       />
//     );
//   } else {
//     return (
//       <View
//         style={{
//           height: 400,
//           marginVertical: 16,
//           marginHorizontal: 16,
//           backgroundColor: '#cccccc',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text style={{ fontSize: 18 }}>Webcam is off</Text>
//       </View>
//     );
//   }
// }

// function ParticipantList({ participants }) {
//   return participants.length > 0 ? (
//     <FlatList
//       data={participants}
//       renderItem={({ item }) => <ParticipantView participantId={item} />}
//     />
//   ) : (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text style={{ fontSize: 24 }}>Press Join button to enter meeting.</Text>
//     </View>
//   );
// }

// function MeetingView() {
//   const { join, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({});
//   const participantsArrId = [...participants.keys()];

//   return (
//     <View style={{ flex: 1 }}>
//       {meetingId ? <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text> : null}
//       <ParticipantList participants={participantsArrId} />
//       <ControlsContainer
//         join={join}
//         leave={leave}
//         toggleWebcam={toggleWebcam}
//         toggleMic={toggleMic}
//       />
//     </View>
//   );
// }

// export default function VideoSDK() {
//   const [meetingId, setMeetingId] = useState(null);
//   const auth = getAuth();
//   const user = auth.currentUser;

//   const getMeetingId = async id => {
//     const meetingId = id == null ? await createMeeting({ token }) : id;
//     setMeetingId(meetingId);
//   };

//   const callUser = async () => {
//     const meetingId = await createMeeting({ token });

//     // Get caller information
//     const callerDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
//     const caller = callerDoc.data().userName;

//     // Get callee information from contacts
//     const contactsSnapshot = await getDocs(collection(FIRESTORE_DB, 'users', user.uid, 'contacts'));
//     const calleeDoc = contactsSnapshot.docs[0]; // Assuming you want to call the first contact for simplicity
//     const callee = calleeDoc.id;

//     // Fetch callee's main document to get pushToken
//     const calleeDocSnapshot = await getDoc(doc(FIRESTORE_DB, 'users', callee));
//     const calleePushToken = calleeDocSnapshot.data().pushToken;

//     if (!calleePushToken) {
//       console.error("Callee's push token is undefined");
//       return;
//     }

//     // Update Firestore with callerId and calleeId
//     await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: meetingId }, { merge: true });
//     await setDoc(doc(FIRESTORE_DB, 'users', callee), { calleeId: meetingId }, { merge: true });

//     const message = {
//       to: calleePushToken,
//       sound: 'default',
//       title: 'Incoming Call',
//       body: `${caller} is calling you`,
//       data: { meetingId: meetingId },
//     };

//     await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(message),
//     });

//     // Join the meeting
//     setMeetingId(meetingId);
//   };

//   useEffect(() => {
//     const updateUserPushToken = async () => {
//       const token = await registerForPushNotificationsAsync();
//       if (token && user) {
//         await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { pushToken: token }, { merge: true });
//       }
//     };

//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         updateUserPushToken();
//       }
//     });

//     if (user) {
//       Notifications.addNotificationResponseReceivedListener(response => {
//         const { meetingId } = response.notification.request.content.data;
//         setMeetingId(meetingId);
//       });
//     }
//   }, [user]);

//   async function registerForPushNotificationsAsync() {
//         let token;
//         if (Constants.isDevice) {
//           const { status: existingStatus } = await Notifications.getPermissionsAsync();
//           let finalStatus = existingStatus;
//           if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//           }
//           if (finalStatus !== 'granted') {
//             alert('Failed to get push token for push notification!');
//             return;
//           }
//           token = (await Notifications.getExpoPushTokenAsync()).data;
//           console.log(token)
//         } else {
//           alert('Must use physical device for Push Notifications');
//         }
    
//         if (Platform.OS === 'android') {
//           Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//           });
//         }
//         return token;
        
//       }

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//       <MeetingProvider
//         config={{
//           meetingId,
//           micEnabled: false,
//           webcamEnabled: true,
//           name: 'Test User',
//         }}
//         token={token}>
//         <MeetingView />
//       </MeetingProvider>
//     </SafeAreaView>
//   ) : (
//     <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <JoinScreen getMeetingId={getMeetingId} />
//       <TouchableOpacity
//         onPress={callUser}
//         style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10, marginTop: 20 }}>
//         <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
//           Call Contact
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

