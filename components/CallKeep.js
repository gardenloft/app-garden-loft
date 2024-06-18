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
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import uuid from 'react-native-uuid';

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

// CallKeep setup
RNCallKeep.setup({
  ios: {
    appName: 'CallKeepDemo',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'OK',
  },
});

const getNewUuid = () => uuid.v4().toLowerCase();

export default function VideoSDK() {
  const [meetingId, setMeetingId] = useState(null);
  const [autoJoin, setAutoJoin] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pc, setPc] = useState(new RTCPeerConnection(servers));
  const [calls, setCalls] = useState({});

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('endCall', endCall);
    };
  }, []);

  const log = (text) => {
    console.info(text);
  };

  const addCall = (callUUID, number) => {
    setCalls({ ...calls, [callUUID]: number });
  };

  const removeCall = (callUUID) => {
    const { [callUUID]: _, ...updated } = calls;
    setCalls(updated);
  };

  const displayIncomingCall = (number) => {
    const callUUID = getNewUuid();
    addCall(callUUID, number);
    log(`[displayIncomingCall] ${callUUID}, number: ${number}`);
    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  };

  const handleCreateMeeting = async () => {
    const newMeetingId = await createMeeting({ token });
    setMeetingId(newMeetingId);
    await setDoc(doc(FIRESTORE_DB, 'calls', newMeetingId), { caller: 'John', callee: 'Carina', meetingId: newMeetingId });
    displayIncomingCall(newMeetingId);
  };

  const answerCall = ({ callUUID }) => {
    const meetingId = calls[callUUID];
    log(`[answerCall] ${callUUID}, meetingId: ${meetingId}`);
    RNCallKeep.startCall(callUUID, meetingId, meetingId);
    setMeetingId(meetingId);
    setAutoJoin(true);
    RNCallKeep.setCurrentCallActive(callUUID);
  };

  const endCall = ({ callUUID }) => {
    log(`[endCall] ${callUUID}`);
    removeCall(callUUID);
  };

  const getMeetingId = id => {
    setMeetingId(id);
    setAutoJoin(true);
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
        onPress={handleCreateMeeting}
        style={{ backgroundColor: '#f3b718', padding: 12, borderRadius: 6 }}>
        <Text style={{ color: 'black', alignSelf: 'center', fontSize: 38 }}>
          Call Carina?
        </Text>
      </TouchableOpacity>
      <JoinScreen getMeetingId={getMeetingId} />
    </SafeAreaView>
  );
}

function JoinScreen(props) {
  const [meetingVal, setMeetingVal] = useState('');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        paddingHorizontal: 10 * 10,
        width: viewportWidth * 0.88,
      }}>
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
