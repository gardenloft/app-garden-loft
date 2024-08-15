// import React, { useState, useEffect, useRef, useCallback } from "react";
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
// import { getAuth } from "firebase/auth";
// import YouTubeVideoPlayer from "../components/YouTubeVideoPlayer.js";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Entertainment = ({ videoId, onClose }) => {
//   const [categories, setCategories] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
//   const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
//     useState(false);
//   const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
//   const [isEpisodeModalVisible, setIsEpisodeModalVisible] = useState(false);
//   const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
//   const [selectedSubcategories, setSelectedSubcategories] = useState([]);
//   const [selectedSeasons, setSelectedSeasons] = useState([]);
//   const [selectedEpisodes, setSelectedEpisodes] = useState([]);
//   const [selectedVideoId, setSelectedVideoId] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [favorites, setFavorites] = useState([]);
//   const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
//   const [isNoFavoritesModalVisible, setIsNoFavoritesModalVisible] =
//     useState(false);
//   const [playing, setPlaying] = useState(true);

//   const onStateChange = useCallback(
//     (state) => {
//       if (state === "ended") {
//         setPlaying(false);
//         onClose();
//       }
//     },
//     [onClose]
//   );

//   const carouselRef = useRef(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     fetchCategories();
//     fetchFavorites();
//   }, [user]);

//   const fetchCategories = async () => {
//     setIsLoading(true);
//     try {
//       const catSnapshot = await getDocs(
//         collection(FIRESTORE_DB, "Entertainment")
//       );
//       const categoriesData = [];
//       for (const catDoc of catSnapshot.docs) {
//         const subcategorySnapshot = await getDocs(
//           collection(FIRESTORE_DB, "Entertainment", catDoc.id, "Subcategories")
//         );
//         const subcategories = [];
//         for (const subcatDoc of subcategorySnapshot.docs) {
//           const seasonsSnapshot = await getDocs(
//             collection(
//               FIRESTORE_DB,
//               "Entertainment",
//               catDoc.id,
//               "Subcategories",
//               subcatDoc.id,
//               "Seasons"
//             )
//           );
//           const seasons = [];
//           for (const seasonDoc of seasonsSnapshot.docs) {
//             const episodesSnapshot = await getDocs(
//               collection(
//                 FIRESTORE_DB,
//                 "Entertainment",
//                 catDoc.id,
//                 "Subcategories",
//                 subcatDoc.id,
//                 "Seasons",
//                 seasonDoc.id,
//                 "Episodes"
//               )
//             );
//             const episodes = episodesSnapshot.docs.map((episodeDoc) => ({
//               id: episodeDoc.id,
//               ...episodeDoc.data(),
//             }));
//             const seasonData = seasonDoc.data();
//             seasons.push({ id: seasonDoc.id, episodes, ...seasonData });
//           }
//           subcategories.push({
//             id: subcatDoc.id,
//             name: subcatDoc.data().name,
//             seasons,
//           });
//         }
//         categoriesData.push({
//           id: catDoc.id,
//           name: catDoc.data().name,
//           subcategories,
//         });
//       }
//       categoriesData.push({ id: "surprise", name: "Surprise Me" });
//       categoriesData.push({ id: "favorites", name: "Favorites" });
//       setCategories(categoriesData);
//       if (categoriesData.length === 0) {
//         setError("No categories available.");
//       }
//     } catch (error) {
//       console.error("Firebase fetch error: ", error.message);
//       setError("Failed to fetch categories. Please try again later.");
//     }
//     setIsLoading(false);
//   };

//   const fetchFavorites = async () => {
//     if (user) {
//       const watchedVideosSnapshot = await getDocs(
//         collection(FIRESTORE_DB, "users", user.uid, "watchedVideos")
//       );
//       const favoritesData = [];
//       const currentTime = new Date();
//       watchedVideosSnapshot.forEach((docSnap) => {
//         const data = docSnap.data();
//         const lastWatched = new Date(data.lastWatched.seconds * 1000);
//         const diffTime = Math.abs(currentTime - lastWatched);
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         if (data.viewCount >= 3 && diffDays <= 30) {
//           favoritesData.push({
//             videoId: data.videoId,
//             name: data.name,
//             title: data.title, // Ensure title is fetched
//           });
//         }
//       });
//       setFavorites(favoritesData);
//     }
//   };

//   const updateWatchedVideos = async (videoId, videoName, videoTitle) => {
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
//           title: videoTitle, // Ensure title is saved
//           viewCount: 1,
//           lastWatched: new Date(),
//         });
//       }
//     }
//   };

//   const openCategoryModal = (category) => {
//     setSelectedSubcategories(category.subcategories);
//     setIsCategoryModalVisible(true);
//   };

//   const openSubcategoryModal = (subcategory) => {
//     setSelectedSeasons(subcategory.seasons);
//     setIsSubcategoryModalVisible(true);
//   };

//   const openSeasonModal = (season) => {
//     setSelectedEpisodes(season.episodes);
//     setIsSeasonModalVisible(true);
//   };

//   const openEpisodeModal = (episode) => {
//     console.log("Opening Video Modal with Video ID: ", episode.videoId);
//     setSelectedVideoId(episode.videoId);
//     setIsVideoModalVisible(true);
//     updateWatchedVideos(episode.videoId, episode.name, episode.title);
//   };

//   const closeVideoModal = () => {
//     setIsVideoModalVisible(false);
//     setSelectedVideoId("");
//   };

//   const handleSurpriseMe = () => {
//     const getRandomElement = (arr) =>
//       arr[Math.floor(Math.random() * arr.length)];

//     if (categories.length > 0) {
//       const nonSpecialCategories = categories.filter(
//         (category) => category.id !== "surprise" && category.id !== "favorites"
//       );
//       const randomCategory = getRandomElement(nonSpecialCategories);
//       const randomSubcategory = getRandomElement(randomCategory.subcategories);
//       const randomSeason = getRandomElement(randomSubcategory.seasons);
//       const randomEpisode = getRandomElement(randomSeason.episodes);

//       openEpisodeModal(randomEpisode);
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
//                 item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
//               transform:
//                 item.id === categories[activeIndex]?.id
//                   ? [{ scale: 1 }]
//                   : [{ scale: 0.8 }],
//             },
//             {
//               height:
//                 viewportWidth > viewportHeight
//                   ? Math.round(Dimensions.get("window").height * 0.3)
//                   : Math.round(Dimensions.get("window").height * 0.25),
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
//                 item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
//               transform:
//                 item.id === categories[activeIndex]?.id
//                   ? [{ scale: 1 }]
//                   : [{ scale: 0.8 }],
//             },
//             {
//               height:
//                 viewportWidth > viewportHeight
//                   ? Math.round(Dimensions.get("window").height * 0.3)
//                   : Math.round(Dimensions.get("window").height * 0.25),
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
//               transform:
//                 item.id === categories[activeIndex]?.id
//                   ? [{ scale: 1 }]
//                   : [{ scale: 0.8 }],
//             },
//             {
//               height:
//                 viewportWidth > viewportHeight
//                   ? Math.round(Dimensions.get("window").height * 0.3)
//                   : Math.round(Dimensions.get("window").height * 0.25),
//             },
//           ]}
//           onPress={() => openCategoryModal(item)}>
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

//   const handleBackPress = (setVisible, setPrevVisible) => {
//     setVisible(false);
//     setPrevVisible(true);
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}>
//       {isLoading ? (
//         <ActivityIndicator size="large" color="orange" style={styles.loading} />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <>
//           <Carousel
//             ref={carouselRef}
//             loop={true}
//             data={categories}
//             renderItem={renderItem}
//             width={Math.round(viewportWidth * 0.3)}
//             height={Math.round(viewportWidth * 0.3)}
//             style={{
//               width: Math.round(viewportWidth * 0.9),
//               height: Math.round(viewportWidth * 0.5),
//             }}
//             snapEnabled
//             scrollAnimationDuration={800}
//             onSnapToItem={(index) => setActiveIndex(index)}
//           />
//           <Pressable
//             style={[
//               styles.arrowLeft,
//               {
//                 left: viewportWidth > viewportHeight ? -17 : -22,
//                 top: viewportWidth > viewportHeight ? "40%" : "30%",
//               },
//             ]}
//             onPress={() => {
//               carouselRef.current?.scrollTo({ count: -1, animated: true });
//             }}>
//             <FontAwesome name="angle-left" size={100} color="black" />
//           </Pressable>
//           <Pressable
//             style={[
//               styles.arrowRight,
//               {
//                 right: viewportWidth > viewportHeight ? -25 : -22,
//                 top: viewportWidth > viewportHeight ? "40%" : "30%",
//               },
//             ]}
//             onPress={() => {
//               carouselRef.current?.scrollTo({ count: 1, animated: true });
//             }}>
//             <FontAwesome name="angle-right" size={100} color="black" />
//           </Pressable>
//         </>
//       )}

//       {/* Category Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isCategoryModalVisible}
//         onRequestClose={() => setIsCategoryModalVisible(false)}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() =>
//               handleBackPress(setIsCategoryModalVisible, () => {})
//             }>
//             <FontAwesome name="arrow-left" size={24} color="black" />
//           </Pressable>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {selectedSubcategories.map((subcategory, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     console.log(
//                       `Button pressed for subcategory: ${subcategory.name}`
//                     );
//                     openSubcategoryModal(subcategory);
//                     setIsCategoryModalVisible(false);
//                   }}>
//                   <Text style={styles.seasonButtonText}>
//                     {subcategory.name}
//                   </Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsCategoryModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Subcategory Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isSubcategoryModalVisible}
//         onRequestClose={() => setIsSubcategoryModalVisible(false)}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() =>
//               handleBackPress(
//                 setIsSubcategoryModalVisible,
//                 setIsCategoryModalVisible
//               )
//             }>
//             <FontAwesome name="arrow-left" size={24} color="black" />
//           </Pressable>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {selectedSeasons.map((season, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     console.log(`Button pressed for season: ${season.name}`);
//                     openSeasonModal(season);
//                     setIsSubcategoryModalVisible(false);
//                   }}>
//                   <Text style={styles.seasonButtonText}>{season.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsSubcategoryModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Season Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isSeasonModalVisible}
//         onRequestClose={() => setIsSeasonModalVisible(false)}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() =>
//               handleBackPress(
//                 setIsSeasonModalVisible,
//                 setIsSubcategoryModalVisible
//               )
//             }>
//             <FontAwesome name="arrow-left" size={24} color="black" />
//           </Pressable>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {selectedEpisodes.map((episode, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     console.log(`Button pressed for episode: ${episode.name}`);
//                     openEpisodeModal(episode);
//                     setIsSeasonModalVisible(false);
//                   }}>
//                   <Text style={styles.seasonButtonText}>{episode.name}</Text>
//                   <Text style={styles.seasonButtonText}>{episode.title}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsSeasonModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Video Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVideoModalVisible}
//         onRequestClose={closeVideoModal}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() =>
//               handleBackPress(setIsVideoModalVisible, setIsSeasonModalVisible)
//             }>
//             <FontAwesome name="arrow-left" size={24} color="black" />
//           </Pressable>
//           <YouTubeVideoPlayer
//             videoId={selectedVideoId}
//             onClose={closeVideoModal}
//           />
//           <Pressable style={styles.closeButton} onPress={closeVideoModal}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Favorites Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isFavoritesModalVisible}
//         onRequestClose={() => setIsFavoritesModalVisible(false)}>
//         <View style={styles.modalView}>
//           <Pressable
//             style={styles.backButton}
//             onPress={() =>
//               handleBackPress(setIsFavoritesModalVisible, () => {})
//             }>
//             <FontAwesome name="arrow-left" size={24} color="black" />
//           </Pressable>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {favorites.map((favorite, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     openEpisodeModal(favorite);
//                     setIsFavoritesModalVisible(false);
//                   }}>
//                   <Text style={styles.seasonButtonText}>{favorite.title}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsFavoritesModalVisible(false)}>
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* No Favorites Modal */}
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
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     backgroundColor: "#f09030",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 10,
//     padding: 10,
//     gap: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 8, height: 7 },
//     shadowOpacity: 0.22,
//     shadowRadius: 9.22,
//     elevation: 12,
//   },
//   cardText: {
//     fontSize: 28,
//     color: "#393939",
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   seasonButtonContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-evenly",
//   },
//   seasonButton: {
//     backgroundColor: "#f09030",
//     padding: 10,
//     marginVertical: 5,
//     marginHorizontal: 5,
//     alignItems: "center",
//     borderRadius: 10,
//     width: (viewportWidth * 0.85) / 3 - 10, // Subtracting margin and making space for three buttons in a row
//     height: 200,
//     justifyContent: "center",
//   },
//   seasonButtonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "500",
//     textAlign: "center",
//   },
//   loading: {
//     flex: 1,
//     alignItems: "flex-start",
//     fontSize: 44,
//   },
//   arrowLeft: {
//     position: "absolute",
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: "absolute",
//     zIndex: 10,
//     transform: [{ translateY: -50 }],
//   },
//   modalView: {
//     margin: 10,
//     height: viewportHeight * 0.9,
//     width: viewportWidth * 0.95,
//     marginTop: 50,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     paddingTop: 100,
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
//     alignSelf: "center",
//   },
//   backButton: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     backgroundColor: "lightblue",
//     padding: 13,
//     borderRadius: 5,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 30,
//     right: 30,
//     backgroundColor: "lightblue",
//     padding: 13,
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

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import YouTubeVideoPlayer from "../components/YouTubeVideoPlayer.js";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Entertainment = ({ videoId, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] =
    useState(false);
  const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
  const [isEpisodeModalVisible, setIsEpisodeModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [isNoFavoritesModalVisible, setIsNoFavoritesModalVisible] =
    useState(false);
  const [playing, setPlaying] = useState(true);

  const onStateChange = useCallback(
    (state) => {
      if (state === "ended") {
        setPlaying(false);
        onClose();
      }
    },
    [onClose]
  );

  const carouselRef = useRef(null);
  const episodesCarouselRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchCategories();
    fetchFavorites();
  }, [user]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const catSnapshot = await getDocs(
        collection(FIRESTORE_DB, "Entertainment")
      );
      const categoriesData = [];
      for (const catDoc of catSnapshot.docs) {
        const subcategorySnapshot = await getDocs(
          collection(FIRESTORE_DB, "Entertainment", catDoc.id, "Subcategories")
        );
        const subcategories = [];
        for (const subcatDoc of subcategorySnapshot.docs) {
          const seasonsSnapshot = await getDocs(
            collection(
              FIRESTORE_DB,
              "Entertainment",
              catDoc.id,
              "Subcategories",
              subcatDoc.id,
              "Seasons"
            )
          );
          const seasons = [];
          for (const seasonDoc of seasonsSnapshot.docs) {
            const episodesSnapshot = await getDocs(
              collection(
                FIRESTORE_DB,
                "Entertainment",
                catDoc.id,
                "Subcategories",
                subcatDoc.id,
                "Seasons",
                seasonDoc.id,
                "Episodes"
              )
            );
            const episodes = episodesSnapshot.docs.map((episodeDoc) => ({
              id: episodeDoc.id,
              ...episodeDoc.data(),
              isWatched: false, // Initialize with false
            }));
            const seasonData = seasonDoc.data();
            seasons.push({ id: seasonDoc.id, episodes, ...seasonData });
          }
          subcategories.push({
            id: subcatDoc.id,
            name: subcatDoc.data().name,
            seasons,
          });
        }
        categoriesData.push({
          id: catDoc.id,
          name: catDoc.data().name,
          subcategories,
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
      const watchedVideosSnapshot = await getDocs(
        collection(FIRESTORE_DB, "users", user.uid, "watchedVideos")
      );
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
            title: data.title,
            isWatched: data.viewCount >= 1, // Mark as watched if viewCount is 1 or more
          });
        }
      });
      setFavorites(favoritesData);
    }
  };

  const fetchAlreadyWatched = async () => {
    if (user) {
      const watchedSnapshot = await getDocs(
        collection(FIRESTORE_DB, "users", user.uid, "alreadyWatched")
      );
      const watchedData = watchedSnapshot.docs.map((doc) => doc.data());
      return watchedData.map((item) => item.title);
    }
    return [];
  };

  const updateAlreadyWatched = async (videoId, videoTitle) => {
    if (user) {
      const watchedRef = doc(
        FIRESTORE_DB,
        "users",
        user.uid,
        "alreadyWatched",
        videoId
      );
      const watchedSnap = await getDoc(watchedRef);
      if (watchedSnap.exists()) {
        // If the video is already marked as watched, just update the timestamp
        await updateDoc(watchedRef, {
          lastWatched: new Date(),
        });
      } else {
        // If the video is not marked as watched, create a new document
        await setDoc(watchedRef, {
          videoId: videoId,
          title: videoTitle, // Store the title in the database
          lastWatched: new Date(),
        });
      }
    }
  };

  const openCategoryModal = (category) => {
    setSelectedSubcategories(category.subcategories);
    setIsCategoryModalVisible(true);
  };

  const openSubcategoryModal = (subcategory) => {
    setSelectedSeasons(subcategory.seasons);
    setIsSubcategoryModalVisible(true);
  };

  const openSeasonModal = async (season) => {
    const watchedTitles = await fetchAlreadyWatched();
    const episodes = season.episodes.map((episode) => ({
      ...episode,
      isWatched: watchedTitles.includes(episode.title),
    }));
    setSelectedEpisodes(episodes);
    setIsSeasonModalVisible(true);
  };

  const openEpisodeModal = (episode) => {
    setSelectedVideoId(episode.videoId);
    setIsVideoModalVisible(true);
    updateAlreadyWatched(episode.videoId, episode.title);

    // Update watched status locally as well
    setSelectedEpisodes((prevEpisodes) =>
      prevEpisodes.map((ep) =>
        ep.id === episode.id ? { ...ep, isWatched: true } : ep
      )
    );
  };

  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideoId("");
  };

  const handleSurpriseMe = () => {
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    if (categories.length > 0) {
      const nonSpecialCategories = categories.filter(
        (category) => category.id !== "surprise" && category.id !== "favorites"
      );
      const randomCategory = getRandomElement(nonSpecialCategories);
      const randomSubcategory = getRandomElement(randomCategory.subcategories);
      const randomSeason = getRandomElement(randomSubcategory.seasons);
      const randomEpisode = getRandomElement(randomSeason.episodes);

      openEpisodeModal(randomEpisode);
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
              backgroundColor:
                item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 1 }]
                  : [{ scale: 0.8 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
          ]}
          onPress={handleSurpriseMe}>
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
              backgroundColor:
                item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 1 }]
                  : [{ scale: 0.8 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
          ]}
          onPress={handleFavorites}>
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
              backgroundColor:
                item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 1 }]
                  : [{ scale: 0.8 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
          ]}
          onPress={() => openCategoryModal(item)}>
          <MaterialCommunityIcons
            name="television-play"
            size={94}
            color="white"
          />
          <Text style={styles.cardText}>{item.name}</Text>
        </Pressable>
      );
    }
  };

  const renderEpisodeItem = ({ item }) => {
    return (
      <Pressable
        key={item.id}
        style={[
          styles.cardContainer,
          {
            backgroundColor: "#f09030",
            transform: [{ scale: 1 }],
            height: viewportHeight * 0.25,
            marginHorizontal: 10, // Add gap between episode cards
          },
        ]}
        onPress={() => openEpisodeModal(item)}>
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={styles.cardText}>{item.title}</Text>
        {item.isWatched && (
          <View style={styles.watchedOverlay}>
            <Text style={styles.watchedText}>Watched</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const handleBackPress = (setVisible, setPrevVisible) => {
    setVisible(false);
    setPrevVisible(true);
  };

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}>
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
            style={{
              width: Math.round(viewportWidth * 0.9),
              height: Math.round(viewportWidth * 0.5),
            }}
            snapEnabled
            scrollAnimationDuration={800}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
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
            }}>
            <FontAwesome name="angle-left" size={100} color="black" />
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
            }}>
            <FontAwesome name="angle-right" size={100} color="black" />
          </Pressable>
        </>
      )}

      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalVisible}
        onRequestClose={() => setIsCategoryModalVisible(false)}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              handleBackPress(setIsCategoryModalVisible, () => {})
            }>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </Pressable>
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.seasonButtonContainer}>
              {selectedSubcategories.map((subcategory, index) => (
                <Pressable
                  key={index}
                  style={styles.seasonButton}
                  onPress={() => {
                    openSubcategoryModal(subcategory);
                    setIsCategoryModalVisible(false);
                  }}>
                  <Text style={styles.seasonButtonText}>
                    {subcategory.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsCategoryModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSubcategoryModalVisible}
        onRequestClose={() => setIsSubcategoryModalVisible(false)}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              handleBackPress(
                setIsSubcategoryModalVisible,
                setIsCategoryModalVisible
              )
            }>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </Pressable>
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.seasonButtonContainer}>
              {selectedSeasons.map((season, index) => (
                <Pressable
                  key={index}
                  style={styles.seasonButton}
                  onPress={() => {
                    openSeasonModal(season);
                    setIsSubcategoryModalVisible(false);
                  }}>
                  <Text style={styles.seasonButtonText}>{season.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsSubcategoryModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      {/* Season Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSeasonModalVisible}
        onRequestClose={() => setIsSeasonModalVisible(false)}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              handleBackPress(
                setIsSeasonModalVisible,
                setIsSubcategoryModalVisible
              )
            }>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </Pressable>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Carousel
              ref={episodesCarouselRef}
              loop={true}
              data={selectedEpisodes}
              renderItem={renderEpisodeItem}
              width={Math.round(viewportWidth * 0.3)}
              height={Math.round(viewportWidth * 0.3)}
              style={{
                width: Math.round(viewportWidth * 0.9),
                height: Math.round(viewportWidth * 0.5),
                alignItems: "center",
                justifyContent: "center",
              }}
              snapEnabled
              scrollAnimationDuration={800}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
            <Pressable
              style={[
                styles.arrowLeft,
                {
                  left: viewportWidth > viewportHeight ? -17 : -22,
                  top: "50%",
                  transform: [{ translateY: -50 }],
                },
              ]}
              onPress={() => {
                episodesCarouselRef.current?.scrollTo({
                  count: -1,
                  animated: true,
                });
              }}>
              <FontAwesome name="angle-left" size={100} color="black" />
            </Pressable>
            <Pressable
              style={[
                styles.arrowRight,
                {
                  right: viewportWidth > viewportHeight ? -25 : -22,
                  top: "50%",
                  transform: [{ translateY: -50 }],
                },
              ]}
              onPress={() => {
                episodesCarouselRef.current?.scrollTo({
                  count: 1,
                  animated: true,
                });
              }}>
              <FontAwesome name="angle-right" size={100} color="black" />
            </Pressable>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsSeasonModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      {/* Video Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              handleBackPress(setIsVideoModalVisible, setIsSeasonModalVisible)
            }>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </Pressable>
          <YouTubeVideoPlayer
            videoId={selectedVideoId}
            onClose={closeVideoModal}
          />
          <Pressable style={styles.closeButton} onPress={closeVideoModal}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFavoritesModalVisible}
        onRequestClose={() => setIsFavoritesModalVisible(false)}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              handleBackPress(setIsFavoritesModalVisible, () => {})
            }>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </Pressable>
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.seasonButtonContainer}>
              {favorites.map((favorite, index) => (
                <Pressable
                  key={index}
                  style={styles.seasonButton}
                  onPress={() => {
                    openEpisodeModal(favorite);
                    setIsFavoritesModalVisible(false);
                  }}>
                  <Text style={styles.seasonButtonText}>{favorite.title}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsFavoritesModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      {/* No Favorites Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNoFavoritesModalVisible}
        onRequestClose={() => setIsNoFavoritesModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.errorText}>No favorites available.</Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsNoFavoritesModalVisible(false)}>
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
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10, // Add gap between cards
    padding: 10,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
  },
  cardText: {
    fontSize: 28,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
  },
  seasonButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  seasonButton: {
    backgroundColor: "#f09030",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 10,
    width: (viewportWidth * 0.85) / 3 - 10, // Subtracting margin and making space for three buttons in a row
    height: 200,
    justifyContent: "center",
  },
  seasonButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  watchedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  watchedText: {
    color: "white",
    fontSize: 12,
  },
  loading: {
    flex: 1,
    alignItems: "flex-start",
    fontSize: 44,
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
  modalView: {
    margin: 10,
    height: viewportHeight * 0.9,
    width: viewportWidth * 0.95,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingTop: 100,
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
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
