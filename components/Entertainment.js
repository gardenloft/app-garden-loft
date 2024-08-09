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
  const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedSeasonVideos, setSelectedSeasonVideos] = useState([]);
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
        const seasonsSnapshot = await getDocs(
          collection(FIRESTORE_DB, "Categories", catDoc.id, "Seasons")
        );
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
          });
        }
      });
      setFavorites(favoritesData);
    }
  };

  const updateWatchedVideos = async (videoId, videoName) => {
    if (user) {
      const videoRef = doc(
        FIRESTORE_DB,
        "users",
        user.uid,
        "watchedVideos",
        videoId
      );
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
      const randomCategory =
        categories[Math.floor(Math.random() * (categories.length - 2))];
      const randomSeason =
        randomCategory.seasons[
          Math.floor(Math.random() * randomCategory.seasons.length)
        ];
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
          onPress={() => openSeasonModal(item)}
        >
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

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}
    >
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
            }}
          >
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
          <View style={styles.seasonButtonContainer}>
            {selectedSeasonVideos.map((season, index) => (
              <Pressable
                key={index}
                style={styles.seasonButton}
                onPress={() => {
                  console.log(
                    `Button pressed for season: ${season.name}, ${season.videoId}`
                  );
                  openVideoModal(season.videoId, season.name);
                  setIsSeasonModalVisible(false);
                }}
              >
                <Text style={styles.seasonButtonText}>{season.name}</Text>
              </Pressable>
            ))}
            </View>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsSeasonModalVisible(false)}
          >
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
          <View style={styles.seasonButtonContainer}>
            {favorites.map((favorite, index) => (
              <Pressable
                key={index}
                style={styles.seasonButton}
                onPress={() => {
                  openVideoModal(favorite.videoId, favorite.name);
                  setIsFavoritesModalVisible(false);
                }}
                
              >


                <Text style={styles.seasonButtonText}>{favorite.name}</Text>
              </Pressable>
            ))}
            </View>
          </ScrollView>
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsFavoritesModalVisible(false)}
          >
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
          <Pressable
            style={styles.closeButton}
            onPress={() => setIsNoFavoritesModalVisible(false)}
          >
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
    marginHorizontal: 10,
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
    // marginVertical: 5,
    // alignItems: "center",
    // borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 10,
    width: (viewportWidth * .85) / 3 - 10, // Subtracting margin and making space for three buttons in a row
    height: 200,
    justifyContent: "center",
  },
  seasonButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  loading: {
    flex: 1,
    alignItems: "flex-start",
    fontSize: 44,
  },
  arrowLeft: {
    position: "absolute",
    // left and top styles above in code for media queries
    zIndex: 10,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    // right and top styles above in code for media queries
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
//   const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] = useState(false);
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
//   const [isNoFavoritesModalVisible, setIsNoFavoritesModalVisible] = useState(false);
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
//       const catSnapshot = await getDocs(collection(FIRESTORE_DB, "Categories"));
//       const categoriesData = [];
//       for (const catDoc of catSnapshot.docs) {
//         const subcategorySnapshot = await getDocs(
//           collection(FIRESTORE_DB, "Categories", catDoc.id, "Subcategories")
//         );
//         const subcategories = [];
//         for (const subcatDoc of subcategorySnapshot.docs) {
//           const seasonsSnapshot = await getDocs(
//             collection(FIRESTORE_DB, "Categories", catDoc.id, "Subcategories", subcatDoc.id, "Seasons")
//           );
//           const seasons = [];
//           for (const seasonDoc of seasonsSnapshot.docs) {
//             const episodesSnapshot = await getDocs(
//               collection(
//                 FIRESTORE_DB,
//                 "Categories",
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
//           });
//         }
//       });
//       setFavorites(favoritesData);
//     }
//   };

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
//     updateWatchedVideos(episode.videoId, episode.name);
//   };

//   const closeVideoModal = () => {
//     setIsVideoModalVisible(false);
//     setSelectedVideoId("");
//   };

//   const handleSurpriseMe = () => {
//     if (categories.length > 0) {
//       const randomCategory =
//         categories[Math.floor(Math.random() * (categories.length - 2))];
//       const randomSubcategory =
//         randomCategory.subcategories[
//           Math.floor(Math.random() * randomCategory.subcategories.length)
//         ];
//       const randomSeason =
//         randomSubcategory.seasons[
//           Math.floor(Math.random() * randomSubcategory.seasons.length)
//         ];
//       const randomEpisode =
//         randomSeason.episodes[
//           Math.floor(Math.random() * randomSeason.episodes.length)
//         ];
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
//           onPress={handleSurpriseMe}
//         >
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
//           onPress={handleFavorites}
//         >
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
//           onPress={() => openCategoryModal(item)}
//         >
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
//     <View
//       style={[
//         styles.container,
//         { height: viewportWidth > viewportHeight ? 320 : 450 },
//       ]}
//     >
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
//             }}
//           >
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
//             }}
//           >
//             <FontAwesome name="angle-right" size={100} color="black" />
//           </Pressable>
//         </>
//       )}

//       {/* Category Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isCategoryModalVisible}
//         onRequestClose={() => setIsCategoryModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {selectedSubcategories.map((subcategory, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     console.log(`Button pressed for subcategory: ${subcategory.name}`);
//                     openSubcategoryModal(subcategory);
//                     setIsCategoryModalVisible(false);
//                   }}
//                 >
//                   <Text style={styles.seasonButtonText}>{subcategory.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsCategoryModalVisible(false)}
//           >
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Subcategory Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isSubcategoryModalVisible}
//         onRequestClose={() => setIsSubcategoryModalVisible(false)}
//       >
//         <View style={styles.modalView}>
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
//                   }}
//                 >
//                   <Text style={styles.seasonButtonText}>{season.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsSubcategoryModalVisible(false)}
//           >
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Season Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isSeasonModalVisible}
//         onRequestClose={() => setIsSeasonModalVisible(false)}
//       >
//         <View style={styles.modalView}>
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
//                   }}
//                 >
//                   <Text style={styles.seasonButtonText}>{episode.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsSeasonModalVisible(false)}
//           >
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* Video Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVideoModalVisible}
//         onRequestClose={closeVideoModal}
//       >
//         <View style={styles.modalView}>
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
//         onRequestClose={() => setIsFavoritesModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <ScrollView style={{ width: "100%" }}>
//             <View style={styles.seasonButtonContainer}>
//               {favorites.map((favorite, index) => (
//                 <Pressable
//                   key={index}
//                   style={styles.seasonButton}
//                   onPress={() => {
//                     openEpisodeModal(favorite);
//                     setIsFavoritesModalVisible(false);
//                   }}
//                 >
//                   <Text style={styles.seasonButtonText}>{favorite.name}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </ScrollView>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsFavoritesModalVisible(false)}
//           >
//             <FontAwesome name="close" size={24} color="black" />
//           </Pressable>
//         </View>
//       </Modal>

//       {/* No Favorites Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isNoFavoritesModalVisible}
//         onRequestClose={() => setIsNoFavoritesModalVisible(false)}
//       >
//         <View style={styles.modalView}>
//           <Text style={styles.errorText}>No favorites available.</Text>
//           <Pressable
//             style={styles.closeButton}
//             onPress={() => setIsNoFavoritesModalVisible(false)}
//           >
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
