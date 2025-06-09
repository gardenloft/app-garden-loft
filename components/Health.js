import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";

// Import local assets
import personalIcon from "../assets/personal.png";
import careIcon from "../assets/care2.png";
import handymanIcon from "../assets/handy.png";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

// Phone-specific styles
const phoneStyles =
  viewportWidth <= 513
    ? {
        container: { height: 400 },
        cardContainer: {
          marginTop: 50,
          width: viewportWidth * 0.32,
          height: viewportHeight * 0.2,
          padding: 15,
          marginHorizontal: 10,
          shadowOpacity: 0,
          elevation: 0,
        },
        cardText: { fontSize: 16 },
        icon: { size: 50 },
        image: { width: 50, height: 50 },
      }
    : {
        image: { width: 130, height: 130 },
      };

// Add image for items with custom icons
const servicesData = [
  { id: "1", name: "Location", icon: "map-pin"  },
  { id: "2", name: "Cooking", icon: "chef-hat"},
  { id: "3", name: "Sleeping", icon: "bed"  },
  { id: "4", name: "Showering", icon: "shower-head" },
  { id: "5", name: "Front Door", icon: "door-closed" },
];

const Health = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item, index }) => (
    <View
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: "#f09030",
          transform: [{ scale: 0.85 }],
          height:
            viewportWidth > viewportHeight
              ? Math.round(viewportHeight * 0.3)
              : Math.round(viewportHeight * 0.25),
        },
        phoneStyles.cardContainer,
      ]}
    >
      {item.image ? (
        <Image
          source={item.image}
          style={[styles.image, phoneStyles.image]}
          resizeMode="contain"
        />
      ) : (
        <MaterialCommunityIcons
          name={item.icon}
          size={phoneStyles.icon?.size || 94}
          color="white"
        />
      )}
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
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
        data={servicesData}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        loop
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.6),
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        scrollAnimationDuration={800}
        snapEnabled
      />

      <Pressable
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -17 : -22,
            top:
              viewportWidth <= 413
                ? "25%"
                : viewportWidth > viewportHeight
                ? "40%"
                : "30%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome
          name="angle-left"
          size={viewportWidth <= 413 ? 70 : 100}
          color="black"
        />
      </Pressable>

      <Pressable
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top:
              viewportWidth <= 413
                ? "25%"
                : viewportWidth > viewportHeight
                ? "40%"
                : "30%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome
          name="angle-right"
          size={viewportWidth <= 413 ? 70 : 100}
          color="black"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginTop: 10,
    ...phoneStyles.container,
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginLeft: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    padding: 20,
    overflow: "hidden",
    ...phoneStyles.cardContainer,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 25,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    ...phoneStyles.cardText,
  },
  arrowLeft: {
    position: "absolute",
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
});

export default Health;
