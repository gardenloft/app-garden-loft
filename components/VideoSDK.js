// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList,
// } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
// } from '@videosdk.live/react-native-sdk';
// import {createMeeting, token} from './api';

// // A Join Screen to our app with which you can create new meetings or join existing meetings.
// function JoinScreen(props) {
//   const [meetingVal, setMeetingVal] = useState('');
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         // flexDirection: 'row',
//         backgroundColor: '#F6F6FF',
//         justifyContent: 'center',
//         paddingHorizontal: 6 * 10,
        
    
//       }}>
//       <TouchableOpacity
//         onPress={() => {
//           props.getMeetingId();
//         }}
//         style={{backgroundColor: '#1178F8', padding: 12, borderRadius: 6}}>
//         <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>
//           Create Meeting
//         </Text>
//       </TouchableOpacity>

//       <Text
//         style={{
//           alignSelf: 'center',
//           fontSize: 22,
//           marginVertical: 16,
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
//           padding: 12,
//           borderWidth: 1,
//           borderRadius: 6,
//           fontStyle: 'italic',
//         }}
//       />
//       <TouchableOpacity
//         style={{
//           backgroundColor: '#1178F8',
//           padding: 12,
//           marginTop: 14,
//           borderRadius: 6,
//         }}
//         onPress={() => {
//           props.getMeetingId(meetingVal);
//         }}>
//         <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>
//           Join Meeting
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const Button = ({onPress, buttonText, backgroundColor}) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         backgroundColor: backgroundColor,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 12,
//         borderRadius: 4,
//       }}>
//       <Text style={{color: 'white', fontSize: 12}}>{buttonText}</Text>
//     </TouchableOpacity>
//   );
// };

// //Manages features like Joining or leaving Meeting and Enable or Disable Webcam/Mic.
// function ControlsContainer({join, leave, toggleWebcam, toggleMic}) {
//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: 'column',
//         justifyContent: 'space-between',
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

// // After implementing controls, it's time to render joined participants.
// // We will get joined participants from useMeeting Hook.

// // function ParticipantView({participantId}) {
// //   //useParticipant hook is responsible for handling all the properties and events of one particular participant who joined in the meeting. It will take participantId as an argument.
// //   //Example for useParticipant Hook
// //   const {webcamStream, webcamOn} = useParticipant(participantId);
// //   return webcamOn ? (
// //     <RTCView
// //       streamURL={new MediaStream([webcamStream.track]).toURL()}
// //       objectFit={'cover'}
// //       style={{
// //         height: 300,
// //         marginVertical: 8,
// //         marginHorizontal: 8,
// //       }}
// //     />
// //   ) : (
// //     <View
// //       style={{
// //         backgroundColor: 'grey',
// //         height: 300,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //       }}>
// //       <Text style={{fontSize: 16}}>NO MEDIA</Text>
// //     </View>
// //   );
// // }

// function ParticipantView({participantId}) {
//   // useParticipant hook is responsible for handling all the properties and events of one particular participant who joined in the meeting. It will take participantId as an argument.
//   // Example for useParticipant Hook
//   const {webcamStream, webcamOn} = useParticipant(participantId);

//   // Check if webcam is on and webcamStream is not null
//   if (webcamOn && webcamStream) {
//     return (
//       <RTCView
//         streamURL={new MediaStream([webcamStream.track]).toURL()}
//         objectFit={'cover'}
//         style={{
//           height: 200,
//           marginVertical: 8,
//           marginHorizontal: 8,
//         }}
//       />
//     );
//   } else {
//     // Return a placeholder or an alternative view if webcam is not on or webcamStream is null
//     return (
//       <View
//         style={{
//           height: 300,
//           marginVertical: 8,
//           marginHorizontal: 8,
//           backgroundColor: '#cccccc', // Placeholder color
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text>Webcam is off</Text>
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
//       <Text style={{fontSize: 20}}>Press Join button to enter meeting.</Text>
//     </View>
//   );
// }

// function MeetingView() {
//   const {join, leave, toggleWebcam, toggleMic, meetingId, participants} =
//     useMeeting({});
//   const participantsArrId = [...participants.keys()];

//   return (
//     <View style={{flex: 1}}>
//       {meetingId ? (
//         <Text style={{fontSize: 18, padding: 12}}>Meeting Id :{meetingId}</Text>
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

//   const getMeetingId = async id => {
//     const meetingId = id == null ? await createMeeting({token}) : id;
//     setMeetingId(meetingId);
//   };

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
//         <MeetingView />
//       </MeetingProvider>
//     </SafeAreaView>
//   ) : (
//     <JoinScreen getMeetingId={getMeetingId} />
//   );
// }


import React, {useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList, Dimensions
} from 'react-native';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
} from '@videosdk.live/react-native-sdk';
import {createMeeting, token} from './api';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

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
      <TouchableOpacity
        onPress={() => {
          props.getMeetingId();
        }}
        style={{backgroundColor: '#1178F8', padding: 20, borderRadius: 10}}>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 22}}>
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
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 22}}>
          Join Meeting
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Button = ({onPress, buttonText, backgroundColor}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 40, //can delete after 
        
      }}>
      <Text style={{color: 'white', fontSize: 16}}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

function ControlsContainer({join, leave, toggleWebcam, toggleMic}) {
  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: viewportWidth * 0.8,
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

function ParticipantView({participantId}) {
  const {webcamStream, webcamOn} = useParticipant(participantId);

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
        <Text style={{fontSize: 18}}>Webcam is off</Text>
      </View>
    );
  }
}

function ParticipantList({participants}) {
  return participants.length > 0 ? (
    <FlatList
      data={participants}
      renderItem={({item}) => {
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
      <Text style={{fontSize: 24}}>Press Join button to enter meeting.</Text>
    </View>
  );
}

function MeetingView() {
  const {join, leave, toggleWebcam, toggleMic, meetingId, participants} =
    useMeeting({});
  const participantsArrId = [...participants.keys()];

  return (
    <View style={{flex: 1}}>
      {meetingId ? (
        <Text style={{fontSize: 22, padding: 16}}>Meeting Id: {meetingId}</Text>
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

  const getMeetingId = async id => {
    const meetingId = id == null ? await createMeeting({token}) : id;
    setMeetingId(meetingId);
  };

  return meetingId ? (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
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
    <JoinScreen getMeetingId={getMeetingId} />
  );
}
