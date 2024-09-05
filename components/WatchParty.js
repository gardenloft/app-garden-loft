// WatchParty.js
import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { MeetingProvider } from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from '../components/api'; // Adjust the path based on your project structure
import WatchPartyMeeting from './WatchPartyMeeting'; // Adjust the path if it's in a different folder

// Log the imported component to check if it's properly imported
console.log('WatchPartyMeeting:', WatchPartyMeeting);
console.log('MeetingProvider:', MeetingProvider);

const WatchParty = () => {
  const [meetingId, setMeetingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to create the meeting
  const handleCreateMeeting = async () => {
    setIsLoading(true);
    try {
      const newMeetingId = await createMeeting({ token });
      if (newMeetingId) {
        setMeetingId(newMeetingId);
      } else {
        Alert.alert('Error', 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      Alert.alert('Error', 'Could not create watch party.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {meetingId ? (
        <MeetingProvider meetingId={meetingId} token={token}>
          <WatchPartyMeeting />
        </MeetingProvider>
      ) : (
        <Button
          title={isLoading ? 'Creating...' : 'Create Watch Party'}
          onPress={handleCreateMeeting}
          disabled={isLoading}
        />
      )}
    </View>
  );
};

// Style definitions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default WatchParty;
