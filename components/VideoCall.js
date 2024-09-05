// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Modal,
//   Image,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { collection, getDocs } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { useRouter } from "expo-router";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const VideoCall = () => {
//   const [userNames, setUserNames] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollViewRef = useRef(null);
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       fetchAddedContacts(user.uid);
//     }
//   }, [user]);

//   const fetchAddedContacts = async (userId) => {
//     const querySnapshot = await getDocs(
//       collection(FIRESTORE_DB, `users/${userId}/addedContacts`)
//     );
//     const fetchedUserNames = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       name: doc.data().name,
//       pushToken: doc.data().pushToken,
//       uid: doc.id,
//       imageUrl: doc.data().imageUrl,
//     }));
//     setUserNames(fetchedUserNames);
//   };

//   const startVideoCall = async (calleeUid) => {
//     router.push({
//       pathname: "/VideoSDK2",
//       params: { calleeUid: calleeUid },
//     });
//   };

//   const handleSnapToItem = (index) => {
//     setActiveIndex(index);
//   };

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
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
//       onPress={() => startVideoCall(item.uid)}>
//       <Image source={item.imageUrl} style={styles.image} />
//       <Text style={styles.cardText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}>
//       <Carousel
//         data={userNames}
//         renderItem={renderItem}
//         width={Math.round(viewportWidth * 0.3)}
//         height={Math.round(viewportWidth * 0.3)}
//         style={{
//           width: Math.round(viewportWidth * 0.9),
//           height: Math.round(viewportWidth * 0.5),
//         }}
//         snapEnabled
//         scrollAnimationDuration={800}
//         onSnapToItem={handleSnapToItem}
//         ref={scrollViewRef}
//       />
//       <Text style={styles.prompt}>{userNames[activeIndex]?.prompt}</Text>

//       <TouchableOpacity
//         style={[
//           styles.arrowLeft,
//           {
//             left: viewportWidth > viewportHeight ? -17 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: -1, animated: true });
//         }}>
//         <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[
//           styles.arrowRight,
//           {
//             right: viewportWidth > viewportHeight ? -25 : -22,
//             top: viewportWidth > viewportHeight ? "40%" : "30%",
//           },
//         ]}
//         onPress={() => {
//           scrollViewRef.current?.scrollTo({ count: 1, animated: true });
//         }}>
//         <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
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
//     // marginLeft: 250,  //edits the centering of the carousel
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 30,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   prompt: {
//     fontSize: 25,
//     color: "#393939",
//     fontWeight: "700",
//     marginTop: 15,
//   },
//   arrowLeft: {
//     // top and left styles are above in code for media queries
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     // top and right styles are above in code for media queries
//     position: "absolute",
//     transform: [{ translateY: -50 }],
//   },
// });

// export default VideoCall;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const VideoCall = () => {
  const [userNames, setUserNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchFriends(user.uid);
    }
  }, [user]);

  // Function to fetch friends from the Firestore friends collection
  const fetchFriends = async (userId) => {
    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, `users/${userId}/friends`)
      );
      const fetchedUserNames = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        pushToken: doc.data().pushToken,
        uid: doc.id,
        imageUrl: doc.data().imageUrl,
      }));
      setUserNames(fetchedUserNames);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  // Function to initiate a video call
  const startVideoCall = async (calleeUid) => {
    router.push({
      pathname: "/VideoSDK2",
      params: { calleeUid: calleeUid },
    });
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
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
      onPress={() => startVideoCall(item.uid)}>
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}>
      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }}
        snapEnabled
        scrollAnimationDuration={800}
        onSnapToItem={handleSnapToItem}
        ref={scrollViewRef}
      />
      {/* <Text style={styles.prompt}>{userNames[activeIndex]?.name}</Text> */}

      <TouchableOpacity
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -17 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ count: -1, animated: true });
        }}>
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top: viewportWidth > viewportHeight ? "40%" : "30%",
          },
        ]}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ count: 1, animated: true });
        }}>
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
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
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 30,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  prompt: {
    fontSize: 25,
    color: "#393939",
    fontWeight: "700",
    marginTop: 15,
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -50 }],
  },
});

export default VideoCall;
