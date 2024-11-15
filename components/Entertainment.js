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
  Image,
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
import { FIRESTORE_DB } from "../FirebaseConfig"; // Import your Firestore instance
import { getAuth } from "firebase/auth";
import YouTubeVideoPlayer from "../components/YouTubeVideoPlayer.js";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

    // Define phone-specific styles
    const phoneStyles = viewportWidth <= 413 ? {
      container: {
        height: 400,
        marginTop: 200, 
        flexDirection: "row",       // Arrange cards in rows
    flexWrap: "wrap",           // Wrap to the next line after three cards
    justifyContent: "center",
    alignItems: "center",
    width: viewportWidth,
      },
      cardContainer: {
        width: viewportWidth * 0.3,
        height: viewportHeight * 0.2, // Adjust height to ensure space for text
      padding: 15,
      marginHorizontal: 5,
      marginVertical:10,
      paddingBottom: 10,
      shadowOpacity: 0,
      elevation: 0,
      borderRadius: 20,
      overflow: "hidden",
      },
      cardText: {
        fontSize: 16,
        color: "#393939", // Ensure visible text color
        fontWeight: "700",
        marginTop: 5,
        paddingHorizontal: 5,
        textAlign: "center",
        height: 40,           // Fixed height for consistency on phones
        overflow: "hidden",   // Hide overflow text
      }, 
      imageUrl: {
        width: viewportWidth * 0.28,
        height: viewportWidth * 0.35,
        margin: 5,
        resizeMode: "cover",
        borderRadius: 10,
      },
      icon: {
        size: 50, // Reduce icon size for phone
      },
      modalView: {
        width: viewportWidth * 0.9,
        height: viewportHeight * 0.85,
        paddingTop: 60,
      },
      seasonButton: {
        width: (viewportWidth * 0.85) / 2 - 10,
        height: 200,
        borderRadius: 10,
      },
      seasonButtonText: {
        fontSize: 14, // Smaller font for phone screens
        fontWeight: "600",
        textAlign: "center",
        marginTop: 5, // Add slight margin to prevent overlap
      },
      arrowLeft: {
        position: "absolute",
        left: 15,                 // Align arrow to the far left
        top: "40%",               // Center arrow vertically with cards
        zIndex: 10,
      },
      arrowRight: {
        position: "absolute",
        right: 15,                // Align arrow to the far right
        top: "40%",               // Center arrow vertically with cards
        zIndex: 5,
      },
    
     
    } : {};

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
      const categoriesData = await Promise.all(
        catSnapshot.docs.map(async (catDoc) => {
          const subcategorySnapshot = await getDocs(
            collection(
              FIRESTORE_DB,
              "Entertainment",
              catDoc.id,
              "Subcategories"
            )
          );
          const subcategories = await Promise.all(
            subcategorySnapshot.docs.map(async (subcatDoc) => {
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
              const seasons = await Promise.all(
                seasonsSnapshot.docs.map(async (seasonDoc) => {
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
                  return {
                    id: seasonDoc.id,
                    episodes,
                    imageUrl: seasonData.imageUrl, // Fetch imageUrl for seasons
                    ...seasonData,
                  };
                })
              );
              return {
                id: subcatDoc.id,
                name: subcatDoc.data().name,
                imageUrl: subcatDoc.data().imageUrl, // Fetch imageUrl for subcategories
                seasons,
              };
            })
          );
          return {
            id: catDoc.id,
            name: catDoc.data().name,
            imageUrl: catDoc.data().imageUrl, // Fetch imageUrl for categories
            subcategories,
          };
        })
      );

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

  const updateWatchedVideos = async (videoId, videoName, videoTitle) => {
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
          title: videoTitle,
          viewCount: 1,
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
        await updateDoc(watchedRef, {
          lastWatched: new Date(),
        });
      } else {
        await setDoc(watchedRef, {
          videoId: videoId,
          title: videoTitle,
          lastWatched: new Date(),
        });
      }
    }
  };

  const openEpisodeModal = (episode) => {
    setSelectedVideoId(episode.videoId);
    setIsVideoModalVisible(true);
    updateWatchedVideos(episode.videoId, episode.name, episode.title);
    updateAlreadyWatched(episode.videoId, episode.title);

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
    if (categories.length > 0) {
      const randomCategory =
        categories[Math.floor(Math.random() * (categories.length - 2))];
      const randomSubcategory =
        randomCategory.subcategories[
          Math.floor(Math.random() * randomCategory.subcategories.length)
        ];
      const randomSeason =
        randomSubcategory.seasons[
          Math.floor(Math.random() * randomSubcategory.seasons.length)
        ];
      const randomEpisode =
        randomSeason.episodes[
          Math.floor(Math.random() * randomSeason.episodes.length)
        ];
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
    const isPhone = viewportWidth <= 413;
      // Conditionally apply margins only for "Surprise Me" and "Favorites" on phones
  const cardStyle = [
    styles.cardContainer,
    phoneStyles.cardContainer,
    {
      backgroundColor: item.id === "surprise" || item.id === "favorites" ? "#f3b718" : "transparent",
      transform: [{ scale: 0.8 }],
      // Add spacing only on phone screens for specific cards
      ...(isPhone && item.id === "surprise" ? { marginRight: 10 } : {}),
      ...(isPhone && item.id === "favorites" ? { marginLeft: 10 } : {}),
    },
  ];

  const iconProps = {
    size: isPhone ? phoneStyles.icon.size : 104,
    color: item.id === "surprise" ? "yellow" : "red",
  };

  if (item.id === "surprise" || item.id === "favorites") {
    return (
      <Pressable key={item.id} style={cardStyle} onPress={item.id === "surprise" ? handleSurpriseMe : handleFavorites}>
        <MaterialCommunityIcons name={item.id === "surprise" ? "star" : "heart"} {...iconProps} />
        <Text
          style={[styles.cardText, phoneStyles.cardText]}
          numberOfLines={isPhone ? 2 : undefined}
          ellipsizeMode={isPhone ? "tail" : undefined}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  }
    if (item.id === "surprise") {
      return (
        <Pressable
          key={item.id}
          style={[
            styles.cardContainer,
            {
              backgroundColor:
                item.id === categories[activeIndex]?.id ? "#f3b718" : "#f3b718",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 0.8 }]
                  : [{ scale: 0.8 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
            phoneStyles.cardContainer,
          ]}
          onPress={handleSurpriseMe}>
          <MaterialCommunityIcons name="star" size={isPhone ? phoneStyles.icon.size : 104} color="yellow" />
          <Text  style={[styles.cardText, phoneStyles.cardText]}
          numberOfLines={isPhone ? 2 : undefined}
          ellipsizeMode={isPhone ? "tail" : undefined}
        >{item.name}</Text>
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
                item.id === categories[activeIndex]?.id ? "#f3b718" : "#f3b718",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 0.8 }]
                  : [{ scale: 0.8 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
            phoneStyles.cardContainer,
          ]}
          onPress={handleFavorites}>
          <MaterialCommunityIcons name="heart" size={isPhone ? phoneStyles.icon.size : 104} color="red" />
          <Text       style={[styles.cardText, phoneStyles.cardText]}
          numberOfLines={isPhone ? 2 : undefined}
          ellipsizeMode={isPhone ? "tail" : undefined}
        >{item.name}</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          key={item.id}
          style={[
            styles.cardContainer,
            phoneStyles.cardContainer,
            {
              backgroundColor:
                item.id === categories[activeIndex]?.id
                  ? "transparent"
                  : "transparent",
              transform:
                item.id === categories[activeIndex]?.id
                  ? [{ scale: 1 }]
                  : [{ scale: 1 }],
            },
            {
              height:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").height * 0.3)
                  : Math.round(Dimensions.get("window").height * 0.25),
            },
          ]}
          onPress={() => openCategoryModal(item)}>
          <Image
            source={{ uri: item.imageUrl, cache: "force-cache" }}
            style={[styles.imageUrl, phoneStyles.imageUrl]}
          />
          <Text style={[styles.cardText, phoneStyles.cardText]}>{item.name}</Text>
        </Pressable>
      );
    }
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
      left: viewportWidth > viewportHeight ? -25 : -22,
      top: viewportWidth <= 413 ? "20%" : viewportWidth > viewportHeight ? "42%" : "32%", // Adjust top for phone
    }
  ]}
  onPress={() => {
    carouselRef.current?.scrollTo({ count: -1, animated: true });
  }}
>
  <FontAwesome name="angle-left" size={viewportWidth <= 413 ? 90:100} color="black" />
</Pressable>

<Pressable
  style={[
    styles.arrowRight,
    {
      right: viewportWidth > viewportHeight ? -25 : -20,
      top: viewportWidth <= 413 ? "20%" : viewportWidth > viewportHeight ? "42%" : "32%", // Adjust top for phone
    }
  ]}
  onPress={() => {
    carouselRef.current?.scrollTo({ count: 1, animated: true });
  }}
>
  <FontAwesome name="angle-right" size={viewportWidth <= 413 ? 90 :100} color="black" />
</Pressable>
          {/* <Pressable
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
          </Pressable> */}
        </>
      )}

      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCategoryModalVisible}
        onRequestClose={() => setIsCategoryModalVisible(false)}>
        <View style={[styles.modalView, phoneStyles.modalView]}>
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
                  style={[styles.seasonButton, phoneStyles.seasonButton]}
                  onPress={() => {
                    openSubcategoryModal(subcategory);
                    setIsCategoryModalVisible(false);
                  }}>
                  {/* <Image
                    source={{ uri: subcategory.imageUrl, cache: "force-cache" }}
                    style={styles.imageUrl}
                  /> */}
                  <Image
                    source={{
                      uri:
                        subcategory.imageUrl ||
                        "https://via.placeholder.com/150",
                    }}
                    style={[styles.imageUrl, phoneStyles.imageUrl]}
                    onError={(e) => {
                      console.error(
                        `Failed to load image for ${subcategory.name}: `,
                        e.nativeEvent.error
                      );
                    }}
                  />

                  <Text style={[styles.seasonButtonText, phoneStyles.seasonButtonText]}>
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
                  <Image
                    source={{ uri: season.imageUrl, cache: "force-cache" }}
                    style={styles.imageUrl}
                  />
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
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.seasonButtonContainer}>
              {selectedEpisodes.map((episode, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.seasonButton,
                    episode.isWatched && styles.watchedOverlay,
                  ]}
                  onPress={() => {
                    openEpisodeModal(episode);
                    setIsSeasonModalVisible(false);
                  }}>
                  <Image
                    source={{ uri: episode.imageUrl, cache: "force-cache" }}
                    style={styles.imageUrl}
                  />
                  <Text style={styles.seasonButtonText}>{episode.name}</Text>
                  <Text style={styles.seasonButtonText}>{episode.title}</Text>
                  {episode.isWatched && (
                    <View style={styles.watchedBadge}>
                      <Text style={styles.watchedText}>Watched</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
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
                  <Text style={styles.seasonButtonText}>{favorite.name}</Text>
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
    ...phoneStyles.container,
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
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    ...phoneStyles.cardContainer,
  },
  cardText: {
    fontSize: 28,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
    ...phoneStyles.cardText,
  },
  seasonButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  seasonButton: {
    backgroundColor: "transparent",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    alignItems: "center",
    borderRadius: 10,
    width: (viewportWidth * 0.85) / 3 - 10,
    height: 300,
    justifyContent: "center",
  },
  seasonButtonText: {
    color: "black",
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
  },
  watchedBadge: {
    position: "absolute",
    top: 5,
    right: 5,
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
    ...phoneStyles.modalView,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
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
  imageUrl: {
    width: viewportWidth * 0.25,
    height: viewportWidth * 0.2,
    margin: 10,
    resizeMode: "cover",
    borderRadius: 10,
    ...phoneStyles.imageUrl,
  },
});

export default Entertainment;
