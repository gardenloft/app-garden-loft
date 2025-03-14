// import React, { useState, useEffect } from "react";
// import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
// import { fetchUserHomeId, getFilteredEntities } from "../homeAssistant";
// import supabase from "../SupabaseConfig";

// const SENSIBO_API_KEY = "7Eay3hPoQTyfrqrDHHdOqK7rHxiIvn"; // Replace with your actual Sensibo API Key

// const SensiboData = () => {
//   const [sensiboData, setSensiboData] = useState(null);
//   const [acState, setAcState] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [acUsage, setAcUsage] = useState({ onDuration: 0, offDuration: 0 });

//   useEffect(() => {
//     fetchStoredSensiboData();
//     fetchStoredAcUsage();
//     const interval = setInterval(fetchSensiboData, 300000); // Sync every 5 minutes
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch Sensibo Data from Home Assistant API
//   const fetchSensiboFromHA = async () => {
//     try {
//       const homeId = await fetchUserHomeId();
//       const entities = await getFilteredEntities(homeId, ["sensor", "climate"]);

//       const temperature = entities.find((entity) => entity.entity_id.includes("sensor.sally_current_temperature"));
//       const humidity = entities.find((entity) => entity.entity_id.includes("sensor.sally_current_humidity"));
//       const co2 = entities.find((entity) => entity.entity_id === "sensor.sally_s_device_airq_co2");
//       const tvoc = entities.find((entity) => entity.entity_id === "sensor.sally_s_device_airq_tvoc");

//       const ac = entities.find((entity) => entity.entity_id.includes("climate.senville_ac"));
//       const acState = ac ? ac.state : "unknown";

//       return { temperature, humidity, co2, tvoc, acState };
//     } catch (error) {
//       console.error("Error fetching Sensibo data from Home Assistant:", error);
//       return null;
//     }
//   };

//   // Fetch Sensibo Data from Sensibo Cloud API
//   const fetchSensiboFromAPI = async () => {
//     try {
//       const response = await fetch(
//         `https://home.sensibo.com/api/v2/pods?apiKey=${SENSIBO_API_KEY}`
//       );
//       const data = await response.json();

//       if (data.pods && data.pods.length > 0) {
//         const pod = data.pods[0];
//         return {
//           temperature: { state: pod.measurements.temperature, unit: "°C" },
//           humidity: { state: pod.measurements.humidity, unit: "%" },
//           co2: { state: pod.measurements.co2 || "N/A", unit: "ppm" },
//           tvoc: { state: pod.measurements.tvoc || "N/A", unit: "ppb" },
//           acState: pod.acState || "unknown"
//         };
//       } else {
//         console.error("No Sensibo data found.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching Sensibo data from API:", error);
//       return null;
//     }
//   };

//   // Fetch & Store Sensibo + AC Data
//   const fetchSensiboData = async () => {
//     setLoading(true);
//     try {
//       const haData = await fetchSensiboFromHA();
//       const apiData = await fetchSensiboFromAPI();

//       const finalData = {
//         temperature: haData?.temperature || apiData?.temperature || { state: "N/A" },
//         humidity: haData?.humidity || apiData?.humidity || { state: "N/A" },
//         co2: haData?.co2 || apiData?.co2 || { state: "N/A" },
//         tvoc: haData?.tvoc || apiData?.tvoc || { state: "N/A" },
//         acState: haData?.acState || apiData?.acState || "unknown"
//       };

//       setSensiboData(finalData);
//       await saveSensiboDataToSupabase(finalData);
//       await updateAcUsage(finalData.acState);
//     } catch (error) {
//       console.error("Error fetching Sensibo data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Store Sensibo Data in Supabase
//   const saveSensiboDataToSupabase = async (data) => {
//     if (!data) return;

//     const { error } = await supabase
//       .from("ac_data")
//       .insert([{
//         temperature: data.temperature?.state || null,
//         humidity: data.humidity?.state || null,
//         co2: data.co2?.state || null,
//         tvoc: data.tvoc?.state || null,
//         acState: data.acState || "unknown",
//         timestamp: new Date().toISOString(),
//       }]);

//     if (error) console.error("Error saving Sensibo data:", error);
//   };

//   // Track AC Usage (ON/OFF Duration)
//   const updateAcUsage = async (newState) => {
//     if (!acState || acState !== newState) {
//       const timestamp = new Date().toISOString();

//       const { error } = await supabase
//         .from("ac_usage")
//         .insert([{ state: newState, timestamp }]);

//       if (error) console.error("Error updating AC usage:", error);
//       setAcState(newState);
//     }
//   };

//   // Retrieve Latest Stored Sensibo Data
//   const fetchStoredSensiboData = async () => {
//     const { data, error } = await supabase
//       .from("ac_data")
//       .select("*")
//       .order("timestamp", { ascending: false })
//       .limit(1);

//     if (error) {
//       console.error("Error retrieving Sensibo data:", error);
//     } else {
//       setSensiboData(data[0]);
//     }
//   };

//   // Retrieve AC Usage Data & Calculate Duration
//   const fetchStoredAcUsage = async () => {
//     const { data, error } = await supabase
//       .from("ac_usage")
//       .select("*")
//       .order("timestamp", { ascending: true });

//     if (error) {
//       console.error("Error retrieving AC usage:", error);
//     } else {
//       let onDuration = 0;
//       let offDuration = 0;
//       let lastTimestamp = null;
//       let lastState = null;

//       data.forEach((entry) => {
//         if (lastTimestamp) {
//           const duration = (new Date(entry.timestamp) - new Date(lastTimestamp)) / 1000; // Convert to seconds
//           if (lastState === "on") onDuration += duration;
//           else offDuration += duration;
//         }
//         lastTimestamp = entry.timestamp;
//         lastState = entry.state;
//       });

//       setAcUsage({ onDuration, offDuration });
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading Sensibo Data...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sensibo & Senville AC Data</Text>
//       <Text>Temperature: {sensiboData?.temperature?.state || "N/A"}°C</Text>
//       <Text>Humidity: {sensiboData?.humidity?.state || "N/A"}%</Text>
//       <Text>CO2: {sensiboData?.co2?.state || "N/A"} ppm</Text>
//       <Text>TVOC: {sensiboData?.tvoc?.state || "N/A"} ppb</Text>
//       <Text>AC State: {sensiboData?.acState || "Unknown"}</Text>
//       <Text>AC On Duration: {Math.round(acUsage.onDuration / 60)} min</Text>
//       <Text>AC Off Duration: {Math.round(acUsage.offDuration / 60)} min</Text>

//       <Pressable style={styles.refreshButton} onPress={fetchSensiboData}>
//         <Text style={styles.buttonText}>Refresh Data</Text>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { alignItems: "center", padding: 15, backgroundColor: "#FFF" },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
//   refreshButton: { marginTop: 15, backgroundColor: "#f3b718", padding: 10, borderRadius: 5 },
//   buttonText: { color: "white", fontWeight: "bold" },
// });

// export default SensiboData;
