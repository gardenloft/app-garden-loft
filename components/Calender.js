// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   Alert,
// // //   Button,
// // //   Platform,
// // //   FlatList,
// // //   TouchableOpacity,
// // // } from "react-native";
// // // import * as Calendar from "expo-calendar";
// // // import axios from "axios";
// // // import moment from "moment-timezone";
// // // import { getAuth } from "firebase/auth";
// // // import { FIRESTORE_DB } from "../FirebaseConfig";
// // // import {
// // //   getDoc,
// // //   collection,
// // //   query,
// // //   where,
// // //   getDocs,
// // //   updateDoc,
// // //   addDoc,
// // //   doc,
// // // } from "firebase/firestore";

// // // const CalendarComponent = () => {
// // //   const [events, setEvents] = useState([]);
// // //   const [calendarId, setCalendarId] = useState(null);
// // //   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const auth = getAuth();
// // //   const user = auth.currentUser;

// // //   useEffect(() => {
// // //     if (user) {
// // //       fetchUserNameAndEvents(user.uid);
// // //       requestCalendarPermissions();
// // //     } else {
// // //       Alert.alert("Error", "User not signed in");
// // //     }
// // //   }, [user]);

// // //   const fetchUserNameAndEvents = async (uid) => {
// // //     try {
// // //       const userRef = doc(FIRESTORE_DB, "users", uid);
// // //       const userSnap = await getDoc(userRef);

// // //       if (userSnap.exists()) {
// // //         const userData = userSnap.data();
// // //         const userName = userData.userName;
// // //         fetchEventsFromSignUpGenius(userName);
// // //       } else {
// // //         throw new Error("No user data found");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching user data:", error);
// // //       Alert.alert(
// // //         "Error",
// // //         "Failed to retrieve user data. Please try again later."
// // //       );
// // //     }
// // //   };

// // //   const fetchEventsFromSignUpGenius = async (userName) => {
// // //     try {
// // //       const response = await axios.get(
// // //         "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
// // //       );

// // //       const currentTime = new Date();

// // //       const fetchedEvents = response.data.data.signup
// // //         .filter((item) => item.firstname === userName)
// // //         .map((item) => {
// // //           let startDate, endDate;
// // //           try {
// // //             startDate = moment
// // //               .tz(
// // //                 item.startdatestring.replace(/-/g, "T"),
// // //                 "YYYY/MM/DD HH:mm",
// // //                 ""
// // //               )
// // //               .toDate();
// // //             endDate = item.enddatestring
// // //               ? moment
// // //                   .tz(
// // //                     item.enddatestring.replace(/-/g, "T"),
// // //                     "YYYY/MM/DD HH:mm:ss",
// // //                     ""
// // //                   )
// // //                   .toDate()
// // //               : undefined;
// // //           } catch (error) {
// // //             console.error("Error parsing date for item:", item, error);
// // //             startDate = new Date();
// // //             endDate = new Date();
// // //           }

// // //           return {
// // //             title: item.item,
// // //             startDate,
// // //             endDate,
// // //             zoomLink:
// // //               item.location === "Zoom Meeting"
// // //                 ? "https://us02web.zoom.us/wc/join/2548196535?omn=81709607895"
// // //                 : null,
// // //           };
// // //         })
// // //         .filter(
// // //           (event) =>
// // //             (event.endDate && currentTime < event.endDate) ||
// // //             (!event.endDate && currentTime < event.startDate)
// // //         );

// // //       if (fetchedEvents.length === 0) {
// // //         Alert.alert("No upcoming events found");
// // //       }

// // //       setEvents(fetchedEvents);
// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error("Error fetching events:", error);
// // //       Alert.alert(
// // //         "Error",
// // //         "Failed to retrieve signed-up activities. Please try again later."
// // //       );
// // //     }
// // //   };

// // //   const requestCalendarPermissions = async () => {
// // //     const { status } = await Calendar.requestCalendarPermissionsAsync();
// // //     if (status === "granted") {
// // //       createOrGetCalendar();
// // //     } else {
// // //       Alert.alert(
// // //         "Permission required",
// // //         "Calendar permissions are required to use this feature."
// // //       );
// // //     }
// // //   };

// // //   const createOrGetCalendar = async () => {
// // //     const calendars = await Calendar.getCalendarsAsync(
// // //       Calendar.EntityTypes.EVENT
// // //     );
// // //     const existingCalendar = calendars.find(
// // //       (cal) => cal.title === "Garden Loft Events"
// // //     );

// // //     if (existingCalendar) {
// // //       setCalendarId(existingCalendar.id);
// // //     } else {
// // //       const defaultCalendarSource =
// // //         Platform.OS === "ios"
// // //           ? await Calendar.getDefaultCalendarSourceAsync()
// // //           : { isLocalAccount: true, name: "Expo Calendar" };

// // //       const newCalendarId = await Calendar.createCalendarAsync({
// // //         title: "Garden Loft Events",
// // //         color: "blue",
// // //         entityType: Calendar.EntityTypes.EVENT,
// // //         sourceId: defaultCalendarSource.id,
// // //         source: defaultCalendarSource,
// // //         name: "Garden Loft Events",
// // //         ownerAccount: "personal",
// // //         accessLevel: Calendar.CalendarAccessLevel.OWNER,
// // //       });

// // //       setCalendarId(newCalendarId);
// // //     }
// // //   };

// // //   const addEventToCalendar = async (event) => {
// // //     if (!calendarId) {
// // //       Alert.alert("Error", "No calendar found. Please try again.");
// // //       return;
// // //     }

// // //     try {
// // //       await Calendar.createEventAsync(calendarId, {
// // //         title: event.title,
// // //         startDate: event.startDate,
// // //         endDate:
// // //           event.endDate || moment(event.startDate).add(1, "hour").toDate(),
// // //         timeZone: "GMT",
// // //         location: event.zoomLink ? "Zoom Meeting" : "In-person",
// // //       });

// // //       Alert.alert("Success", "Event added to your calendar.");
// // //     } catch (error) {
// // //       console.error("Error adding event to calendar:", error);
// // //       Alert.alert("Error", "Failed to add event to calendar.");
// // //     }
// // //   };

// // //   const handleDatePress = (date) => {
// // //     const dateEvents = events.filter((event) =>
// // //       moment(event.startDate).isSame(moment(date), "day")
// // //     );
// // //     setSelectedDateEvents(dateEvents);
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       {loading ? (
// // //         <Text style={styles.loadingText}>Loading...</Text>
// // //       ) : (
// // //         <>
// // //           <Calendar
// // //             onDayPress={(day) => handleDatePress(day.dateString)}
// // //             markedDates={events.reduce((acc, event) => {
// // //               const date = moment(event.startDate).format("YYYY-MM-DD");
// // //               acc[date] = { marked: true, dotColor: "blue" };
// // //               return acc;
// // //             }, {})}
// // //           />

// // //           {selectedDateEvents.length > 0 && (
// // //             <FlatList
// // //               data={selectedDateEvents}
// // //               keyExtractor={(item, index) => index.toString()}
// // //               renderItem={({ item }) => (
// // //                 <View style={styles.eventCard}>
// // //                   <Text style={styles.eventTitle}>{item.title}</Text>
// // //                   <Text style={styles.eventTime}>
// // //                     {moment(item.startDate).format(
// // //                       "dddd, MMMM Do YYYY, h:mm a"
// // //                     )}
// // //                   </Text>
// // //                   <Button
// // //                     title="Add to Calendar"
// // //                     onPress={() => addEventToCalendar(item)}
// // //                   />
// // //                 </View>
// // //               )}
// // //             />
// // //           )}
// // //         </>
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 10,
// // //     backgroundColor: "#fff",
// // //   },
// // //   loadingText: {
// // //     textAlign: "center",
// // //     marginTop: 20,
// // //     fontSize: 18,
// // //     color: "gray",
// // //   },
// // //   eventCard: {
// // //     backgroundColor: "#f9f9f9",
// // //     padding: 10,
// // //     marginVertical: 5,
// // //     borderRadius: 8,
// // //     shadowColor: "#000",
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 5,
// // //     shadowOffset: { width: 0, height: 2 },
// // //   },
// // //   eventTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //   },
// // //   eventTime: {
// // //     fontSize: 14,
// // //     color: "gray",
// // //     marginBottom: 5,
// // //   },
// // // });

// // // export default CalendarComponent;
// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Alert,
// //   FlatList,
// //   ActivityIndicator,
// //   Button,
// //   Dimensions,
// // } from "react-native";
// // import axios from "axios";
// // import moment from "moment-timezone";
// // import { getAuth } from "firebase/auth";
// // import { FIRESTORE_DB } from "../FirebaseConfig";
// // import { doc, getDoc } from "firebase/firestore";

// // // Get device dimensions
// // const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// // const CalenderComponent = () => {
// //   const [availableActivities, setAvailableActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const auth = getAuth();
// //   const user = auth.currentUser;

// //   useEffect(() => {
// //     if (user) {
// //       fetchAvailableActivities();
// //     } else {
// //       Alert.alert("Error", "User not signed in");
// //     }
// //   }, [user]);

// //   const fetchAvailableActivities = async () => {
// //     try {
// //       const response = await axios.get(
// //         "https://api.signupgenius.com/v2/k/signups/report/available/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
// //       );

// //       const activities = response.data.data.signup.map((item, index) => ({
// //         id: item.id || index.toString(), // Use item.id or fallback to index
// //         title: item.item || "Untitled Activity",
// //         startDate: item.startdatestring
// //           ? moment
// //               .tz(
// //                 item.startdatestring.replace(/-/g, "T"),
// //                 "YYYY/MM/DD HH:mm",
// //                 ""
// //               )
// //               .toDate()
// //           : null,
// //         endDate: item.enddatestring
// //           ? moment
// //               .tz(
// //                 item.enddatestring.replace(/-/g, "T"),
// //                 "YYYY/MM/DD HH:mm:ss",
// //                 ""
// //               )
// //               .toDate()
// //           : null,
// //         maxSlots: item.max || 0,
// //         availableSlots: item.available || 0,
// //       }));

// //       setAvailableActivities(activities);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching activities:", error);
// //       Alert.alert(
// //         "Error",
// //         "Failed to retrieve available activities. Please try again later."
// //       );
// //       setLoading(false);
// //     }
// //   };

// //   const handleSignUp = async (activity) => {
// //     try {
// //       const userRef = doc(FIRESTORE_DB, "users", user.uid);
// //       const userSnap = await getDoc(userRef);

// //       if (!userSnap.exists()) {
// //         throw new Error("User data not found");
// //       }

// //       const userData = userSnap.data();

// //       const response = await axios.post(
// //         "https://api.signupgenius.com/v2/k/signups/rsvp/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09",
// //         {
// //           signup_id: activity.id,
// //           firstname: userData.userName,
// //           email: user.email,
// //           item: activity.title,
// //         }
// //       );

// //       if (response.data.success) {
// //         Alert.alert("Success", "You have successfully signed up!");
// //         fetchAvailableActivities(); // Refresh activities list
// //       } else {
// //         Alert.alert("Error", response.data.message || "Failed to sign up.");
// //       }
// //     } catch (error) {
// //       console.error("Error signing up:", error);
// //       Alert.alert("Error", "Failed to sign up. Please try again later.");
// //     }
// //   };

// //   const renderActivity = ({ item }) => (
// //     <View style={styles.activityCard}>
// //       <Text style={styles.activityTitle}>{item.title}</Text>
// //       <Text style={styles.activityTime}>
// //         {item.startDate
// //           ? moment(item.startDate).format("dddd, MMMM Do YYYY, h:mm a")
// //           : "No start date available"}
// //       </Text>
// //       <Text style={styles.activitySlots}>
// //         Slots: {item.availableSlots} / {item.maxSlots}
// //       </Text>
// //       <Button
// //         title="Sign Up"
// //         onPress={() => handleSignUp(item)}
// //         disabled={item.availableSlots <= 0}
// //       />
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       {loading ? (
// //         <ActivityIndicator size="large" color="blue" />
// //       ) : (
// //         <FlatList
// //           data={availableActivities}
// //           keyExtractor={(item) => item.id.toString()}
// //           renderItem={renderActivity}
// //           ListEmptyComponent={
// //             <Text style={styles.noActivitiesText}>
// //               No available activities at the moment.
// //             </Text>
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // };
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: SCREEN_WIDTH > 600 ? 40 : 20, // More padding for larger screens
// //     backgroundColor: "#fff",
// //   },
// //   activityCard: {
// //     backgroundColor: "#f9f9f9",
// //     padding: SCREEN_WIDTH > 600 ? 20 : 10, // Larger padding for tablets
// //     marginVertical: 5,
// //     borderRadius: 8,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     shadowOffset: { width: 0, height: 2 },
// //   },
// //   activityTitle: {
// //     fontSize: SCREEN_WIDTH > 600 ? 24 : 18, // Larger text for tablets
// //     fontWeight: "bold",
// //   },
// //   activityTime: {
// //     fontSize: SCREEN_WIDTH > 600 ? 18 : 14,
// //     color: "gray",
// //     marginBottom: 5,
// //   },
// //   activitySlots: {
// //     fontSize: SCREEN_WIDTH > 600 ? 18 : 14,
// //     color: "green",
// //     marginBottom: 10,
// //   },
// //   noActivitiesText: {
// //     textAlign: "center",
// //     marginTop: 20,
// //     fontSize: SCREEN_WIDTH > 600 ? 20 : 16, // Larger text for tablets
// //     color: "gray",
// //   },
// // });

// // export default CalenderComponent;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   Dimensions,
//   Modal,
// } from "react-native";
// import { Calendar } from "react-native-calendars";
// import axios from "axios";
// import moment from "moment-timezone";
// import { getAuth } from "firebase/auth";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// const CalendarComponent = () => {
//   const [availableActivities, setAvailableActivities] = useState([]);
//   const [filteredActivities, setFilteredActivities] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     moment().format("YYYY-MM-DD")
//   );
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       fetchAvailableActivities();
//     } else {
//       Alert.alert("Error", "User not signed in");
//     }
//   }, [user]);

//   const fetchAvailableActivities = async () => {
//     try {
//       const response = await axios.get(
//         "https://api.signupgenius.com/v2/k/signups/report/available/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//       );

//       console.log("Raw API Response:", response.data);

//       if (!response.data || !response.data.data || !response.data.data.signup) {
//         throw new Error("Unexpected API response structure.");
//       }

//       const activities = response.data.data.signup.map((item) => ({
//         id: item.id, // Ensure this ID matches what the API expects
//         title: item.item || "Unnamed Activity",
//         startDate: item.startdatestring
//           ? moment
//               .tz(
//                 item.startdatestring.replace(/-/g, "T"),
//                 "YYYY/MM/DD HH:mm",
//                 ""
//               )
//               .toDate()
//           : null,
//         endDate: item.enddatestring
//           ? moment
//               .tz(
//                 item.enddatestring.replace(/-/g, "T"),
//                 "YYYY/MM/DD HH:mm:ss",
//                 ""
//               )
//               .toDate()
//           : null,
//         maxSlots: item.max || 0,
//         availableSlots: item.available || 0,
//       }));

//       console.log("Mapped Activities:", activities);

//       setAvailableActivities(activities);
//       setFilteredActivities(activities);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//       Alert.alert(
//         "Error",
//         "Failed to retrieve available activities. Please try again later."
//       );
//       setLoading(false);
//     }
//   };

//   // const fetchAvailableActivities = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       "https://api.signupgenius.com/v2/k/signups/report/available/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//   //     );

//   //     const activities = response.data.data.signup
//   //       .map((item, index) => ({
//   //         id: item.id || `temp-id-${index}`, // Fallback for missing id
//   //         title: item.item || "Unnamed Activity",
//   //         startDate: item.startdatestring
//   //           ? moment
//   //               .tz(
//   //                 item.startdatestring.replace(/-/g, "T"),
//   //                 "YYYY/MM/DD HH:mm",
//   //                 ""
//   //               )
//   //               .toDate()
//   //           : null,
//   //         endDate: item.enddatestring
//   //           ? moment
//   //               .tz(
//   //                 item.enddatestring.replace(/-/g, "T"),
//   //                 "YYYY/MM/DD HH:mm:ss",
//   //                 ""
//   //               )
//   //               .toDate()
//   //           : null,
//   //         isSignedUp: false,
//   //       }))
//   //       .filter((event) => moment(event.startDate).isAfter(moment())); // Exclude past events

//   //     setAvailableActivities(activities);
//   //     setFilteredActivities(activities); // Default filtered list
//   //     setLoading(false);
//   //   } catch (error) {
//   //     console.error("Error fetching activities:", error);
//   //     Alert.alert(
//   //       "Error",
//   //       "Failed to retrieve available activities. Please try again later."
//   //     );
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSignUp = async (activity) => {
//     try {
//       const userRef = doc(FIRESTORE_DB, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         throw new Error("User data not found");
//       }

//       const userData = userSnap.data();
//       const payload = {
//         signup_id: activity.id, // Ensure this ID is valid
//         firstname: userData.userName || "Guest",
//         email: user.email || "no-email@example.com",
//         item: activity.title,
//       };

//       console.log("Sign-Up Payload:", payload);

//       const response = await axios.post(
//         "https://api.signupgenius.com/v2/k/signups/rsvp/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09",
//         payload
//       );

//       console.log("Sign-Up Response:", response.data);

//       if (response.data.success) {
//         Alert.alert("Success", "You have successfully signed up!");
//         setAvailableActivities((prev) =>
//           prev.map((act) =>
//             act.id === activity.id ? { ...act, isSignedUp: true } : act
//           )
//         );
//         setFilteredActivities((prev) =>
//           prev.map((act) =>
//             act.id === activity.id ? { ...act, isSignedUp: true } : act
//           )
//         );
//       } else {
//         Alert.alert("Error", response.data.message || "Failed to sign up.");
//       }
//     } catch (error) {
//       console.error("Error signing up:", error.response || error.message || error);
//       Alert.alert("Error", "Failed to sign up. Please try again later.");
//     }
//   };

//   // const handleSignUp = async (activity) => {
//   //   try {
//   //     const userRef = doc(FIRESTORE_DB, "users", user.uid);
//   //     const userSnap = await getDoc(userRef);

//   //     if (!userSnap.exists()) {
//   //       throw new Error("User data not found");
//   //     }

//   //     const userData = userSnap.data();

//   //     const response = await axios.post(
//   //       "https://api.signupgenius.com/v2/k/signups/rsvp/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09",
//   //       {
//   //         signup_id: activity.id,
//   //         firstname: userData.userName,
//   //         email: user.email,
//   //         item: activity.title,
//   //       }
//   //     );

//   //     if (response.data.success) {
//   //       Alert.alert("Success", "You have successfully signed up!");
//   //       // Update the activity's "signed up" status
//   //       setAvailableActivities((prev) =>
//   //         prev.map((act) =>
//   //           act.id === activity.id ? { ...act, isSignedUp: true } : act
//   //         )
//   //       );
//   //       setFilteredActivities((prev) =>
//   //         prev.map((act) =>
//   //           act.id === activity.id ? { ...act, isSignedUp: true } : act
//   //         )
//   //       );
//   //     } else {
//   //       Alert.alert("Error", response.data.message || "Failed to sign up.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error signing up:", error);
//   //     Alert.alert("Error", "Failed to sign up. Please try again later.");
//   //   }
//   // };

//   const handleDatePress = (date) => {
//     setSelectedDate(date.dateString);
//     const filtered = availableActivities.filter((event) =>
//       moment(event.startDate).isSame(moment(date.dateString), "day")
//     );
//     setFilteredActivities(filtered);
//   };

//   const renderActivity = ({ item }) => (
//     <TouchableOpacity
//       style={styles.activityCard}
//       onPress={() => {
//         setSelectedActivity(item);
//         setModalVisible(true);
//       }}>
//       <Text style={styles.activityTitle}>
//         {item.title} {item.isSignedUp ? "(Signed Up)" : ""}
//       </Text>
//       <Text style={styles.activityTime}>
//         {moment(item.startDate).format("dddd, MMMM Do YYYY, h:mm a")}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : (
//         <>
//           <Calendar
//             onDayPress={handleDatePress}
//             markedDates={{
//               [selectedDate]: { selected: true, selectedColor: "blue" },
//               ...availableActivities.reduce((acc, event) => {
//                 const date = moment(event.startDate).format("YYYY-MM-DD");
//                 acc[date] = {
//                   marked: true,
//                   dotColor: event.isSignedUp ? "green" : "orange",
//                 };
//                 return acc;
//               }, {}),
//             }}
//             theme={{
//               calendarBackground: "#ffffff",
//               textSectionTitleColor: "#2d4150",
//               selectedDayBackgroundColor: "#00adf5",
//               selectedDayTextColor: "#ffffff",
//               todayTextColor: "#00adf5",
//               dayTextColor: "#2d4150",
//               arrowColor: "blue",
//               monthTextColor: "blue",
//               textDayFontSize: SCREEN_WIDTH * 0.04,
//               textMonthFontSize: SCREEN_WIDTH * 0.05,
//               textDayHeaderFontSize: SCREEN_WIDTH * 0.04,
//             }}
//           />
//           <FlatList
//             data={filteredActivities.sort(
//               (a, b) => new Date(a.startDate) - new Date(b.startDate)
//             )}
//             keyExtractor={(item) => item.id}
//             renderItem={renderActivity}
//             ListEmptyComponent={
//               <Text style={styles.noActivitiesText}>
//                 No activities available for the selected date.
//               </Text>
//             }
//           />
//           {selectedActivity && (
//             <Modal
//               visible={modalVisible}
//               transparent
//               animationType="slide"
//               onRequestClose={() => setModalVisible(false)}>
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <TouchableOpacity
//                     style={styles.closeButton}
//                     onPress={() => setModalVisible(false)}>
//                     <Text style={styles.closeButtonText}>X</Text>
//                   </TouchableOpacity>
//                   <Text style={styles.modalTitle}>
//                     {selectedActivity.title}
//                   </Text>
//                   <Text style={styles.modalTime}>
//                     {moment(selectedActivity.startDate).format(
//                       "dddd, MMMM Do YYYY, h:mm a"
//                     )}
//                   </Text>
//                   {!selectedActivity.isSignedUp && (
//                     <TouchableOpacity
//                       style={styles.signUpButton}
//                       onPress={() => handleSignUp(selectedActivity)}>
//                       <Text style={styles.signUpButtonText}>Sign Up</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>
//             </Modal>
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: SCREEN_WIDTH * 0.05,
//     backgroundColor: "#fff",
//   },
//   activityCard: {
//     backgroundColor: "#f9f9f9",
//     padding: SCREEN_WIDTH * 0.04,
//     marginVertical: SCREEN_HEIGHT * 0.01,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   activityTitle: {
//     fontSize: SCREEN_WIDTH * 0.05,
//     fontWeight: "bold",
//   },
//   activityTime: {
//     fontSize: SCREEN_WIDTH * 0.04,
//     color: "gray",
//   },
//   noActivitiesText: {
//     textAlign: "center",
//     marginTop: SCREEN_HEIGHT * 0.02,
//     fontSize: SCREEN_WIDTH * 0.04,
//     color: "gray",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: SCREEN_WIDTH * 0.8,
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//     backgroundColor: "red",
//     padding: 5,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   modalTitle: {
//     fontSize: SCREEN_WIDTH * 0.06,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalTime: {
//     fontSize: SCREEN_WIDTH * 0.045,
//     color: "gray",
//     marginBottom: 20,
//   },
//   signUpButton: {
//     backgroundColor: "blue",
//     padding: 10,
//     borderRadius: 5,
//   },
//   signUpButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: SCREEN_WIDTH * 0.045,
//   },
// });

// export default CalendarComponent;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import moment from "moment-timezone";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const CalendarComponent = () => {
  const [signedUpActivities, setSignedUpActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchSignedUpActivities(user);
    } else {
      Alert.alert("Error", "User not signed in");
    }
  }, [user]);

  const fetchSignedUpActivities = async (user) => {
    try {
      const userRef = doc(FIRESTORE_DB, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found");
      }

      const userData = userSnap.data();
      const userName = userData.userName;

      const response = await axios.get(
        "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
      );

      const activities = response.data.data.signup
        .filter((item) =>
          item.signups.some((signup) => signup.firstname === userName)
        )
        .map((item) => ({
          id: item.id || `${item.item}-${item.startdatestring}`,
          title: item.item,
          startDate: moment(item.startdatestring).toDate(),
          endDate: item.enddatestring
            ? moment(item.enddatestring).toDate()
            : null,
          participants: item.signups
            .map((signup) => signup.firstname)
            .join(", "),
        }));

      setSignedUpActivities(activities);
    } catch (error) {
      console.error("Error fetching signed-up activities:", error);
      Alert.alert(
        "Error",
        "Failed to fetch signed-up activities. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const mergeAndGroupActivities = () => {
    const grouped = signedUpActivities.reduce((acc, activity) => {
      const date = moment(activity.startDate).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  };

  const handleDatePress = (date) => {
    setSelectedDate(date.dateString);
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityTime}>
        {moment(item.startDate).format("h:mm a")} -{" "}
        {item.endDate ? moment(item.endDate).format("h:mm a") : "Ongoing"}
      </Text>
      <Text style={styles.participants}>Participants: {item.participants}</Text>
    </View>
  );

  const groupedActivities = mergeAndGroupActivities();

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Calendar
            onDayPress={handleDatePress}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "blue" },
              ...groupedActivities.reduce((acc, group) => {
                const date = group.title;
                acc[date] = { marked: true, dotColor: "green" };
                return acc;
              }, {}),
            }}
          />

          <Text style={styles.sectionTitle}>Signed-Up Activities</Text>
          <SectionList
            sections={groupedActivities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderActivity}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.dateHeader}>
                {moment(title).format("dddd, MMMM Do YYYY")}
              </Text>
            )}
            ListEmptyComponent={
              <Text style={styles.noActivitiesText}>
                No signed-up activities found.
              </Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "gray",
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#f4f4f4",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  activityCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityTime: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  participants: {
    fontSize: 14,
    color: "blue",
    marginTop: 5,
  },
  noActivitiesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default CalendarComponent;
