// import React, { useState } from 'react';
// import { View, Button, StyleSheet } from 'react-native';
// import { MeetingProvider } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from '../components/api';
// import WatchPartyMeeting from './WatchPartyMeeting';

// const WatchParty = () => {
//   const [meetingId, setMeetingId] = useState(null);

//   const handleCreateMeeting = async () => {
//     try {
//       const newMeetingId = await createMeeting({ token });
//       setMeetingId(newMeetingId);
//     } catch (error) {
//       console.error('Error creating meeting:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {meetingId ? (
//         <MeetingProvider
//           config={{
//             meetingId,
//             micEnabled: true,
//             webcamEnabled: false,
//             name: "Participant's name",
//           }}
//           token={token}
//         >
//           <WatchPartyMeeting />
//         </MeetingProvider>
//       ) : (
//         <Button title="Create Watch Party" onPress={handleCreateMeeting} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default WatchParty;

// This is the code below that you can comment in if you work on this again 

// import React, { useState } from 'react';
// import { View, Button, Text, StyleSheet, TextInput, Alert } from 'react-native';
// import { MeetingProvider } from '@videosdk.live/react-native-sdk';
// import { createMeeting, token } from '../components/api'; // Adjust your path
// import WatchPartyMeeting from './WatchPartyMeeting'; // The watch party video player component

// const WatchParty = () => {
//   const [meetingId, setMeetingId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [videoId, setVideoId] = useState(''); // Video ID for YouTube
//   const [isHost, setIsHost] = useState(true); // For host control

//   const handleCreateMeeting = async () => {
//     setIsLoading(true);
//     try {
//       const newMeetingId = await createMeeting({ token });
//       if (newMeetingId) {
//         setMeetingId(newMeetingId);
//       } else {
//         Alert.alert('Error', 'Failed to create meeting');
//       }
//     } catch (error) {
//       console.error('Error creating meeting:', error);
//       Alert.alert('Error', 'Could not create watch party.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Garden Loft Watch Party 🎉</Text>

//       {/* Host selects the content */}
//       {isHost && !meetingId && (
//         <View style={styles.inputSection}>
//           <TextInput
//             placeholder="Enter YouTube Video ID"
//             style={styles.input}
//             value={videoId}
//             onChangeText={setVideoId}
//           />
//           <Button
//             title={isLoading ? 'Creating...' : 'Start Watch Party'}
//             onPress={handleCreateMeeting}
//             disabled={isLoading || !videoId}
//           />
//         </View>
//       )}

//       {/* Watch Party Meeting */}
//       {meetingId && videoId ? (
//         <MeetingProvider meetingId={meetingId} token={token}>
//           <WatchPartyMeeting videoId={videoId} isHost={isHost} />
//         </MeetingProvider>
//       ) : null}
//     </View>
//   );
// };

// // Style definitions
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   inputSection: {
//     marginBottom: 20,
//     width: '100%',
//     alignItems: 'center',
//   },
//   input: {
//     width: '80%',
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
// });

// export default WatchParty;
