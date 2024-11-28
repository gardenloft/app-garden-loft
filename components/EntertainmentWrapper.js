import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entertainment from "./Entertainment"; // Your existing component

const EntertainmentWrapper = () => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // Handle user acceptance of terms
  const handleAcceptTerms = async () => {
    setHasAcceptedTerms(true);
    try {
      await AsyncStorage.setItem("youtube_terms_accepted", "true"); // Persist acceptance
    } catch (e) {
      console.error("Failed to save terms acceptance: ", e);
    }
  };

  // Check AsyncStorage on component load
  useEffect(() => {
    const checkTermsAccepted = async () => {
      try {
        const accepted = await AsyncStorage.getItem("youtube_terms_accepted");
        if (accepted === "true") {
          setHasAcceptedTerms(true);
        }
      } catch (e) {
        console.error("Failed to fetch terms acceptance: ", e);
      }
    };
    checkTermsAccepted();
  }, []);

  // Conditionally render based on terms acceptance
  return hasAcceptedTerms ? (
    <Entertainment />
  ) : (
    <TermsScreen onAccept={handleAcceptTerms} />
  );
};

const TermsScreen = ({ onAccept }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>YouTube Terms of Service</Text>
        <Text style={styles.text}>
          To access the video content, you must agree to the following terms:
          {"\n"}- YouTube Terms of Service (
          <Text style={styles.link}>
            https://www.youtube.com/t/terms
          </Text>
          )
          {"\n"}- Google Privacy Policy (
          <Text style={styles.link}>
            https://policies.google.com/privacy
          </Text>
          )
          {"\n"}- YouTube API Services Terms of Service (
          <Text style={styles.link}>
            https://developers.google.com/youtube/terms/api-services-terms-of-service
          </Text>
          )
        </Text>
      </ScrollView>
      <Button title="Accept and Continue" onPress={onAccept} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default EntertainmentWrapper;
