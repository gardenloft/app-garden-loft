// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { WebView } from "react-native-webview";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// // Game data for carousel
// const gamesData = [
//   { id: '1', name: 'Word Game' },
//   { id: '2', name: 'Card Game' },
//   { id: '3', name: 'Trivia' },
//   { id: '4', name: 'Puzzle Game' },
//   { id: '5', name: 'Bluffy' },
//   { id: '6', name: 'Combat Game' },
// ];

// // Game URLs based on game names
// const gameUrls = {
//   "Word Game": "https://skribbl.io/",
//   "Card Game": "https://playingcards.io/",
//   "Trivia": "https://play.quizwitz.com/",
//   "Puzzle Game": "https://www.jigsawpuzzles.io/",
//   "Bluffy": "https://www.horsepaste.com/",
//   "Combat Game": "http://slither.io/"
// };

// const Games = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isGameModalVisible, setIsGameModalVisible] = useState(false);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const carouselRef = useRef(null);

//   // Function to open modal when a game is selected
//   const openGameModal = (game) => {
//     setIsLoading(true); // Simulate loading time
//     setSelectedGame(game);
//     setIsGameModalVisible(true);
//     setTimeout(() => setIsLoading(false), 1000); // Loading effect for 1 second
//   };

//   // Function to close the modal
//   const closeGameModal = () => {
//     setIsGameModalVisible(false);
//     setSelectedGame(null);
//   };

//   // Function to render each game in the carousel
//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         { backgroundColor: index === activeIndex ? "#f09030" : "#f09030" },
//         { transform: index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }] },
//         {
//           height: viewportWidth > viewportHeight
//             ? Math.round(viewportHeight * 0.3)
//             : Math.round(viewportHeight * 0.25),
//         },
//       ]}
//       onPress={() => openGameModal(item)}
//     >
//       <MaterialCommunityIcons name="gamepad-variant" size={94} color="white" />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           height: viewportWidth > viewportHeight ? 320 : 450,
//         },
//       ]}
//     >
//       {/* Modal for displaying game content */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isGameModalVisible}
//         onRequestClose={closeGameModal}
//       >
//         <View style={styles.modalView}>
//           {isLoading ? (
//             <ActivityIndicator size="large" color="orange" />
//           ) : (
//             <WebView
//               source={{ uri: gameUrls[selectedGame?.name] }}
//               style={{ width: viewportWidth * 0.9, height: viewportHeight * 0.7 }}
//             />
//           )}
//           <Pressable style={styles.closeButton} onPress={closeGameModal}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Carousel for displaying game options */}
//       <Carousel
//         ref={carouselRef}
//         data={gamesData}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         loop={true}
//         style={{ width: Math.round(viewportWidth * 0.9), height: Math.round(viewportWidth * 0.5) }}
//         onSnapToItem={(index) => setActiveIndex(index)}
//         scrollAnimationDuration={800}
//         snapEnabled
//       />

//       {/* Left navigation arrow */}
//       <Pressable
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: -1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-left" size={100} color="black" />
//       </Pressable>

//       {/* Right navigation arrow */}
//       <Pressable
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: 1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-right" size={100} color="black" />
//       </Pressable>
//     </View>
//   );
// };

// // Styles for the component
// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     backgroundColor: "#f09030",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//     padding: 20,
//     height: viewportHeight * 0.2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 18,
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   arrowLeft: {
//     position: "absolute",
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   modalView: {
//     margin: 10,
//     height: viewportHeight * 0.9,
//     width: viewportWidth * 0.95,
//     marginTop: 50,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 3,
//   },
//   modalText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 30,
//     right: 30,
//     backgroundColor: "lightblue",
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default Games;
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// Game data for carousel
const gamesData = [
  { id: '1', name: 'Word Wipe', url: 'https://games.aarp.org/games/word-wipe' },
  { id: '2', name: 'Daily Crossword', url: 'https://games.aarp.org/games/daily-crossword' },
  { id: '3', name: 'Classic Solitaire', url: 'https://games.aarp.org/games/solitaire-classic' },
  { id: '4', name: 'Mahjongg Dimensions', url: 'https://games.aarp.org/games/mahjongg-dimensions' },
  { id: '5', name: 'Sudoku', url: 'https://games.aarp.org/games/sudoku' },
  { id: '6', name: 'Blackjack', url: 'https://games.aarp.org/games/blackjack' },
];

const Games = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isGameModalVisible, setIsGameModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const carouselRef = useRef(null);

  const openGameModal = (game) => {
    setIsLoading(true); // Simulate loading time
    setSelectedGame(game);
    setIsGameModalVisible(true);
    setTimeout(() => setIsLoading(false), 1000); // Loading effect for 1 second
  };

  const closeGameModal = () => {
    setIsGameModalVisible(false);
    setSelectedGame(null);
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={styles.cardContainer}
      onPress={() => openGameModal(item)}
    >
      <MaterialCommunityIcons name="gamepad-variant" size={94} color="white" />
      <Text style={styles.cardText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGameModalVisible}
        onRequestClose={closeGameModal}
      >
        <View style={styles.modalView}>
          {isLoading ? (
            <ActivityIndicator size="large" color="orange" />
          ) : (
            <WebView
              source={{ uri: selectedGame?.url }}
              style={{ width: viewportWidth * 0.9, height: viewportHeight * 0.7 }}
            />
          )}
          <Pressable style={styles.closeButton} onPress={closeGameModal}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      <Carousel
        ref={carouselRef}
        data={gamesData}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        loop={true}
        style={{ width: Math.round(viewportWidth * 0.9), height: Math.round(viewportWidth * 0.5) }}
        onSnapToItem={(index) => setActiveIndex(index)}
        scrollAnimationDuration={800}
        snapEnabled
      />

      {/* Left Arrow */}
      <Pressable
        style={styles.arrowLeft}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="black" />
      </Pressable>

      {/* Right Arrow */}
      <Pressable
        style={styles.arrowRight}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="black" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    padding: 20,
    height: viewportHeight * 0.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    margin: 10,
    height: viewportHeight * 0.9,
    width: viewportWidth * 0.95,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
});

export default Games;



// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Modal,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { WebView } from "react-native-webview";
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
//   createCameraVideoTrack,
// } from "@videosdk.live/react-native-sdk";
// import { createMeeting, token } from "../components/api"; // Update the path as necessary
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// // Game data for carousel
// const gamesData = [
//   { id: '1', name: 'Word Game' },
//   { id: '2', name: 'Card Game' },
//   { id: '3', name: 'Trivia' },
//   { id: '4', name: 'Puzzle Game' },
//   { id: '5', name: 'Bluffy' },
//   { id: '6', name: 'Combat Game' },
// ];

// // Game URLs based on game names
// const gameUrls = {
//   "Word Game": "https://skribbl.io/",
//   "Card Game": "https://playingcards.io/",
//   "Trivia": "https://play.quizwitz.com/",
//   "Puzzle Game": "https://www.jigsawpuzzles.io/",
//   "Bluffy": "https://www.horsepaste.com/",
//   "Combat Game": "http://slither.io/"
// };

// const Games = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isGameModalVisible, setIsGameModalVisible] = useState(false);
//   const [selectedGame, setSelectedGame] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [meetingId, setMeetingId] = useState(null);
//   const [customVideoTrack, setCustomVideoTrack] = useState(null);
//   const carouselRef = useRef(null);
//   const auth = getAuth();

//   // Create a VideoSDK meeting when a game is opened
//   const openGameModal = async (game) => {
//     setIsLoading(true);
//     setSelectedGame(game);
//     const newMeetingId = await createMeeting({ token });
//     setMeetingId(newMeetingId);
//     setIsGameModalVisible(true);
//     setTimeout(() => setIsLoading(false), 1000);
//   };

//   // Close the game modal
//   const closeGameModal = () => {
//     setIsGameModalVisible(false);
//     setSelectedGame(null);
//   };

//   // Set up custom video track for VideoSDK
//   useEffect(() => {
//     const setupCustomTrack = async () => {
//       const track = await createCameraVideoTrack({
//         optimizationMode: "text",
//         encoderConfig: "h540p_w960p",
//         facingMode: "user",
//         multiStream: false,
//       });
//       setCustomVideoTrack(track);
//     };
//     setupCustomTrack();
//   }, []);

//   // Function to render each game in the carousel
//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         { backgroundColor: index === activeIndex ? "#f09030" : "#f09030" },
//         { transform: index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }] },
//         {
//           height: viewportWidth > viewportHeight
//             ? Math.round(viewportHeight * 0.3)
//             : Math.round(viewportHeight * 0.25),
//         },
//       ]}
//       onPress={() => openGameModal(item)}
//     >
//       <MaterialCommunityIcons name="gamepad-variant" size={94} color="white" />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           height: viewportWidth > viewportHeight ? 320 : 450,
//         },
//       ]}
//     >
//       {/* Modal for displaying game content */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isGameModalVisible}
//         onRequestClose={closeGameModal} // Close modal when back button is pressed
//       >
//         <View style={styles.modalView}>
//           {isLoading ? (
//             <ActivityIndicator size="large" color="orange" />
//           ) : (
//             <View style={{ width: viewportWidth * 0.9, height: viewportHeight * 0.7 }}>
//               <WebView source={{ uri: gameUrls[selectedGame?.name] }} />
//               {/* Video SDK integration for video bubbles */}
//               <MeetingProvider
//                 config={{
//                   meetingId: meetingId,
//                   micEnabled: true,
//                   webcamEnabled: false,
//                   name: auth.currentUser?.displayName || "Guest",
//                   customCameraVideoTrack: customVideoTrack,
//                 }}
//                 token={token}
//                 joinWithoutUserInteraction={true}
//               >
//                 <VideoMeetingBubble meetingId={meetingId} />
//               </MeetingProvider>
//             </View>
//           )}
//           <Pressable style={styles.closeButton} onPress={closeGameModal}>
//             <Text style={styles.closeText}>Close</Text> 
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Carousel for displaying game options */}
//       <Carousel
//         ref={carouselRef}
//         data={gamesData}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         loop={true}
//         style={{ width: Math.round(viewportWidth * 0.9), height: Math.round(viewportWidth * 0.5) }}
//         onSnapToItem={(index) => setActiveIndex(index)}
//         scrollAnimationDuration={800}
//         snapEnabled
//       />

//       {/* Left navigation arrow */}
//       <Pressable
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: -1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-left" size={100} color="black" />
//       </Pressable>

//       {/* Right navigation arrow */}
//       <Pressable
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: 1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-right" size={100} color="black" />
//       </Pressable>
//     </View>
//   );
// };

// export default Games;

