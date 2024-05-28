import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Entertainment = () => {
  const [categories, setCategories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSeasonModalVisible, setIsSeasonModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedSeasonVideos, setSelectedSeasonVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const catSnapshot = await getDocs(
          collection(FIRESTORE_DB, "Categories")
        );
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
    fetchCategories();
  }, []);

  const openSeasonModal = (category) => {
    setSelectedSeasonVideos(category.seasons);
    setIsSeasonModalVisible(true);
  };

  const openVideoModal = (videoId) => {
    setSelectedVideoId(videoId);
    setIsVideoModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor:
            item.id === categories[activeIndex]?.id ? "#f3b718" : "#f09030",
        },
      ]}
      onPress={() => openSeasonModal(item)}>
      <MaterialCommunityIcons name="television-play" size={94} color="white" />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loading} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Carousel
            loop
            data={categories}
            renderItem={renderItem}
            width={Math.round(viewportWidth * 0.3)}
            style={{ width: Math.round(viewportWidth * 0.9) }}
            snapEnabled
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <TouchableOpacity
            style={styles.arrowLeft}
            onPress={() => scrollViewRef.current?.snapToPrev()}>
            <FontAwesome name="angle-left" size={100} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowRight}
            onPress={() => scrollViewRef.current?.snapToNext()}>
            <FontAwesome name="angle-right" size={100} color="black" />
          </TouchableOpacity>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSeasonModalVisible}
        onRequestClose={() => setIsSeasonModalVisible(false)}>
        <View style={styles.modalView}>
          <ScrollView style={{ width: "100%" }}>
            {selectedSeasonVideos.map((season, index) => (
              <TouchableOpacity
                key={index}
                style={styles.seasonButton}
                onPress={() => openVideoModal(season.videoId)}>
                <Text style={styles.seasonButtonText}>{season.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsSeasonModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={() => setIsVideoModalVisible(false)}>
        <View style={styles.modalView}>
          <WebView
            style={{ width: viewportWidth * 0.8, height: viewportHeight * 0.4 }}
            javaScriptEnabled={true}
            source={{ uri: `https://www.youtube.com/embed/${selectedVideoId}` }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsVideoModalVisible(false)}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    height: 290,
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    height: viewportHeight * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cardText: {
    fontSize: 36,
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
    height: viewportHeight * 0.7,
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
    width: "80%",
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
