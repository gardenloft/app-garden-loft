import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const HowTo = () => {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const docSnapshot = await getDocs(collection(FIRESTORE_DB, "HowToV"));
        const videosData = [];
        docSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Fetched Video Data: ", data);
          videosData.push({
            id: doc.id,
            name: data.name,
            videoId: data.videoId,
          });
        });
        setVideos(videosData);
        if (videosData.length === 0) {
          setError("No videos found.");
        }
      } catch (error) {
        console.error("Error fetching videos: ", error.message);
        setError("Failed to fetch videos. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const openVideoModal = (videoId) => {
    console.log("Opening Video Modal with Video ID: ", videoId);
    setSelectedVideoId(videoId);
    setIsVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setSelectedVideoId("");
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: index === activeIndex ? "#f3b718" : "#f09030",
        },
      ]}
      onPress={() => openVideoModal(item.videoId)}>
      <MaterialCommunityIcons name="television-play" size={94} color="white" />
      <Text style={styles.cardText}>{item.name}</Text>
    </Pressable>
  );

  const handleArrowPress = (direction) => {
    let newIndex = activeIndex;
    if (direction === "left") {
      newIndex = (activeIndex - 1 + videos.length) % videos.length;
    } else if (direction === "right") {
      newIndex = (activeIndex + 1) % videos.length;
    }
    carouselRef.current.scrollTo({ index: newIndex, animated: true });
    setActiveIndex(newIndex);
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="orange" style={styles.loading} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={videos}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportHeight * 0.3)}
        loop
        style={{ width: Math.round(viewportWidth * 0.9) }}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pressable
        style={styles.arrowLeft}
        onPress={() => handleArrowPress("left")}>
        <FontAwesome name="angle-left" size={100} color="black" />
      </Pressable>
      <Pressable
        style={styles.arrowRight}
        onPress={() => handleArrowPress("right")}>
        <FontAwesome name="angle-right" size={100} color="black" />
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}>
        <View style={styles.modalView}>
          <WebView
            style={{ width: "100%" }}
            javaScriptEnabled
            source={{ uri: `https://www.youtube.com/embed/${selectedVideoId}` }}
          />
          <Pressable style={styles.closeButton} onPress={closeVideoModal}>
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
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    elevation: 3,
    width: "90%",
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
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 20,
  },
});

export default HowTo;
