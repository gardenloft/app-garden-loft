// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Image,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { collection, getDocs } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useRouter } from "expo-router";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const VideoCall = () => {
//   const [userNames, setUserNames] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollViewRef = useRef(null);
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       fetchFriends(user.uid);
//     }
//   }, [user]);

//   // Function to fetch friends from the Firestore friends collection
//   const fetchFriends = async (userId) => {
//     try {
//       const querySnapshot = await getDocs(
//         collection(FIRESTORE_DB, `users/${userId}/friends`)
//       );
//       const fetchedUserNames = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name,
//         pushToken: doc.data().pushToken,
//         uid: doc.id,
//         imageUrl: doc.data().imageUrl,
//       }));
//       setUserNames(fetchedUserNames);
//     } catch (error) {
//       console.error("Error fetching friends: ", error);
//     }
//   };

//   // Function to initiate a video call
//   const startVideoCall = async (calleeUid) => {
//     router.push({
//       pathname: "/VideoSDK2",
//       params: { calleeUid: calleeUid },
//     });
//   };

//   const handleSnapToItem = (index) => {
//     setActiveIndex(index);
//   };

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
//           transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => startVideoCall(item.uid)}>
//       <Image source={item.imageUrl} style={styles.image} />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}>
//       <Carousel
//         data={userNames}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         snapEnabled
//         scrollAnimationDuration={800}
//         onSnapToItem={handleSnapToItem}
//         ref={scrollViewRef}
//       />
//       {/* <Text style={styles.prompt}>{userNames[activeIndex]?.name}</Text> */}

//       <TouchableOpacity
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: -1, animated: true });
//         }}>
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: 1, animated: true });
//         }}>
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 30,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   prompt: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     marginTop: 15,
//   },
//   arrowLeft: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
// });

// export default VideoCall;

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Ensure onAuthStateChanged is imported
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { callUser } from "../app/VideoSDK2"; 

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const VideoCall = ({calleeName}) => {
  const [userNames, setUserNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false); 
  const [user, setUser] = useState(null); // Track the authenticated user state
  const auth = getAuth();
  const router = useRouter();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
        fetchFriends(authenticatedUser.uid); // Fetch friends only after authentication
      } else {
        setUser(null); // Reset user state on logout
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  // Function to fetch friends from the Firestore friends collection
  const fetchFriends = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, `users/${userId}/friends`));
      const fetchedUserNames = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        pushToken: doc.data().pushToken,
        uid: doc.id,
        imageUrl: doc.data().imageUrl,
      }));
      setUserNames(fetchedUserNames);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  // Function to initiate a video call
  const startVideoCall = async (calleeUid) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsCalling(true);
    setIsDeclined(false);  // Reset the decline state when starting a new call
    await callUser(calleeUid, user); // Pass the authenticated user

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const { accept, decline, meetingId } = notification.request.content.data;
      if (accept) {
        setIsCalling(false);
        onCalleeAccept(meetingId);
      } else if (decline) {;
        setIsCalling(false);
        setIsDeclined(true); 
      }
    });

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
    };
  };

  const onCalleeAccept = (meetingId) => {
    router.push({
      pathname: "/VideoSDK2",
      params: { meetingId, autoJoin: true },
    });
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
          transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
          height:
                      viewportWidth > viewportHeight
                        ? Math.round(Dimensions.get("window").height * 0.3)
                        : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      onPress={() => startVideoCall(item.uid)}
    >
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
              styles.container,
              { height: viewportWidth > viewportHeight ? 320 : 450 },
            ]}>
      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
                style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }}
        onSnapToItem={handleSnapToItem}
                snapEnabled
        scrollAnimationDuration={800}
        ref={scrollViewRef}
      />

       {/* Calling message modal */}
      <Modal animationType="fade" transparent={true} visible={isCalling}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#f3b718" />
          <Text style={styles.modalText}>Calling...</Text>
        </View>
      </Modal>


 {/* Decline message modal */}
      <Modal animationType="slide" transparent={true} visible={isDeclined}>
        <View style={styles.modalContainer}>
        <Image source={require('../assets/garden-loft-logo2.png')} style={styles.logo} />
          {/* <Text style={styles.modalText}>{`${calleeName} is not available right now`}</Text> */}
          <Text style={styles.modalText}>{`They are not available right now`}</Text>
          <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={() => {
          setIsDeclined(false);
        }}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
        </View>
        
      </Modal>
      <TouchableOpacity
        style={[
                    styles.arrowLeft,
                    {
                      left: viewportWidth > viewportHeight ? -17 : -22,
                      top: viewportWidth > viewportHeight ? "40%" : "30%",
                    },
                  ]}
        onPress={() => scrollViewRef.current?.scrollTo({ count: -1, animated: true })}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity
                style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() => scrollViewRef.current?.scrollTo({ count: 1, animated: true })}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    position: "relative",
    alignItems: "center",
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginLeft: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.05,
    shadowRadius: 5.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 30,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
  },
  modalText: {
    fontSize: 40,
    color: "black",
    marginTop: 20,
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  button: {
    padding: 20,
    borderRadius: 10,
  },
  dismissButton: {
    backgroundColor: 'orange',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  }
};

export default VideoCall;
