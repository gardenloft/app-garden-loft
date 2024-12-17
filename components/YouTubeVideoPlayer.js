import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const YouTubeVideoPlayer = ({ videoId, onClose }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        style={[{
          height: viewportHeight * 0.7,
          width: viewportWidth * 0.8, 
        },phoneStyles.video]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback
        onNavigationStateChange={(event) => {
          if (event.url.includes("watch")) {
            console.log("Video ended");
            onClose(); // Trigger close modal when video ends
          }
        }}
      />
    </View>
  );
};
const phoneStyles = viewportWidth <= 513 ? {
video: {
  height: viewportHeight * 0.5,
  width: viewportWidth * 0.8,
}
} : {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});



export default YouTubeVideoPlayer;
