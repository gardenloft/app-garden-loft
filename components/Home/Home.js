import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import VideoCall from "../VideoCall";
import Activities from "../Activities";
import Entertainment from "../Entertainment";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

interface Item {
  title: string;
  icon: string;
  component?: JSX.Element;
  prompt: string;
  action?: () => void;
}

const data: Item[] = [
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities />,
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
];

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  const handleCardPress = (item: Item, index: number) => {
    if (item.action) {
      item.action();
    } else {
      carouselRef.current?.scrollTo({ index, animated: true });
    }
  };

  const renderItem = ({ item, index }: { item: Item; index: number }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, index)}>
      <View
        style={[
          styles.item,
          {
            backgroundColor: index === activeIndex ? "#f3b718" : "#909090",
          },
        ]}
      >
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
          ]}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{data[activeIndex].prompt}</Text>
      <View style={styles.carousel2}>
        {data[activeIndex].component}
      </View>
      <TouchableOpacity
        style={styles.arrowLeft}
        onPress={() => carouselRef.current?.prev()}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.arrowRight}
        onPress={() => carouselRef.current?.next()}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "column",
    gap: 5,
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
