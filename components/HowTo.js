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
import YouTube from "react-native-youtube-iframe";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

// Define phone-specific styles
const phoneStyles =
  viewportWidth <= 513
    ? {
        container: {
          height: 400,
          // marginTop: 200, // Increase this value to move the cards lower on the screen
        },
        cardContainer: {
          marginTop: 50,
          width: viewportWidth * 0.32,
          height: viewportHeight * 0.2,
          padding: 15,
          marginHorizontal: 10, // Add margin to create gap between cards
          shadowOpacity: 0, // Remove shadow opacity on phones
          elevation: 0,
        },
        cardText: {
          fontSize: 16,
        },
        icon: {
          size: 50, // Reduce icon size for phone
        },
        modalView: {
          width: viewportWidth * 0.9,
        },
      }
    : {};

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
            // videoId: data.videoId,  // for YouTube Videos
            videoUrl: data.videoUrl, // for FireStore Storage Vids
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

  const openVideoModal = (videoUrl) => {
    console.log("Opening Video Modal with Video URL: ", videoUrl);
    setSelectedVideoId(videoUrl); // videoUrl should be the Firebase Storage link
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
          backgroundColor: index === activeIndex ? "#f09030" : "#f09030",
          transform:
            index === activeIndex ? [{ scale: 0.85 }] : [{ scale: 0.85 }],
        },
        {
          height:
            viewportWidth > viewportHeight
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
        }, phoneStyles.cardContainer,
      ]}
      onPress={() => openVideoModal(item.videoUrl)}
    >
      <MaterialCommunityIcons
        name="television-play"
        size={phoneStyles.icon?.size || 94}
        color="white"
      />
      <Text style={styles.cardText}>{item.name}</Text>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { height: viewportWidth > viewportHeight ? 320 : 450 },
        ]}
      >
        <ActivityIndicator size="large" color="orange" style={styles.loading} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { height: viewportWidth > viewportHeight ? 320 : 450 },
        ]}
      >
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { height: viewportWidth > viewportHeight ? 320 : 450 },
      ]}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoModalVisible}
        onRequestClose={closeVideoModal}
      >
        <View style={styles.modalView}>
          {/* <YouTube
            width={viewportWidth * 0.8}
            height={viewportHeight * 0.7}
            play={true}
            videoId={selectedVideoId} // Pass the selected video ID here
          /> */}
          <WebView
            source={{ uri: selectedVideoId }} // Firebase Storage video link
            // source={{
            //   html: `
            //     <html>
            //       <body style="margin:0;padding:0;">
            //         <iframe
            //           src="${selectedVideoId}"
            //           width="100%"
            //           height="100%"
            //           style="border: none;"
            //           allow="autoplay; fullscreen"
            //           allowfullscreen>
            //         </iframe>
            //       </body>
            //     </html>
            //   `,
            // }}
            style={{
              width: viewportWidth * 0.8,
              height: viewportHeight * 0.7,
              zIndex: 100,
            }}
            javaScriptEnabled={true}
            allowsFullscreenVideo={false} // Allow fullscreen video playback
            mediaPlaybackRequiresUserAction={true} // Allow autoplay
            startInLoadingState={true} // Show loading indicator while video is loading
            onError={(e) => console.log("Error loading video", e)} // Handle any errors
          />
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
          height: Math.round(viewportWidth * 0.6),
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        scrollAnimationDuration={800}
        snapEnabled
      />
      <Pressable
        style={[
          styles.arrowLeft,
          {
            left: viewportWidth > viewportHeight ? -17 : -22,
            top:
              viewportWidth <= 413
                ? "25%"
                : viewportWidth > viewportHeight
                ? "40%"
                : "30%", // Adjust top for phone
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
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
                ? "25%"
                : viewportWidth > viewportHeight
                ? "40%"
                : "30%", // Adjust top for phone
          },
        ]}
        onPress={() => {
          carouselRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
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
    marginTop: 10, // Moves carousel lower on the screen
    ...phoneStyles.container,
  },
  cardContainer: {
    width: viewportWidth * 0.3, //changes width of carousel cards
    backgroundColor: "#f09030",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10, // Add margin to create gap between cards
    marginLeft: 0,
    shadowColor: "tranparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 0,
    padding: 20,
    overflow: "hidden",
    ...phoneStyles.cardContainer,
  },
  cardText: {
    fontSize: 25,
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
