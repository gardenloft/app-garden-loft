import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { VLCPlayer } from "react-native-vlc-media-player";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchUserHomeId, fetchStreamUrl } from "../homeAssistant"; // Import functions

const DoorbellLive = () => {
  const { cameraEntityId } = useLocalSearchParams(); // Camera entity ID passed from notification
  const router = useRouter();
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStream = async () => {
      try {
        const homeId = await fetchUserHomeId();
        const url = await fetchStreamUrl(homeId, cameraEntityId);
        setStreamUrl(url);
      } catch (err) {
        console.error("Error fetching stream URL:", err);
        setError("Failed to load video stream.");
        Alert.alert("Error", "Failed to load video stream.");
      } finally {
        setLoading(false);
      }
    };

    getStream();
  }, [cameraEntityId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doorbell Live Stream</Text>

      {streamUrl ? (
        <VLCPlayer
          style={styles.videoPlayer}
          videoAspectRatio="16:9"
          source={{
            uri: streamUrl,
            initOptions: [
              "--network-caching=20",
              "--rtsp-tcp",
              "--no-stats",
              "--clock-jitter=0",
              "--clock-synchro=0",
            ],
          }}
          hwDecoderEnabled={1}
          hwDecoderForced={1}
          onError={(error) => {
            console.error("VLCPlayer Error:", error);
            setError("Failed to load video stream.");
          }}
          onBuffering={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
        />
      ) : (
        <Text style={styles.errorText}>No stream available.</Text>
      )}

      {loading && <ActivityIndicator size="large" color="#FFA500" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  videoPlayer: {
    width: "100%",
    height: "60%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "orange",
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default DoorbellLive;
