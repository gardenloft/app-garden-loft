import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { fetchWaterUsageData } from '../../homeAssistant';

const fixtureColors = {
  "🚽 Toilet Flush": "#4CAF50",
  "🚰 Bathroom/Kitchen Sink": "#2196F3",
  "🛁 Small Bathtub Fill / Utility Sink": "#FFC107",
  "🍽️ Dishwasher": "#FF9800",
  "🚿 Shower": "#673AB7",
  "🧺 Washing Machine": "#9C27B0",
  "Standby / No Activity": "#9E9E9E",
  "Unknown Fixture": "#F44336",
};

export default function WaterSensor() {
  const [dailyUsage, setDailyUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSessions, setAllSessions] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [showTodayOnly, setShowTodayOnly] = useState(true);

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  console.log(today);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { dailyUsage, sessionHistory } = await fetchWaterUsageData();
        setDailyUsage(dailyUsage);

        // const sessions = sessionHistory
        //   .split('\n')
        //   .filter(Boolean)
        //   .map((line) => {
        //     const [fixture, timestamp, usage] = line.split('|').map(s => s.trim());
        //     return { fixture, timestamp, usage };
        //   });

          const sessions = sessionHistory
  .split(/\n+/) // handle multiple accidental newlines
  .map(line => line.trim())
  .filter(Boolean) // filter out blanks
  .map((line) => {
    const [fixture, timestamp, usage] = line.split('|').map(s => s.trim());
    return { fixture, timestamp, usage };
  });

  setAllSessions(sessions.reverse());
  setTodaySessions(sessions.filter((s) => s.timestamp?.startsWith(today)));

      } catch (error) {
        console.error('Error loading water usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedSessions = showTodayOnly ? todaySessions : allSessions;

  // useEffect(() => {
  //   if (showTodayOnly) {
  //     const todaySessions = history.filter((s) => s.timestamp?.startsWith(today));
  //     setFilteredHistory(todaySessions);
  //   } else {
  //     setFilteredHistory(history);
  //   }
  // }, [history, showTodayOnly]);

  if (loading) {
    return <Text>Loading water usage...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Total Daily Usage Card */}
      <View style={styles.dailyCard}>
        <Text style={styles.dailyHeader}>Total Daily Water Usage</Text>
        <Text style={styles.dailyLitres}>{dailyUsage ? `${dailyUsage}` : '0 L'}</Text>
      </View>

      {/* Toggle Button */}
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setShowTodayOnly(!showTodayOnly)}
      >
        <Text style={styles.toggleButtonText}>
          {showTodayOnly ? 'Show All History' : 'Show Today Only'}
        </Text>
      </TouchableOpacity>

      {/* Session Cards */}
      {/* {filteredHistory.length === 0 ? ( */}
      {displayedSessions.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888' }}>No sessions {showTodayOnly ? 'for today' : ''}</Text>
      ) : (
        // filteredHistory.map((item, idx) => (
          displayedSessions.map((item, idx) => (
          <View key={idx} style={styles.sessionCard}>
            <View style={[styles.badge, { backgroundColor: fixtureColors[item.fixture] || '#607D8B' }]}>
              <Text style={styles.badgeText}>{item.fixture}</Text>
            </View>
            <Text style={styles.infoText}>{item.usage}</Text>
            <Text style={styles.infoText}>{item.timestamp}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  dailyCard: {
    backgroundColor: '#f3b718',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  dailyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dailyLitres: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  toggleButton: {
    backgroundColor: '#59ACCE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

