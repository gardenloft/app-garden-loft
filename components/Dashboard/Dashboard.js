// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// import supabase from "../../SupabaseConfig";
// import TochTech from "../IotDevices/TochTech/TochTech";
// import AppUsageDash from "./AppUsageDash"; // Import AppUsageDash

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const isPhone = SCREEN_WIDTH <= 514;

// const Dashboard = ({ visible, onClose }) => {
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalText}>IoT Dashboard</Text>


//           {/* Displays the App Usage Data */}
//           <AppUsageDash />

//           {/* Displays TochTech.js Data on Dashboard */}
//           {/* <TochTech onClose={onClose} /> */}

//           <TouchableOpacity onPress={onClose} style={styles.modalButton}>
//             <Text style={styles.modalButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(117, 94, 4, 0.5)",
//   },
//   modalText: {
//     fontSize: 18,
//     color: "#333",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: "#59ACCE",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   closeButton: {
//     alignSelf: "flex-end",
//   },

//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     marginTop: isPhone ? 20 : 30, // Smaller margin for phones
//     width: isPhone ? "70%" : Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.95, // Adjust width for phones
//     height: isPhone ? "75%" : Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.68, // Adjust height for phones
//     alignItems: "center",
//     justifyContent: "flex-start", // Ensure top alignment for phones
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 10,
//   },
// });

// export default Dashboard;

import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AppUsageDash from "./AppUsageDash"; // Import AppUsageDash
import TochTech from "../IotDevices/TochTech/TochTech"; // Placeholder for Sleep
// Import other components when available

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isPhone = SCREEN_WIDTH <= 514;

const Dashboard = ({ visible, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("Overview"); // Default tab

  // Mapping components to the selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "AppUsage":
        return <AppUsageDash />;
      case "Sleep":
        return <TochTech onClose={onClose} />; // Placeholder for Sleep component
      case "Movement":
        return <Text style={styles.placeholderText}>Movement Data Coming Soon</Text>;
      case "Health":
        return <Text style={styles.placeholderText}>Health Data Coming Soon</Text>;
      default:
        return <Text style={styles.placeholderText}>Overview Coming Soon</Text>;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>IoT Dashboard</Text>

          <View style={styles.dashboardContainer}>
            {/* Left-side Buttons */}
            <View style={styles.buttonContainer}>
              {["Overview", "App Usage", "Sleep", "Movement", "Health"].map((tab) => (
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
              ))}
            </View>

            {/* Right-side Content */}
            <View style={styles.contentContainer}>{renderContent()}</View>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
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
    fontSize: 22,
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
    width: "90%",
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#f3b718",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  activeTab: {
    borderColor: "#f09030",
    borderWidth: 3, // Highlight active tab
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
  modalButton: {
    backgroundColor: "#59ACCE",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Dashboard;

