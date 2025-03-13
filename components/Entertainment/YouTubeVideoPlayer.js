import { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const YouTubeVideoPlayer = ({ videoId, onClose, onStart, onEnd }) => {
  const [videoStarted, setVideoStarted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const videoUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;

  return (
    // <View style={styles.container}>
    //   <WebView
    //     source={{ uri: videoUrl }}
    //     style={[{
    //       height: viewportHeight * 0.7,
    //       width: viewportWidth * 0.8, 
    //     },phoneStyles.video]}
    //     javaScriptEnabled={true}
    //     domStorageEnabled={true}
    //     allowsInlineMediaPlayback
    //     onLoad={() => {
    //       if (!videoStarted) {
    //         setVideoStarted(true);
    //         onStart(); // ✅ Trigger onStart when video begins
    //       }
    //     }}
    //     // onNavigationStateChange={(event) => {
    //     //   if (event.url.includes("watch") || event.url.includes("youtube.com")) {
    //     //     console.log("Video ended");
    //     //     // onEnd(); // ✅ Trigger onEnd when video ends
    //     //     onClose(); // Trigger close modal when video ends
    //     //   }
    //     // }}

    //     onNavigationStateChange={(event) => {
    //       setCurrentUrl(event.url); // Track URL changes

    //       // ✅ Detect when the video ends (YouTube changes URL when finished)
    //       if (videoStarted && event.url !== currentUrl && event.url.includes("youtube.com/watch")) {
    //         console.log("Video likely ended");
    //         onEnd(); // Trigger end event
    //         onClose(); // Close modal after video ends
    //       }
    //     }}
    //   />
    // </View>
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
        onMessage={(event) => {
          console.log("WebView message:", event.nativeEvent.data);
          if (event.nativeEvent.data === "VIDEO_STARTED") {
            if (onStart) onStart(); // ✅ Calls start tracking
          }
          if (event.nativeEvent.data === "VIDEO_ENDED") {
            if (onEnd) onEnd(); // ✅ Calls end tracking
          }
           // ✅ Detect when video is paused
           if (event.nativeEvent.data === "VIDEO_PAUSED") {
            if (onPause) onPause();
          }
        }}
        onNavigationStateChange={(event) => {
          setCurrentUrl(event.url);

          // ✅ Detect when user navigates away from YouTube
          if (videoStarted && event.url !== currentUrl && !event.url.includes("youtube.com/embed")) {
            console.log("🚨 User navigated away before finishing the video");
            if (onClose) onClose(); // Call onClose if they leave
          }
        }}


        injectedJavaScript={`
          function sendMessage(message) {
            window.ReactNativeWebView.postMessage(message);
          }
        
          function checkYouTubePlayer() {
            let player;
            if (typeof YT !== "undefined" && YT.Player) {
              player = new YT.Player("player", {
                events: {
                  "onStateChange": function(event) {
                    if (event.data === 1) { // Video started playing
                      sendMessage("VIDEO_STARTED");
                    }
                    if (event.data === 2) { // Video paused
                      sendMessage("VIDEO_PAUSED");
                    }
                    if (event.data === 0) { // Video ended
                      sendMessage("VIDEO_ENDED");
                    }
                  }
                }
              });
            }
          }
        
          document.addEventListener("DOMContentLoaded", checkYouTubePlayer);
          setTimeout(checkYouTubePlayer, 2000); // Retry if YouTube API isn't ready
        `}
        
        // injectedJavaScript={`
        //   function sendMessage(message) {
        //     window.ReactNativeWebView.postMessage(message);
        //   }
  
        //   document.addEventListener("DOMContentLoaded", function() {
        //     let player;
        //     function onYouTubeIframeAPIReady() {
        //       player = new YT.Player('player', {
        //         events: {
        //           'onStateChange': function(event) {
        //             if (event.data === 1) { // Video started
        //               sendMessage("VIDEO_STARTED");
        //             }
        //                if (event.data === 2) { // Video paused
        //               sendMessage("VIDEO_PAUSED");
        //             }
        //             if (event.data === 0) { // Video ended
        //               sendMessage("VIDEO_ENDED");
        //             }
        //           }
        //         }
        //       });
        //     }
        //   });
        // `}
        // onNavigationStateChange={(event) => {
        //   if (event.url.includes("watch")) {
        //     console.log("Video ended");
        //     onClose(); // Trigger close modal when video ends
        //   }
        // }}

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
