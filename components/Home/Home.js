import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import VideoCall from "../VideoCall";
import Activities2 from "../Activities";
import Entertainment from "../Entertainment";
import Lights from "../Lights";
import HowTo from "../HowTo";
import GLCommunity from "../GLCommunity";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

interface Item {
  title: string;
  icon: string;
  component?: JSX.Element;
  prompt: string;
}

const data: Item[] = [
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities2 />,
    prompt: "Join an Activity?",
  },
  {
    title: "VIDEO CALL",
    icon: "phone",
    component: <VideoCall />,
    prompt: "Make a Video Call?",
  },
  {
    title: "ENTERTAINMENT",
    icon: "movie-open-star",
    component: <Entertainment />,
    prompt: "Watch Entertainment?",
  },
  {
    title: "HOW-TO VIDEOS",
    icon: "account-question",
    component: <HowTo />,
    prompt: "Need Help With Your Garden Loft?",
  },
  {
    title: "GARDEN LOFT",
    icon: "home-group-plus",
    component: <GLCommunity />,
    prompt: "Meet Garden Loft Members?",
  },
  {
    title: "LIGHTS",
    icon: "lightbulb",
    component: <Lights />,
    prompt: "Change Lights?",
  },
  // {
  //   title: "LOGOUT",
  //   icon: "logout",
  //   component: <Logout />,
  //   prompt: "Log out of Garden Loft app?",
  // },
  {
    title: "LOGOUT",
    icon: "logout",
    prompt: "Log out of Garden Loft app?",
  },
];

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  const handleCardPress = (item: Item, index: number) => {
    if (item.title === "LOGOUT") {
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Logout cancelled"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const auth = getAuth();
              try {
                await signOut(auth);
                await AsyncStorage.removeItem("rememberedUser");
                console.log("User signed out!");
              } catch (error) {
                console.error("Logout failed:", error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      carouselRef.current?.scrollTo({ index, animated: true });
    }
  };

  const renderItem = ({ item, index }: { item: Item, index: number }) => (
    <Pressable onPress={() => handleCardPress(item, index)}>
      <View
        style={[
          styles.item,
          {
            backgroundColor: index === activeIndex ? "#f3b718" : "#909090",
          },
        ]}>
        <MaterialCommunityIcons
          style={[
            styles.icon,
            {
              color: index === activeIndex ? "black" : "#f3b718",
            },
          ]}
          name={item.icon}
          size={82}
        />
        <Text
          style={[
            styles.title,
            {
              color: index === activeIndex ? "black" : "#f3b718",
            },
          ]}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  const handleArrowPress = (direction: "left" | "right") => {
    let newIndex = activeIndex;
    if (direction === "left") {
      newIndex = (activeIndex - 1 + data.length) % data.length;
    } else if (direction === "right") {
      newIndex = (activeIndex + 1) % data.length;
    }
    carouselRef.current?.scrollTo({ index: newIndex, animated: true });
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.2)}
        height={Math.round(viewportHeight * 0.9)}
        loop={true}
        style={{ width: Math.round(viewportWidth * 0.8) }}
        onSnapToItem={handleSnapToItem}
        pagingEnabled={false}
        scrollEnabled={false}
        snapEnabled={false}
      />
      <Text style={styles.prompt}>{data[activeIndex].prompt}</Text>
      <View style={styles.carousel2}>{data[activeIndex].component}</View>
      <Pressable
        style={styles.arrowLeft}
        onPress={() => handleArrowPress("left")}>
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
      <Pressable
        style={styles.arrowRight}
        onPress={() => handleArrowPress("right")}>
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "column",
    gap: 2,
  },
  carousel2: {
    marginBottom: -40,
  },
  prompt: {
    fontSize: 30,
    marginBottom: 15,
    marginTop: -10,
    color: "rgb(45, 62, 95)",
  },
  item: {
    width: viewportWidth * 0.17,
    height: viewportHeight * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    flexDirection: "column",
    gap: 30,
    paddingHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 8,
      height: 7,
    },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#f3b718",
  },
  arrowLeft: {
    position: "absolute",
    top: "12%",
    left: 0,
    transform: [{ translateY: -10 }],
  },
  arrowRight: {
    position: "absolute",
    top: "12%",
    right: -10,
    transform: [{ translateY: -10 }],
  },
  icon: {},
});

export default Home;
