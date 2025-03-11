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
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

// Define phone-specific styles
const phoneStyles =
  viewportWidth <= 513
    ? {
        container: {
          height: 700,
          // marginTop: 200, // Increase this value to move the cards lower on the screen
        },
        cardContainer: {
          width: viewportWidth * 0.3,
          height: viewportHeight * 0.2, // Adjust height to ensure space for text
          padding: 15,
          marginHorizontal: 10,
          marginTop: 30,
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
          marginTop: 10,
          paddingHorizontal: 5,
          textAlign: "center",
        },
        cardImage: {
          // width: "100%",
          // height: "70%",
          // resizeMode: "cover",
          // borderRadius: 20, // Ensure image corners match card border radius
          // // overflow: "hidden",

          width: "130%",
          height: "75%",
        // width: viewportWidth * 0.28,
        // height: viewportWidth * 0.35,
        margin: 5,
        // resizeMode: "contain",
        resizeMode: "cover",
        borderRadius: 10,
        },
        icon: {
          size: 60, // Reduce icon size for phone
        },
        modalView: {
          width: viewportWidth * 0.9,
        },
        arrowLeft: {
          left: -15,                 // Align arrow to the far left
        top: "26%",
      
        },
        arrowRight: {
          right: -15,                // Align arrow to the far right
          top: "26%",
        },
      }
    : {};

const Kosmi = () => {
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const docSnapshot = await getDocs(
          collection(FIRESTORE_DB, "WatchParty")
        );
        const videosData = [];
        docSnapshot.forEach((doc) => {
          const data = doc.data();
          videosData.push({
            id: doc.id,
            name: data.name,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
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

  const openVideoModal = (url) => {
    setCurrentVideoUrl(url || "https://app.kosmi.io/room/@sallydo");
    setIsVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalVisible(false);
    setCurrentVideoUrl(null);
  };

  const renderItem = ({ item, index }) => (
    <View key={item.id} style={styles.itemContainer}>
      <Pressable
        style={[
          styles.cardContainer,
          {
            backgroundColor:
              index === activeIndex ? "transparent" : "transparent",
            transform:
              index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }],
          },
          {
            height:
              viewportWidth > viewportHeight
                ? Math.round(Dimensions.get("window").height * 0.3)
                : Math.round(Dimensions.get("window").height * 0.25),
          },
        ]}
        onPress={() => openVideoModal(item.videoUrl)}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons
            name="television-play"
            size={94}
            color="white"
          />
        )}
      </Pressable>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            height: viewportWidth > viewportHeight ? 320 : 450,
          },
        ]}>
        <ActivityIndicator size="large" color="orange" style={styles.loading} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            height: viewportWidth > viewportHeight ? 320 : 450,
          },
        ]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          height: viewportWidth > viewportHeight ? 320 : 450,
        },
      ]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}>
        <View style={styles.modalView}>
          {currentVideoUrl ? (
            <WebView
              source={{ uri: currentVideoUrl }}
              style={{
                width: viewportWidth * 0.93,
                height: viewportHeight * 0.7,
              }}
            />
          ) : (
            <Text>No video URL available</Text>
          )}
          <Pressable style={styles.closeButton} onPress={closeVideoModal}>
            <FontAwesome name="close" size={24} color="black" />
          </Pressable>
        </View>
      </Modal>
      <Carousel
        ref={carouselRef}
        data={videos}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        loop={true}
        style={{
          width: Math.round(viewportWidth * 0.9),
          height: Math.round(viewportWidth * 0.5),
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        scrollAnimationDuration={800}
        snapEnabled
      />

      <Pressable
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -25 : -22,
            top:
              viewportWidth <= 413
                ? "20%"
                : viewportWidth > viewportHeight
                ? "42%"
                : "32%", // Adjust top for phone
          },phoneStyles.arrowLeft
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}>
        <FontAwesome
          name="angle-left"
          size={viewportWidth <= 413 ? 70 : 100}
          color="black"
        />
      </Pressable>

      <Pressable
        style={[
          styles.arrowRight,
          {
            right: viewportWidth > viewportHeight ? -25 : -22,
            top:
              viewportWidth <= 413
                ? "20%"
                : viewportWidth > viewportHeight
                ? "42%"
                : "32%", // Adjust top for phone
          },phoneStyles.arrowRight
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}>
        <FontAwesome
          name="angle-right"
          size={viewportWidth <= 413 ? 70 : 100}
          color="black"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginTop: 8, // Moves carousel lower on the screen
    ...phoneStyles.container,
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    backgroundColor: "#f09030",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginLeft: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    overflow: "hidden",
    ...phoneStyles.cardContainer,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    ...phoneStyles.cardImage,
  },
  cardText: {
    fontSize: 20,
    color: "#393939",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    ...phoneStyles.cardText,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft: {
    position: "absolute",
    zIndex: 10,
    transform: [{ translateY: -20 }], // Moves the left arrow to align with the carousel vertically
    ...phoneStyles.arrowLeft,
  },
  arrowRight: {
    position: "absolute",
    zIndex: 10,
    transform: [{ translateY: -20 }], // Moves the right arrow to align with the carousel vertically
    ...phoneStyles.arrowRight,
  },
  modalView: {
    margin: 10,
    height: viewportHeight * 0.9,
    width: viewportWidth * 0.95,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingTop: 70,
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
    alignSelf: "center",
    ...phoneStyles.modalView,
  },
  closeButton: {
    position: "absolute",
    top: 10,
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

export default Kosmi;
