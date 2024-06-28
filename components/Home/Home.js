// import React, { useState, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
// import VideoCall from "../VideoCall";
// import Activities from "../Activities";
// import Entertainment from "../Entertainment";
// import Lights from "../Lights";
// import HowTo from "../HowTo";
// import GLClub from "../GLClub";
// import Logout from "../Logout"; // Import the Logout component

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// interface Item {
//   title: string;
//   icon: string;
//   component?: JSX.Element;
//   prompt: string;
// }

// const data: Item[] = [
//   {
//     title: "ACTIVITIES",
//     icon: "weight-lifter",
//     component: <Activities />,
//     prompt: "Join an Activity?",
//   },
//   {
//     title: "VIDEO CALL",
//     icon: "phone",
//     component: <VideoCall />,
//     prompt: "Make a Video Call?",
//   },
//   {
//     title: "ENTERTAINMENT",
//     icon: "movie-open-star",
//     component: <Entertainment />,
//     prompt: "Watch Entertainment?",
//   },
//   {
//     title: "HOW-TO VIDEOS",
//     icon: "account-question",
//     component: <HowTo />,
//     prompt: "Need Help With Your Garden Loft?",
//   },
//   {
//     title: "GARDEN LOFT",
//     icon: "home-group-plus",
//     component: <GLClub />,
//     prompt: "Meet Garden Loft Members?",
//   },
//   {
//     title: "LIGHTS",
//     icon: "lightbulb",
//     component: <Lights />,
//     prompt: "Change Lights?",
//   },
//   {
//     title: "LOGOUT",
//     icon: "logout",
//     component: <Logout />, // Render the Logout component
//     prompt: "Log out of Garden Loft app?",
//   },
// ];

// const Home: React.FC = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

//   const handleSnapToItem = (index: number) => {
//     setActiveIndex(index);
//   };

//   const handleCardPress = (item: Item, index: number) => {
//     if (item.title === "LOGOUT") {
//       // Do nothing, as the Logout component handles its own logic
//     } else {
//       carouselRef.current?.scrollTo({ index, animated: true });
//     }
//   };

//   const renderItem = ({ item, index }: { item: Item, index: number }) => (
//     <Pressable onPress={() => handleCardPress(item, index)}>
//       <View
//         style={[
//           styles.item,
//           {
//             backgroundColor: index === activeIndex ? "#f3b718" : "#909090",
//           },
//         ]}>
//         <MaterialCommunityIcons
//           style={[
//             styles.icon,
//             {
//               color: index === activeIndex ? "black" : "#f3b718",
//             },
//           ]}
//           name={item.icon}
//           size={82}
//         />
//         <Text
//           style={[
//             styles.title,
//             {
//               color: index === activeIndex ? "black" : "#f3b718",
//             },
//           ]}>
//           {item.title}
//         </Text>
//       </View>
//     </Pressable>
//   );

//   const handleArrowPress = (direction: "left" | "right") => {
//     let newIndex = activeIndex;
//     if (direction === "left") {
//       newIndex = (activeIndex - 1 + data.length) % data.length;
//     } else if (direction === "right") {
//       newIndex = (activeIndex + 1) % data.length;
//     }
//     carouselRef.current?.scrollTo({ index: newIndex, animated: true });
//     setActiveIndex(newIndex);
//   };

//   return (
//     <View style={styles.container}>
//       <Carousel
//         ref={carouselRef}
//         data={data}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.2)}
//         height={Math.round(viewportHeight * 0.9)}
//         loop={true}
//         style={{ width: Math.round(viewportWidth * 0.8) }}
//         onSnapToItem={handleSnapToItem}
//         pagingEnabled={false}
//         scrollEnabled={false}
//         snapEnabled={false}
//       />
//       <Text style={styles.prompt}>{data[activeIndex].prompt}</Text>
//       <View style={styles.carousel2}>{data[activeIndex].component}</View>
//       <Pressable
//         style={styles.arrowLeft}
//         onPress={() => handleArrowPress("left")}>
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//       <Pressable
//         style={styles.arrowRight}
//         onPress={() => handleArrowPress("right")}>
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     marginTop: 10,
//     flexDirection: "column",
//     gap: 2,
//   },
//   carousel2: {
//     marginBottom: -40,
//   },
//   prompt: {
//     fontSize: 30,
//     marginBottom: 15,
//     marginTop: -10,
//     color: "rgb(45, 62, 95)",
//   },
//   item: {
//     width: viewportWidth * 0.17,
//     height: viewportHeight * 0.25,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 60,
//     flexDirection: "column",
//     gap: 30,
//     paddingHorizontal: 10,
//     shadowColor: "#000000",
//     shadowOffset: {
//       width: 8,
//       height: 7,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   title: {
//     fontSize: 19,
//     fontWeight: "bold",
//     marginLeft: 10,
//     color: "#f3b718",
//   },
//   arrowLeft: {
//     position: "absolute",
//     top: "12%",
//     left: 0,
//     transform: [{ translateY: -10 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     top: "12%",
//     right: -10,
//     transform: [{ translateY: -10 }],
//   },
//   icon: {},
// });

// export default Home;

// components/Carousel.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import VideoCall from "../VideoCall";
import Activities2 from "../Activities";
import Entertainment from "../Entertainment";
import Lights from "../Lights";
import HowTo from "../HowTo";
import GLClub from "../GLClub";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Logout from "../Logout";
import VideoSDK from "../../app/VideoSDK";
import HelpButton from "../HelpButton";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const data = [
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities2 />,
    prompt: "Join an Activity?",
  },
  {
    title: "VIDEO CALL",
    icon: "phone",
    // component: <VideoCall />,
    component: <VideoSDK />,
    prompt: "Make a Video Call?",
  },
  {
    title: "GARDEN LOFT",
    icon: "home-group-plus",
    component: <GLClub />,
    prompt: "Meet Garden Loft Members?",
  },
  {
    title: "ENTERTAINMENT",
    icon: "movie-open-star",
    component: <Entertainment />,
    prompt: "Watch Entertainment?",
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
    component: <Lights />,
    prompt: "Change Lights?",
  },
  {
    title: "LOG OUT",
    icon: "logout",
    component: <Logout />,
    prompt: "Log Out of Garden Loft App?",
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Set initial active index to the yellow card (index 2)
  const carouselRef = useRef(null);

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
           }
          
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


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowLeft}
        // onPress={handlePrev}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <Carousel
        ref={carouselRef}
        width={Math.round(viewportWidth / 5)} // Display 5 cards
        height={Math.round(viewportHeight * 0.3)}
        autoPlay={false}
        data={data}
        renderItem={renderItem}
        loop={true}
        onSnapToItem={handleSnapToItem}
        style={styles.carousel}
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
        style={styles.arrowRight}
        // onPress={handleNext}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <Text style={styles.prompt}>{data[activeIndex].prompt}</Text>
      <View style={styles.carousel2}>{data[activeIndex].component}</View>
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
    backgroundColor: "#FCF8E3"
  },
  carousel2: {
    marginTop: 10,
  },
  carousel: {
    width: Math.round(viewportWidth * 0.8),
    marginTop: 10,
  },
  prompt: {
    fontSize: 30,
    color: "rgb(45, 62, 95)",
    marginBottom: 50,
  },
  item: {
  
    width: Math.round(viewportWidth * 0.18), // Width for 5 items
    height: Math.round(viewportHeight * 0.25),
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
    top: "12%",
    left: 10,
    transform: [{ translateY: -10 }],
  },
  arrowRight: {
    position: "absolute",
    top: "12%",
    right: 35,
    transform: [{ translateY: -10 }],
  },
  icon: {},
});

export default Home;

