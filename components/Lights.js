//////////////////// Code that uses a array of items below and pulls from the array of items

// import React, { useState, useRef } from "react";
// import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// // import { toggleLight } from "../components/api/homeAssistant.js";
// import { toggleTV } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Lights = () => {
//   const [contacts, setContacts] = useState([
//     {
//       id: 1,
//       // name: "All Lights",
//       // entityId: "light.all_lights", //CHANGE BASED ON SMART LIGHT NAME GIVEN
//       name: "Google TV",
//       entityId: "media_player.family_room_tv",
//       phoneNumber: "1234567890",
//       prompt: "Turn all lights on?",
//       active: false,
//     },
//     {
//       id: 2,
//       // name: "Bedroom Lights",
//       // name: "Bedroom Lights",
//       // entityId: "light.bedroom_lights",
//       name: "Samsung TV",
//       entityId: "media_player.75_qled",
//       phoneNumber: "0987654321",
//       prompt: "Turn bedroom lights ON?",
//       active: false,
//     },
//     {
//       id: 3,
//       name: "Kitchen Lights",
//       // entityId: "light.kitchen_lights",
// name: "GL-TV 1",
  //     entityId: "media_player.samsung_7_series_50",
//       phoneNumber: "9876543210",

//       prompt: "Turn kitchen lights OFF?",
//       active: false,
//     },
//     {
//       id: 4,
//       name: "Bathroom Lights",
//       phoneNumber: "0123456789",
//       prompt: "Turn bathroom lights ON?",
//       active: false,
//     },
//     {
//       id: 5,
//       name: "Living Room Lights",
//       phoneNumber: "6789012345",
//       prompt: "Turn Living Room Lights OFF?",
//       active: false,
//     },
//   ]);

//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

//   // const toggleLight = (id) => {
//   //   setContacts((contacts) =>
//   //     contacts.map((contact) =>
//   //       contact.id === id ? { ...contact, active: !contact.active } : contact
//   //     )
//   //   );
//   // };

//   // Add this in and remove above code for new Toggle Light Code
//   const handleToggleLight = async (id, entityId, isActive) => {
//     const toggleState = !isActive;
//     try {
//       await toggleLight(entityId, toggleState);
//       setContacts((contacts) =>
//         contacts.map((contact) =>
//           contact.id === id ? { ...contact, active: toggleState } : contact
//         )
//       );
//     } catch (error) {
//       console.error("Failed to toggle light.");
//     }
//   };

//   //Handles Toogle TV Home Assistant Green
//   const handleToggleTV = async (id, entityId, isActive) => {
//     const toggleState = !isActive;
//     try {
//       await toggleTV(entityId, toggleState);
//       setContacts((contacts) =>
//         contacts.map((contact) =>
//           contact.id === id ? { ...contact, active: toggleState } : contact
//         )
//       );
//     } catch (error) {
//       console.error("Failed to toggle TV.");
//       //       console.log("HA URL:", HOME_ASSISTANT_URL);
//       // console.log("HA Token:", HOME_ASSISTANT_TOKEN);
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
//           transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       // onPress={() => toggleLight(item.id)}
//       // onPress={() => handleToggleLight(item.id, item.entityId, item.active)}
//       onPress={() => handleToggleTV(item.id, item.entityId, item.active)}
//     >
//       <MaterialCommunityIcons
//         name="lightbulb"
//         size={94}
//         color={item.active ? "yellow" : "white"}
//       />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}
//     >
//       <Carousel
//         ref={carouselRef}
//         data={contacts}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3} //width of carousel card
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }} //width of the carousel
//         loop={true}
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       {/* Prompt */}
//       <Text
//         style={[
//           styles.prompt,
//           {
//             marginBottom: viewportWidth > viewportHeight ? 35 : 100,
//           },
//         ]}
//       >
//         {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
//       </Text>
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
//     // marginLeft: 355, //edits the centering of the carousel
//     flexDirection: "column",
//     gap: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
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
// });

// export default Lights;




/////////////////Code that pulls from Home Assistant Green and fetches devices and states to control on app
// import React, { useState, useRef, useEffect } from "react";
// import { View, Text, Pressable, StyleSheet, Dimensions , ActivityIndicator} from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// // import { toggleLight } from "../components/api/homeAssistant.js";
// import { getAllEntities, getDeviceState, toggleTV } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Lights = () => {

//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isToggling, setIsToggling] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);


//   // Fetch all entities and their states on mount
//   useEffect(() => {
//     const fetchEntities = async () => {
//       try {
//         const entities = await getAllEntities();
//         const filteredDevices = entities
//           .filter((entity) => entity.entity_id.startsWith("media_player.")) // Filter for media players
//           .map((entity) => ({
//             id: entity.entity_id,
//             name: entity.attributes.friendly_name || entity.entity_id,
//             entityId: entity.entity_id,
//             state: entity.state, // Fetch current state
//           }));
//         setDevices(filteredDevices);
//       } catch (error) {
//         console.error("Failed to fetch entities:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEntities();
//   }, []);

//   // Handle device toggle
//   const handleToggleTV = async (id, entityId, currentState) => {
//     console.log(currentState);
//     if (isToggling) return;

//     setIsToggling(true);
//     const turnOn = currentState === "off"; // Determine the toggle direction

//     try {
//       await toggleTV(entityId, turnOn);

//       // Update the state in the devices array
//       setDevices((prevDevices) =>
//         prevDevices.map((device) =>
//           device.id === id ? { ...device, state: turnOn ? "on" : "off" } : device
//         )
//       );
//     } catch (error) {
//       console.error("Failed to toggle TV:", error);
//     } finally {
//       setIsToggling(false);
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
//           transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => handleToggleTV(item.id, item.entityId, item.state)}
//     >
//       <MaterialCommunityIcons
//         name="lightbulb"
//         size={94}
//         // color={item.active ? "yellow" : "white"}
//         color={item.state === "on" ? "yellow" : "white"}
//       />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading device states...</Text>
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
//         // data={contacts}
//         data={devices}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3} //width of carousel card
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }} //width of the carousel
//         loop={true}
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       {/* Prompt */}
//       {/* <Text
//         style={[
//           styles.prompt,
//           {
//             marginBottom: viewportWidth > viewportHeight ? 35 : 100,
//           },
//         ]}
//       >
//         {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
//       </Text> */}
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
//     // marginLeft: 355, //edits the centering of the carousel
//     flexDirection: "column",
//     gap: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
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
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default Lights;


/////////Code that fetches all entities based on the Home Assistant Instance int the .env file
// import React, { useState, useRef, useEffect } from "react";
// import { View, Text, Pressable, StyleSheet, Dimensions , ActivityIndicator} from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { fetchUserHomeId , getFilteredEntities, toggleTV, controlDevice } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// const Lights = () => {

//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isToggling, setIsToggling] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

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
//           // "remote",
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

  // Handle device toggle (comment In)
  // const handleToggleDevice = async (id, entityId, currentState) => {
  //   if (isToggling) return;
    
  //   console.log(currentState);
  //   setIsToggling(true);
  //   const turnOn = currentState === "off"; // Determine the toggle direction

  //   try {
  //     const homeId = await fetchUserHomeId(); // Specify the correct Home Assistant instance ID
  //     await toggleTV(homeId, entityId, turnOn);

  //     // Update the state in the devices array
  //     setDevices((prevDevices) =>
  //       prevDevices.map((device) =>
  //         device.id === id ? { ...device, state: turnOn ? "on" : "off" } : device
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to toggle device:", error);
  //   } finally {
  //     setIsToggling(false);
  //   }
  // };

 /// this added the domain if its tv or switch 
  // const handleToggleDevice = async (id, entityId, currentState, domain) => {
  //   if (isToggling) return;
  
  //   setIsToggling(true);
  //   const turnOn = currentState === "off"; // Determine the toggle direction
  
  //   try {
  //     if (domain === "switch") {
  //       // Handle Leviton DZPA1 toggle
  //       await toggleLight(entityId, turnOn);
  //     } else if (domain === "media_player") {
  //       // Handle TV toggle
  //       await toggleTV(entityId, turnOn);
  //     }
  
  //     // Update the state in the devices array
  //     setDevices((prevDevices) =>
  //       prevDevices.map((device) =>
  //         device.id === id ? { ...device, state: turnOn ? "on" : "off" } : device
  //       )
  //     );
  //   } catch (error) {
  //     console.error(`Failed to toggle device (${entityId}):`, error.message);
  //   } finally {
  //     setIsToggling(false);
  //   }
  // };
  
  // Toggle Smart Light (e.g., Leviton DZPA1)
// export const toggleLight = async (entityId, turnOn = true) => {
//   const service = turnOn ? "turn_on" : "turn_off";

//   try {
//     console.log(`Toggling light (${entityId}): ${turnOn ? "on" : "off"}`);

//     const response = await apiClient.post(`/api/services/switch/${service}`, {
//       entity_id: entityId,
//     });

//     console.log(`Light toggled ${turnOn ? "on" : "off"}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to toggle light (${entityId}):`, error.message);
//     throw error;
//   }
// };

///////*****comment in below */
//     const renderItem = ({ item, index }) => (
//     <Pressable
//       key={item.id}
//       style={[
//         styles.cardContainer,
//         {
//           backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
//           transform: index === activeIndex ? [{ scale: 0.8 }] : [{ scale: 0.8 }],
//         },
//         {
//           height:
//             viewportWidth > viewportHeight
//               ? Math.round(Dimensions.get("window").height * 0.3)
//               : Math.round(Dimensions.get("window").height * 0.25),
//         },
//       ]}
//       onPress={() => handleToggleDevice(item.id, item.entityId, item.state,item.domain)}
//     >
//       <MaterialCommunityIcons
//         name="lightbulb"
//         size={94}
//         // color={item.active ? "yellow" : "white"}
//         color={item.state === "on" ? "yellow" : "white"}
//       />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading device states...</Text>
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
//         // data={contacts}
//         data={devices}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3} //width of carousel card
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }} //width of the carousel
//         loop={true}
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
//       {/* Prompt */}
//       {/* <Text
//         style={[
//           styles.prompt,
//           {
//             marginBottom: viewportWidth > viewportHeight ? 35 : 100,
//           },
//         ]}
//       >
//         {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
//       </Text> */}
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
//     // marginLeft: 355, //edits the centering of the carousel
//     flexDirection: "column",
//     gap: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
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
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default Lights;




//////////////renderIcon based on entityType//////////////////////
// const handleDeviceAction = async (device, action, value = null) => {
//   const homeId = await fetchUserHomeId(); // Fetch the homeId dynamically
//   if (isToggling) return;

//   setIsToggling(true);
//   try {
//     await controlDevice({ homeId, domain: device.domain, entityId: device.entityId, action, value });
//     console.log(homeId, action, value);

//     // Update state dynamically
//     setDevices((prevDevices) =>
//       prevDevices.map((d) =>
//         d.id === device.id
//           ? { ...d, state: action === "toggle" ? (value ? "on" : "off") : d.state }
//           : d
//       )
//     );
//   } catch (error) {
//     console.error(`Failed to control device (${device.entityId}):`, error.message);
//   } finally {
//     setIsToggling(false);
//   }
// };

// const renderItem = ({ item }) => {
//   const icon = {
//     light: "lightbulb",
//     media_player: "television",
//     climate: "air-conditioner",
//     sensor: "thermometer",
//     lock: "lock",
//     switch: "power-plug",
//     camera: "camera",
//   }[item.domain] || "device-hub";

//   const onPress = () => {
//     if (item.domain === "light") {
//       handleDeviceAction(item, "toggle", item.state === "off");
//     } else if (item.domain === "media_player") {
//       handleDeviceAction(item, "turn_on");
//     } else if (item.domain === "climate") {
//       handleDeviceAction(item, "set_temperature", 22);
//     } else if (item.domain === "lock") {
//       handleDeviceAction(item, "toggle", item.state === "unlocked");
//     }
//   };

//   return (
//     <Pressable style={styles.cardContainer} onPress={onPress}>
//       <MaterialCommunityIcons
//         name={icon}
//         size={94}
//         color={item.state === "on" || item.state === "locked" ? "yellow" : "white"}
//       />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </Pressable>
//   );
// };

// if (loading) {
//   return (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#f3b718" />
//       <Text>Loading device states...</Text>
//     </View>
//   );
// }

// return (
//   <View style={styles.container}>
//     <Carousel
//       ref={carouselRef}
//       data={devices}
//       renderItem={renderItem}
//       width={Math.round(viewportWidth * 0.3)}
//       height={viewportHeight * 0.3}
//       style={{
//         width: Math.round(viewportWidth * 0.9),
//         height: Math.round(viewportWidth * 0.5),
//       }}
//       loop={true}
//       onSnapToItem={(index) => setActiveIndex(index)}
//     />
//   </View>
// );
// };

// const styles = StyleSheet.create({
// container: {
//   position: "relative",
//   alignItems: "center",
// },
// cardContainer: {
//   width: viewportWidth * 0.3,
//   justifyContent: "center",
//   alignItems: "center",
//   borderRadius: 20,
//   marginHorizontal: 10,
//   flexDirection: "column",
//   gap: 20,
//   shadowColor: "#000",
//   shadowOffset: { width: 8, height: 7 },
//   shadowOpacity: 0.22,
//   shadowRadius: 9.22,
//   elevation: 12,
// },
// cardText: {
//   fontSize: 25,
//   color: "#393939",
//   fontWeight: "700",
//   textAlign: "center",
// },
// loadingContainer: {
//   flex: 1,
//   justifyContent: "center",
//   alignItems: "center",
// },
// });

// export default Lights;


////this code grabs everytrhing but ids onnly turnign the tv on 
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { fetchUserHomeId, getFilteredEntities, controlDevice } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// const Lights = () => {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isToggling, setIsToggling] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

//   // Fetch all entities and their states on mount
//   useEffect(() => {
//     const fetchEntities = async () => {
//       try {
//         const homeId = await fetchUserHomeId(); // Specify the correct Home Assistant instance ID
//         const domains = ["media_player", "light", "switch", "humidifier", "lock", "climate", "water_heater", "remote"];
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

//   const handleAction = async (device, action, value = null) => {
//     if (isToggling) return;

//     setIsToggling(true);
//     const newState = device.state === "off"; 
//     try {
//       await controlDevice({
//         homeId: await fetchUserHomeId(),
//         domain: device.domain,
//         entityId: device.entityId,
//         action,
//         value,
//       });

//       // Update state dynamically
//       setDevices((prevDevices) =>
//         prevDevices.map((d) =>
//           d.id === device.id
//             ? { ...d, state: action === "toggle" ? (d.state === "off" ? "on" : "off") : d.state }
//             : d
//         )
//       );
//     } catch (error) {
//       console.error(`Failed to perform action on device ${device.id}`, error);
//     } finally {
//       setIsToggling(false);
//     }
//   };

//   const renderItem = ({ item }) => {
//     const icons = {
//       light: "lightbulb",
//       media_player: "television",
//       climate: "air-conditioner",
//       sensor: "thermometer",
//       lock: "lock",
//       switch: "power-plug",
//       camera: "camera",
//       remote: "remote"
//     };

//     const icon = icons[item.domain] || "camera-control";

//     const onPress = () => {
//       if (item.domain === "light" || item.domain === "switch") {
//         handleAction(item, "toggle");
//       } else if (item.domain === "lock") {
//         handleAction(item, item.state === "locked" ? "unlock" : "lock");
//       } else if (item.domain === "media_player") {
//         handleAction(item, "turn_on");
//       } else if (item.domain === "climate") {
//         handleAction(item, "set_temperature", 22); // Example for setting temperature
//       }
//     };

//     return (
//       <Pressable
//         key={item.id}
//         style={[
//           styles.cardContainer,
//           {
//             backgroundColor: item.state === "on" ? "#f3b718" : "#f09030",
//           },
//         ]}
//         onPress={onPress}
//       >
//         <MaterialCommunityIcons
//           name={icon}
//           size={94}
//           color={item.state === "on" || item.state === "locked" ? "yellow" : "white"}
//         />
//         <Text style={styles.cardText}>{item.name}</Text>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading devices...</Text>
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
//         data={devices}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         loop
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
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
//     flexDirection: "column",
//     gap: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default Lights;

////////////// code that turns remote on and off and works with any device passed through it (so far tv, and remote)
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { fetchUserHomeId, getFilteredEntities, controlDevice } from "../homeAssistant";

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// const Lights = () => {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isToggling, setIsToggling] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

//   // Fetch all entities and their states on mount
//   useEffect(() => {
//     const fetchEntities = async () => {
//       try {
//         const homeId = await fetchUserHomeId(); // Specify the correct Home Assistant instance ID
//         const domains = ["media_player", "light", "switch", "humidifier", "lock", "climate", "water_heater", "remote"];
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

//   const handleAction = async (device, action, value = null) => {
//     if (isToggling) return;
  
//     setIsToggling(true);
//     try {
//       let actionToUse = action;
//       let payload = { homeId: await fetchUserHomeId(), domain: device.domain, entityId: device.entityId };
  
//       // Special case for media_player
//       if (device.domain === "media_player" || "switch") {
//         if (action === "toggle") {
//           actionToUse = device.state === "off" ? "turn_on" : "turn_off";
//         }
//       }
  
//       // General device control
//       await controlDevice({
//         ...payload,
//         action: actionToUse,
//         value,
//       });
  
//       // Update state dynamically
//       setDevices((prevDevices) =>
//         prevDevices.map((d) =>
//           d.id === device.id
//             ? { ...d, state: actionToUse === "turn_on" ? "on" : actionToUse === "turn_off" ? "off" : d.state }
//             : d
//         )
//       );
//     } catch (error) {
//       console.error(`Failed to perform action on device ${device.id}`, error);
//     } finally {
//       setIsToggling(false);
//     }
//   };

//   const renderItem = ({ item }) => {
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

//     const icon = icons[item.domain] || "camera-control";

//     const onPress = () => {
//       if (item.domain === "remote" || item.domain === "switch") {
//         handleAction(item, "toggle");
//       } else if (item.domain === "lock") {
//         handleAction(item, item.state === "locked" ? "unlock" : "lock");
//       } else if (item.domain === "media_player") {
//         handleAction(item, "toggle"); // Toggle lights using media player
//       } else if (item.domain === "climate") {
//         handleAction(item, "set_temperature", 22); // Example for setting temperature
//       }
//     };

//     return (
//       <Pressable
//         key={item.id}
//         style={[
//           styles.cardContainer,
//           {
//             backgroundColor: item.state === "on" ? "#f3b718" : "#f09030",
//           },
//         ]}
//         onPress={onPress}
//       >
//         <MaterialCommunityIcons
//           name={icon}
//           size={94}
//           color={item.state === "on" || item.state === "locked" ? "yellow" : "white"}
//         />
//         <Text style={styles.cardText}>{item.name}</Text>
//       </Pressable>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f3b718" />
//         <Text>Loading devices...</Text>
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
//         data={devices}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={viewportHeight * 0.3}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         loop
//         onSnapToItem={(index) => setActiveIndex(index)}
//       />
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
//     flexDirection: "column",
//     gap: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default Lights;


import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { fetchUserHomeId, getFilteredEntities, controlDevice } from "../homeAssistant";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const Lights = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // Fetch all entities and their states on mount
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const homeId = await fetchUserHomeId(); // Specify the correct Home Assistant instance ID
        const domains = ["media_player", "light", "switch", "humidifier", "lock", "climate", "water_heater", "remote"];
        const entities = await getFilteredEntities(homeId, domains);
        const filteredDevices = entities.map((entity) => ({
          id: entity.entity_id,
          name: entity.attributes.friendly_name || entity.entity_id,
          entityId: entity.entity_id,
          attributes: entity.attributes,
          state: entity.state, // Fetch current state
          domain: entity.entity_id.split(".")[0], // Extract domain (e.g., 'switch')
        }));
        setDevices(filteredDevices);
      } catch (error) {
        console.error("Failed to fetch entities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  const handleAction = async (device, action, value = null) => {
    if (isToggling) return;
  
    setIsToggling(true);
    try {
      let actionToUse = action;
      let payload = { homeId: await fetchUserHomeId(), domain: device.domain, entityId: device.entityId };
  
      // Special case for media_player
      if (device.domain === "media_player" || "switch") {
        if (action === "toggle") {
          actionToUse = device.state === "off" ? "turn_on" : "turn_off";
        }
      }
  
      // General device control
      await controlDevice({
        ...payload,
        action: actionToUse,
        value,
      });
  
      // Update state dynamically
      setDevices((prevDevices) =>
        prevDevices.map((d) =>
          d.id === device.id
            ? { ...d, state: actionToUse === "turn_on" ? "on" : actionToUse === "turn_off" ? "off" : d.state }
            : d
        )
      );
    } catch (error) {
      console.error(`Failed to perform action on device ${device.id}`, error);
    } finally {
      setIsToggling(false);
    }
  };
  

  // const handleAction = async (device, action, value = null) => {
  //   if (isToggling) return;

  //   setIsToggling(true);
  //   try {
  //     if (device.domain === "media_player" && action === "toggle") {
  //       // Special case: Toggle lights using media player
  //       const lightDevice = devices.find((d) => d.domain === "media_player");
  //       if (lightDevice) {
  //         const newState = lightDevice.state === "off" ? "on" : "off";
  //         await controlDevice({
  //           homeId: await fetchUserHomeId(),
  //           domain: lightDevice.domain,
  //           entityId: lightDevice.entityId,
  //           action: "toggle",
  //           value: newState === "on",
  //         });

  //         // Update light device state dynamically
  //         setDevices((prevDevices) =>
  //           prevDevices.map((d) =>
  //             d.id === lightDevice.id ? { ...d, state: newState } : d
  //           )
  //         );
  //       }
  //     } else {
  //       // General case for toggling devices
  //       await controlDevice({
  //         homeId: await fetchUserHomeId(),
  //         domain: device.domain,
  //         entityId: device.entityId,
  //         action,
  //         value,
  //       });

  //       // Update state dynamically
  //       setDevices((prevDevices) =>
  //         prevDevices.map((d) =>
  //           d.id === device.id
  //             ? { ...d, state: action === "toggle" ? (d.state === "off" ? "on" : "off") : d.state }
  //             : d
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error(`Failed to perform action on device ${device.id}`, error);
  //   } finally {
  //     setIsToggling(false);
  //   }
  // };

  const renderItem = ({ item }) => {
    const icons = {
      light: "lightbulb",
      media_player: "television",
      climate: "air-conditioner",
      sensor: "thermometer",
      lock: "lock",
      switch: "power-plug",
      camera: "camera",
      remote: "remote",
    };

    const icon = icons[item.domain] || "camera-control";

    const onPress = () => {
      if (item.domain === "remote" || item.domain === "switch") {
        handleAction(item, "toggle");
      } else if (item.domain === "lock") {
        handleAction(item, item.state === "locked" ? "unlock" : "lock");
      } else if (item.domain === "media_player") {
        handleAction(item, "toggle"); // Toggle lights using media player
      } else if (item.domain === "climate") {
        handleAction(item, "set_temperature", 22); // Example for setting temperature
      }
    };

    return (
      <Pressable
        key={item.id}
        style={[
          styles.cardContainer,
          {
            backgroundColor: item.state === "on" ? "#f3b718" : "#f09030",
            transform: [{scale: 0.8}],
                      height:
            viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
          },
        ]}
        onPress={onPress}
      >
        <MaterialCommunityIcons
          name={icon}
          size={94}
          color={item.state === "on" || item.state === "locked" ? "yellow" : "white"}
        />
        <Text style={styles.cardText}>{item.name}</Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View 
      style={[
        styles.loadingContainer,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}
      >
        {/* <ActivityIndicator size="large" color="#f3b718" />
        <Text>Loading devices...</Text> */}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}
    >
      <Carousel
        ref={carouselRef}
        data={devices}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={viewportHeight * 0.3}
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }}
        loop
        onSnapToItem={(index) => setActiveIndex(index)}
      />
       {/* Prompt
//       {/* <Text
//         style={[
//           styles.prompt,
//           {
//             marginBottom: viewportWidth > viewportHeight ? 35 : 100,
//           },
//         ]}
//       >
//         {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
//       </Text> */}
  <Pressable
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -17 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
      <Pressable
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 10,
    padding: 30,
    // marginLeft: 355, //edits the centering of the carousel
    flexDirection: "column",
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 25,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  prompt: {
    fontSize: 25,
    color: "#393939",
  },
  arrowLeft: {
    position: "absolute",
    top: "40%",
    left: -30,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    top: "40%",
    right: -30,
    transform: [{ translateY: -50 }],
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    position: "relative",
    alignItems: "center",
  },
});

export default Lights;