// import React, { useEffect, useState, useRef } from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import { useMeeting, usePubSub } from '@videosdk.live/react-native-sdk';
// import { YouTubeIframe } from 'react-native-youtube-iframe';

// const WatchPartyMeeting = () => {
//   const { join, leave, toggleMic, localParticipant, participants } = useMeeting({
//     onError: (error) => {
//       console.error('Meeting error:', error);
//     },
//   });
//   const { publish, subscribe } = usePubSub('video-sync');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [participantCount, setParticipantCount] = useState(0);
//   const playerRef = useRef(null);

//   useEffect(() => {
//     const joinMeeting = async () => {
//       try {
//         await join();
//         console.log('Joined the meeting successfully');
//       } catch (error) {
//         console.error('Failed to join the meeting:', error);
//       }
//     };

//     joinMeeting();

//     const unsubscribe = subscribe((message) => {
//       console.log('Received message:', message);
//       if (message.data.action === 'play') {
//         playerRef.current?.seekTo(message.data.time, true);
//         setIsPlaying(true);
//       } else if (message.data.action === 'pause') {
//         playerRef.current?.seekTo(message.data.time, true);
//         setIsPlaying(false);
//       }
//     });

//     return () => {
//       unsubscribe();
//       leave();
//     };
//   }, []);

//   useEffect(() => {
//     setParticipantCount(participants.size);
//   }, [participants]);

//   const handlePlayPause = async () => {
//     try {
//       const newPlayingState = !isPlaying;
//       const currentTime = await playerRef.current?.getCurrentTime();
//       setIsPlaying(newPlayingState);
//       publish({ action: newPlayingState ? 'play' : 'pause', time: currentTime });
//     } catch (error) {
//       console.error('Error in handlePlayPause:', error);
//     }
//   };

//   const handleToggleMic = () => {
//     if (localParticipant) {
//       toggleMic();
//     } else {
//       console.log('localParticipant is not yet available.');
//     }
//   };

//   return (
//     <View style={styles.meetingContainer}>
//       <YouTubeIframe
//         ref={playerRef}
//         height={300}
//         videoId="ybVfdZ6G7po"
//         play={isPlaying}
//         onReady={() => console.log('Video is ready')}
//         onError={(error) => console.error('YouTube player error:', error)}
//       />
//       <View style={styles.controlsContainer}>
//         <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
//         <Button
//           title={localParticipant?.micOn ? 'Mute' : 'Unmute'}
//           onPress={handleToggleMic}
//           disabled={!localParticipant}
//         />
//         <Button title="Leave Party" onPress={leave} />
//       </View>
//       <Text style={styles.participantsText}>
//         Participants: {participantCount}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   meetingContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   participantsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 18,
//   },
// });
// export default WatchPartyMeeting;



// WatchPartyMeeting.js
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import { useMeeting, usePubSub } from '@videosdk.live/react-native-sdk';
// import { YouTubeIframe } from 'react-native-youtube-iframe';

// const WatchPartyMeeting = ({ videoId, isHost }) => {
//   const { join, leave, toggleMic, localParticipant, participants } = useMeeting();
//   const { publish, subscribe } = usePubSub('video-sync');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const playerRef = useRef(null);

//   useEffect(() => {
//     join();
//     subscribe((message) => {
//       if (message.data.action === 'play') {
//         playerRef.current.seekTo(message.data.time, true);
//         setIsPlaying(true);
//       } else if (message.data.action === 'pause') {
//         playerRef.current.seekTo(message.data.time, true);
//         setIsPlaying(false);
//       }
//     });

//     return () => {
//       leave();
//     };
//   }, []);

//   const handlePlayPause = async () => {
//     if (!isHost) return; // Only host controls playback
//     const newPlayingState = !isPlaying;
//     const currentTime = await playerRef.current.getCurrentTime();

//     setIsPlaying(newPlayingState);

//     if (newPlayingState) {
//       publish({ action: 'play', time: currentTime });
//     } else {
//       publish({ action: 'pause', time: currentTime });
//     }
//   };

//   const handleToggleMic = () => {
//     if (localParticipant) {
//       toggleMic();
//     } else {
//       console.log('localParticipant is not yet available.');
//     }
//   };

//   return (
//     <View style={styles.meetingContainer}>
//       <YouTubeIframe
//         ref={playerRef}
//         height={300}
//         videoId={videoId}
//         play={isPlaying}
//         onReady={() => console.log('Video is ready')}
//       />
//       <View style={styles.controlsContainer}>
//         {isHost && (
//           <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
//         )}
//         <Button
//           title={localParticipant && localParticipant.micOn ? 'Mute' : 'Unmute'}
//           onPress={handleToggleMic}
//         />
//         <Button title="Leave Party" onPress={leave} />
//       </View>
//       <Text style={styles.participantsText}>Participants: {participants.size}</Text>
//     </View>
//   );
// };

// // Style definitions
// const styles = StyleSheet.create({
//   meetingContainer: {
//     flex: 1,
//     width: '100%',
//   },
//   controlsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   participantsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 18,
//   },
// });

// export default WatchPartyMeeting;
