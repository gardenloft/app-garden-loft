import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { fetchResidentData, fetchResidentDataDaily, fetchResidentDailySleep} from "./apiTochTech";

export default function TochTech() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Vericare Residents Data</Text>
      {loading ? <ActivityIndicator size="large" /> : 
      
      (
        <>
          <Text style={{ fontSize: 16 }}>Score: {score ?? "N/A"}</Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>Sleep Quality:</Text>
          {sleepQuality ? (
            Object.entries(sleepQuality).map(([key, value]) => (
              <Text key={key}>{key}: {value}</Text>
            ))
          ) : (
            <Text>No sleep data available</Text>
          )}
        </>
      )}
      {/* <Text>{JSON.stringify(data, null, 2)}</Text> */}
      <Button title="Refresh Data" onPress={loadResidents} />
    </View>
  );
}