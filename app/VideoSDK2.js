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
  createCameraVideoTrack
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

function ControlsContainer({ join, leave, end, handleEnd, toggleWebcam, toggleMic, addPeople, isWebcamOn, isMicOn }) {
  const router = useRouter();
  console.log("handleEnd function:", handleEnd);

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
     <IconButton
        onPress={() => {
          toggleWebcam();
        }}
        iconName="camera"
        // buttonText="Webcam On/Off"
        // backgroundColor="orange"
        buttonText={isWebcamOn ? "Webcam On" : "Webcam Off"}
        backgroundColor={isWebcamOn ? "green" : "red"}
      />
      <IconButton
        onPress={() => {
          toggleMic();
        }}
        iconName="microphone"
        // buttonText="Mic On/Off"
        // backgroundColor="orange"
        buttonText={isMicOn ? "Mic On" : "Mic Off"}
        backgroundColor={isMicOn ? "green" : "red"}
      />
            <IconButton
        onPress={() => {
          console.log("end button pressed")
          handleEnd(); // Call handleEnd instead of just leave
          handleBack();

        }}
        iconName="phone-hangup"
        buttonText="End"
        backgroundColor="red"
      />
      <IconButton
        onPress={() => {
          leave();
          handleBack();
        }}
        iconName="phone-hangup"
        buttonText="Leave"
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
  const { webcamStream, webcamOn, setQuality } = useParticipant(participantId);

  useEffect(() => {
    if (webcamOn) {
      setQuality("high");
    }
  }, [webcamOn]);

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
      <Text style={{ fontSize: 18 }}>No participants yet.</Text>
    </View>
  );
}

function MeetingView({ autoJoin, setAutoJoin, callUser, onMeetingEnd, customVideoTrack }) {
  const { join, end, leave, toggleWebcam, toggleMic, meetingId, participants } = useMeeting({
    config: {
      multiStream: false,
    },
    onMeetingJoined: () => {
      console.log("onMeetingJoined");
    },
    onMeetingLeft: () => {
      console.log("onMeetingLeft");
      onMeetingEnd();
      handleEnd();
    },
  });

  useEffect(() => {
    return () => {
      if (typeof leave === 'function') {
        try {
          leave();
        } catch (error) {
          console.error("Error leaving meeting:", error);
        }
      }
    };
  }, []);

  const handleEnd = async () => {

    try {
      if (typeof leave === 'function') await leave();
      console.log("handleend leave activated")
      if (typeof end === 'function') await end();
      console.log("handleend end activated")
    } catch (error) {
      console.error("Error ending meeting:", error);
    } finally {
      setAutoJoin(false);
      console.log("handleend false autojoin activated")
    }
  };

  const handleJoin = () => {
    if (typeof join === 'function') {
      join();
      if (customVideoTrack) {
        toggleWebcam(customVideoTrack);
      } else {
        toggleWebcam();
      }
    }
  };

  const participantsArrId = [...participants.keys()];
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const handleToggleWebcam = () => {
    toggleWebcam();
    setIsWebcamOn((prev) => !prev);
  };

  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn((prev) => !prev);
  };

  useEffect(() => {
    if (autoJoin) {
      handleJoin();
      setIsWebcamOn(true);
      setIsMicOn(true);
      setAutoJoin(false);
    }
  }, [autoJoin, setAutoJoin]);

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
      <ControlsContainer 
        // end={handleEnd}  
        handleEnd={handleEnd} 
        join={handleJoin} 
        leave={leave} 
        toggleWebcam={handleToggleWebcam}
        toggleMic={handleToggleMic}
        isWebcamOn={isWebcamOn}
        isMicOn={isMicOn}
        addPeople={addPeople} 
      />
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

const createCustomVideoTrack = async () => {
  try {
    const customTrack = await createCameraVideoTrack({
      optimizationMode: "text",  // 'detail' or 'text', never motion
      encoderConfig: "h540p_w960p",
      facingMode: "user",
      multiStream: false,
    });
    return customTrack;
  } catch (error) {
    console.error("Error creating custom video track:", error);
    return null;
  }
};

export default function VideoSDK() {
  const [meetingId, setMeetingId] = useState(null);
  const [autoJoin, setAutoJoin] = useState(false);
  const [customVideoTrack, setCustomVideoTrack] = useState(null);
  const params = useLocalSearchParams();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (params.meetingId) {
      setMeetingId(params.meetingId);
      // if (params.autoJoin === 'true') {
      //   setAutoJoin(true);
      // }
    }
  }, [params.meetingId
    // , params.autoJoin, 
  ]);

  useEffect(() => {
    const setupCustomTrack = async () => {
      const track = await createCustomVideoTrack();
      setCustomVideoTrack(track);
    };
    setupCustomTrack();
  }, []);

  const getMeetingId = async (id) => {
    const newMeetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(newMeetingId);
  };

  const callUser = async (calleeUid) => {
    const newMeetingId = await createMeeting({ token });
    setMeetingId(newMeetingId);
    // setAutoJoin(true); //never do autojoin(true) because it will mess up the video streaming and give you black screens

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

  const joinMeeting = async (meetingId) => {
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
          customCameraVideoTrack: customVideoTrack,
          optimizationMode: "text", 
          mediaStream: false,
          adaptiveVideo: false,
          
          // UI customization
          participantId: user?.uid,
          preferredProtocol: 'udp',
          
          // Advanced features
          screenShareEnabled: true,
          speakerDetectionEnabled: true,
          recordingEnabled: true,
          chatEnabled: true,
          raiseHandEnabled: true,
          
          // Analytics and debugging
          debug: true,
          networkBarEnabled: true,
          
          // Device management
          autoDeviceManagement: {
            audioInput: true,
            audioOutput: true,
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
        <MeetingView 
          autoJoin={autoJoin} 
          setAutoJoin={setAutoJoin} 
          callUser={callUser}
          customVideoTrack={customVideoTrack}
          onMeetingEnd={() => {
            console.log("Meeting ended");
            setMeetingId(null);
            setAutoJoin(false);
            
          }}
        />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <JoinScreen getMeetingId={getMeetingId} />
    </SafeAreaView>
  );
}