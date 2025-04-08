import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HomeBento = () => {
  // Define Bento Box Data
  const bentoItems = [
    { name: "TV", icon: "television", color: "#A8DADC" },
    { name: "Lights Kitchen", icon: "lightbulb-on-outline", color: "#F4A261" },
    { name: "Lights Living Room", icon: "lightbulb-group-outline", color: "#E76F51" },
    { name: "TV Remote", icon: "remote-tv", color: "#457B9D" },
    { name: "A/C", icon: "air-conditioner", color: "#2A9D8F" },
    { name: "Doorbell", icon: "doorbell", color: "#8D99AE" },
  ];


  return (
    <View style={styles.container}>
      {bentoItems.map((item, index) => (
        <View key={index} style={[styles.bentoBox, { backgroundColor: item.color }]}>
          <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
          <Text style={styles.bentoText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.7,
    padding: 10,
  },
  bentoBox: {
    width: "30%", // 3 items per row
    aspectRatio: 1, // Makes it square
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  bentoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
});

export default HomeBento;
