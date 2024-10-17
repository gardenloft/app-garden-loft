import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useMeeting, useParticipant, RTCView } from '@videosdk.live/react-native-sdk';

const { width: viewportWidth } = Dimensions.get("window");

const VideoMeetingBubble = ({ meetingId }) => {
  const { participants } = useMeeting({
    onParticipantJoined: (participant) => {
      console.log('Participant joined', participant);
    },
    onParticipantLeft: (participant) => {
      console.log('Participant left', participant);
    },
  });

  return (
    <View style={styles.container}>
      {/* Iterate over participants */}
      {Array.from(participants.values()).map((participantId) => (
        <ParticipantBubble key={participantId} participantId={participantId} />
      ))}
    </View>
  );
};

const ParticipantBubble = ({ participantId }) => {
  const { webcamOn, webcamStream, displayName } = useParticipant(participantId);

  return (
    <View style={styles.bubble}>
      {webcamOn ? (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          style={styles.rtcView}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{displayName.charAt(0)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
  },
  bubble: {
    width: viewportWidth * 0.3,
    height: viewportWidth * 0.3,
    borderRadius: viewportWidth * 0.15,
    overflow: 'hidden',
    margin: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtcView: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: '#888',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default VideoMeetingBubble;
