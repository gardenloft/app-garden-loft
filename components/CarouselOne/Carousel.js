// // components/Carousel.js
// import React, { useRef, useState } from 'react';
// import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import Carousel from 'react-native-reanimated-carousel';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import CarouselCard from './CarouselCard';
// import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

// const { width: viewportWidth } = Dimensions.get('window');
// const carouselWidth = viewportWidth * 0.90;
// const cardWidth = carouselWidth / 5;

// const data = [
//   {
//     title: "ACTIVITIES",
//     icon: "child",
//     // component: <Activities2 />,
//     prompt: "Join an Activity?",
//   },
//   { icon: 'phone', title: 'VIDEO CALL' },
//   { icon: 'users', title: 'GARDEN LOFT' },
//   { icon: 'television', title: 'ENTERTAINMENT' },
//   { icon: 'youtube-play', title: 'HOW-TO VIDEOS' },
//   { icon: 'sun-o', title: 'LIGHTS' },
//   { icon: 'angellist', title: 'LOG OUT' },
// ]

// const CustomCarousel = () => {
//   const carouselRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePrev = () => {
//     carouselRef.current.prev();
//   };

//   const handleNext = () => {
//     carouselRef.current.next();
//   };

//   const getCardStyle = (index) => {
//     const scale = index === currentIndex ? 2 : 1;
//     return {
//       width: cardWidth * scale,
//       height: cardWidth * scale,
//     };
//   };

//   return (
//     <View style={styles.carouselContainer}>
//       <TouchableOpacity style={styles.arrow} onPress={handlePrev}>
//         <Icon name="angle-left" size={80} color="#000" />
//       </TouchableOpacity>
//       <Carousel
//         ref={carouselRef}
//         width={carouselWidth}
//         height={cardWidth}
//         autoPlay={false}
//         inactiveSlideScale={0.8}
//         inactiveSlideOpacity={0.7}
//         pagingEnabled={false}
//         snapEnabled={false}
//         loop={true}
//         data={data}
//         onScrollIndexChanged={setCurrentIndex}
//         renderItem={({ item, index }) => (
//           <View style={getCardStyle(index)}>
//           <CarouselCard iconName={item.icon} label={item.title} cardWidth={cardWidth}/>
//           </View>
//         )}
//         style={styles.carousel}
//         mode="horizontal-stack"
//         modeConfig={{
//           snapDirection: 'left',
//           stackInterval: cardWidth,
//         }}
//       />
//       <TouchableOpacity style={styles.arrow} onPress={handleNext}>
//         <Icon name="angle-right" size={80} color="#000" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   carouselContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     marginTop: 120,
//   },
//   arrow: {
//     padding: 10,
//   },
//   carousel: {
//     width: carouselWidth,
//   },
// });

// export default CustomCarousel;

// // components/Carousel.js
// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import Carousel from "react-native-reanimated-carousel";
// import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
// // import { getAuth, signOut } from 'firebase/auth';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // import VideoCall from '../CarouselTwo/VideoCall';
// // import Activities2 from '../CarouselTwo/Activities2';
// // import Lights from '../CarouselTwo/Lights';
// // import Entertainment from '../CarouselTwo/Entertainment';
// // import HowTo from '../CarouselTwo/HowTo';
// // import GLCommunity from '../CarouselTwo/GLCommunity';

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const data = [
//   {
//     title: "ACTIVITIES",
//     icon: "weight-lifter",
//     // component: <Activities2 />,
//     prompt: "Join an Activity?",
//   },
//   {
//     title: "VIDEO CALL",
//     icon: "phone",
//     // component: <VideoCall />,
//     prompt: "Make a Video Call?",
//   },
//   {
//     title: "GARDEN LOFT",
//     icon: "home-group-plus",
//     // component: <GLCommunity />,
//     prompt: "Meet Garden Loft Members?",
//   },
//   {
//     title: "ENTERTAINMENT",
//     icon: "movie-open-star",
//     // component: <Entertainment />,
//     prompt: "Watch Entertainment?",
//   },
//   {
//     title: "HOW-TO VIDEOS",
//     icon: "account-question",
//     // component: <HowTo />,
//     prompt: "Need Help With Your Garden Loft?",
//   },
//   {
//     title: "LIGHTS",
//     icon: "lightbulb",
//     // component: <Lights />,
//     prompt: "Change Lights?",
//   },
//   // {
//   //   title: 'LOGOUT',
//   //   icon: 'logout',
//   //   prompt: 'Want to log out of Garden Loft app?',
//   //   action: async () => {
//   //     Alert.alert(
//   //       'Logout',
//   //       'Are you sure you want to log out?',
//   //       [
//   //         { text: 'Cancel', onPress: () => console.log('Logout cancelled'), style: 'cancel' },
//   //         {
//   //           text: 'Yes',
//   //           onPress: async () => {
//   //             const auth = getAuth();
//   //             try {
//   //               await signOut(auth);
//   //               await AsyncStorage.removeItem('rememberedUser');
//   //               console.log('User signed out!');
//   //             } catch (error) {
//   //               console.error('Logout failed:', error);
//   //             }
//   //           }
//   //         }
//   //       ],
//   //       { cancelable: false }
//   //     );
//   //   },
//   // },
// ];

// const Home = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);

//   const handleSnapToItem = (index) => {
//     setActiveIndex(index);
//   };

//   const handleCardPress = (item, index) => {
//     if (item.action) {
//       item.action();
//     } else {
//       carouselRef.current.scrollTo({ index });
//     }
//   };

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity onPress={() => handleCardPress(item, index)}>
//       <View
//         style={[
//           styles.item,
//           { backgroundColor: index === activeIndex ? "#f3b718" : "#909090" },
//         ]}
//       >
//         <MaterialCommunityIcons
//           style={[
//             styles.icon,
//             { color: index === activeIndex ? "black" : "#f3b718" },
//           ]}
//           name={item.icon}
//           size={82}
//         />
//         <Text
//           style={[
//             styles.title,
//             { color: index === activeIndex ? "black" : "#f3b718" },
//           ]}
//         >
//           {item.title}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.arrowLeft}
//         onPress={() => carouselRef.current.prev()}
//       >
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//       <Carousel
//         ref={carouselRef}
//         width={Math.round(viewportHeight * 0.28)}
//         height={Math.round(viewportHeight * 0.3)}
//         autoPlay={false}
//         data={data}
//         renderItem={renderItem}
//         loop={true}
//         onSnapToItem={handleSnapToItem}
//         // mode="parallax"
//         // modeConfig={{
//         //   parallaxScrollingScale: 0.9,
//         //   parallaxScrollingOffset: 0.1,
//         // }}
//         style={styles.carousel}
//       />
//       <TouchableOpacity
//         style={styles.arrowRight}
//         onPress={() => carouselRef.current.next()}
//       >
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//       <Text style={styles.prompt}>{data[activeIndex].prompt}</Text>
//       <View style={styles.carousel2}>{data[activeIndex].component}</View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     marginTop: 10,
//     flexDirection: "column",
//     width: "100%",
//   },
//   carousel2: {
//     marginTop: 10,
//   },
//   carousel: {
//    width: Math.round(viewportWidth * 0.9),
//     marginTop: 10,
//   },
//   prompt: {
//     fontSize: 30,
//     marginBottom: 500,
//     marginTop: 10,
//     color: "rgb(45, 62, 95)",
//   },
//   item: {
//     width: viewportWidth * 0.17,
//     height: viewportHeight * 0.25,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 60,
//     flexDirection: "column",
//     paddingHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//     marginHorizontal: 5,
//   },
//   title: {
//     fontSize: 19,
//     fontWeight: "bold",
//     color: "#f3b718",
//   },
//   arrowLeft: {
//     position: "absolute",
//     top: "12%",
//     left: 30,
//     transform: [{ translateY: -10 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     top: "12%",
//     right: 30,
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
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
// import VideoCall from "../VideoCall";

import Entertainment from "../Entertainment";
import Activities from "../Activities";
import HowTo from "../HowTo";
import Lights from "../Lights";
// import { getAuth, signOut } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const data = [
  {
    title: "ACTIVITIES",
    icon: "weight-lifter",
    component: <Activities />,
    prompt: "Join an Activity?",
  },
  {
    title: "VIDEO CALL",
    icon: "phone",
    // component: <VideoCall />,
    prompt: "Make a Video Call?",
  },
  {
    title: "GARDEN LOFT",
    icon: "home-group-plus",
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
    icon: "account-question",
    component: <HowTo />,
    prompt: "Need Help With Your Garden Loft?",
  },
  {
    title: "LIGHTS",
    icon: "lightbulb",
    component: <Lights />,
    prompt: "Change Lights?",
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(3); // Set initial active index to the yellow card (index 2)
  const carouselRef = useRef(null);

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const handleCardPress = (item, index) => {
    if (item.action) {
      item.action();
    } else {
      carouselRef.current.scrollTo({ index });
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleCardPress(item, index)}>
      <View
        style={[
          styles.item,
          { backgroundColor: index === activeIndex ? "#f3b718" : "#909090" },
        ]}>
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
          ]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowLeft}
        onPress={() => carouselRef.current.prev()}>
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <Carousel
        ref={carouselRef}
        width={Math.round(viewportHeight * 0.28)}
        height={Math.round(viewportHeight * 0.25)}
        autoPlay={false}
        data={data}
        renderItem={renderItem}
        loop={true}
        onSnapToItem={handleSnapToItem}
        style={styles.carousel}
        defaultIndex={3} // Ensure the yellow card is centered initially
      />
      <TouchableOpacity
        style={styles.arrowRight}
        onPress={() => carouselRef.current.next()}>
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
  },
  carousel2: {
    marginTop: 10,
  },
  carousel: {
    width: Math.round(viewportWidth * 0.9),
    marginTop: 10,
    marginLeft: 90,
  },
  prompt: {
    fontSize: 30,
    // marginBottom: 370,
    // marginTop: 10,
    color: "rgb(45, 62, 95)",
  },
  item: {
    width: viewportWidth * 0.17,
    height: viewportHeight * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    flexDirection: "column",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#f3b718",
  },
  arrowLeft: {
    position: "absolute",
    top: "12%",
    left: 30,
    transform: [{ translateY: -10 }],
  },
  arrowRight: {
    position: "absolute",
    top: "12%",
    right: 30,
    transform: [{ translateY: -10 }],
  },
  icon: {},
});

export default Home;
