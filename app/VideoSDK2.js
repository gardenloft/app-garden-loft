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


///////////////////////////
// WORKING CODE with leave/back button
//////////////////////////

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
// import { useLocalSearchParams } from 'expo-router';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import {useRouter} from 'expo-router'


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

// const IconButton = ({ onPress, iconName, buttonText, backgroundColor }) => {
  
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         backgroundColor: backgroundColor,
//         flexDirection:"row",
//         gap: 2,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//         borderRadius: 8,
//         marginBottom: 40,
//       }}>
//          <MaterialCommunityIcons name={iconName} size={24} color="white" />
//       <Text style={{ color: 'white', fontSize: 16 }}>{buttonText}</Text>
//     </TouchableOpacity>
//   );
// };



// function ControlsContainer({ join, leave, toggleWebcam, toggleMic,  back }) {
//   const router = useRouter();

// const handleBack = () => {
//   router.back();
// };


//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         // justifyContent: "center", // Centers vertically
//       // alignItems: "center",
//         width: viewportWidth * 0.9,
//         height: viewportHeight * 0.2,
//       }}>

//       <IconButton
//         onPress={() => {
//           join();
//         }}
//           iconName={"video"}
//         buttonText={'Join'}
//         backgroundColor={'#FF9900'}
//       />
//       <IconButton
//         onPress={() => {
//           toggleWebcam();
//         }}
//         iconName="camera"
//         buttonText="Toggle Webcam"
//         backgroundColor="orange"
//       />
//       <IconButton
//         onPress={() => {
//           toggleMic();
//         }}
//         iconName="microphone"
//         buttonText="Toggle Mic"
//         backgroundColor="orange"
      
       
//       />
//       <IconButton
//         onPress={() => {
//           leave();
//           handleBack();
//         }}
//         iconName="phone-hangup"
//         buttonText="Leave"
//         backgroundColor="red"
//       />
//        {/* <IconButton
//         onPress={() => {
//           handleBack();
//         }}
//         iconName="arrow-left"
//         buttonText="Back"
//         backgroundColor="orange"
//       /> */}

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

  
 

//   useEffect(() => {
//     if (autoJoin) {
//       join();
//       toggleWebcam();
//       setAutoJoin(false);
//     }
//   }, [autoJoin, join, toggleWebcam, setAutoJoin]);



// const handleBack = () => {
//   router.back();
// };


//   return (
//     <View style={{ flex: 1, width: viewportWidth * 0.9, height: viewportHeight * 0.5, alignContent: 'center', backgroundColor:"white", borderRadius: 40, }}>
//       {meetingId ? <Text style={{ fontSize: 22, padding: 16 }}>Meeting Id: {meetingId}</Text> : null}
//       <ParticipantList participants={participantsArrId} />

//       <ControlsContainer join={join} leave={leave} toggleWebcam={toggleWebcam} toggleMic={toggleMic} back={handleBack}/>

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
//       // setAutoJoin(true);
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
//       // setAutoJoin(true); 
//     }
//   }, [params.calleeUid]);


//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#FCF8E3',justifyContent: "center", // Centers vertically
//       alignItems: "center", }}>
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
//       <JoinScreen getMeetingId={getMeetingId}  />
//     </SafeAreaView>
//   );
// }

///////////////////////////
// WORKING CODE with leave/back button ABOVE
//////////////////////////


import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Dimensions,
  Alert,
  Modal,
  Button
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
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import { getAuth } from 'firebase/auth';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function JoinScreen(props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        paddingHorizontal: 60,
        width: viewportWidth * 0.8,
      }}>
      {/* Your join screen content here */}
    </SafeAreaView>
  );
}

const IconButton = ({ onPress, iconName, buttonText, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        flexDirection: "row",
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

function ControlsContainer({ join, leave, end, toggleWebcam, toggleMic, addPeople }) {
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
        position: 'absolute',
        bottom: 20,
        width: viewportWidth * 0.9,
      }}>

      {/* <IconButton
        onPress={() => {
          join();
        }}
        iconName={"video"}
        buttonText={'Join'}
        backgroundColor={'#FF9900'}
      /> */}
      <IconButton
        onPress={() => {
          toggleWebcam();
        }}
        iconName="camera"
        buttonText="Webcam On/Off"
        backgroundColor="orange"
      />
      <IconButton
        onPress={() => {
          toggleMic();
        }}
        iconName="microphone"
        buttonText="Mic On/Off"
        backgroundColor="orange"
      />
      {/* <IconButton
        onPress={() => {
          leave();
          handleBack();
        }}
        iconName="phone-hangup"
        buttonText="Leave"
        backgroundColor="red"
      /> */}

<IconButton
         onPress={() => {
          leave();
          handleBack();
        }}
        iconName="phone-hangup"
        buttonText="End"
        backgroundColor="red"
      />
      <IconButton
        onPress={addPeople}
        iconName="account-plus"
        buttonText="Add People"
        backgroundColor="green"
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
          flex: 1,
          margin: 8,
          width: viewportWidth * 0.9, 
          height: viewportHeight * 0.65
        }}
      />
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          margin: 8,
          backgroundColor: '#cccccc',
          justifyContent: 'center',
          alignItems: 'center',
          width: viewportWidth * 0.9, 
          height: viewportHeight * 0.65
        }}>
        <Text style={{ fontSize: 18 }}>Webcam is off</Text>
      </View>
    );
  }
}

function ParticipantList({ participants }) {
  return participants.length > 0 ? (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {participants.map((participantId) => (
        <ParticipantView key={participantId} participantId={participantId} />
      ))}
    </View>
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

function MeetingView({ autoJoin, setAutoJoin, callUser, onMeetingEnd  }) {
  const { join, end, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({
    config: {
            resolution: { width: 1280, height: 720 }, // HD resolution
            frameRate: 30, // Standard frame rate
            bitrate: 2500, // High bitrate for HD quality
            codec: 'H264', // High-quality codec
          }, onMeetingEnded: () => {
            console.log("The meeting has ended");
            onMeetingEnd();}
  });

  const handleEnd = async () => {
    try {
      await end();
    } catch (error) {
      console.error("Error ending meeting:", error);
    } finally {
      cleanupMeeting();
    }
  };

  const cleanupMeeting = () => {
    setAutoJoin(false);
    // Add any other cleanup logic here
  };



  const participantsArrId = [...participants.keys()];
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (autoJoin) {
      join();
      toggleWebcam();
      setAutoJoin(false);
    }
  }, [autoJoin, join, toggleWebcam, setAutoJoin]);

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsCollection = collection(FIRESTORE_DB, 'users');
      const contactsSnapshot = await getDocs(contactsCollection);
      const contactsList = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsList);
    };

    fetchContacts();
  }, []);

  const addPeople = () => {
    setModalVisible(true);
  };

  const handleAddPeople = async () => {
    if (selectedContact) {
      await callUser(selectedContact.id);
    }
    setModalVisible(false);
    setSelectedContact(null);
  };

  return (
    <View style={{ flex: 1, width: viewportWidth * 0.9, height: viewportHeight * 0.5, alignContent: 'center', backgroundColor: "white", borderRadius: 40, }}>
      {meetingId ? <Text style={{ fontSize: 22, padding: 16 }}>Video Call: {meetingId}</Text> : null}
      <ParticipantList participants={participantsArrId} />
      <ControlsContainer  end={handleEnd} join={join} leave={leave} toggleWebcam={toggleWebcam} toggleMic={toggleMic} addPeople={addPeople} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Select a contact to add:</Text>
            <FlatList
              data={contacts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedContact(item)}>
                  <Text style={{ padding: 10, backgroundColor: selectedContact?.id === item.id ? '#ddd' : '#fff' }}>{item.userName}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Add" onPress={handleAddPeople} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
      if (params.autoJoin === 'true') {
        setAutoJoin(true);
      }
    }
  }, [params.meetingId, params.autoJoin]);

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
      data: { meetingId: newMeetingId, caller: caller },
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
    console.log('Joining Video Call with ID:', meetingId);
  };

  useEffect(() => {
    if (params.calleeUid) {
      callUser(params.calleeUid);
    }
  }, [params.calleeUid]);

  return meetingId ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FCF8E3', justifyContent: "center", alignItems: "center" }}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: user.displayName || 'Test User',

              // Video settings
    resolution: { width: 1920, height: 1080 }, // Full HD resolution
    frameRate: 30,
    bitrate: 4000, // Increased for better quality
    codec: 'VP9', // More efficient codec
    
    // Audio settings
    audioCodec: 'opus',
    audioBitrate: 128,
    
    // Network optimization
    simulcast: true,
    adaptiveVideo: true,
    
    // UI customization
    participantId: user?.uid,
    preferredProtocol: 'udp',
    
    // Advanced features
    screenShareEnabled: true,
    speakerDetectionEnabled: true,
    recordingEnabled: true,
    chatEnabled: true,
    raiseHandEnabled: true,
    
    // Breakout rooms
    breakoutRoomEnabled: true,
    maxResolution: 'hd',
    
    // Analytics and debugging
    debug: true,
    networkBarEnabled: true,
    
    // Device management
    autoDeviceManagement: {
      audioInput: true,
      audioOutput: true,
      videoInput: true,
    },
    
    // Layout customization
    layout: {
      type: 'SPOTLIGHT',
      priority: 'SPEAKER',
      gridSize: 9,
    },
  }}
  token={token}
  joinWithoutUserInteraction={true}
        
        >
        <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin} callUser={callUser} />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <JoinScreen getMeetingId={getMeetingId} />
    </SafeAreaView>
  );
}

