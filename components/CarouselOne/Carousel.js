// components/Carousel.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import VideoCall from "../VideoCall";
import Activities2 from "../Activities";
import Entertainment from "../Entertainment";
import Lights from "../Lights";
import HowTo from "../HowTo";
import GLClub from "../GLClub";
import WatchParty from "../WatchParty";
// import VideoSDK from  '../../app/VideoSDK'
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Logout from "../Logout";
import ComingSoon from "../ComingSoon";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

const data = [
  {
    title: "MY FRIENDS",
    icon: "home-group-plus",
    component: <GLClub />,
    prompt: "",
  },
  {
    title: "VIDEO CALL",
    icon: "phone",
    component: <VideoCall />,
    // component: <VideoSDK />,
    prompt: "Make a Video Call?",
  },
  {
    title: "ENTERTAINMENT",
    icon: "movie-open-star",
    component: <Entertainment />,
    prompt: "Watch Entertainment?",
  },
  {
    title: "CLUBS",
    icon: "account-group",
    component: <ComingSoon />,
    prompt: "Watch Entertainment?",
  },
  {
    title: "EVENTS",
    icon: "calendar-star",
    component: <ComingSoon />,
    prompt: "Change Lights?",
  },
  {
    title: "Watch Party",
    icon: "calendar-star",
    component: <WatchParty />,
    prompt: "Watch Party?",
  },
  {
    title: "COURSES",
    // icon: "card-account-details-star-outline",
    icon: "food-variant",
    component: <ComingSoon />,
    prompt: "Change Lights?",
  },
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities2 />,
    prompt: "Join an Activity?",
  },
  {
    title: "HOW-TO VIDEOS",
    component: <HowTo />,
    icon: "account-question",
    prompt: "Need Help With Your Garden Loft?",
  },
  {
    title: "LIGHTS",
    icon: "lightbulb",
    // component: <Lights />,
    component: <ComingSoon/>,
    prompt: "Change Lights?",
  },
  {
    title: "LOG OUT",
    icon: "logout",
    component: <Logout />,
    prompt: "Log Out of Garden Loft App?",
  },
  {
    title: "CALENDAR",
    icon: "calendar-month",
    component: <ComingSoon/>,
    prompt: "Change Lights?",
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Set initial active index to the yellow card (index 2)
  const carouselRef = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const handleCardPress = (item, index) => {
    carouselRef.current.scrollTo({ index });
  };

  const handleCardPressSnap = (item, index) => {
    handleCardPress(item, index);
    handleSnapToItem(index);
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleCardPressSnap(item, index)}>
      <View
        style={[
          styles.item,
          { backgroundColor: index === activeIndex ? "#f3b718" : "#909090",
          transform: index === activeIndex ? [{scale: 1}] : [{scale: 0.8}]
           },
           {
            width: viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").width * 0.18)
              : Math.round(Dimensions.get("window").width  * 0.28),
          },
           {
            height: viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.25)
              : Math.round(Dimensions.get("window").height * 0.20),
          },
           {
            marginLeft: viewportWidth > viewportHeight
              ? 350
              : 220,
          },
          
        ]}
      >
        <MaterialCommunityIcons
          style={[
            styles.icon,
            { color: index === activeIndex ? "black" : "#f3b718" },
          ]}
          name={item.icon}
          size={82}
        />
        <Text
          style={[
            styles.title,
            { color: index === activeIndex ? "black" : "#f3b718" },
          ]}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );


  const cardsToShow = viewportWidth > viewportHeight ? 5 : 3;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowLeft,
          {left: viewportWidth > viewportHeight
            ? 10
            : 18,
          top: viewportWidth > viewportHeight
            ? "12%"
            : "14.5%",}
        ]}
        // onPress={handlePrev}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <Carousel
        ref={carouselRef}
        // width={Math.round(viewportWidth / 5)} // Display 5 cards
        width={Math.round(viewportWidth / cardsToShow)} // Display 5 cards
        height={Math.round(viewportHeight * 0.3)}
        autoPlay={false}
        data={data}
        renderItem={renderItem}
        loop={true}
        onSnapToItem={handleSnapToItem}
        style={[styles.carousel,
          {marginTop: viewportWidth > viewportHeight
            ? 10
            : 70,}
        ]}
        // autoFillData={true}
        // defaultIndex={2} // Ensure the yellow card is centered initially
        // mode="parallax"
        modeConfig={{
            // parallaxScrollingScale: 1,
            // parallaxScrollingOffset: 20,
            // parallaxAdjacentItemScale: 0.85,
        }}
      />
      <TouchableOpacity
        style={[styles.arrowRight,
          {right: viewportWidth > viewportHeight
            ? 35
            : 22,
          top: viewportWidth > viewportHeight
            ? "12%"
            : "15%",}
        ]}
        // onPress={handleNext}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <Text style={[styles.prompt,
        {marginBottom: viewportWidth > viewportHeight ? 30 : 50}
      ]}>{data[activeIndex].prompt}</Text>
      <View style={styles.carousel2}>{data[activeIndex].component}</View>
    </View>
  );
};
// const cardsSpacing = viewportWidth > viewportHeight ? 0.18 : 3;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "column",
    width: "100%",
  },
  carousel2: {
    marginTop: 10,
  },
  carousel: {
    width: Math.round(Dimensions.get("window").width * 0.8),
  },
  prompt: {
    fontSize: 30,
    color: "rgb(45, 62, 95)",
  },
  item: {
    gap: 10,
    marginLeft: 350,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    flexDirection: "column",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    marginHorizontal: 25,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#f3b718",
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -10 }],
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -10 }],
  },
  icon: {},
});

export default Home;