import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import VideoSDK from '../app/VideoSDK';
import VideoSDK2 from '../app/VideoSDK2';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const VideoCall = () => {
  const [userNames, setUserNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserNames(user.uid);
    }
  }, [user]);

  const fetchUserNames = async (userId) => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, `users/${userId}/contacts`));
    const fetchedUserNames = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      meetingId: doc.data().meetingId
    }));
    setUserNames(fetchedUserNames);
  };

  const startVideoCall = async (meetingId) => {
    // Implement your video calling logic here
    console.log('Starting video call with Meeting ID:', meetingId);
    setIsModalVisible(true); // Show a modal or navigate to another screen
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.cardContainer, { backgroundColor: index === activeIndex ? '#f3b718' : '#f09030',
      transform: index === activeIndex ? [{scale: 1}] : [{scale: 0.8}],
       }]}
      onPress={() => startVideoCall(item.meetingId)} // Pass the meetingId here
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        style={{ width: Math.round(viewportWidth * 0.9) }}
        autoPlay={false}
        snapEnabled
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        onSnapToItem={handleSnapToItem}
        ref={scrollViewRef}
      />
      <Text style={styles.prompt}>{userNames[activeIndex]?.prompt}</Text>

      <TouchableOpacity style={styles.arrowLeft} 
      onPress={() => {
        scrollViewRef.current?.scrollTo({ count: -1, animated: true });}}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowRight} 
      onPress={() => {
        scrollViewRef.current?.scrollTo({ count: 1, animated: true });}}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>

      {/* Modal for Video Call */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(!isModalVisible)}
          >
            <FontAwesome name="arrow-left" size={24} color="black" />
            <Text style={styles.closeText}>Back To Garden Loft App</Text>
          </TouchableOpacity>
          {/* Implement your video call UI here */}
          <VideoSDK2 />
          {/* <VideoCallComponent meetingId={youtubeId} /> */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    height: 320,
  },
  cardContainer: {
    width: viewportWidth * 0.30,
    height: viewportHeight * 0.3,
    backgroundColor: '#f09030',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 355,
    marginHorizontal: 10, // Add margin to create gap between cards
    shadowOffset: {
      width: 6,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  cardText: {
    fontSize: 30,
    color: '#393939',
    fontWeight: '700',
  },
  prompt: {
    fontSize: 20,
    color: '#393939',
    fontWeight: '700',
    marginTop: 15,
  },
  arrowLeft: {
    position: 'absolute',
    top: '40%',
    left: -17,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: 'absolute',
    top: '40%',
    right: -25,
    transform: [{ translateY: -50 }],
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    height: viewportHeight * 0.9,
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 3,
    paddingTop: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    left: 400,
    top: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 5,
  },
  closeText: {
    fontSize: 24,
    position: 'absolute',
    left: 40,
    top: 0,
    width: 320,
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 70,
    marginLeft: 1,
  },
});

export default VideoCall;

