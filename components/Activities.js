// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   ActivityIndicator,
//   Button,
//   Platform,
// } from "react-native";
// import axios from "axios";
// import Carousel from "react-native-reanimated-carousel";
// import moment from "moment-timezone";
// import { FontAwesome } from "@expo/vector-icons";
// import { getAuth } from "firebase/auth";
// import * as Notifications from "expo-notifications";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { WebView } from "react-native-webview";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const ZoomMeetingWebView = ({ zoomLink, onMeetingLeave }) => {
//   const handleNavigationStateChange = (navState) => {
//     const { url } = navState;

//     if (url.startsWith("zoomus://")) {
//       Alert.alert(
//         "Error",
//         "Cannot open the Zoom app. Please stay within the browser."
//       );
//       return false;
//     }

//     if (url.includes("leave")) {
//       onMeetingLeave();
//     }
//   };

//   return (
//     <WebView
//       source={{ uri: zoomLink }}
//       style={styles.webViewStyle}
//       javaScriptEnabled={true}
//       domStorageEnabled={true}
//       startInLoadingState={true}
//       allowsInlineMediaPlayback={true}
//       onNavigationStateChange={handleNavigationStateChange}
//       onError={(syntheticEvent) => {
//         const { nativeEvent } = syntheticEvent;
//         console.warn("WebView error: ", nativeEvent);
//         Alert.alert(
//           "Error",
//           "Failed to load the Zoom meeting. Please try again."
//         );
//       }}
//     />
//   );
// };

// const Activities = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showWebView, setShowWebView] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const auth = getAuth();
//   const user = auth.currentUser;
//   const carouselRef = useRef(null);
//   const scrollViewRef = useRef(null);

//   useEffect(() => {
//     if (user) {
//       fetchUserNameAndEvents(user.uid);
//     } else {
//       setError("User not signed in");
//       setLoading(false);
//     }

//     const foregroundSubscription =
//       Notifications.addNotificationReceivedListener((notification) => {
//         Alert.alert("Notification Received", notification.request.content.body);
//       });

//     const responseSubscription =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         Alert.alert("Garden Loft", response.notification.request.content.body);
//       });

//     return () => {
//       foregroundSubscription.remove();
//       responseSubscription.remove();
//     };
//   }, [user]);

//   async function fetchUserNameAndEvents(uid) {
//     try {
//       const userRef = doc(FIRESTORE_DB, "users", uid);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const userName = userData.userName;
//         if (Platform.OS !== "web") {
//           registerForPushNotificationsAsync();
//         }
//         fetchEvents(userName);
//       } else {
//         throw new Error("No user data found");
//       }
//     } catch (error) {
//       setError("Failed to retrieve user data. Please try again later.");
//       setLoading(false);
//     }
//   }

//   async function fetchEvents(userName) {
//     try {
//       const response = await axios.get(
//         "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//       );
//       const currentTime = new Date();

//       const eventData = response.data.data.signup
//         .filter((item) => item.firstname === userName)
//         .map((item) => ({
//           item: item.item,
//           startDate: moment
//             .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
//             .toDate(),
//           endDate: item.enddatestring
//             ? moment
//                 .tz(
//                   item.enddatestring.replace(/-/g, "T"),
//                   "YYYY/MM/DD HH:mm:ss",
//                   ""
//                 )
//                 .toDate()
//             : undefined,
//           zoomLink:
//             item.location === "Zoom Meeting"
//               ? `https://us06web.zoom.us/wc/join/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09`
//               : null,
//         }))
//         .filter(
//           (event) =>
//             (event.endDate && currentTime < event.endDate) || // Keep if the current time is before the event's end date
//             (!event.endDate && currentTime < event.startDate) // Or if no endDate, keep if the event hasn't started yet
//         );

//       eventData.sort((a, b) => a.startDate - b.startDate);

//       eventData.forEach((event) => {
//         if (Platform.OS !== "web") {
//           scheduleNotification(event);
//         }
//       });

//       setEvents(eventData);
//       setLoading(false);
//     } catch (error) {
//       setError("Failed to retrieve signed-up activities. Please try again later.");
//       setLoading(false);
//     }
//   }

//   // async function fetchEvents(userName) {
//   //   try {
//   //     const response = await axios.get(
//   //       "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//   //     );
//   //     const currentTime = new Date();
//   //     const eventData = response.data.data.signup
//   //       .filter((item) => item.firstname === userName)
//   //       .map((item) => ({
//   //         item: item.item,
//   //         startDate: moment
//   //           .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
//   //           .toDate(),
//   //         endDate: item.enddatestring
//   //           ? moment
//   //               .tz(
//   //                 item.enddatestring.replace(/-/g, "T"),
//   //                 "YYYY/MM/DD HH:mm:ss",
//   //                 ""
//   //               )
//   //               .toDate()
//   //           : undefined,
//   //         zoomLink:
//   //           item.location === "Zoom Meeting"
//   //             ? `https://us06web.zoom.us/wc/join/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09`
//   //             : null,
//   //       }));

//   //     eventData.sort((a, b) => a.startDate - b.startDate);

//   //     eventData.forEach((event) => {
//   //       if (Platform.OS !== "web") {
//   //         scheduleNotification(event);
//   //       }
//   //     });

//   //     setEvents(eventData);
//   //     setLoading(false);
//   //   } catch (error) {
//   //     setError(
//   //       "Failed to retrieve signed-up activities. Please try again later."
//   //     );
//   //     setLoading(false);
//   //   }
//   // }

//   async function registerForPushNotificationsAsync() {
//     const settings = await Notifications.getPermissionsAsync();
//     if (
//       settings.granted ||
//       settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
//     ) {
//       console.log("Notification permissions granted.");
//     } else {
//       const response = await Notifications.requestPermissionsAsync({
//         ios: {
//           allowAlert: true,
//           allowSound: true,
//           allowBadge: true,
//           allowDisplayInCarPlay: true,
//           allowCriticalAlerts: true,
//         },
//       });
//       if (!response.granted) {
//         alert("Failed to get push token for push notification!");
//         return;
//       }
//     }

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         sound: "default",
//       });
//     }
//   }

//   const navigateToZoomLink = (event) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//   };

//   const closeWebView = () => {
//     setShowWebView(false);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedEvent(null);
//   };

//   const handleJoinMeeting = (event) => {
//     setIsModalOpen(false);
//     setShowWebView(true);
//   };

//   const renderModalContent = (event) => {
//     const currentTime = new Date();
//     const tenMinutesBeforeStartTime = new Date(event.startDate);
//     tenMinutesBeforeStartTime.setMinutes(
//       tenMinutesBeforeStartTime.getMinutes() - 10
//     );

//     if (event.endDate && currentTime > event.endDate) {
//       return <Text>Event ended.</Text>;
//     } else if (currentTime < tenMinutesBeforeStartTime) {
//       return <Text>Event has not started yet.</Text>;
//     } else if (
//       currentTime >= tenMinutesBeforeStartTime &&
//       currentTime < event.endDate
//     ) {
//       return (
//         <Button
//           style={[styles.modalJoinNow]}
//           title="Join Now"
//           onPress={() => handleJoinMeeting(event)}
//         />
//       );
//     } else {
//       return <Button title="Event in progress" disabled />;
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={index}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: index === activeIndex ? "#f09030" : "#f09030",
//           transform: index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => navigateToZoomLink(item)}>
//       <Text style={styles.cardText}>{item.item}</Text>
//       <Text style={styles.cardTextTime}>
//         {moment(item.startDate).format("dddd MMMM Do, h:mm a")}
//       </Text>
//     </Pressable>
//   );

//   const handleSnapToItem = (index) => {
//     setActiveIndex(index);
//   };

//   const scheduleNotification = async (event) => {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Upcoming Activity!",
//         body: `Your activity ${event.item} is starting in 10 minutes.`,
//         sound: true,
//         data: { event },
//       },
//       trigger: {
//         date: new Date(event.startDate.getTime() - 10 * 60 * 1000),
//       },
//     });

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "Upcoming Activity!",
//         body: `Your activity ${event.item} is starting now.`,
//         sound: true,
//         data: { event },
//       },
//       trigger: {
//         date: new Date(event.startDate.getTime() - 60 * 1000),
//       },
//     });
//   };

//   const handleArrowPress = (direction) => {
//     let newIndex = activeIndex;
//     if (direction === "left") {
//       newIndex = (activeIndex - 1 + events.length) % events.length;
//     } else if (direction === "right") {
//       newIndex = (activeIndex + 1) % events.length;
//     }
//     carouselRef.current?.scrollTo({ index: newIndex, animated: true });
//     setActiveIndex(newIndex);
//   };

//   return (
//     <View  style={[
//       styles.container,
//       { height: viewportWidth > viewportHeight ? 320 : 450 },
//     ]}>
//       {loading ? (
//         <ActivityIndicator size="large" color="orange" style={styles.loading} />
//       ) : error ? (
//         <Text style={styles.loading}>Error: {error}</Text>
//       ) : showWebView && selectedEvent ? (
//         <View style={styles.webViewModal}>
//           <View style={styles.webViewContainer}>
//             <ZoomMeetingWebView
//               zoomLink={selectedEvent.zoomLink}
//               onMeetingLeave={closeWebView}
//             />
//             <Pressable style={styles.closeButton1} onPress={closeWebView}>
//               {/* <Text style={styles.closeButtonText}>Close</Text> */}
//               <FontAwesome name="close" size={24} color="black" />
//             </Pressable>
//           </View>
//         </View>
//       ) : (

//           <View
//             style={[
//               styles.container,
//               { height: viewportWidth > viewportHeight ? 320 : 450 },
//             ]}>
//             <Carousel
//               ref={carouselRef}
//               // ref={scrollViewRef}
//               data={events}
//               // layout={"default"}
//               renderItem={renderItem}
//               width={Math.round(viewportWidth * 0.3)}
//               height={Math.round(viewportHeight * 0.3)}
//               style={{
//                 width: Math.round(viewportWidth * 0.9),
//                 height: Math.round(viewportHeight * 0.5),
//               }}
//               itemWidth={Math.round(viewportWidth * 0.3)}
//               loop={true}
//               useScrollView={true}
//               activeSlideAlignment="center"
//               onSnapToItem={(index) => handleSnapToItem(index)}
//               scrollAnimationDuration={800}
//             />
//             <Pressable
//               style={[
//                 styles.arrowLeft,
//                 {
//                   left: viewportWidth > viewportHeight ? -17 : -22,
//                   top: viewportWidth > viewportHeight ? "40%" : "30%",
//                 },
//               ]}
//               onPress={() => {
//                 handleArrowPress("left");
//               }}>
//               <FontAwesome
//                 name="angle-left"
//                 size={100}
//                 color="rgb(45, 62, 95)"
//               />
//             </Pressable>
//             <Pressable
//               style={[
//                 styles.arrowRight,
//                 {
//                   right: viewportWidth > viewportHeight ? -25 : -22,
//                   top: viewportWidth > viewportHeight ? "40%" : "30%",
//                 },
//               ]}
//               onPress={() => {
//                 handleArrowPress("right");
//               }}>
//               <FontAwesome
//                 name="angle-right"
//                 size={100}
//                 color="rgb(45, 62, 95)"
//               />
//             </Pressable>
//             {isModalOpen && selectedEvent && (
//               <View style={styles.modalContainer}>
//                 <View style={styles.modal}>
//                   <Text>{selectedEvent.item}</Text>
//                   {selectedEvent.endDate && (
//                     <Text>
//                       End Date:{" "}
//                       {moment(selectedEvent.endDate).format(
//                         "dddd MMMM Do, h:mm a"
//                       )}
//                     </Text>
//                   )}
//                   {renderModalContent(selectedEvent)}
//                   <Pressable onPress={closeModal} style={styles.closeButton}>
//                     <Text>Close</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             )}
//           </View>

//       )}
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
//     backgroundColor: "#f09030",
//     borderRadius: 20,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//     marginLeft: 0,
//     // flexDirection: "column",
//     gap: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 7 },
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
//   cardTextTime: {
//     fontSize: 20,
//     color: "#393939",
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   arrowLeft: {
//     position: "absolute",
//     left: -22,
//     top: "30%",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     right: -22,
//     top: "30%",
//     transform: [{ translateY: -50 }],
//   },
//   loading: {
//     flex: 1,
//     alignItems: "flex-start",
//     fontSize: 44,
//   },
//   modalContainer: {
//     position: "absolute",
//     bottom: "70%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     padding: 20,
//     borderRadius: 10,
//   },
//   modal: {
//     backgroundColor: "beige",
//     padding: 60,
//     borderRadius: 10,
//   },
//   modalJoinNow: {
//     backgroundColor: "blue",
//     fontSize: 20,
//   },
//   closeButton: {
//     marginTop: 10,
//     backgroundColor: "gray",
//     paddingVertical: 10,
//     paddingHorizontal: 200,
//     borderRadius: 5,
//   },
//   closeButton1: {
//     position: "absolute",
//     top: 30,
//     right: 30,
//     backgroundColor: "lightblue",
//     padding: 13,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   webViewStyle: {
//     flex: 1,
//     width: viewportWidth * 0.9,
//     height: viewportHeight * 0.7,
//   },
//   webViewModal: {
//     position: "absolute",
//     bottom: "10%",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   webViewContainer: {
//     margin: 10,
//     height: viewportHeight * 0.9,
//     width: viewportWidth * 0.95,
//     marginTop: 50,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     paddingTop: 100,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     alignSelf: "center",
//   },
// });

// export default Activities;
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Button,
  Platform,
} from "react-native";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import moment from "moment-timezone";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import * as Notifications from "expo-notifications";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getDoc,collection, query, where, getDocs, updateDoc, addDoc, doc} from "firebase/firestore";
import { WebView } from "react-native-webview";
import { Image } from 'react-native';

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const ZoomMeetingWebView = ({ zoomLink, onMeetingLeave }) => {
  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (url.startsWith("zoomus://")) {
      Alert.alert(
        "Error",
        "Cannot open the Zoom app. Please stay within the browser."
      );
      return false;
    }

    if (url.includes("leave")) {
      onMeetingLeave();
    }
  };

  return (
    <WebView
      source={{ uri: zoomLink }}
      style={styles.webViewStyle}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      allowsInlineMediaPlayback={true}
      onNavigationStateChange={handleNavigationStateChange}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("WebView error: ", nativeEvent);
        Alert.alert(
          "Error",
          "Failed to load the Zoom meeting. Please try again."
        );
      }}
    />
  );
};

const Activities = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;
  const carouselRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUserNameAndEvents(user.uid);
    } else {
      setError("User not signed in");
      setLoading(false);
    }

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        Alert.alert("Notification Received", notification.request.content.body);
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        Alert.alert("Garden Loft", response.notification.request.content.body);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [user]);

  async function fetchUserNameAndEvents(uid) {
    try {
      const userRef = doc(FIRESTORE_DB, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userName = userData.userName;
        if (Platform.OS !== "web") {
          registerForPushNotificationsAsync();
        }
        fetchEventsAndSaveToFirestore(userName);
      } else {
        throw new Error("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to retrieve user data. Please try again later.");
      setLoading(false);
    }
  }

//   async function fetchEventsAndSaveToFirestore(userName) {
//     try {
//       const response = await axios.get(
//         "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//       );
   

//       const currentTime = new Date();
  
//       const eventData = response.data.data.signup
//         .filter((item) => item.firstname === userName)
//         .map((item) => ({
//           item: item.item,
         
//           startDate: moment
//             .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
//             .toDate(),
//           endDate: item.enddatestring
//             ? moment
//                 .tz(
//                   item.enddatestring.replace(/-/g, "T"),
//                   "YYYY/MM/DD HH:mm:ss",
//                   ""
//                 )
//                 .toDate()
//             : undefined,
//           zoomLink:
//             item.location === "Zoom Meeting"
//               ? `https://us06web.zoom.us/wc/join/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09`
//               : null,
             
              
//         }))
        
//         .filter(
//           (event) =>
//             (event.endDate && currentTime < event.endDate) || // Keep if the current time is before the event's end date
//             (!event.endDate && currentTime < event.startDate) // Or if no endDate, keep if the event hasn't started yet
//         );
        
//         if (eventData.length === 0) {
//           throw new Error("No upcoming events found.");
//         }
  
//       eventData.sort((a, b) => a.startDate - b.startDate);

//    // Save or update each event in Firestore
//   for (const event of eventData) {
//     const q = query(collection(FIRESTORE_DB, "events"), where("item", "==", event.item));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       // Event does not exist, add it
//       await addDoc(collection(FIRESTORE_DB, "events"), {
//         ...event,
//         isNew: true,
//         imageUrl: '' // Initialize with empty string
//       });
//     } else {
//       // Event exists, update it
//       querySnapshot.forEach(async (docSnapshot) => {
//         const existingEvent = docSnapshot.data();
//         const eventDoc = doc(FIRESTORE_DB, "events", docSnapshot.id);
//         await updateDoc(eventDoc, {
//           ...event,
//           isNew: false,
//           imageUrl: existingEvent.imageUrl || '' // Preserve existing imageUrl if any
//         });
//       });
//     }
//   }

//   // Fetch all events from Firestore to include manually added imageUrls
//   const eventsSnapshot = await getDocs(collection(FIRESTORE_DB, "events"));
//   const updatedEvents = eventsSnapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data()
//   }));

//   // Schedule event notifications
//   updatedEvents.forEach((event) => {
//     if (Platform.OS !== "web") {
//       scheduleNotification(event);
//     }
//   });

//   setEvents(updatedEvents);
//   setLoading(false);
// } catch (error) {
//   console.error("Error fetching events: ", error.message);
//   setError("Failed to retrieve signed-up activities. Please try again later.");
//   setLoading(false);
// }
//   }
async function fetchEventsAndSaveToFirestore(userName) {
  try {
    const response = await axios.get(
      "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
    );

    const currentTime = new Date();

    const eventData = response.data.data.signup
      .filter((item) => item.firstname === userName)
      .map((item) => {
        // Parse dates carefully, considering AM/PM
        let startDate, endDate;
        try {
          // Assuming the API returns time in 12-hour format with AM/PM indicator
          startDate = moment.tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "").toDate();
          endDate = item.enddatestring
            ? moment.tz(item.enddatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm:ss", "").toDate()
            : undefined;
          
          

          // Log parsed dates for debugging
          console.log(`Parsed startDate: ${startDate}, endDate: ${endDate}`);
        } catch (error) {
          console.error("Error parsing date for item:", item, error);
          // Set to current date if parsing fails, to avoid breaking the app
          startDate = new Date();
          endDate = new Date();
        }

        return {
          item: item.item,
          startDate,
          endDate,
          zoomLink:
            item.location === "Zoom Meeting"
              ? `https://us06web.zoom.us/wc/join/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09`
              : null,
        };
      })
      .filter(
        (event) =>
          (event.endDate && currentTime < event.endDate) ||
          (!event.endDate && currentTime < event.startDate)
      );

    if (eventData.length === 0) {
      throw new Error("No upcoming events found.");
    }

    eventData.sort((a, b) => a.startDate - b.startDate);

    // Save or update each event in Firestore
    for (const event of eventData) {
      const q = query(collection(FIRESTORE_DB, "events"), where("item", "==", event.item));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Event does not exist, add it
        await addDoc(collection(FIRESTORE_DB, "events"), {
          ...event,
          isNew: true,
          imageUrl: '' // Initialize with empty string
        });
      } else {
        // Event exists, update it
        querySnapshot.forEach(async (docSnapshot) => {
          const existingEvent = docSnapshot.data();
          const eventDoc = doc(FIRESTORE_DB, "events", docSnapshot.id);
          await updateDoc(eventDoc, {
            ...event,
            isNew: false,
            imageUrl: existingEvent.imageUrl || '' // Preserve existing imageUrl if any
          });
        });
      }
    }

    // Fetch all events from Firestore to include manually added imageUrls
    const eventsSnapshot = await getDocs(collection(FIRESTORE_DB, "events"));
    const updatedEvents = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure dates are properly converted back to Date objects
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate ? doc.data().endDate.toDate() : undefined
    }));

    // Schedule event notifications
    updatedEvents.forEach((event) => {
      if (Platform.OS !== "web") {
        scheduleNotification(event);
      }
    });

    setEvents(updatedEvents);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching events: ", error.message);
    setError("Failed to retrieve signed-up activities. Please try again later.");
    setLoading(false);
  }
}
  // async function fetchEvents(userName) {
  //   try {
  //     const response = await axios.get(
  //       "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
  //     );
  //     const currentTime = new Date();
  //     const eventData = response.data.data.signup
  //       .filter((item) => item.firstname === userName)
  //       .map((item) => ({
  //         item: item.item,
  //         startDate: moment
  //           .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
  //           .toDate(),
  //         endDate: item.enddatestring
  //           ? moment
  //               .tz(
  //                 item.enddatestring.replace(/-/g, "T"),
  //                 "YYYY/MM/DD HH:mm:ss",
  //                 ""
  //               )
  //               .toDate()
  //           : undefined,
  //         zoomLink:
  //           item.location === "Zoom Meeting"
  //             ? `https://us06web.zoom.us/wc/join/87666824017?pwd=RUZLSFVabjhtWjJVSm1CcDZsZXcrUT09`
  //             : null,
  //       }));

  //     eventData.sort((a, b) => a.startDate - b.startDate);

  //     eventData.forEach((event) => {
  //       if (Platform.OS !== "web") {
  //         scheduleNotification(event);
  //       }
  //     });

  //     setEvents(eventData);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(
  //       "Failed to retrieve signed-up activities. Please try again later."
  //     );
  //     setLoading(false);
  //   }
  // }

  async function registerForPushNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    if (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      console.log("Notification permissions granted.");
    } else {
      const response = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: true,
        },
      });
      if (!response.granted) {
        alert("Failed to get push token for push notification!");
        return;
      }
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });
    }
  }

  const navigateToZoomLink = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleJoinMeeting = (event) => {
    setIsModalOpen(false);
    setShowWebView(true);
  };

  const renderModalContent = (event) => {
    const currentTime = new Date();
    const tenMinutesBeforeStartTime = new Date(event.startDate);
    tenMinutesBeforeStartTime.setMinutes(
      tenMinutesBeforeStartTime.getMinutes() - 10
    );

    if (event.endDate && currentTime > event.endDate) {
      return <Text>Event ended.</Text>;
    } else if (currentTime < tenMinutesBeforeStartTime) {
      return <Text>Event has not started yet.</Text>;
    } else if (
      currentTime >= tenMinutesBeforeStartTime &&
      currentTime < event.endDate
    ) {
      return (
        <Button
          style={[styles.modalJoinNow]}
          title="Join Now"
          onPress={() => handleJoinMeeting(event)}
        />
      );
    } else {
      return <Button title="Event in progress" disabled />;
    }
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={index}
      style={[
        styles.cardContainer,
        {
          backgroundColor: index === activeIndex ? "transparent" : "transparent",
          transform: index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }],
        },
        {
          height:
            viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      onPress={() => navigateToZoomLink(item)}>
      <Image
      source={item.imageUrl ? { uri: item.imageUrl } : require("../assets/images/garden-loft-logo-outline.png")} // Use the image URL or fallback
      style={styles.cardImage} // Style the image
      resizeMode="contain" // Optional: Adjust image resizing behavior
    />
      <Text style={styles.cardText}>{item.item}</Text>
      <Text style={styles.cardTextTime}>
        {moment(item.startDate).format("dddd MMMM Do, h:mm a")}
      </Text>
    </Pressable>
  );

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const scheduleNotification = async (event) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Activity!",
        body: `Your activity ${event.item} is starting in 10 minutes.`,
        sound: true,
        data: { event },
      },
      trigger: {
        date: new Date(event.startDate.getTime() - 10 * 60 * 1000),
      },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Activity!",
        body: `Your activity ${event.item} is starting now.`,
        sound: true,
        data: { event },
      },
      trigger: {
        date: new Date(event.startDate.getTime() - 60 * 1000),
      },
    });
  };

  const handleArrowPress = (direction) => {
    let newIndex = activeIndex;
    if (direction === "left") {
      newIndex = (activeIndex - 1 + events.length) % events.length;
    } else if (direction === "right") {
      newIndex = (activeIndex + 1) % events.length;
    }
    carouselRef.current?.scrollTo({ index: newIndex, animated: true });
    setActiveIndex(newIndex);
  };

  return (
    <View  style={[
      styles.container,
      { height: viewportWidth > viewportHeight ? 320 : 450 },
    ]}>
      {loading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loading} />
      ) : error ? (
        <Text style={styles.loading}>Error: {error}</Text>
      ) : showWebView && selectedEvent ? (
        <View style={styles.webViewModal}>
          <View style={styles.webViewContainer}>
            <ZoomMeetingWebView
              zoomLink={selectedEvent.zoomLink}
              onMeetingLeave={closeWebView}
            />
            <Pressable style={styles.closeButton1} onPress={closeWebView}>
              {/* <Text style={styles.closeButtonText}>Close</Text> */}
              <FontAwesome name="close" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      ) : (
        
          <View
            style={[
              styles.container,
              { height: viewportWidth > viewportHeight ? 320 : 450 },
            ]}>
            <Carousel
              ref={carouselRef}
              // ref={scrollViewRef}
              data={events}
              // layout={"default"}
              renderItem={renderItem}
              width={Math.round(viewportWidth * 0.3)}
              height={Math.round(viewportHeight * 0.3)}
              style={{
                width: Math.round(viewportWidth * 0.9),
                height: Math.round(viewportHeight * 0.5),
              }}
              itemWidth={Math.round(viewportWidth * 0.3)}
              loop={true}
              useScrollView={true}
              activeSlideAlignment="center"
              onSnapToItem={(index) => handleSnapToItem(index)}
              scrollAnimationDuration={800}
            />
            <Pressable
              style={[
                styles.arrowLeft,
                {
                  left: viewportWidth > viewportHeight ? -17 : -22,
                  top: viewportWidth > viewportHeight ? "40%" : "30%",
                },
              ]}
              onPress={() => {
                handleArrowPress("left");
              }}>
              <FontAwesome
                name="angle-left"
                size={100}
                color="rgb(45, 62, 95)"
              />
            </Pressable>
            <Pressable
              style={[
                styles.arrowRight,
                {
                  right: viewportWidth > viewportHeight ? -25 : -22,
                  top: viewportWidth > viewportHeight ? "40%" : "30%",
                },
              ]}
              onPress={() => {
                handleArrowPress("right");
              }}>
              <FontAwesome
                name="angle-right"
                size={100}
                color="rgb(45, 62, 95)"
              />
            </Pressable>
            {isModalOpen && selectedEvent && (
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  <Text>{selectedEvent.item}</Text>
                  {selectedEvent.endDate && (
                    <Text>
                      End Date:{" "}
                      {moment(selectedEvent.endDate).format(
                        "dddd MMMM Do, h:mm a"
                      )}
                    </Text>
                  )}
                  {renderModalContent(selectedEvent)}
                  <Pressable onPress={closeModal} style={styles.closeButton}>
                    <Text>Close</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        
      )}
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
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginLeft: 0,
    // flexDirection: "column",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardImage: {
    width: viewportWidth * 0.25,
    height: viewportWidth * 0.2,
    margin: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
  cardText: {
    fontSize: 30,
    color: "trans",
    fontWeight: "700",
    textAlign: "center",
  },
  cardTextTime: {
    fontSize: 25,
    color: "#393939",
    fontWeight: "600",
    textAlign: "center",
  },
  arrowLeft: {
    position: "absolute",
    left: -22,
    top: "30%",
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    right: -22,
    top: "30%",
    transform: [{ translateY: -50 }],
  },
  loading: {
    flex: 1,
    alignItems: "flex-start",
    fontSize: 44,
  },
  modalContainer: {
    position: "absolute",
    bottom: "70%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
  },
  modal: {
    backgroundColor: "beige",
    padding: 60,
    borderRadius: 10,
  },
  modalJoinNow: {
    backgroundColor: "blue",
    fontSize: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 200,
    borderRadius: 5,
  },
  closeButton1: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  webViewStyle: {
    flex: 1,
    width: viewportWidth * 0.9,
    height: viewportHeight * 0.7,
  },
  webViewModal: {
    position: "absolute",
    bottom: "10%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  webViewContainer: {
    margin: 10,
    height: viewportHeight * 0.9,
    width: viewportWidth * 0.95,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: "center",
  },
});

export default Activities;