// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import Carousel from "react-native-reanimated-carousel";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   setDoc,
//   getDoc,
// } from "firebase/firestore";
// import { FIRESTORE_DB } from "../FirebaseConfig";
// import { WebView } from "react-native-webview";
// import { getAuth } from "firebase/auth";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Entertainment = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [selectedSeasonVideos, setSelectedSeasonVideos] = useState([]);
//   const [selectedVideoId, setSelectedVideoId] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [favorites, setFavorites] = useState([]);
//   const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
//   const [isNoFavoritesModalVisible, setIsNoFavoritesModalVisible] =
//     useState(false);

//   const scrollViewRef = useRef(null);

//   const carouselRef = useRef(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchCategories = async () => {
//       setIsLoading(true);
//       try {
//         const catSnapshot = await getDocs(
//           collection(FIRESTORE_DB, "Categories")
//         );
//         const categoriesData = [];
//         for (const catDoc of catSnapshot.docs) {
//           const seasonsSnapshot = await getDocs(
//             collection(FIRESTORE_DB, "Categories", catDoc.id, "Seasons")
//           );
//           const seasons = [];
//           for (const seasonDoc of seasonsSnapshot.docs) {
//             const seasonData = seasonDoc.data();
//             seasons.push({ id: seasonDoc.id, ...seasonData });
//           }
//           categoriesData.push({
//             id: catDoc.id,
//             name: catDoc.data().name,
//             seasons,
//           });
//         }
//         categoriesData.push({ id: "surprise", name: "Surprise Me" }); // Adding Surprise Me card
//         categoriesData.push({ id: "favorites", name: "Favorites" }); // Adding Favorites card
//         setCategories(categoriesData);
//         if (categoriesData.length === 0) {
//           setError("No categories available.");
//         }
//       } catch (error) {
//         console.error("Firebase fetch error: ", error.message);
//         setError("Failed to fetch categories. Please try again later.");
//       }
//       setIsLoading(false);
//     };

//     const fetchFavorites = async () => {
//       if (user) {
//         const watchedVideosSnapshot = await getDocs(
//           collection(FIRESTORE_DB, "users", user.uid, "watchedVideos")
//         );
//         const favoritesData = [];
//         const currentTime = new Date();
//         watchedVideosSnapshot.forEach((docSnap) => {
//           const data = docSnap.data();
//           const lastWatched = new Date(data.lastWatched.seconds * 1000);
//           const diffTime = Math.abs(currentTime - lastWatched);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//           if (data.viewCount >= 3 && diffDays <= 30) {
//             favoritesData.push({
//               videoId: data.videoId,
//               name: data.name,
//             });
//           }
//         });
//         setFavorites(favoritesData);
//       }
//     };

//     fetchCategories();
//     fetchFavorites();
//   }, [user]);

//   const updateWatchedVideos = async (videoId, videoName) => {
//     if (user) {
//       const videoRef = doc(
//         FIRESTORE_DB,
//         "users",
//         user.uid,
//         "watchedVideos",
//         videoId
//       );
//       const videoSnap = await getDoc(videoRef);
//       if (videoSnap.exists()) {
//         const data = videoSnap.data();
//         await updateDoc(videoRef, {
//           viewCount: data.viewCount + 1,
//           lastWatched: new Date(),
//         });
//       } else {
//         await setDoc(videoRef, {
//           videoId: videoId,
//           name: videoName,
//           viewCount: 1,
//           lastWatched: new Date(),
//         });
//       }
//     }
//   };

//   const openSeasonModal = (category) => {
//     setSelectedSeasonVideos(category.seasons);
//     setIsSeasonModalVisible(true);
//   };

//   const openVideoModal = (videoId, videoName) => {
//     setSelectedVideoId(videoId);
//     setIsVideoModalVisible(true);
//     updateWatchedVideos(videoId, videoName);
//   };


//   const handleSurpriseMe = () => {
//     if (categories.length > 0) {
//       const randomCategory =
//         categories[Math.floor(Math.random() * (categories.length - 2))];
//       const randomSeason =
//         randomCategory.seasons[
//           Math.floor(Math.random() * randomCategory.seasons.length)
//         ];
//       openVideoModal(randomSeason.videoId, randomSeason.name);
//     }
//   };

//   const handleFavorites = () => {
//     if (favorites.length > 0) {
//       setIsFavoritesModalVisible(true);
//     } else {
//       setIsNoFavoritesModalVisible(true);
//     }
//   };

//   const renderItem = ({ item }) => {
//     if (item.id === "surprise") {
//       return (
//         <Pressable
//           key={item.id}
//           style={[
//             styles.cardContainer,
//             {
//               backgroundColor:
//               item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
//              transform:
//           item.id === categories[activeIndex]?.id ? [{scale: 1}] : [{scale: 0.8}]
//             },
//           ]}
//           onPress={handleSurpriseMe}>
//           <MaterialCommunityIcons name="star" size={94} color="white" />
//           <Text style={styles.cardText}>{item.name}</Text>
//         </Pressable>
//       );
//     } else if (item.id === "favorites") {
//       return (
//         <Pressable
//           key={item.id}
//           style={[
//             styles.cardContainer,
//             {
//               backgroundColor:
//               item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
//              transform:
//           item.id === categories[activeIndex]?.id ? [{scale: 1}] : [{scale: 0.8}]
//             },
//           ]}
//           onPress={handleFavorites}>
//           <MaterialCommunityIcons name="heart" size={94} color="white" />
//           <Text style={styles.cardText}>{item.name}</Text>
//         </Pressable>
//       );
//     } else {
//       return (
//         <Pressable
//           key={item.id}
//           style={[
//             styles.cardContainer,
//             {
//               backgroundColor:
//                 item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
//                transform:
//             item.id === categories[activeIndex]?.id ? [{scale: 1}] : [{scale: 0.8}]
//             },
//           ]}
//           onPress={() => openSeasonModal(item)}>
//           <MaterialCommunityIcons
//             name="television-play"
//             size={94}
//             color="white"
//           />
//           <Text style={styles.cardText}>{item.name}</Text>
//         </Pressable>
//       );
//     }
//   };


//   return (
//     <View style={styles.container}>
//       {isLoading ? (
//         <ActivityIndicator size="large" color="orange" style={styles.loading} />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <>
//           <Carousel
//            ref={carouselRef}
//             loop={true}
//             data={categories}
//             renderItem={renderItem}
//             width={Math.round(viewportWidth * 0.3)}
//             height={Math.round(viewportWidth * 0.3)}
//             style={{ width: Math.round(viewportWidth * 0.9) }}
//             snapEnabled={false}
//             onSnapToItem={(index) => setActiveIndex(index)}
//           />
//           <Pressable
//             style={styles.arrowLeft}
//             onPress={() => {
//               carouselRef.current?.scrollTo({ count: -1, animated: true });}}
//              >
//             <FontAwesome name="angle-left" size={100} color="black" />
//           </Pressable>
//           <Pressable
//             style={styles.arrowRight}
//             onPress={() => {
//               carouselRef.current?.scrollTo({ count: 1, animated: true });}}
//             >
//             <FontAwesome name="angle-right" size={100} color="black" />
//           </Pressable>
//         </>
//       )}

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isSeasonModalVisible}
//         onRequestClose={() => setIsSeasonModalVisible(false)}>
//         <View style={styles.modalView}>
//           <ScrollView style={{ width: "100%" }}>
//             {selectedSeasonVideos.map((season, index) => (
//               <Pressable
//                 key={index}
//                 style={styles.seasonButton}
//                 onPress={() => openVideoModal(season.videoId, season.name)}>
//                 <Text style={styles.seasonButtonText}>{season.name}</Text>
//               </Pressable>
//             ))}
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsSeasonModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVideoModalVisible}
//         onRequestClose={() => setIsVideoModalVisible(false)}>
//         <View style={styles.modalView}>
//           <WebView
//             style={{ width: viewportWidth * 0.8, height: viewportHeight * 0.8 , flex:1 }}
//             javaScriptEnabled={true}
//             allowsInlineMediaPlayback={true}
//             mediaPlaybackRequiresUserAction={false}
//             useWebKit={true} 
//             source={{ uri: `https://www.youtube.com/embed/${selectedVideoId}` }}
//           />
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsVideoModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isFavoritesModalVisible}
//         onRequestClose={() => setIsFavoritesModalVisible(false)}>
//         <View style={styles.modalView}>
//           <ScrollView style={{ width: "100%" }}>
//             {favorites.map((favorite, index) => (
//               <Pressable
//                 key={index}
//                 style={styles.seasonButton}
//                 onPress={() => openVideoModal(favorite.videoId, favorite.name)}>
//                 <Text style={styles.seasonButtonText}>{favorite.name}</Text>
//               </Pressable>
//             ))}
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsFavoritesModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isNoFavoritesModalVisible}
//         onRequestClose={() => setIsNoFavoritesModalVisible(false)}>
//         <View style={styles.modalView}>
//           <Text style={styles.errorText}>No favorites available.</Text>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsNoFavoritesModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     alignItems: "center",
//     height: 300,
//   },
//   cardContainer: {
//     width: viewportWidth * 0.30, //changes width of carousel cards
//     height: viewportHeight * 0.3,
//     backgroundColor: "#f09030",
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 5,
//     // marginLeft: 355, //edits the centering of the carousel
//     padding: 10,
//   },
//   cardText: {
//     fontSize: 30,
//     color: "#393939",
//     fontWeight: "700",
//   },
//   seasonButton: {
//     backgroundColor: "#f09030",
//     padding: 10,
//     marginVertical: 5,
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   seasonButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "500",
//   },
//   loading: {
//     flex: 1,
//     alignItems: "flex-start",
//     fontSize: 44,
//   },
//   arrowLeft: {
//     position: "absolute",
//     top: "50%",
//     left: -17,
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     top: "50%",
//     right: -25,
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   modalView: {
//     margin: 10,
//     height: viewportHeight * 0.7,
//     marginTop: 50,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 3,
//     paddingTop: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     width: "80%",
//     alignSelf: "center",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "lightblue",
//     padding: 10,
//     borderRadius: 5,
//   },
//   closeText: {
//     fontSize: 24,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//     marginTop: 20,
//   },
// });

// export default Entertainment;


// code below is messi working youtube 


import React, { useState, useEffect, useRef,  useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import YouTubeVideoPlayer from '../components/YouTubeVideoPlayer.js';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const Entertainment = ({ videoId, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedSeasonVideos, setSelectedSeasonVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [isNoFavoritesModalVisible, setIsNoFavoritesModalVisible] = useState(false);
  const [playing, setPlaying] = useState(true);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      onClose();
    }
  }, [onClose]);

  const carouselRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCategories();
    fetchFavorites();
  }, [user]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const catSnapshot = await getDocs(collection(FIRESTORE_DB, "Categories"));
      const categoriesData = [];
      for (const catDoc of catSnapshot.docs) {
        const seasonsSnapshot = await getDocs(collection(FIRESTORE_DB, "Categories", catDoc.id, "Seasons"));
        const seasons = [];
        for (const seasonDoc of seasonsSnapshot.docs) {
          const seasonData = seasonDoc.data();
          seasons.push({ id: seasonDoc.id, ...seasonData });
        }
        categoriesData.push({
          id: catDoc.id,
          name: catDoc.data().name,
          seasons,
        });
      }
      categoriesData.push({ id: "surprise", name: "Surprise Me" });
      categoriesData.push({ id: "favorites", name: "Favorites" });
      setCategories(categoriesData);
      if (categoriesData.length === 0) {
        setError("No categories available.");
      }
    } catch (error) {
      console.error("Firebase fetch error: ", error.message);
      setError("Failed to fetch categories. Please try again later.");
    }
    setIsLoading(false);
  };

  const fetchFavorites = async () => {
    if (user) {
      const watchedVideosSnapshot = await getDocs(collection(FIRESTORE_DB, "users", user.uid, "watchedVideos"));
      const favoritesData = [];
      const currentTime = new Date();
      watchedVideosSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const lastWatched = new Date(data.lastWatched.seconds * 1000);
        const diffTime = Math.abs(currentTime - lastWatched);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (data.viewCount >= 3 && diffDays <= 30) {
          favoritesData.push({
            videoId: data.videoId,
            name: data.name,
          });
        }
      });
      setFavorites(favoritesData);
    }
  };

  const updateWatchedVideos = async (videoId, videoName) => {
    if (user) {
      const videoRef = doc(FIRESTORE_DB, "users", user.uid, "watchedVideos", videoId);
      const videoSnap = await getDoc(videoRef);
      if (videoSnap.exists()) {
        const data = videoSnap.data();
        await updateDoc(videoRef, {
          viewCount: data.viewCount + 1,
          lastWatched: new Date(),
        });
      } else {
        await setDoc(videoRef, {
          videoId: videoId,
          name: videoName,
          viewCount: 1,
          lastWatched: new Date(),
        });
      }
    }
  };

  const openSeasonModal = (category) => {
    setSelectedSeasonVideos(category.seasons);
    setIsSeasonModalVisible(true);
  };

  const openVideoModal = (videoId, videoName) => {
    console.log("Opening Video Modal with Video ID: ", videoId);
    setSelectedVideoId(videoId);
    setIsVideoModalVisible(true);
    updateWatchedVideos(videoId, videoName);
  };

  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideoId("");
  };

  const handleSurpriseMe = () => {
    if (categories.length > 0) {
      const randomCategory = categories[Math.floor(Math.random() * (categories.length - 2))];
      const randomSeason = randomCategory.seasons[Math.floor(Math.random() * randomCategory.seasons.length)];
      openVideoModal(randomSeason.videoId, randomSeason.name);
    }
  };

  const handleFavorites = () => {
    if (favorites.length > 0) {
      setIsFavoritesModalVisible(true);
    } else {
      setIsNoFavoritesModalVisible(true);
    }
  };

  const renderItem = ({ item }) => {
    if (item.id === "surprise") {
      return (
        <Pressable
          key={item.id}
          style={[
            styles.cardContainer,
            {
              backgroundColor: item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform: item.id === categories[activeIndex]?.id ? [{ scale: 1 }] : [{ scale: 0.8 }],
            },
          ]}
          onPress={handleSurpriseMe}
        >
          <MaterialCommunityIcons name="star" size={94} color="white" />
          <Text style={styles.cardText}>{item.name}</Text>
        </Pressable>
      );
    } else if (item.id === "favorites") {
      return (
        <Pressable
          key={item.id}
          style={[
            styles.cardContainer,
            {
              backgroundColor: item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform: item.id === categories[activeIndex]?.id ? [{ scale: 1 }] : [{ scale: 0.8 }],
            },
          ]}
          onPress={handleFavorites}
        >
          <MaterialCommunityIcons name="heart" size={94} color="white" />
          <Text style={styles.cardText}>{item.name}</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          key={item.id}
          style={[
            styles.cardContainer,
            {
              backgroundColor: item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform: item.id === categories[activeIndex]?.id ? [{ scale: 1 }] : [{ scale: 0.8 }],
            },
          ]}
          onPress={() => openSeasonModal(item)}
        >
           {/* <YoutubePlayer
        height={300}
        width={viewportWidth * 0.9}
        play={playing}
        videoId={`${videoId}`}
        onChangeState={onStateChange}
      /> */}
          <MaterialCommunityIcons name="television-play" size={94} color="white" />
          <Text style={styles.cardText}>{item.name}</Text>
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loading} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Carousel
            ref={carouselRef}
            loop={true}
            data={categories}
            renderItem={renderItem}
            width={Math.round(viewportWidth * 0.3)}
            height={Math.round(viewportWidth * 0.3)}
            style={{ width: Math.round(viewportWidth * 0.9) }}
            snapEnabled={false}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <Pressable
            style={styles.arrowLeft}
            onPress={() => {
              carouselRef.current?.scrollTo({ count: -1, animated: true });
            }}
          >
            <FontAwesome name="angle-left" size={100} color="black" />
          </Pressable>
          <Pressable
            style={styles.arrowRight}
            onPress={() => {
              carouselRef.current?.scrollTo({ count: 1, animated: true });
            }}
          >
            <FontAwesome name="angle-right" size={100} color="black" />
          </Pressable>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSeasonModalVisible}
        onRequestClose={() => setIsSeasonModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={{ width: "100%" }}>
            {selectedSeasonVideos.map((season, index) => (
              <Pressable
                key={index}
                style={styles.seasonButton}
                onPress={() => {
                  console.log(`Button pressed for season: ${season.name}, ${season.videoId}`);
                  openVideoModal(season.videoId, season.name)
                   setIsSeasonModalVisible(false);
                }}
              >
                <Text style={styles.seasonButtonText}>{season.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={() => setIsSeasonModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalView}>
          <YouTubeVideoPlayer 
            videoId={selectedVideoId} 
            onClose={closeVideoModal}
          />
          <Pressable style={styles.closeButton} onPress={closeVideoModal}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFavoritesModalVisible}
        onRequestClose={() => setIsFavoritesModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={{ width: "100%" }}>
            {favorites.map((favorite, index) => (
              <Pressable
                key={index}
                style={styles.seasonButton}
                onPress={() => openVideoModal(favorite.videoId, favorite.name)}
              >
                <Text style={styles.seasonButtonText}>{favorite.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={() => setIsFavoritesModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isNoFavoritesModalVisible}
        onRequestClose={() => setIsNoFavoritesModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.errorText}>No favorites available.</Text>
          <Pressable style={styles.closeButton} onPress={() => setIsNoFavoritesModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    height: 300,
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    height: viewportHeight * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    padding: 10,
  },
  cardText: {
    fontSize: 30,
    color: "#393939",
    fontWeight: "700",
  },
  seasonButton: {
    backgroundColor: "#f09030",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  seasonButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  loading: {
    flex: 1,
    alignItems: "flex-start",
    fontSize: 44,
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: -17,
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: -25,
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
 modalView: {
           margin: 10,
          height: viewportHeight * 0.9,
          width: viewportWidth * 0.95,
          marginTop: 50,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 3,
          paddingTop: 20,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          alignSelf: "center",
        },
        closeButton: {
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "lightblue",
          padding: 10,
          borderRadius: 5,
        },
        closeText: {
          fontSize: 24,
        },
        errorText: {
          fontSize: 18,
          color: "red",
          marginTop: 20,
        },
      });
      
      export default Entertainment;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   Dimensions,
//   Modal,
// } from 'react-native';
// // import { WebView } from 'react-native-webview';
// import YouTube from 'react-native-youtube-iframe';
// import { FontAwesome } from '@expo/vector-icons';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const SimpleWebViewExample = () => {
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [error, setError] = useState("");

//   const openVideoModal = () => {
//     setIsVideoModalVisible(true);
//   };

//   const closeVideoModal = () => {
//     setIsVideoModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Pressable style={styles.button} onPress={openVideoModal}>
//         <Text style={styles.buttonText}>Open Video</Text>
//       </Pressable>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVideoModalVisible}
//         onRequestClose={closeVideoModal}
//       >
//         <View style={styles.modalView}>
//           {/* <WebView
//             style={{ width: viewportWidth * 0.8, height: viewportHeight * 0.8 }}
//             javaScriptEnabled={true}
//             allowsInlineMediaPlayback={true}
//             mediaPlaybackRequiresUserAction={false}
//             useWebKit={true}
//             domStorageEnabled={true}
//             source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }} // Replace with your video ID
//             onLoad={() => console.log('WebView loaded successfully')}
//             onError={(syntheticEvent) => {
//               const { nativeEvent } = syntheticEvent;
//               console.error('WebView error:', nativeEvent);
//               setError("Failed to load video. Please try again later.");
//               setIsVideoModalVisible(false);
//             }}
//             onLoadStart={() => console.log('WebView started loading')}
//             onLoadEnd={() => console.log('WebView finished loading')}
//           /> */}
//            <YouTube
//             width={viewportWidth * 0.8}
//             height={viewportHeight * 0.8}
//             play={true}
//             videoId="dQw4w9WgXcQ" // Replace with your video ID
//             onError={(e) => {
//               console.error('YouTubeIframe error:', e);
//               setError("Failed to load video. Please try again later.");
//               setIsVideoModalVisible(false);
//             }}
//           />
//           <Pressable style={styles.closeButton} onPress={closeVideoModal}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     height: viewportHeight * 0.2,
//     width: viewportWidth * 0.2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   button: {
//     padding: 10,
//     backgroundColor: '#841584',
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//   },
//   modalView: {
//     margin: 10,
//     height: viewportHeight * 0.7,
//     marginTop: 50,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 3,
//     paddingTop: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     width: '80%',
//     alignSelf: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: 'lightblue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 20,
//   },
// });

// export default SimpleWebViewExample;