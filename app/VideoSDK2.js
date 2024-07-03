// import React, { useState, useEffect, useRef } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList,
//   Dimensions,
//   Platform,
//   Alert,
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from '../components/api';
// import { FIRESTORE_DB } from '../FirebaseConfig';
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import * as Notifications from 'expo-notifications';
// // import Constants from 'expo-constants';
// // import * as Device from 'expo-device';
// import { getAuth } from 'firebase/auth';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// // import * as Linking from 'expo-linking';

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

// const Button = ({ onPress, buttonText, backgroundColor }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         backgroundColor: backgroundColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//         borderRadius: 8,
//         marginBottom: 40,
//       }}>
//       <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
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
//         width: viewportWidth * 0.8,
//         height: viewportHeight * 0.2,
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
//           height: 200,
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

// function MeetingView({autoJoin, setAutoJoin}) {
//   const { join, leave, toggleWebcam, toggleMic, meetingId, participants } =
//     useMeeting({});
//   const participantsArrId = [...participants.keys()];

//   useEffect(() => {
//     if (autoJoin) {
//       join();
//       toggleWebcam();  // Automatically turn on the webcam
//       setAutoJoin(false);  // Reset the auto-join state
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
//   const params = useLocalSearchParams();
//   console.log(params);
//   const auth = getAuth();
//   const user = auth.currentUser;


//   useEffect(() => {
//     if (params.meetingId) {
//       setMeetingId(params.meetingId);
//       // setAutoJoin(true);
//     }
//   }, [params]);

//   const getMeetingId = async id => {
//     const meetingId = id == null ? await createMeeting({ token }) : id;
//     setMeetingId(meetingId);
//   };

//   const callUser = async (calleeUid) => {
//     const meetingId = await createMeeting({ token });
//     setMeetingId(meetingId);
//     setAutoJoin(true);

//     const callerDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
//     const caller = callerDoc.data().userName;

//     const calleeDoc = await getDoc(doc(FIRESTORE_DB, 'users', calleeUid));
//     if (!calleeDoc.exists()) {
//       Alert.alert('Callee not found');
//       return;
//     }
//     const calleeData = calleeDoc.data();
//     const calleePushToken = calleeData.pushToken;

//         // Update Firestore with callerId and calleeId
//     await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: meetingId }, { merge: true });
//     await setDoc(doc(FIRESTORE_DB, 'users', calleeUid), { calleeId: meetingId }, { merge: true });

//     const message = {
//       to: calleePushToken,
//       sound: 'default',
//       title: 'Incoming Call',
//       body: `${caller} is calling you`,
//       data: { meetingId },
//       categoryId: 'incoming_call',
//     };

//     await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(message),
//     });

//     joinMeeting(meetingId); // Automatically join the meeting after calling the user
//   };

//   const joinMeeting = async (meetingId) => {
//     console.log('Joining meeting with ID:', meetingId);
    
//   };

//   useEffect(() => {
//     if (params.calleeUid) {
//       callUser(params.calleeUid);
//     }
//   }, [params.calleeUid]);

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
//     <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <JoinScreen getMeetingId={getMeetingId} />
//       <TouchableOpacity
//         onPress={() => callUser(calleeUid)} // Replace 'xD7G0pcqRodqecqH1XEoMLUagep1' with the actual callee's UID
//         style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10, marginTop: 20 }}>
//         <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
//           Call Matthew
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from '../components/api';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import { getAuth } from 'firebase/auth';

import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useRouter} from 'expo-router'


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
     
    </SafeAreaView>
  );
}

const IconButton = ({ onPress, iconName, buttonText, backgroundColor }) => {
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        flexDirection:"row",
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 40,
      }}>
         <MaterialCommunityIcons name={iconName} size={24} color="white" />
      <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
    </TouchableOpacity>
  );
};



function ControlsContainer({ join, leave, toggleWebcam, toggleMic,  back }) {
  const router = useRouter();

const handleBack = () => {
  router.back();
};


  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // justifyContent: "center", // Centers vertically
      // alignItems: "center",
        width: viewportWidth * 0.8,
        height: viewportHeight * 0.2,
      }}>

      <IconButton
        onPress={() => {
          join();
        }}
          iconName={"video"}
        buttonText={'Join'}
        backgroundColor={'#FF9900'}
      />
      <IconButton
        onPress={() => {
          toggleWebcam();
        }}
        iconName="camera"
        buttonText="Toggle Webcam"
        backgroundColor="orange"
      />
      <IconButton
        onPress={() => {
          toggleMic();
        }}
        iconName="microphone"
        buttonText="Toggle Mic"
        backgroundColor="orange"
      
       
      />
      <IconButton
        onPress={() => {
          leave();
        }}
        iconName="phone-hangup"
        buttonText="Leave"
        backgroundColor="red"
      />
       <IconButton
        onPress={() => {
          handleBack();
        }}
        iconName="arrow-left"
        buttonText="Back"
        backgroundColor="orange"
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
        objectFit="cover"
        style={{
          height: 200,
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
      renderItem={({ item }) => <ParticipantView participantId={item} />}
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

function MeetingView({ autoJoin, setAutoJoin }) {
  const { join, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({});
  const participantsArrId = [...participants.keys()];

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
 

  useEffect(() => {
    if (autoJoin) {
      join();
      toggleWebcam();
      setAutoJoin(false);
    }
  }, [autoJoin, join, toggleWebcam, setAutoJoin]);

  const router = useRouter();

const handleBack = () => {
  router.back();
};


  return (
    <View style={{ flex: 1, width: viewportWidth * 0.9, height: viewportHeight * 0.5, alignContent: 'center', backgroundColor:"white", borderRadius: 40, }}>
      {meetingId ? <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text> : null}
      <ParticipantList participants={participantsArrId} />

      <ControlsContainer join={join} leave={leave} toggleWebcam={toggleWebcam} toggleMic={toggleMic} back={handleBack}/>

    </View>
  );
}



export default function VideoSDK() {
  const [meetingId, setMeetingId] = useState(null);
  const [autoJoin, setAutoJoin] = useState(false);
  const params = useLocalSearchParams();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (params.meetingId) {
      setMeetingId(params.meetingId);
      setAutoJoin(true);
    }
  }, [params]);

  const getMeetingId = async id => {
    const newMeetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(newMeetingId);
  };

  const callUser = async (calleeUid) => {
    const newMeetingId = await createMeeting({ token });
    setMeetingId(newMeetingId);
    setAutoJoin(true);
   

    const callerDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
    const caller = callerDoc.data().userName;

    const calleeDoc = await getDoc(doc(FIRESTORE_DB, 'users', calleeUid));
    if (!calleeDoc.exists()) {
      Alert.alert('Callee not found');
      return;
    }
    const calleeData = calleeDoc.data();
    const calleePushToken = calleeData.pushToken;

    await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: newMeetingId }, { merge: true });
    await setDoc(doc(FIRESTORE_DB, 'users', calleeUid), { calleeId: newMeetingId }, { merge: true });

    const message = {
      to: calleePushToken,
      sound: 'default',
      title: 'Incoming Call',
      body: `${caller} is calling you`,
      data: { meetingId: newMeetingId },
      categoryId: 'incoming_call',
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(message),
    });

    joinMeeting(newMeetingId);
  };

  const joinMeeting = async meetingId => {
    console.log('Joining meeting with ID:', meetingId);
  };

  useEffect(() => {
    if (params.calleeUid) {
      callUser(params.calleeUid);
      setAutoJoin(true); 
    }
  }, [params.calleeUid]);


  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FCF8E3',justifyContent: "center", // Centers vertically
      alignItems: "center", }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: user.displayName || 'Test User',
        }}
        token={token}>
        <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin} />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <JoinScreen getMeetingId={getMeetingId}  />
    </SafeAreaView>
  );
}


// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   View,
//   FlatList,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from '../components/api';
// import { FIRESTORE_DB } from '../FirebaseConfig';
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import * as Notifications from 'expo-notifications';
// import { getAuth } from 'firebase/auth';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { FontAwesome } from '@expo/vector-icons';

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
//     </SafeAreaView>
//   );
// }

// const IconButton = ({ onPress, iconName, backgroundColor }) => {
//   const [isPressed, setIsPressed] = useState(false);

//   return (
//     <TouchableOpacity
//       onPressIn={() => setIsPressed(true)}
//       onPressOut={() => setIsPressed(false)}
//       onPress={onPress}
//       style={{
//         backgroundColor: isPressed ? 'black' : backgroundColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//         borderRadius: 8,
//         marginBottom: 40,
//       }}>
//       <FontAwesome name={iconName} size={24} color="white" />
//     </TouchableOpacity>
//   );
// };

// function ControlsContainer({ join, leave, toggleWebcam, toggleMic, back }) {
//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: viewportWidth * 0.8,
//         height: viewportHeight * 0.2,
//       }}>
//       <IconButton onPress={join} iconName="video-camera" backgroundColor="orange" />
//       <IconButton onPress={toggleWebcam} iconName="camera" backgroundColor="orange" />
//       <IconButton onPress={toggleMic} iconName="microphone" backgroundColor="orange" />
//       <IconButton onPress={leave} iconName="sign-out" backgroundColor="orange" />
//       <TouchableOpacity
//         onPress={back}
//         style={{
//           backgroundColor: "orange",
//           justifyContent: 'center',
//           alignItems: 'center',
//           padding: 16,
//           borderRadius: 8,
//         }}>
//         <Text style={{ color: 'white', fontSize: 16 }}>Back</Text>
//       </TouchableOpacity>
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
//           height: 200,
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

// function MeetingView({ autoJoin, setAutoJoin }) {
//   const { join, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({});
//   const participantsArrId = [...participants.keys()];

//   const router = useRouter();

//   const handleBack = () => {
//     router.back();
//   };

//   useEffect(() => {
//     if (autoJoin) {
//       join();
//       toggleWebcam();
//       setAutoJoin(false);
//     }
//   }, [autoJoin, join, toggleWebcam, setAutoJoin]);

//   return (
//     <View style={{ flex: 1 }}>
//       {meetingId ? <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text> : null}
//       <ParticipantList participants={participantsArrId} />
//       <ControlsContainer join={join} leave={leave} toggleWebcam={toggleWebcam} toggleMic={toggleMic} back={handleBack} />
//     </View>
//   );
// }

// export default function VideoSDK() {
//   const [meetingId, setMeetingId] = useState(null);
//   const [autoJoin, setAutoJoin] = useState(false);
//   const params = useLocalSearchParams();
//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (params.meetingId) {
//       setMeetingId(params.meetingId);
//       setAutoJoin(true);
//     }
//   }, [params]);

//   const getMeetingId = async id => {
//     const newMeetingId = id == null ? await createMeeting({ token }) : id;
//     setMeetingId(newMeetingId);
//   };

//   const callUser = async (calleeUid) => {
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     setAutoJoin(true);

//     const callerDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
//     const caller = callerDoc.data().userName;

//     const calleeDoc = await getDoc(doc(FIRESTORE_DB, 'users', calleeUid));
//     if (!calleeDoc.exists()) {
//       Alert.alert('Callee not found');
//       return;
//     }
//     const calleeData = calleeDoc.data();
//     const calleePushToken = calleeData.pushToken;

//     await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: newMeetingId }, { merge: true });
//     await setDoc(doc(FIRESTORE_DB, 'users', calleeUid), { calleeId: newMeetingId }, { merge: true });

//     const message = {
//       to: calleePushToken,
//       sound: 'default',
//       title: 'Incoming Call',
//       body: `${caller} is calling you`,
//       data: { meetingId: newMeetingId },
//       categoryId: 'incoming_call',
//     };

//     await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(message),
//     });

//     joinMeeting(newMeetingId);
//   };

//   const joinMeeting = async meetingId => {
//     console.log('Joining meeting with ID:', meetingId);
//   };

//   useEffect(() => {
//     if (params.calleeUid) {
//       callUser(params.calleeUid);
//       setAutoJoin(true);
//     }
//   }, [params.calleeUid]);


//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//       <MeetingProvider
//         config={{
//           meetingId,
//           micEnabled: false,
//           webcamEnabled: true,
//           name: user.displayName || 'Test User',
//         }}
//         token={token}>
//         <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin} />
//       </MeetingProvider>
//     </SafeAreaView>
//   ) : (
//     <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <JoinScreen getMeetingId={getMeetingId} />
//     </SafeAreaView>
//   );
}


























