import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import supabase from "../../SupabaseConfig";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AppUsageDash = () => {

  // Text Message App Usage Collection
  const [messageData, setMessageData] = useState({
    sent: 0,
    received: 0,
    logs: [],
  });
  

  useEffect(() => {
    fetchMessageLogs();
  }, []);

  // Fetch Sent and Received Messages
  const fetchMessageLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("app_usage_event_log")
        .select("event_type")
        .in("event_type", ["text_message_sent", "text_message_received"]);

      if (error) return console.error("Error fetching logs:", error);

      setMessageData({
        sent: data.filter((log) => log.event_type === "text_message_sent")
          .length,
        received: data.filter(
          (log) => log.event_type === "text_message_received"
        ).length,
        logs: data,
      });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>App Usage Data</Text>
      <Text style={styles.title2}>Text Messages:</Text>
      <Text style={styles.modalText}>Messages Sent: {messageData.sent}</Text>
      <Text style={styles.modalText}>Messages Received: {messageData.received}</Text>

      {/* <BarChart
        data={{
          labels: ["Sent", "Received"],
          datasets: [{ data: [messageData.sent, messageData.received] }],
        }}
        width={SCREEN_WIDTH * 0.4}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f3b718",
          backgroundGradientTo: "#f09030",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{ marginVertical: 10, borderRadius: 20 }}
      /> */}

       {/* Message Logs in raw format */}
          <ScrollView style={styles.logContainer}>
        {messageData.logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {new Date(log.event_time).toLocaleString()} - {log.event_type}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  title1: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  title2: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default AppUsageDash;
