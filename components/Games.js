import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { WebView } from "react-native-webview";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const phoneStyles = SCREEN_WIDTH <= 513 ? {
  container: {
    marginTop: SCREEN_HEIGHT * 0.17, // Adjust margin for spacing
  },
  filterButtons: {
    marginTop: SCREEN_HEIGHT * 0.2,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_HEIGHT * 0.25,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 20,
    elevation: 0, // Dim the shadow for cards on phones
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  cardImage: {
    width: "120%",
    height: "70%",
    width: SCREEN_WIDTH * 0.29,
    height: SCREEN_HEIGHT * 0.2,
    borderRadius: 20,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    numberOfLines: 2, // Truncate text to one line
    ellipsizeMode: "tail",
  },
  carousel: {
    width: Math.round(SCREEN_WIDTH * 0.9), // Adjust carousel width for phone
  },
  filterButton: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.012,
  },
  filterButtonText: {
    fontSize: 20,
  },
  arrowLeft: {
    top: "58%",
    left: -20,
  },
  arrowRight: {
    top: "58%",
    right: -20,
  },
} : {};


// Define URLs and multiplayer games
const gameUrls = {
  Crossword: "https://www.seniorsonline.vic.gov.au/services-information/crossword",
  "Word Search": "https://www.seniorsonline.vic.gov.au/services-information/word-search",
  Sudoku: "https://www.seniorsonline.vic.gov.au/services-information/sudoku",
  Trivia: "https://www.seniorsonline.vic.gov.au/services-information/trivia",
  "Code Cracker": "https://www.seniorsonline.vic.gov.au/services-information/code-cracker",
  "Memory Game": "https://www.memozor.com/memory-games/for-seniors-or-elderly/black-and-white",
  UNO: "https://buddyboardgames.com/uno",
  Chess: "https://buddyboardgames.com/chess",
  "Connect 4": "https://buddyboardgames.com/connect4",
  Battleship: "https://buddyboardgames.com/battleship",
};
const multiplayerGames = ["UNO", "Chess", "Connect 4", "Battleship"];

const Games = () => {
  const [gamesData, setGamesData] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isGameModalVisible, setIsGameModalVisible] = useState(false);
  const [isInstructionModalVisible, setIsInstructionModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchGamesData();
  }, []);

  const fetchGamesData = async () => {
    try {
      const gamesCollection = collection(FIRESTORE_DB, "games");
      const gamesSnapshot = await getDocs(gamesCollection);
      const gamesList = gamesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
      }));
      setGamesData(gamesList);
      setFilteredGames(gamesList);
    } catch (error) {
      console.error("Error fetching games from Firestore:", error);
    }
  };

  const filterGames = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === "All") {
      setFilteredGames(gamesData);
    } else {
      const isMultiplayer = filterType === "Multiplayer";
      setFilteredGames(
        gamesData.filter((game) => multiplayerGames.includes(game.name) === isMultiplayer)
      );
    }
  };

  const openGameModal = (game) => {
    if (multiplayerGames.includes(game.name)) {
      setSelectedGame(game);
      setIsInstructionModalVisible(true);
    } else {
      setSelectedGame(game);
      setIsLoading(true);
      setIsGameModalVisible(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const proceedToGame = () => {
    setIsInstructionModalVisible(false);
    setIsLoading(true);
    setIsGameModalVisible(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const closeGameModal = () => setIsGameModalVisible(false);

  const renderItem = ({ item, index }) => (
    <Pressable key={item.id} style={styles.cardContainer} onPress={() => openGameModal(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <Text style={styles.cardText}
      numberOfLines={1} // Ensure text is limited to one line
      ellipsizeMode="tail" >{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterButtons}>
        {["All", "Single", "Multiplayer"].map((filter) => (
          <Pressable
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => filterGames(filter)}
          >
            <Text style={styles.filterButtonText}>{filter}</Text>
          </Pressable>
        ))}
      </View>

      <Modal visible={isInstructionModalVisible} transparent onRequestClose={() => setIsInstructionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Enter your name and use "gardenloft" as the room name.
          </Text>
          <Pressable style={styles.proceedButton} onPress={proceedToGame}>
            <Text style={styles.proceedButtonText}>Proceed to Game</Text>
          </Pressable>
        </View>
      </Modal>

      <Modal visible={isGameModalVisible} transparent onRequestClose={closeGameModal}>
        <View style={styles.modalContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="orange" />
          ) : (
            <WebView source={{ uri: gameUrls[selectedGame?.name] }} style={styles.webView} />
          )}
          <Pressable style={styles.closeButton} onPress={closeGameModal}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>

      <Carousel
        ref={carouselRef}
        data={filteredGames}
        renderItem={renderItem}
        width={SCREEN_WIDTH * 0.28 + SCREEN_WIDTH * 0.02}
        height={SCREEN_HEIGHT * 0.3}
        loop
        style={styles.carousel}
      />
      <Pressable style={styles.arrowLeft} onPress={() => carouselRef.current?.scrollTo({ count: -1 })}>
        <FontAwesome name="angle-left" size={SCREEN_WIDTH <= 413 ? 70 :100} color="rgb(45, 62, 95)" />
      </Pressable>
      <Pressable style={styles.arrowRight} onPress={() => carouselRef.current?.scrollTo({ count: 1 })}>
        <FontAwesome name="angle-right" size={SCREEN_WIDTH <= 413 ? 70 :100} color="rgb(45, 62, 95)" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    ...phoneStyles.container,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.05,
    marginTop:SCREEN_HEIGHT * 0.22,
    ...phoneStyles.filterButtons,
  },
  filterButton: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 20,
    backgroundColor: "grey",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...phoneStyles.filterButton,
  },
  activeFilterButton: {
    backgroundColor: "orange",
  },
  filterButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    ...phoneStyles.filterButtonText,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    ...phoneStyles.cardContainer,
  },
  cardImage: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.25,
    margin: 10,
    resizeMode: "cover",
    borderRadius: 10,
    ...phoneStyles.cardImage,
  },
  cardText: {
    fontSize: 30,
    color: "black",
    fontWeight: "700",
    ...phoneStyles.cardText,
  },
  arrowLeft: {
    position: "absolute",
    left: -25,
    top: "60%",
    transform: [{ translateY: -50 }],
    ...phoneStyles.arrowLeft,
  },
  arrowRight: {
    position: "absolute",
    right: -22,
    top: "60%",
    transform: [{ translateY: -50 }],
    ...phoneStyles.arrowRight,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
  },
  modalText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#666",
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  proceedButton: {
    backgroundColor: "#f09030",
    padding: 15,
    borderRadius: 10,
  },
  proceedButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
  },
  webView: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.7,
  },
  carousel: {
    width: Math.round(SCREEN_WIDTH * 0.9),
    height: Math.round(SCREEN_HEIGHT * 0.5),
    ...phoneStyles.carousel,
  },
});

export default Games;




