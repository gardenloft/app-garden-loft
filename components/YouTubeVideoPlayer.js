// // YouTubeVideoPlayer.js
// import React, { useState, useCallback } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const YouTubeVideoPlayer = ({ videoId, onClose }) => {
//   const [playing, setPlaying] = useState(true);
//   console.log("this is the youtube thingyyyy id:", videoId)


//   const onStateChange = useCallback((state) => {
//     if (state === 'ended') {
//       setPlaying(false);
//       onClose();
//     }
//   }, [onClose]);

//   return (
//     <View style={styles.container}>
//       <YoutubePlayer
//         // height={300}
//         height={viewportHeight * 0.7}
//         width={viewportWidth * 0.8}
//         play={playing}
//         videoId={videoId}
//         onChangeState={onStateChange}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
  
//   },
// });

// export default YouTubeVideoPlayer;


// YouTubeVideoPlayer.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const YouTubeVideoPlayer = ({ videoId, onClose }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        style={{
          height: viewportHeight * 0.7,
          width: viewportWidth * 0.8,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback
        onNavigationStateChange={(event) => {
          if (event.url.includes('watch')) {
            console.log('Video ended');
            onClose(); // Trigger close modal when video ends
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default YouTubeVideoPlayer;
