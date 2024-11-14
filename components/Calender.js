// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   Button,
//   Platform,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import * as Calendar from "expo-calendar";
// import axios from "axios";
// import moment from "moment-timezone";
// import { getAuth } from "firebase/auth";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import {
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   addDoc,
//   doc,
// } from "firebase/firestore";

// const CalendarComponent = () => {
//   const [events, setEvents] = useState([]);
//   const [calendarId, setCalendarId] = useState(null);
//   const [selectedDateEvents, setSelectedDateEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (user) {
//       fetchUserNameAndEvents(user.uid);
//       requestCalendarPermissions();
//     } else {
//       Alert.alert("Error", "User not signed in");
//     }
//   }, [user]);

//   const fetchUserNameAndEvents = async (uid) => {
//     try {
//       const userRef = doc(FIRESTORE_DB, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const userName = userData.userName;
//         fetchEventsFromSignUpGenius(userName);
//       } else {
//         throw new Error("No user data found");
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       Alert.alert(
//         "Error",
//         "Failed to retrieve user data. Please try again later."
//       );
//     }
//   };

//   const fetchEventsFromSignUpGenius = async (userName) => {
//     try {
//       const response = await axios.get(
//         "https://api.signupgenius.com/v2/k/signups/report/filled/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
//       );

//       const currentTime = new Date();

//       const fetchedEvents = response.data.data.signup
//         .filter((item) => item.firstname === userName)
//         .map((item) => {
//           let startDate, endDate;
//           try {
//             startDate = moment
//               .tz(
//                 item.startdatestring.replace(/-/g, "T"),
//                 "YYYY/MM/DD HH:mm",
//                 ""
//               )
//               .toDate();
//             endDate = item.enddatestring
//               ? moment
//                   .tz(
//                     item.enddatestring.replace(/-/g, "T"),
//                     "YYYY/MM/DD HH:mm:ss",
//                     ""
//                   )
//                   .toDate()
//               : undefined;
//           } catch (error) {
//             console.error("Error parsing date for item:", item, error);
//             startDate = new Date();
//             endDate = new Date();
//           }

//           return {
//             title: item.item,
//             startDate,
//             endDate,
//             zoomLink:
//               item.location === "Zoom Meeting"
//                 ? "https://us02web.zoom.us/wc/join/2548196535?omn=81709607895"
//                 : null,
//           };
//         })
//         .filter(
//           (event) =>
//             (event.endDate && currentTime < event.endDate) ||
//             (!event.endDate && currentTime < event.startDate)
//         );

//       if (fetchedEvents.length === 0) {
//         Alert.alert("No upcoming events found");
//       }

//       setEvents(fetchedEvents);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       Alert.alert(
//         "Error",
//         "Failed to retrieve signed-up activities. Please try again later."
//       );
//     }
//   };

//   const requestCalendarPermissions = async () => {
//     const { status } = await Calendar.requestCalendarPermissionsAsync();
//     if (status === "granted") {
//       createOrGetCalendar();
//     } else {
//       Alert.alert(
//         "Permission required",
//         "Calendar permissions are required to use this feature."
//       );
//     }
//   };

//   const createOrGetCalendar = async () => {
//     const calendars = await Calendar.getCalendarsAsync(
//       Calendar.EntityTypes.EVENT
//     );
//     const existingCalendar = calendars.find(
//       (cal) => cal.title === "Garden Loft Events"
//     );

//     if (existingCalendar) {
//       setCalendarId(existingCalendar.id);
//     } else {
//       const defaultCalendarSource =
//         Platform.OS === "ios"
//           ? await Calendar.getDefaultCalendarSourceAsync()
//           : { isLocalAccount: true, name: "Expo Calendar" };

//       const newCalendarId = await Calendar.createCalendarAsync({
//         title: "Garden Loft Events",
//         color: "blue",
//         entityType: Calendar.EntityTypes.EVENT,
//         sourceId: defaultCalendarSource.id,
//         source: defaultCalendarSource,
//         name: "Garden Loft Events",
//         ownerAccount: "personal",
//         accessLevel: Calendar.CalendarAccessLevel.OWNER,
//       });

//       setCalendarId(newCalendarId);
//     }
//   };

//   const addEventToCalendar = async (event) => {
//     if (!calendarId) {
//       Alert.alert("Error", "No calendar found. Please try again.");
//       return;
//     }

//     try {
//       await Calendar.createEventAsync(calendarId, {
//         title: event.title,
//         startDate: event.startDate,
//         endDate:
//           event.endDate || moment(event.startDate).add(1, "hour").toDate(),
//         timeZone: "GMT",
//         location: event.zoomLink ? "Zoom Meeting" : "In-person",
//       });

//       Alert.alert("Success", "Event added to your calendar.");
//     } catch (error) {
//       console.error("Error adding event to calendar:", error);
//       Alert.alert("Error", "Failed to add event to calendar.");
//     }
//   };

//   const handleDatePress = (date) => {
//     const dateEvents = events.filter((event) =>
//       moment(event.startDate).isSame(moment(date), "day")
//     );
//     setSelectedDateEvents(dateEvents);
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : (
//         <>
//           <Calendar
//             onDayPress={(day) => handleDatePress(day.dateString)}
//             markedDates={events.reduce((acc, event) => {
//               const date = moment(event.startDate).format("YYYY-MM-DD");
//               acc[date] = { marked: true, dotColor: "blue" };
//               return acc;
//             }, {})}
//           />

//           {selectedDateEvents.length > 0 && (
//             <FlatList
//               data={selectedDateEvents}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.eventCard}>
//                   <Text style={styles.eventTitle}>{item.title}</Text>
//                   <Text style={styles.eventTime}>
//                     {moment(item.startDate).format(
//                       "dddd, MMMM Do YYYY, h:mm a"
//                     )}
//                   </Text>
//                   <Button
//                     title="Add to Calendar"
//                     onPress={() => addEventToCalendar(item)}
//                   />
//                 </View>
//               )}
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   loadingText: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 18,
//     color: "gray",
//   },
//   eventCard: {
//     backgroundColor: "#f9f9f9",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   eventTime: {
//     fontSize: 14,
//     color: "gray",
//     marginBottom: 5,
//   },
// });

// export default CalendarComponent;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import moment from "moment-timezone";
import { getAuth } from "firebase/auth";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const SignUpComponent = () => {
  const [availableActivities, setAvailableActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchAvailableActivities();
    } else {
      Alert.alert("Error", "User not signed in");
    }
  }, [user]);

  const fetchAvailableActivities = async () => {
    try {
      const response = await axios.get(
        "https://api.signupgenius.com/v2/k/signups/report/available/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09"
      );

      const activities = response.data.data.signup.map((item) => ({
        id: item.id,
        title: item.item,
        startDate: moment
          .tz(item.startdatestring.replace(/-/g, "T"), "YYYY/MM/DD HH:mm", "")
          .toDate(),
        endDate: item.enddatestring
          ? moment
              .tz(
                item.enddatestring.replace(/-/g, "T"),
                "YYYY/MM/DD HH:mm:ss",
                ""
              )
              .toDate()
          : null,
        maxSlots: item.max,
        availableSlots: item.available,
      }));

      setAvailableActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      Alert.alert(
        "Error",
        "Failed to retrieve available activities. Please try again later."
      );
      setLoading(false);
    }
  };

  const handleSignUp = async (activity) => {
    try {
      const userRef = doc(FIRESTORE_DB, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found");
      }

      const userData = userSnap.data();

      const response = await axios.post(
        "https://api.signupgenius.com/v2/k/signups/rsvp/47293846/?user_key=UmNrVWhyYWwrVGhtQmdXeVpweTBZZz09",
        {
          signup_id: activity.id,
          firstname: userData.userName,
          email: user.email,
          item: activity.title,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "You have successfully signed up!");
        fetchAvailableActivities(); // Refresh activities list
      } else {
        Alert.alert("Error", response.data.message || "Failed to sign up.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Error", "Failed to sign up. Please try again later.");
    }
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityTime}>
        {moment(item.startDate).format("dddd, MMMM Do YYYY, h:mm a")}
      </Text>
      <Text style={styles.activitySlots}>
        Slots: {item.availableSlots} / {item.maxSlots}
      </Text>
      <Button
        title="Sign Up"
        onPress={() => handleSignUp(item)}
        disabled={item.availableSlots <= 0}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={availableActivities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivity}
          ListEmptyComponent={
            <Text style={styles.noActivitiesText}>
              No available activities at the moment.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  activityTime: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  activitySlots: {
    fontSize: 14,
    color: "green",
    marginBottom: 10,
  },
  noActivitiesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default SignUpComponent;
