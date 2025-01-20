//////// Code that grabs Home Assitant Devices Entities and states and displays them allowing us to turn on/off via media_player and remote

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Modal,
//   FlatList,
//   ScrollView
// } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import {
//   fetchUserHomeId,
//   getFilteredEntities,
//   controlDevice,
// } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Lights = () => {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isToggling, setIsToggling] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [filteredEntities, setFilteredEntities] = useState([]);
//   const [modalTitle, setModalTitle] = useState("");
//   const carouselRef = useRef(null);

//   const categories = [
//     { id: "all", name: "All Controls", icon: "apps" },
//     { id: "light", name: "Lights", icon: "lightbulb" },
//     { id: "media_player", name: "TV", icon: "television" },
//     { id: "camera", name: "Camera", icon: "camera" },
//   ];

//   // Fetch all entities and their states on mount
//   useEffect(() => {
//     const fetchEntities = async () => {
//       try {
//         const homeId = await fetchUserHomeId(); // Specify the correct Home Assistant instance ID
//         const domains = [
//           "media_player",
//           "light",
//           "switch",
//           "humidifier",
//           "lock",
//           "climate",
//           "water_heater",
//           "remote",
//         ];
//         const entities = await getFilteredEntities(homeId, domains);
//         const filteredDevices = entities.map((entity) => ({
//           id: entity.entity_id,
//           name: entity.attributes.friendly_name || entity.entity_id,
//           entityId: entity.entity_id,
//           attributes: entity.attributes,
//           state: entity.state, // Fetch current state
//           domain: entity.entity_id.split(".")[0], // Extract domain (e.g., 'switch')
//         }));
//         setDevices(filteredDevices);
//       } catch (error) {
//         console.error("Failed to fetch entities:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEntities();
//   }, []);

//   const openModal = (categoryId) => {
//     let filtered = [];
//     switch (categoryId) {
//       case "all":
//         filtered = devices;
//         setModalTitle("All Controls");
//         break;
//       case "light":
//         filtered = devices.filter((device) => device.domain === "light");
//         setModalTitle("Lights");
//         break;
//       case "media_player":
//         filtered = devices.filter(
//           (device) =>
//             device.domain === "media_player" || device.domain === "remote"
//         );
//         setModalTitle("TV and Remote");
//         break;
//       case "camera":
//         filtered = devices.filter((device) => device.domain === "camera");
//         setModalTitle("Cameras");
//         break;
//       default:
//         filtered = [];
//     }
//     setFilteredEntities(filtered);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setFilteredEntities([]);
//   };


//   const handleAction = async (device, action, value = null) => {
//     if (isToggling) return;

//     setIsToggling(true);

//     // Optimistically update the state
//     const newState = device.state === "on" ? "off" : "on";
//     const updatedDevices = devices.map((d) =>
//       d.id === device.id ? { ...d, state: newState } : d
//     );
//     setDevices(updatedDevices);

//     try {
//       const homeId = await fetchUserHomeId();
//       const domainAction =
//         action === "toggle"
//           ? device.state === "on"
//             ? "turn_off"
//             : "turn_on"
//           : action;

//       await controlDevice({
//         homeId,
//         domain: device.domain,
//         entityId: device.entityId,
//         action: domainAction,
//         value,
//       });

//       console.log(
//         `Device ${device.name} toggled to ${newState} successfully.`
//       );
//     } catch (error) {
//       console.error(`Failed to toggle ${device.name}:`, error);

//       // Revert to the original state on error
//       const revertedDevices = devices.map((d) =>
//         d.id === device.id ? { ...d, state: device.state } : d
//       );
//       setDevices(revertedDevices);
//     } finally {
//       setIsToggling(false);
//     }
//   };


//   const renderDeviceItem = ( item ) => {
//     const icons = {
//       light: "lightbulb",
//       media_player: "television",
//       climate: "air-conditioner",
//       sensor: "thermometer",
//       lock: "lock",
//       switch: "power-plug",
//       camera: "camera",
//       remote: "remote",
//     };

//     // [item.domain] || "device-hub";

//     const icon = icons[item.domain] || "camera-control";

//     const onPress = () => {
//       switch (item.domain) {
//         case "remote":
//         case "switch":
//         case "media_player":
//           // Toggle for these domains
//           handleAction(item, "toggle");
          
//           break;
    
//         case "lock":
//           // Lock or unlock based on the current state
//           handleAction(item, item.state === "locked" ? "unlock" : "lock");
//           break;
    
//         case "climate":
//           // Example: Set a specific temperature for climate devices
//           handleAction(item, "set_temperature", 22);
//           break;
    
//         default:
//           // Fallback for unsupported domains or custom handling
//           console.warn(`Action not supported for domain: ${item.domain}`);
//       }
//     };


//     return (
//       <Pressable
//         key={item.id}
//         style={[
//           styles.cardContainer,
//           {
//             backgroundColor: item.state === "on" ? "#f3b718" : "#f09030",
//             transform: [{ scale: 0.8 }],
//             height:
//               viewportWidth > viewportHeight
//                 ? Math.round(Dimensions.get("window").height * 0.3)
//                 : Math.round(Dimensions.get("window").height * 0.25),
//           },
//         ]}
//         onPress={onPress}
//       >
//         <MaterialCommunityIcons
//           name={icon}
//           size={94}
//           color={
//             item.state === "on" || item.state === "locked" ? "yellow" : "white"
//           }
//         />
//         <Text style={styles.cardText}>{item.name}</Text>
//       </Pressable>
//     );
//   };

//   const renderModalItem = ({ item }) => renderItem({ item });



//   if (loading) {
//     return (
//       <View
//         style={[
//           styles.loadingContainer,
//           { height: viewportWidth > viewportHeight ? 320 : 450 },
//         ]}
//       >
//         {/* <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading devices...</Text> */}
//       </View>
//     );
//   }

//   return (
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}
//     >
//       <Carousel
//         ref={carouselRef}
//         // data={devices}
//         data={categories}
//         // renderItem={renderItem}
//         renderItem={({ item }) => (


//           <Pressable
       
//           style={[
//             styles.cardContainer,
//             {
//               backgroundColor: item.state === "on" ? "#f3b718" : "#f09030",
//               transform: [{ scale: 0.8 }],
//               height:
//                 viewportWidth > viewportHeight
//                   ? Math.round(Dimensions.get("window").height * 0.3)
//                   : Math.round(Dimensions.get("window").height * 0.25),
//             },
//           ]}
//           onPress={() => openModal(item.id)}
//         >
//           <MaterialCommunityIcons
//             name={item.icon || "apps"}
//             size={94}
//             color={
//                "white"
//             }
//           />
//           <Text style={styles.cardText}>{item.name}</Text>
//         </Pressable>
//         )}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         loop
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       {/* Prompt
// //       {/* <Text
// //         style={[
// //           styles.prompt,
// //           {
// //             marginBottom: viewportWidth > viewportHeight ? 35 : 100,
// //           },
// //         ]}
// //       >
// //         {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
// //       </Text> */}
//       <Pressable
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: -1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//       <Pressable
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           carouselRef.current?.scrollTo({ count: 1, animated: true });
//         }}
//       >
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>

//       {/* Modal that opens up the entities */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>{modalTitle}</Text>
//           {/* <FlatList
//             data={filteredEntities}
//             renderItem={renderModalItem}
//             keyExtractor={(item) => item.id}
//             numColumns={3}
//             columnWrapperStyle={styles.row}
//           /> */}
//            <ScrollView contentContainerStyle={styles.scrollViewContent}>
//            {/* {filteredEntities.map((item) => renderDeviceItem(item))} */}
//            {filteredEntities.map((item, index) => (
//     <View key={item.id} style={styles.gridItem}>
//       {renderDeviceItem(item)}
//     </View>
//   ))}
//           </ScrollView>
//           <Pressable style={styles.closeButton} onPress={closeModal}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </Pressable>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 20,
//     marginHorizontal: 10,
//     padding: 30,
//     flexDirection: "column",
//     gap: 20,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   modalContainer: {
//     // flex: 1,
//     // backgroundColor: "#fff",
//     margin: 10,
//     height: viewportHeight * 0.9,
//     width: viewportWidth * 0.95,
//     marginTop: 50,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 0,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 5,
//     alignSelf: "center",

//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     paddingTop: 30,
//     paddingLeft: 30,
//   },
//   closeButton: {
//     // backgroundColor: "#f3b718",
//     // padding: 10,
//     // borderRadius: 10,
//     // alignItems: "center",
//     // marginTop: 20,
//       position: "absolute",
//       top: 30,
//       right: 30,
//       backgroundColor: "lightblue",
//       padding: 13,
//       borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   scrollViewContent: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     paddingHorizontal: 30,
//   },
//   gridItem: {
//     width: `${100 / 3 - 3}%`, // Each item takes up ~33% of the row
//     marginVertical: 10, // Vertical spacing between rows
//     alignItems: "center", // Center align content within each grid item
//   },
//   // row: {
//   //   // justifyContent: "space-between",
//   // },
//   prompt: {
//     fontSize: 25,
//     color: "#393939",
//   },
//   arrowLeft: {
//     position: "absolute",
//     top: "40%",
//     left: -30,
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     top: "40%",
//     right: -30,
//     transform: [{ translateY: -50 }],
//   },
//   loadingContainer: {
//     position: "relative",
//     alignItems: "center",
//   }
// });

// export default Lights;
