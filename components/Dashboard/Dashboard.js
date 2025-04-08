import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import AppUsageDash from "./AppUsageDash"; // Import AppUsageDash
import TochTech from "../IotDevices/TochTech/TochTech"; // Placeholder for Sleep
import HomeBento from "./HomeBento";
import WaterSensor from "./WaterSensor";
import { fetchUserHomeId } from '../../homeAssistant';

// Import other components when available

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isPhone = SCREEN_WIDTH <= 514;

const Dashboard = ({ visible, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("Overview"); // Default tab
  // const [homeId, setHomeId] = useState(null);

  // useEffect(() => {
  //   const loadHomeId = async () => {
  //     try {
  //       const id = await fetchUserHomeId(); // Get homeId from Firebase
  //       setHomeId(id);
  //     } catch (error) {
  //       console.error("Failed to fetch homeId:", error);
  //     }
  //   };
  //   loadHomeId();
  // }, []);

  // useEffect(() => {
  //   const loadHomeId = async () => {
  //     await new Promise(resolve => setTimeout(resolve, 10000)); // 3 sec delay before fetching
  //     const id = await fetchUserHomeId();
  //     setHomeId(id);
  //   };
  
  //   if (visible) {
  //     loadHomeId();
  //   }
  // }, [visible]);
  

  // Mapping components to the selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "App Usage":
        return <AppUsageDash />;
      case "Sleep":
        return <TochTech />; // Placeholder for Sleep component
      case "Movement":
        return (
          <Text style={styles.placeholderText}>Movement Data Coming Soon</Text>
        );
      case "Health":
        return (
          <Text style={styles.placeholderText}>Health Data Coming Soon</Text>
        );
      case "Water":
        // return homeId ? <WaterSensor  /> : <Text>Loading Home ID...</Text>;
        return (
          <WaterSensor />
        );
      case "Home Controls":
        return (
          <Text style={styles.placeholderText}>Home Controls Coming Soon</Text>
          // <HomeBento />
        );
      default:
        return <Text style={styles.placeholderText}>Overview Coming Soon</Text>;
    }
  };

    const tabs = [
      { name: "Overview", icon: "view-dashboard-outline" }, // Dashboard icon
      { name: "Home Controls", icon: "home-automation" }, // Health icon
      { name: "App Usage", icon: "chart-bar" }, // Bar chart icon
      { name: "Sleep", icon: "sleep" }, // Sleep icon
      { name: "Movement", icon: "walk" }, // Walking person icon
      { name: "Health", icon: "heart-pulse" }, // Health icon
      { name: "Water", icon: "water-outline" }, // Health icon

    ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>IoT Dashboard</Text>

          <View style={styles.dashboardContainer}>
            {/* Left-side Buttons */}
            {/* <View style={styles.buttonContainer}>
              {["Overview", "App Usage", "Sleep", "Movement", "Health"].map(
                (tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      selectedTab === tab && styles.activeTab, // Highlight active tab
                    ]}
                    onPress={() => setSelectedTab(tab)}
                  >
                    <Text style={styles.tabText}>{tab}</Text>
                  </TouchableOpacity>
                )
              )}
            </View> */}
             <View style={styles.buttonContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.name}
                  style={[
                    styles.tabButton,
                    selectedTab === tab.name && styles.activeTab, // Highlight active tab
                  ]}
                  onPress={() => setSelectedTab(tab.name)}
                >
                  <MaterialCommunityIcons name={tab.icon} size={20} color="#333" style={styles.iconStyle} />
                  <Text style={styles.tabText}>{tab.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Right-side Content */}
            <View style={styles.contentContainer}>{renderContent()}</View>
          </View>
              {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(117, 94, 4, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: isPhone ? 20 : 30, // Smaller margin for phones
    width: isPhone ? "70%" : Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.95, // Adjust width for phones
    height: isPhone ? "75%" : Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.68, // Adjust height for phones
    alignItems: "center",
    justifyContent: "flex-start", // Ensure top alignment for phones
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },

  modalText: {
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  dashboardContainer: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    width: "80%",
    height: "12%",
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#f3b718",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    // paddingLeft: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
  },
  activeTab: {
    borderColor: "#f09030",
    borderWidth: 5, // Highlight active tab
  },
  iconStyle: {
    marginRight: 10, // Space between icon and text
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Dashboard;
