import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import VideoCall from "../VideoCall";
import Activities2 from "../Activities";
import Entertainment from "../Entertainment";
import Lights from "../Lights";
import Games from "../Games"; 
import HowTo from "../HowTo";
import GLClub from "../GLClub";
// import WatchParty from "../WatchParty";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Logout from "../Logout";
import ComingSoon from "../ComingSoon";
import Kosmi from '../Kosmi'

const data = [
  {
    id: 1,
    title: "MY FRIENDS",
    icon: "home-group-plus",
    component: <GLClub />,
    prompt: "",
  },
  // {
  //   id: 2,
  //   title: "VIDEO CALL",
  //   icon: "phone",
  //   component: <VideoCall />,
  //   // component: <VideoSDK />,
  //   prompt: "Make a Video Call?",
  // },
  {
    id: 3,
    title: "MY ENTERTAINMENT",
    icon: "movie-open-star",
    component: <Entertainment />,
    prompt: "Watch Entertainment?",
  },
  // {
  //   title: "CLUBS",
  //   icon: "account-group",
  //   component: <ComingSoon />,
  //   prompt: "Watch Entertainment?",
  // },
  // {
  //   title: "EVENTS",
  //   icon: "calendar-star",
  //   component: <ComingSoon />,
  //   prompt: "Join an Upcoming Event?",
  // },
  {
    id: 4,
    title: "WATCH PARTY",
    icon: "calendar-star",
    component: <Kosmi />,
    prompt: "Watch Party?",
  },
  // {

  //   title: "COURSES",
  //   // icon: "card-account-details-star-outline",
  //   icon: "food-variant",
  //   component: <ComingSoon />,
  //   prompt: "Join a Course?",
  // },
  {
    id: 5,
    title: "MY ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities2 />,
    prompt: "Join an Activity?",
  },
  {
    id: 6,
    title: "HOW-TO VIDEOS",
    component: <HowTo />,
    icon: "account-question",
    prompt: "Need Help With Your Garden Loft?",
  },
  // {
  //   title: "LIGHTS",
  //   icon: "lightbulb",
  //   // component: <Lights />,
  //   component: <ComingSoon/>,
  //   prompt: "Change Lights?",
  // },
  {
    id: 7,
    title: "LOG OUT",
    icon: "logout",
    component: <Logout />,
    prompt: "Log Out of Garden Loft App?",
  },
  {
    id: 8,
    title: "MY CALENDAR",
    icon: "calendar-month",
    component: <ComingSoon/>,
    prompt: "See What's Coming Up?",
  },
  {
    id: 9,
    title: "Games",
    // icon: "card-account-details-star-outline",
    icon: "gamepad",
    component: <Games />,
    prompt: "Lets play Games?",
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Set initial active index
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [showPrompt, setShowPrompt] = useState(false); // Prompt visibility state
  const carouselRef = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
    setIsLoading(true); // Set loading true when snapping to a new item
    setShowPrompt(false); // Hide prompt while loading the new component
  };

  // Simulate component loading with a timeout and show prompt 1 second after loading
  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      setIsLoading(false); // Set loading to false after component has "loaded"
      const promptTimeout = setTimeout(() => {
        setShowPrompt(true); // Show prompt 1 second after the component has loaded
      }, 0);

      return () => clearTimeout(promptTimeout); // Cleanup prompt timeout on unmount
    }, 1000); // Simulating a 1-second load time

    return () => clearTimeout(loadTimeout); // Cleanup loading timeout on unmount
  }, [activeIndex]);

  const handleCardPress = (item, index) => {
    // carouselRef.current.scrollTo({ index });
  };

  const handleCardPressSnap = (item, index) => {
    // carouselRef.current.scrollTo({ index, animated: true }); // Scroll to the clicked card
    // setActiveIndex(index); // Set the clicked card as the active index
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleCardPressSnap(item, index)}>
      <View
        style={[
          styles.item,
          { backgroundColor: index === activeIndex ? "#f3b718" : "#909090" },
          {
            transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
            width: viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").width * 0.18)
              : Math.round(Dimensions.get("window").width * 0.28),
            height: viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.25)
              : Math.round(Dimensions.get("window").height * 0.20),
            marginLeft: viewportWidth > viewportHeight ? 350 : 220,
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
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? 28 : 18,
            top: viewportWidth > viewportHeight ? "12%" : "14.5%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>

      <Carousel
        ref={carouselRef}
        width={Math.round(viewportWidth / cardsToShow)}
        height={Math.round(viewportHeight * 0.3)}
        autoPlay={false}
        data={data}
        renderItem={renderItem}
        loop={true}
        onSnapToItem={handleSnapToItem}
        style={[
          styles.carousel,
          { marginTop: viewportWidth > viewportHeight ? 10 : 70 },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? 35 : 22,
            top: viewportWidth > viewportHeight ? "12%" : "15%",
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>

      {/* Show loading indicator while the component is loading */}
      {isLoading ? (
        <ActivityIndicator size="large" color="orange" style={[styles.loading,
          {
            marginBottom: viewportWidth > viewportHeight ? 140 : 340,
          }
        ]} />
      ) : (
        <>
          {/* Show the prompt only when showPrompt is true */}
          {showPrompt && (
            <Text
              style={[
                styles.prompt,
                { marginBottom: viewportWidth > viewportHeight ? 30 : 50 },
              ]}
            >
              {data[activeIndex].prompt}
            </Text>
          )}
          <View style={styles.carousel2}>{data[activeIndex].component}</View>
        </>
      )}
    </View>
  );
};

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
    // marginLeft: 350,
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
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
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
  loading: {
    
  },
});

export default Home;

