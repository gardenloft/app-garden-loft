// YouTubeVideoPlayer.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const YouTubeVideoPlayer = ({ videoId, onClose }) => {
  const [playing, setPlaying] = useState(true);
  console.log("this is the youtube thingyyyy id:", videoId)


  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      onClose();
    }
  }, [onClose]);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        // height={300}
        height={viewportHeight * 0.7}
        width={viewportWidth * 0.8}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
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