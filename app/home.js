import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HelpButton from "../components/HelpButton";
import Carousel from "../components/CarouselOne/Carousel";
//used for deep linking video call
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import * as Device from 'expo-device';
import CallAlertModal from '../components/CallAlertModal';

export default function App() {
  const auth = getAuth();
  const user = auth.currentUser;
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  //modal alert
  const [modalVisible, setModalVisible] = useState(false);
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
        const { caller, meetingId } = notification.request.content.data;
        setCallerName(caller);
        setMeetingId(meetingId);
        setModalVisible(true);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const { meetingId, caller } = response.notification.request.content.data;
        if (response.actionIdentifier === 'ACCEPT_CALL') {
          Linking.openURL(`app-garden-loft://VideoSDK2?meetingId=${meetingId}?caller=${caller}`);
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

  const joinMeeting = async () => {
    setModalVisible(false);
    router.push({
      pathname: '/VideoSDK2',
      params: { meetingId }
    });
  };

  const handleDecline = () => {
    setModalVisible(false);
  };

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

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FCF8E3" }}>
    <SafeAreaProvider>
      <HelpButton />
      <Carousel />
    </SafeAreaProvider>
    <CallAlertModal
        visible={modalVisible}
        callerId={callerName}
        onAccept={joinMeeting}
        onDecline={handleDecline}
      />
  </GestureHandlerRootView>
  )
}

