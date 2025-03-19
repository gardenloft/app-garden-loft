// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   FlatList,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // // } from "react-native";
// // // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // // import { fetchEntityState } from "../../homeAssistant"; // ✅ Use Home Assistant API Helper
// // // import {
// // //   fetchUserHomeId,
// // //   getFilteredEntities,
// // //   controlDevice,
// // //   fetchStreamUrl,
// // //   setReolinkVideoSettings,
// // // } from "../../homeAssistant";

// // // const WaterLogs = () => {
// // //   const [logs, setLogs] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   // ✅ Fetch Daily Water Usage from Home Assistant
// // //   const fetchLogs = async () => {
// // //     try {
// // //       const entityId = "sensor.phyn_pc1_daily_water_usage"; // The correct sensor ID
// // //       const response = await fetchEntityState(entityId); // Fetch latest state

// // //       if (!response || !response.state) {
// // //         setLogs([{ time: "No Data", value: "N/A" }]);
// // //       } else {
// // //         const logEntry = {
// // //           time: new Date(response.last_changed).toLocaleString(),
// // //           value: `${response.state} ${response.attributes?.unit_of_measurement || "L"}`,
// // //           sensor: "Daily Water Usage",
// // //         };

// // //         setLogs([logEntry]); // Only show the latest daily usage
// // //       }
// // //     } catch (error) {
// // //       console.error("❌ Error fetching data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchLogs();
// // //     const interval = setInterval(fetchLogs, 300000); // Refresh every 5 minutes
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   return (
// // //     <View style={styles.container}>
// // //       <Text style={styles.header}>💧 Water Usage Logs</Text>
// // //       {loading ? (
// // //         <ActivityIndicator size="large" color="#00aaff" />
// // //       ) : (
// // //         <FlatList
// // //           data={logs}
// // //           keyExtractor={(item, index) => index.toString()}
// // //           renderItem={({ item }) => (
// // //             <View style={styles.logItem}>
// // //               <MaterialCommunityIcons name="water" size={24} color="#007BFF" />
// // //               <View>
// // //                 <Text style={styles.logText}>🕒 {item.time}</Text>
// // //                 <Text style={styles.logText}>🔹 {item.sensor}: {item.value}</Text>
// // //               </View>
// // //             </View>
// // //           )}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 20,
// // //     backgroundColor: "#f8f9fa",
// // //   },
// // //   header: {
// // //     fontSize: 22,
// // //     fontWeight: "bold",
// // //     textAlign: "center",
// // //     marginBottom: 20,
// // //     color: "#333",
// // //   },
// // //   logItem: {
// // //     backgroundColor: "#fff",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     padding: 15,
// // //     marginBottom: 10,
// // //     borderRadius: 8,
// // //     shadowColor: "#000",
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 5,
// // //     elevation: 3,
// // //   },
// // //   logText: {
// // //     fontSize: 16,
// // //     marginLeft: 10,
// // //     color: "#444",
// // //   },
// // // });

// // // export default WaterLogs;


// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Dimensions,
// // } from "react-native";
// // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // import { subscribeToEntityState } from "../../homeAssistant"; // Import the WebSocket function

// // const { width: viewportWidth } = Dimensions.get("window");

// // const WaterLogs = () => {
// //   const [logs, setLogs] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const entityId = "sensor.phyn_pc1_daily_water_usage"; // ✅ Update with correct entity

// //   useEffect(() => {
// //     setLoading(true);

// //     // Subscribe to WebSocket updates from Home Assistant
// //     const unsubscribe = subscribeToEntityState(entityId, (newState) => {
// //       const latestUsage = parseFloat(newState);
// //       const timeStamp = new Date().toLocaleString();

// //       setLogs((prevLogs) => [
// //         {
// //           time: timeStamp,
// //           value: `${latestUsage} L`,
// //           sensor: "Daily Water Usage",
// //         },
// //         ...prevLogs.filter((_, index) => index < 10), // Keep only last 10 logs
// //       ]);
// //     });

// //     setLoading(false);
// //     return () => unsubscribe(); // Cleanup WebSocket on unmount
// //   }, []);

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.header}>💧 Water Usage Logs</Text>
// //       {loading ? (
// //         <ActivityIndicator size="large" color="#00aaff" />
// //       ) : (
// //         <FlatList
// //           data={logs}
// //           keyExtractor={(item, index) => index.toString()}
// //           renderItem={({ item }) => (
// //             <View style={styles.logItem}>
// //               <MaterialCommunityIcons name="water" size={24} color="#007BFF" />
// //               <View>
// //                 <Text style={styles.logText}> {item.time}</Text>
// //                 <Text style={styles.logText}>
// //                   {item.sensor}: {item.value}
// //                 </Text>
// //               </View>
// //             </View>
// //           )}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // // 🎨 Styles
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: "#ffffff", // ✅ White background fix
// //   },
// //   header: {
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     textAlign: "center",
// //     marginBottom: 20,
// //     color: "#333",
// //   },
// //   logItem: {
// //     backgroundColor: "#fff",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     padding: 15,
// //     marginBottom: 10,
// //     borderRadius: 8,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.2,
// //     shadowRadius: 5,
// //     elevation: 3,
// //   },
// //   logText: {
// //     fontSize: 16,
// //     marginLeft: 10,
// //     color: "#444",
// //   },
// // });

// // export default WaterLogs;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { subscribeToEntityState } from "../../homeAssistant";

// const { width: viewportWidth } = Dimensions.get("window");

// const WaterLogs = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const entityId = "sensor.phyn_pc1_daily_water_usage"; // ✅ Update this with actual entity ID

//   // Get today's date (YYYY-MM-DD)
//   const getCurrentDate = () => new Date().toISOString().split("T")[0];

//   // Load logs from AsyncStorage when component mounts
//   useEffect(() => {
//     const loadLogs = async () => {
//       const today = getCurrentDate();
//       const storedLogs = await AsyncStorage.getItem("waterLogs");

//       if (storedLogs) {
//         const parsedLogs = JSON.parse(storedLogs);
//         if (parsedLogs.date === today) {
//           setLogs(parsedLogs.data); // Load today's logs
//         } else {
//           await AsyncStorage.removeItem("waterLogs"); // Remove old logs
//         }
//       }
//       setLoading(false);
//     };

//     loadLogs();
//   }, []);

//   useEffect(() => {
//     setLoading(true);

//     // Subscribe to real-time water usage updates
//     const unsubscribe = subscribeToEntityState(entityId, async (newState) => {
//       const latestUsage = parseFloat(newState);
//       const timeStamp = new Date().toLocaleTimeString();
//       const today = getCurrentDate();

//       // Save and update logs
//       setLogs((prevLogs) => {
//         const updatedLogs = [
//           {
//             date: today,
//             time: timeStamp,
//             value: `${latestUsage} L`,
//             sensor: "Daily Water Usage",
//           },
//           ...prevLogs.slice(0, 10), // Keep only last 10 logs
//         ];

//         AsyncStorage.setItem(
//           "waterLogs",
//           JSON.stringify({ date: today, data: updatedLogs })
//         );

//         return updatedLogs;
//       });
//     });

//     setLoading(false);
//     return () => unsubscribe(); // Cleanup WebSocket on unmount
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Today's Water Usage</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#00aaff" />
//       ) : (
//         <FlatList
//           data={logs}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.logItem}>
//               <MaterialCommunityIcons name="water" size={24} color="#007BFF" />
//               <View>
//                 <Text style={styles.logText}>🕒 {item.time}</Text>
//                 <Text style={styles.logText}>
//                   🔹 {item.sensor}: {item.value}
//                 </Text>
//               </View>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#ffffff", // ✅ White background fix
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#333",
//   },
//   logItem: {
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   logText: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: "#444",
//   },
// });

// export default WaterLogs;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { subscribeToEntityState } from "../../homeAssistant";
import moment from "moment-timezone"; // ✅ Import moment-timezone for Mountain Time conversion

const { width: viewportWidth } = Dimensions.get("window");

const WaterLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const entityId = "sensor.phyn_pc1_daily_water_usage"; // ✅ Update with correct entity ID

  // Get today's date in **Mountain Time**
  const getCurrentDate = () => moment().tz("America/Denver").format("YYYY-MM-DD");

  useEffect(() => {
    const loadLogs = async () => {
      const today = getCurrentDate();
      const storedLogs = await AsyncStorage.getItem("waterLogs");

      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        if (parsedLogs.date === today) {
          setLogs(parsedLogs.data); // Load only today's logs
        } else {
          await AsyncStorage.removeItem("waterLogs"); // Remove old logs
        }
      }
      setLoading(false);
    };

    loadLogs();
  }, []);

  useEffect(() => {
    setLoading(true);

    // ✅ Subscribe to real-time water usage updates
    const unsubscribe = subscribeToEntityState(entityId, async (newState) => {
      const latestUsage = parseFloat(newState);
      const timestampUTC = moment().utc(); // Get UTC timestamp
      const timestampMT = timestampUTC.tz("America/Denver").format("YYYY-MM-DD HH:mm:ss"); // Convert to Mountain Time

      const today = getCurrentDate();

      setLogs((prevLogs) => {
        const updatedLogs = [
          {
            date: today, // ✅ Store Date
            time: timestampMT, // ✅ Store time in Mountain Time
            value: `${latestUsage} L`,
            sensor: "Daily Water Usage",
          },
          ...prevLogs.slice(0, 20), // Keep only last 10 logs
        ];

        AsyncStorage.setItem(
          "waterLogs",
          JSON.stringify({ date: today, data: updatedLogs })
        );

        return updatedLogs;
      });
    });

    setLoading(false);
    return () => unsubscribe(); // Cleanup WebSocket on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Water Usage</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00aaff" />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <MaterialCommunityIcons name="water" size={24} color="#007BFF" />
              <View>
                <Text style={styles.logText}> 🕒 {item.date} {item.time}</Text> 
               
                <Text style={styles.logText}>
                  🔹 {item.sensor}: {item.value}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff", // ✅ White background fix
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  logItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  logText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#444",
  },
});

export default WaterLogs;
