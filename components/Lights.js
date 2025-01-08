import React, { useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
// import { toggleLight } from "../components/api/homeAssistant.js";
import { toggleTV } from "../homeAssistant";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Lights = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      // name: "All Lights",
      // entityId: "light.all_lights", //CHANGE BASED ON SMART LIGHT NAME GIVEN
      name: "Google TV",
      entityId: "media_player.family_room_tv",
      phoneNumber: "1234567890",
      prompt: "Turn all lights on?",
      active: false,
    },
    {
      id: 2,
      // name: "Bedroom Lights",
      // name: "Bedroom Lights",
      // entityId: "light.bedroom_lights",
      name: "Samsung TV",
      entityId: "media_player.75_qled",
      phoneNumber: "0987654321",
      prompt: "Turn bedroom lights ON?",
      active: false,
    },
    {
      id: 3,
      name: "Kitchen Lights",
      // entityId: "light.kitchen_lights",
      phoneNumber: "9876543210",

      prompt: "Turn kitchen lights OFF?",
      active: false,
    },
    {
      id: 4,
      name: "Bathroom Lights",
      phoneNumber: "0123456789",
      prompt: "Turn bathroom lights ON?",
      active: false,
    },
    {
      id: 5,
      name: "Living Room Lights",
      phoneNumber: "6789012345",
      prompt: "Turn Living Room Lights OFF?",
      active: false,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // const toggleLight = (id) => {
  //   setContacts((contacts) =>
  //     contacts.map((contact) =>
  //       contact.id === id ? { ...contact, active: !contact.active } : contact
  //     )
  //   );
  // };

  // Add this in and remove above code for new Toggle Light Code
  const handleToggleLight = async (id, entityId, isActive) => {
    const toggleState = !isActive;
    try {
      await toggleLight(entityId, toggleState);
      setContacts((contacts) =>
        contacts.map((contact) =>
          contact.id === id ? { ...contact, active: toggleState } : contact
        )
      );
    } catch (error) {
      console.error("Failed to toggle light.");
    }
  };

  //Handles Toogle TV Home Assistant Green
  const handleToggleTV = async (id, entityId, isActive) => {
    const toggleState = !isActive;
    try {
      await toggleTV(entityId, toggleState);
      setContacts((contacts) =>
        contacts.map((contact) =>
          contact.id === id ? { ...contact, active: toggleState } : contact
        )
      );
    } catch (error) {
      console.error("Failed to toggle TV.");
      //       console.log("HA URL:", HOME_ASSISTANT_URL);
      // console.log("HA Token:", HOME_ASSISTANT_TOKEN);
    }
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
          transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
        },
        {
          height:
            viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      // onPress={() => toggleLight(item.id)}
      // onPress={() => handleToggleLight(item.id, item.entityId, item.active)}
      onPress={() => handleToggleTV(item.id, item.entityId, item.active)}
    >
      <MaterialCommunityIcons
        name="lightbulb"
        size={94}
        color={item.active ? "yellow" : "white"}
      />
      <Text style={styles.cardText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}
    >
      <Carousel
        ref={carouselRef}
        data={contacts}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={viewportHeight * 0.3} //width of carousel card
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }} //width of the carousel
        loop={true}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      {/* Prompt */}
      <Text
        style={[
          styles.prompt,
          {
            marginBottom: viewportWidth > viewportHeight ? 35 : 100,
          },
        ]}
      >
        {contacts[activeIndex].prompt && contacts[activeIndex].prompt}
      </Text>
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
});

export default Lights;
