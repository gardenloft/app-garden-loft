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
import { createMeeting, token } from '../components/api';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { getAuth } from 'firebase/auth';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';

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

function MeetingView({autoJoin, setAutoJoin}) {
  const { join, leave, toggleWebcam, toggleMic, meetingId, participants } =
    useMeeting({});
  const participantsArrId = [...participants.keys()];

  useEffect(() => {
    if (autoJoin) {
      join();
      toggleWebcam();  // Automatically turn on the webcam
      setAutoJoin(false);  // Reset the auto-join state
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
  const params = useLocalSearchParams();
  console.log(params);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

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
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'DECLINE_CALL',
          buttonTitle: 'Decline',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const { meetingId } = response.notification.request.content.data;
        if (response.actionIdentifier === 'ACCEPT_CALL') {
          setMeetingId(meetingId);
          setAutoJoin(true);
          console.log ('i am setting callee meeting id with,', meetingId)
          Linking.openURL(`app-garden-loft://VideoSDK?meetingId=${meetingId}`);
        } else if (response.actionIdentifier === 'DECLINE_CALL') {
          // Handle decline action if needed
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

  useEffect(() => {
    if (params.meetingId) {
      setMeetingId(params.meetingId);
      setAutoJoin(true);
    }
  }, [params]);

  // useEffect(() => {
  //   if (autoJoin && meetingId) {
  //     joinMeeting(meetingId);
  //   }
  // }, [autoJoin, meetingId]);

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

      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId
      })).data;
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

  const getMeetingId = async id => {
    const meetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(meetingId);
  };

  const callUser = async (calleeUid) => {
    const meetingId = await createMeeting({ token });
    setMeetingId(meetingId);
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

        // Update Firestore with callerId and calleeId
    await setDoc(doc(FIRESTORE_DB, 'users', user.uid), { callerId: meetingId }, { merge: true });
    await setDoc(doc(FIRESTORE_DB, 'users', calleeUid), { calleeId: meetingId }, { merge: true });

    const message = {
      to: calleePushToken,
      sound: 'default',
      title: 'Incoming Call',
      body: `${caller} is calling you`,
      data: { meetingId },
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

    joinMeeting(meetingId); // Automatically join the meeting after calling the user
  };

  const joinMeeting = async (meetingId) => {
    console.log('Joining meeting with ID:', meetingId);
    // setAutoJoin(true); 
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
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <JoinScreen getMeetingId={getMeetingId} />
      <TouchableOpacity
        onPress={() => callUser('xD7G0pcqRodqecqH1XEoMLUagep1')} // Replace 'xD7G0pcqRodqecqH1XEoMLUagep1' with the actual callee's UID
        style={{ backgroundColor: '#1178F8', padding: 20, borderRadius: 10, marginTop: 20 }}>
        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 22 }}>
          Call Matthew
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}