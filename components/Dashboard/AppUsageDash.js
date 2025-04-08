// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// import supabase from "../../SupabaseConfig";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const AppUsageDash = () => {

//   // Text Message App Usage Collection
//   const [messageData, setMessageData] = useState({
//     sent: 0,
//     received: 0,
//     logs: [],
//   });
  

//   useEffect(() => {
//     fetchMessageLogs();
//   }, []);

//   // Fetch Sent and Received Messages
//   const fetchMessageLogs = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("app_usage_event_log")
//         .select("event_type")
//         .in("event_type", ["text_message_sent", "text_message_received"]);

//       if (error) return console.error("Error fetching logs:", error);

//       setMessageData({
//         sent: data.filter((log) => log.event_type === "text_message_sent")
//           .length,
//         received: data.filter(
//           (log) => log.event_type === "text_message_received"
//         ).length,
//         logs: data,
//       });
//     } catch (error) {
//       console.error("Error fetching logs:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title1}>App Usage Data</Text>
//       <Text style={styles.title2}>Text Messages:</Text>
//       <Text style={styles.modalText}>Messages Sent: {messageData.sent}</Text>
//       <Text style={styles.modalText}>Messages Received: {messageData.received}</Text>

//       {/* <BarChart
//         data={{
//           labels: ["Sent", "Received"],
//           datasets: [{ data: [messageData.sent, messageData.received] }],
//         }}
//         width={SCREEN_WIDTH * 0.4}
//         height={220}
//         yAxisLabel=""
//         chartConfig={{
//           backgroundColor: "#fff",
//           backgroundGradientFrom: "#f3b718",
//           backgroundGradientTo: "#f09030",
//           decimalPlaces: 0,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         style={{ marginVertical: 10, borderRadius: 20 }}
//       /> */}

//        {/* Message Logs in raw format */}
//           <ScrollView style={styles.logContainer}>
//         {messageData.logs.map((log, index) => (
//           <Text key={index} style={styles.logText}>
//             {new Date(log.event_time).toLocaleString()} - {log.event_type}
//           </Text>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title1: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   title2: {
//     fontSize: 25,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
// });

// export default AppUsageDash;

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { PieChart } from "react-native-chart-kit";
// import { getAuth } from "firebase/auth";
// import supabase from "../../SupabaseConfig";

// const AppUsageDash = () => {
//   const [appUsageData, setAppUsageData] = useState({
//     youtube_video_clicked: 0,
//     total_watch_time: 0,
//     video_calls_started: 0,
//     text_message_sent: 0,
//     text_message_received: 0,
//   });

//   const [loading, setLoading] = useState(true);
//   const [residentId, setResidentId] = useState(null);

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     setLoading(true);
//     const auth = getAuth();
//     const firebaseUser = auth.currentUser;

//     if (!firebaseUser) {
//       console.error("❌ No authenticated user found.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data: residentData, error: residentError } = await supabase
//         .from("residents")
//         .select("resident_id")
//         .eq("firebase_uid", firebaseUser.uid)
//         .single();

//       if (residentError || !residentData) {
//         console.error("❌ Error fetching resident ID:", residentError);
//         setLoading(false);
//         return;
//       }

//       const residentId = parseInt(residentData.resident_id, 10);
//       setResidentId(residentId);
//       fetchAppUsageLogs(residentId);
//     } catch (error) {
//       console.error("❌ Error fetching user data:", error);
//       setLoading(false);
//     }
//   };

//   const fetchAppUsageLogs = async (residentId) => {
//     try {
//       const { data, error } = await supabase
//         .from("app_usage_event_log")
//         .select("event_type, event_time, metadata")
//         .eq("resident_id", residentId);

//       if (error) {
//         console.error("❌ Error fetching logs:", error);
//         setLoading(false);
//         return;
//       }

//       const eventCounts = {
//         youtube_video_clicked: 0,
//         total_watch_time: 0,
//         video_calls_started: 0,
//         text_message_sent: 0,
//         text_message_received: 0,
//       };

//       data.forEach((log) => {
//         if (log.event_type === "Youtube_video_clicked") {
//           eventCounts.youtube_video_clicked += 1;
//         }

//         if (log.event_type === "video_call_started") {
//           eventCounts.video_calls_started += 1;
//         }

//         if (log.event_type === "text_message_sent") {
//           eventCounts.text_message_sent += 1;
//         }

//         if (log.event_type === "text_message_received") {
//           eventCounts.text_message_received += 1;
//         }
//       });

//       setAppUsageData(eventCounts);
//       setLoading(false);
//     } catch (error) {
//       console.error("❌ Error fetching logs:", error);
//       setLoading(false);
//     }
//   };

//   const chartData = [
//     {
//       name: "Text Messages",
//       count: appUsageData.text_message_sent + appUsageData.text_message_received,
//       color: "#FFA726",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//     {
//       name: "Video Calls",
//       count: appUsageData.video_calls_started,
//       color: "#66BB6A",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//     {
//       name: "YouTube Clicks",
//       count: appUsageData.youtube_video_clicked,
//       color: "#29B6F6",
//       legendFontColor: "#333",
//       legendFontSize: 14,
//     },
//   ].filter((item) => item.count > 0); // Remove categories with 0 values

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>App Usage Summary</Text>

//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <PieChart
//             data={chartData}
//             width={350}
//             height={220}
//             chartConfig={{
//               backgroundColor: "#ffffff",
//               backgroundGradientFrom: "#ffffff",
//               backgroundGradientTo: "#ffffff",
//               decimalPlaces: 0,
//               color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             }}
//             accessor="count"
//             backgroundColor="transparent"
//             paddingLeft="15"
//             absolute
//           />

//           <Text style={styles.summaryText}>📨 Messages Sent: {appUsageData.text_message_sent}</Text>
//           <Text style={styles.summaryText}>📩 Messages Received: {appUsageData.text_message_received}</Text>
//           <Text style={styles.summaryText}>📹 Video Calls Started: {appUsageData.video_calls_started}</Text>
//           <Text style={styles.summaryText}>🎥 YouTube Videos Clicked: {appUsageData.youtube_video_clicked}</Text>
//           <Text style={styles.summaryText}>⏱️ Total YouTube Watch Time: {appUsageData.total_watch_time} seconds</Text>
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     padding: 10,
//     flex: 1,
//   },
//   scrollContainer: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   summaryText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginVertical: 5,
//   },
// });

// export default AppUsageDash;



import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import supabase from "../../SupabaseConfig";

const AppUsageDash = () => {
  const [appUsageData, setAppUsageData] = useState({
    youtube_video_clicked: 0,
    total_watch_time: 0,
    video_calls_started: 0,
    text_message_sent: 0,
    text_message_received: 0,
    videos: {},
  });

  const [loading, setLoading] = useState(true);
  const [residentId, setResidentId] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      console.error("❌ No authenticated user found.");
      setLoading(false);
      return;
    }

    console.log("✅ Firebase UID:", firebaseUser.uid);

    try {
      // Get resident_id as INT from Supabase
      const { data: residentData, error: residentError } = await supabase
        .from("residents")
        .select("resident_id")
        .eq("firebase_uid", firebaseUser.uid)
        .single();

      if (residentError || !residentData) {
        console.error("❌ Error fetching resident ID:", residentError);
        console.log("Resident data returned:", residentData);
        setLoading(false);
        return;
      }

      const residentId = parseInt(residentData.resident_id, 10);
      console.log("✅ Resident ID (as int):", residentId);

      setResidentId(residentId);
      fetchAppUsageLogs(residentId);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setLoading(false);
    }
  };

  const fetchAppUsageLogs = async (residentId) => {
    try {
      console.log("Fetching logs for resident_id (as int):", residentId);

      const { data, error } = await supabase
        .from("app_usage_event_log")
        .select("event_type, event_time, metadata")
        .eq("resident_id", residentId);

      if (error) {
        console.error("❌ Error fetching logs:", error);
        setLoading(false);
        return;
      }

      console.log("✅ Event logs retrieved:", data);

      if (data.length === 0) {
        console.warn("⚠️ No logs found for this user.");
      }

      // Initialize summary
      const eventCounts = {
        youtube_video_clicked: 0,
        total_watch_time: 0,
        video_calls_started: 0,
        text_message_sent: 0,
        text_message_received: 0,
        videos: {},
      };

      data.forEach((log) => {
        if (log.event_type === "Youtube_video_clicked") {
          eventCounts.youtube_video_clicked += 1;
        }

        // Extract watch time from "Youtube_watch_abandoned" metadata
        if (log.event_type === "Youtube_watch_abandoned" && log.metadata) {
          try {
            const metadata = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata;
            if (metadata.watch_time_seconds) {
              eventCounts.total_watch_time += metadata.watch_time_seconds;

              const videoTitle = metadata.video_title || "Unknown Video";
              if (!eventCounts.videos[videoTitle]) {
                eventCounts.videos[videoTitle] = { watch_time: 0 };
              }
              eventCounts.videos[videoTitle].watch_time += metadata.watch_time_seconds;
            }
          } catch (e) {
            console.error("❌ Error parsing metadata:", e);
          }
        }

        if (log.event_type === "video_call_started") {
          eventCounts.video_calls_started += 1;
        }

        if (log.event_type === "text_message_sent") {
          eventCounts.text_message_sent += 1;
        }

        if (log.event_type === "text_message_received") {
          eventCounts.text_message_received += 1;
        }
      });

      setAppUsageData(eventCounts);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching logs:", error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>App Usage Summary</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.summaryText}>Messages Sent: {appUsageData.text_message_sent}</Text>
          <Text style={styles.summaryText}> Messages Received: {appUsageData.text_message_received}</Text>
          <Text style={styles.summaryText}> Video Calls Started: {appUsageData.video_calls_started}</Text>
          <Text style={styles.summaryText}> YouTube Videos Clicked: {appUsageData.youtube_video_clicked}</Text>
          <Text style={styles.summaryText}> Total YouTube Watch Time: {appUsageData.total_watch_time} seconds</Text>

          <Text style={styles.title2}>YouTube Videos Watched:</Text>
          {Object.entries(appUsageData.videos).map(([title, details]) => (
            <Text key={title} style={styles.videoText}>
              🎬 {title}: {details.watch_time} seconds watched
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  scrollContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  title2: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  videoText: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default AppUsageDash;

