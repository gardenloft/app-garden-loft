import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  fetchResidentData,
  fetchResidentDataDaily,
  fetchResidentDailySleep,
} from "./apiTochTech";
import { BarChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TochTech({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  // const [modalVisible, setModalVisible] = useState(false);

  const loadResidents = async () => {
    setLoading(true);
    const residents = await fetchResidentData();
    const residentsDaily = await fetchResidentDataDaily();
    const sleepData = await fetchResidentDailySleep();

    if (sleepData) {
      setScore(sleepData.score);
      setSleepQuality(sleepData.sleep_quality);
    }
    setData(residents, residentsDaily);
    setLoading(false);
  };

  useEffect(() => {
    loadResidents();
  }, []);

  // Calculate Night Time Sleep (in minutes)
  const nightTimeSleep = sleepQuality
    ? (sleepQuality.inBedDuration - sleepQuality.wakeDuration) / 60
    : 0;

  // Convert to hours and minutes
  const hours = Math.floor(nightTimeSleep);
  const minutes = Math.round(nightTimeSleep % 60);

  // Convert Sleep Durations from seconds to minutes
  const sleepDurations = sleepQuality
    ? {
        remDuration: sleepQuality.remDuration / 60,
        lightDuration: sleepQuality.lightDuration / 60,
        deepDuration: sleepQuality.deepDuration / 60,
        wakeDuration: sleepQuality.wakeDuration / 60,
      }
    : null;

  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text>Vericare Residents Data</Text>
    //   {loading ? <ActivityIndicator size="large" /> :

    //   (
    //     <>
    //       <Text style={{ fontSize: 16 }}>Score: {score ?? "N/A"}</Text>
    //       <Text style={{ fontSize: 16, marginTop: 10 }}>Sleep Quality:</Text>
    //       {sleepQuality ? (
    //         Object.entries(sleepQuality).map(([key, value]) => (
    //           <Text key={key}>{key}: {value}</Text>
    //         ))
    //       ) : (
    //         <Text>No sleep data available</Text>
    //       )}
    //     </>
    //   )}
    //   {/* <Text>{JSON.stringify(data, null, 2)}</Text> */}
    //   <Button title="Refresh Data" onPress={loadResidents} />
    // </View>

    // Bento Boxes Display of Sleep Score and Sleep Quality
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          width: SCREEN_WIDTH * 0.5,
          height: SCREEN_HEIGHT * 0.7,
          backgroundColor: "#ff8",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Sleep Quality
        </Text>

        {/* Bento Box 1: Sleep Quality Score */}
        <View
          style={{
            backgroundColor: "#f3b718",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            Sleep Score
          </Text>
          <Text style={{ fontSize: 22 }}>{score ?? "N/A"}</Text>
        </View>

        {/* Bento Box 2: Night Time Sleep */}
        <View
          style={{
            backgroundColor: "#f09030",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            Night Time Sleep
          </Text>
          <Text style={{ fontSize: 22 }}>
            {hours}h {minutes}m
          </Text>
        </View>

        {/* Bar Chart */}
        {sleepDurations && (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Sleep Stages
            </Text>
            <BarChart
              data={{
                labels: ["REM", "Light", "Deep", "Wake"],
                datasets: [{ data: Object.values(sleepDurations) }],
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
                barColors: ["#3b82f6", "#10b981", "#ef4444", "#f97316"], // Different colors for bars
              }}
              style={{ marginVertical: 10, borderRadius: 10 }}
            />
          </>
        )}

        {/* <TouchableOpacity
              style={{ backgroundColor: "#f09030", padding: 10, borderRadius: 10, marginTop: 20, alignSelf: "center" }}
              onPress={onClose}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Close</Text>
            </TouchableOpacity> */}
      </View>
    </View>
  );
}
