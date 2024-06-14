// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList, Dimensions
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import {createMeeting, token} from './api';
// import { collection, addDoc, query, getDocs,doc, getDoc, setDoc  } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// // Initialize Firestore and Messaging
// const firestore = FIRESTORE_DB;
// // const messaging = firebase.messaging();

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');

//   const [meetingId, setMeetingId] = useState('');

//   const handleCreateMeeting = async () => {
//     const newMeetingId = await createMeeting({ token });
//     // const newMeetingId = "2eir-4xus-3ygn"
//     console.log("newMeetingId", newMeetingId);
//     setMeetingId(newMeetingId);  // Update the meeting ID in state

//     props.getMeetingId(newMeetingId);  // Propagate the meeting ID up to the parent component to switch view
//     // props.onMeetingCreated(newMeetingId);  // Additional prop to signal meeting creation
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
      
//       }}>

// <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text 
//         onPress={()=> {}}style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           props.getMeetingId();
//         }}
//         style={{backgroundColor: '#1178F8', padding: 20, borderRadius: 10}}>
//         <Text style={{color: 'white', alignSelf: 'center', fontSize: 22}}>
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
//         <Text style={{color: 'white', alignSelf: 'center', fontSize: 22}}>
//           Join Meeting
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// //button design
// const Button = ({onPress, buttonText, backgroundColor}) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         backgroundColor: backgroundColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 18,
//         borderRadius: 20,
//         marginBottom: 40, //can delete after 
        
//       }}>
//       <Text style={{color: 'white', fontSize: 23, }}>{buttonText}</Text>
//     </TouchableOpacity>
//   );
// };

// function ControlsContainer({join, leave, toggleWebcam, toggleMic}) {
//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: viewportWidth * 0.88,
//         height: viewportHeight * 0.2 //can adjust container height
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

// function ParticipantView({participantId}) {
//   const {webcamStream, webcamOn} = useParticipant(participantId);

//   if (webcamOn && webcamStream) {
//     return (
//       //edit the sizes of the video call windows 
//       <RTCView
//         streamURL={new MediaStream([webcamStream.track]).toURL()}
//         objectFit={'cover'}
//         style={{
//           flex: 1,
//           // height: 400,
//           // marginVertical: 16,
//           // marginHorizontal: 16,
//           height: 250,
//           marginVertical: 8, //height of video window
//           marginHorizontal: 8, //width of video window
//         }}
//       />
//     );
//   } else {
//     return (
//        // Return a placeholder or an alternative view if webcam is not on or webcamStream is null
//       <View
//         style={{
//           height: 400,
//           marginVertical: 8,
//           marginHorizontal: 8,
//           backgroundColor: '#cccccc',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text style={{fontSize: 18}}>Webcam is off</Text>
//       </View>
//     );
//   }
// }

// function ParticipantList({participants}) {
//   return participants.length > 0 ? (
//     <FlatList
//       data={participants}
//       renderItem={({item}) => {
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
//       <Text style={{fontSize: 24}}>Press Join button to enter meeting.</Text>
//     </View>
//   );
// }

// function MeetingView({autoJoin, setAutoJoin}) {
//   const {join, leave, toggleWebcam, toggleMic, meetingId, participants} =
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
//     <View style={{flex: 1}}>
//       {meetingId ? (
//         <Text style={{fontSize: 22, padding: 16}}>Meeting Id: {meetingId}</Text>
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

//   //original code from VideoSDK
//   // const getMeetingId = async id => {
//   //   const meetingId = id == null ? await createMeeting({token}) : id;
//   //   setMeetingId(meetingId);
//   // };

//   //Code for when I click 'Call Person" button, it autojoins to open the webcam directly
//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);  // Set flag to auto-join and activate webcam
//   };

//   const callUser = async (caller, callee) => {
//     const meetingId = await createMeeting({ token });

//     // Update Firestore with callerId and calleeId
//     await firestore.collection('users').doc(caller).update({
//       callerId: meetingId,
//     });
//     await firestore.collection('users').doc(callee).update({
//       calleeId: meetingId,
//     });}

//   return meetingId ? (
//     <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
//       <MeetingProvider
//         config={{
//           meetingId,
//           micEnabled: false,
//           webcamEnabled: true,
//           name: 'Test User',
//         }}
//         token={token}>
//         <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin}/>
//       </MeetingProvider>
//     </SafeAreaView>
//   ) : (
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }

//////////////////////
///Not working
// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList, Dimensions
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from './api';
// import { collection, addDoc, query, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// // Initialize Firestore
// const firestore = FIRESTORE_DB;

// // ICE servers configuration
// const servers = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleCreateMeeting = async () => {
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     props.getMeetingId(newMeetingId);
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
//       }}>
//       <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
  
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

//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);
//   };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);
//   };

//   const createOffer = async () => {
//     const callDoc = firestore.collection("contacts").doc();
//     const offerCandidates = callDoc.collection("offerCandidates");
//     const answerCandidates = callDoc.collection("answerCandidates");

//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };

//     await callDoc.set({ offer });

//     callDoc.onSnapshot(snapshot => {
//       const data = snapshot.data();
//       if (!pc.currentRemoteDescription && data?.answer) {
//         const answerDescription = new RTCSessionDescription(data.answer);
//         pc.setRemoteDescription(answerDescription);
//       }
//     });

//     offerCandidates.onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           pc.addIceCandidate(candidate);
//         }
//       });
//     });

//     return callDoc.id;
//   };

//   const answerCall = async callId => {
//     const callDoc = firestore.collection("calls").doc(callId);
//     const answerCandidates = callDoc.collection("answerCandidates");
//     const offerCandidates = callDoc.collection("offerCandidates");

//     const callData = (await callDoc.get()).data();
//     const offerDescription = callData.offer;
//     await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//     const answerDescription = await pc.createAnswer();
//     await pc.setLocalDescription(answerDescription);

//     const answer = {
//       type: answerDescription.type,
//       sdp: answerDescription.sdp,
//     };

//     await callDoc.update({ answer });

//     offerCandidates.onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           pc.addIceCandidate(candidate);
//         }
//       });
//     });

//     // Start VideoSDK meeting once call is answered
//     setMeetingId(callId);
//     setAutoJoin(true);
//   };

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//         <TouchableOpacity
//         onPress={answerCall}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           answer
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={startLocalStream}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           start local stream
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={createOffer}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           create offer
//         </Text>
//       </TouchableOpacity>
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
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }



////////////////////
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

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleCreateMeeting = async () => {
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     props.getMeetingId(newMeetingId);
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
//       }}>
//       <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
  
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

//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);
//   };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);
//   };

//   const createOffer = async () => {
//     const callDoc = doc(collection(FIRESTORE_DB, "calls"));
//     const offerCandidates = collection(callDoc, "offerCandidates");
//     const answerCandidates = collection(callDoc, "answerCandidates");

//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
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

//   const answerCall = async callId => {
//     const callDoc = doc(collection(FIRESTORE_DB, "calls"), callId);
//     const answerCandidates = collection(callDoc, "answerCandidates");
//     const offerCandidates = collection(callDoc, "offerCandidates");

//     const callData = (await getDoc(callDoc)).data();
//     const offerDescription = callData.offer;
//     await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//     const answerDescription = await pc.createAnswer();
//     await pc.setLocalDescription(answerDescription);

//     const answer = {
//       type: answerDescription.type,
//       sdp: answerDescription.sdp,
//     };

//     await setDoc(callDoc, { answer }, { merge: true });

//     onSnapshot(offerCandidates, snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === "added") {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           pc.addIceCandidate(candidate);
//         }
//       });
//     });

//     // Start VideoSDK meeting once call is answered
//     setMeetingId(callId);
//     setAutoJoin(true);
//   };

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//            <TouchableOpacity
//         onPress={answerCall}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           answer
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={startLocalStream}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           start local stream
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={createOffer}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           create offer
//         </Text>
//       </TouchableOpacity>
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
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }




///this code answers automatically to the above code
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

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleCreateMeeting = async () => {
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     props.getMeetingId(newMeetingId);
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
//       }}>
//       <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
  
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

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(FIRESTORE_DB, "calls"), snapshot => {
//       snapshot.docChanges().forEach(async change => {
//         if (change.type === "added") {
//           const callId = change.doc.id;
//           const callData = change.doc.data();
//           const offerDescription = callData.offer;

//           if (!pc.currentRemoteDescription && offerDescription) {
//             await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//             const answerDescription = await pc.createAnswer();
//             await pc.setLocalDescription(answerDescription);

//             const answer = {
//               type: answerDescription.type,
//               sdp: answerDescription.sdp,
//             };

//             await setDoc(doc(FIRESTORE_DB, "calls", callId), { answer }, { merge: true });

//             const offerCandidates = collection(doc(FIRESTORE_DB, "calls", callId), "offerCandidates");
//             onSnapshot(offerCandidates, snapshot => {
//               snapshot.docChanges().forEach(change => {
//                 if (change.type === "added") {
//                   const candidate = new RTCIceCandidate(change.doc.data());
//                   pc.addIceCandidate(candidate);
//                 }
//               });
//             });

//             setMeetingId(callId);
//             setAutoJoin(false);
//           }
//         }
//       });
//     });

//     return () => unsubscribe();
//   }, [pc]);

//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);
//   };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);
//   };

//   const createOffer = async () => {
//     const callDoc = doc(collection(FIRESTORE_DB, "calls"));
//     const offerCandidates = collection(callDoc, "offerCandidates");
//     const answerCandidates = collection(callDoc, "answerCandidates");

//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
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

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//                 {/* <TouchableOpacity
//         onPress={answerCall}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           answer
//         </Text>
//       </TouchableOpacity> */}
//       <TouchableOpacity
//         onPress={startLocalStream}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           start local stream
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={createOffer}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           create offer
//         </Text>
//       </TouchableOpacity>
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
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }

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

// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleCreateMeeting = async () => {
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     props.getMeetingId(newMeetingId);
//   }

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 10 * 10,
//         width: viewportWidth * 0.88,
//       }}>
//       <TouchableOpacity
//         onPress={handleCreateMeeting}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           Call Carina?
//         </Text>
//       </TouchableOpacity>
  
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

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(FIRESTORE_DB, "calls"), snapshot => {
//       snapshot.docChanges().forEach(async change => {
//         if (change.type === "added") {
//           const callId = change.doc.id;
//           const callData = change.doc.data();
//           const offerDescription = callData.offer;

//           if (!pc.currentRemoteDescription && offerDescription) {
//             await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//             const answerDescription = await pc.createAnswer();
//             await pc.setLocalDescription(answerDescription);

//             const answer = {
//               type: answerDescription.type,
//               sdp: answerDescription.sdp,
//             };

//             await setDoc(doc(FIRESTORE_DB, "calls", callId), { answer }, { merge: true });

//             const offerCandidates = collection(doc(FIRESTORE_DB, "calls", callId), "offerCandidates");
//             onSnapshot(offerCandidates, snapshot => {
//               snapshot.docChanges().forEach(change => {
//                 if (change.type === "added") {
//                   const candidate = new RTCIceCandidate(change.doc.data());
//                   pc.addIceCandidate(candidate);
//                 }
//               });
//             });

//             setMeetingId(callId);
//             setAutoJoin(false);
//           }
//         }
//       });
//     });

//     return () => unsubscribe();
//   }, [pc]);

//   const getMeetingId = id => {
//     setMeetingId(id);
//     setAutoJoin(true);
//   };

//   const startLocalStream = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     setLocalStream(stream);
//   };

//   const createOffer = async () => {
//     const callDoc = doc(collection(FIRESTORE_DB, "calls"));
//     const offerCandidates = collection(callDoc, "offerCandidates");
//     const answerCandidates = collection(callDoc, "answerCandidates");

//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
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

//   return meetingId ? (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
//                 {/* <TouchableOpacity
//         onPress={answerCall}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           answer
//         </Text>
//       </TouchableOpacity> */}
//       <TouchableOpacity
//         onPress={startLocalStream}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           start local stream
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={createOffer}
//         style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
//         <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
//           create offer
//         </Text>
//       </TouchableOpacity>
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
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }


import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
  Dimensions
} from 'react-native';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from './api';
import { collection, addDoc, getDocs, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// ICE servers configuration
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function JoinScreen(props) {
  const [meetingVal, setMeetingVal] = useState('');
  const [meetingId, setMeetingId] = useState('');

  const handleCreateMeeting = async () => {
    const newMeetingId = await createMeeting({ token });
    setMeetingId(newMeetingId);
    props.getMeetingId(newMeetingId);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        paddingHorizontal: 10 * 10,
        width: viewportWidth * 0.88,
      }}>
      <TouchableOpacity
        onPress={handleCreateMeeting}
        style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
          Call Carina?
        </Text>
      </TouchableOpacity>
  
      <TouchableOpacity
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
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//button design
const Button = ({ onPress, buttonText, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        marginBottom: 40,
      }}>
      <Text style={{ color: 'white', fontSize: 23 }}>{buttonText}</Text>
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
        width: viewportWidth * 0.88,
        height: viewportHeight * 0.2
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
          flex: 1,
          height: 250,
          marginVertical: 8,
          marginHorizontal: 8,
        }}
      />
    );
  } else {
    return (
      <View
        style={{
          height: 400,
          marginVertical: 8,
          marginHorizontal: 8,
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

function MeetingView({ autoJoin, setAutoJoin }) {
  const { join, leave, toggleWebcam, toggleMic, meetingId, participants } =
    useMeeting({});
  const participantsArrId = [...participants.keys()];

  useEffect(() => {
    if (autoJoin) {
      join();
      toggleWebcam();
      setAutoJoin(false);
    }
  }, [autoJoin, join, toggleWebcam, setAutoJoin]);

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
  const [autoJoin, setAutoJoin] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(new RTCPeerConnection(servers));

  useEffect(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = event => {
        const newRemoteStream = new MediaStream();
        event.streams[0].getTracks().forEach(track => {
          newRemoteStream.addTrack(track);
        });
        setRemoteStream(newRemoteStream);
      };

      pc.onicecandidate = event => {
        if (event.candidate) {
          console.log("New ICE candidate: ", event.candidate);
        }
      };
    }
  }, [localStream, pc]);

  const getMeetingId = id => {
    setMeetingId(id);
    setAutoJoin(true);
  };


  const callUser = async (caller, callee) => {
   

    // Update Firestore documents
    await setDoc(elizabethContactRef, { meetingId: newMeetingId }, { merge: true });
    await setDoc(tracyContactRef, { calleeId: newMeetingId, status: 'initiated' }, { merge: true });
    };

  const startLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
  };

  const createOffer = async () => {
    //  const newMeetingId = await createMeeting({ token });
    const meetingIDVSDK = "2eir-4xus-3ygn";
    //  const newMeetingId = "2eir-4xus-3ygn"
     console.log("newMeetingId", meetingIDVSDK);
     setMeetingId(meetingIDVSDK);  // Update the meeting ID in state

    const callDoc = doc(collection(FIRESTORE_DB, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    // const setCalleeCaller =
    // await setDoc(offerCandidates, { meetingId: newMeetingId }, { merge: true });
    // await setDoc(answerCandidates, { calleeId: newMeetingId, status: 'initiated' }, { merge: true });

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
      meetingIDVSDK: "2eir-4xus-3ygn"
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, snapshot => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(offerCandidates, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    return callDoc.id;
  };

  const answerCall = async () => {

     //  const newMeetingId = await createMeeting({ token });
     const meetingIDVSDK = "2eir-4xus-3ygn";
     //  const newMeetingId = "2eir-4xus-3ygn"
      console.log("newMeetingId", meetingIDVSDK);
      setMeetingId(meetingIDVSDK);  // Update the meeting ID in state
      
    const callsSnapshot = await getDocs(collection(FIRESTORE_DB, "calls"));
    for (const callDoc of callsSnapshot.docs) {
      const callData = callDoc.data();
      if (callData.offer && !callData.answer) {
        const offerDescription = new RTCSessionDescription(callData.offer);
        await pc.setRemoteDescription(offerDescription);

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
          type: answerDescription.type,
          sdp: answerDescription.sdp,
          meetingIDVSDK: "2eir-4xus-3ygn"
        };

        await setDoc(callDoc.ref, { answer }, { merge: true });

        const offerCandidates = collection(callDoc.ref, "offerCandidates");
        onSnapshot(offerCandidates, snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.addIceCandidate(candidate);
            }
          });
        });

        setMeetingId(`${callDoc.id}_answer_${callDoc.meetingIDVSDK}`);
        setAutoJoin(true);
        break;
      }
    }
  };

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
        <MeetingView autoJoin={autoJoin} setAutoJoin={setAutoJoin} />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F6FF' }}>
      <TouchableOpacity
        onPress={startLocalStream}
        style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
          Start Local Stream
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={createOffer}
        style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
          Create Offer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={answerCall}
        style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
          Answer Call
        </Text>
      </TouchableOpacity>
      <JoinScreen getMeetingId={getMeetingId} />
    </SafeAreaView>
  );
}
