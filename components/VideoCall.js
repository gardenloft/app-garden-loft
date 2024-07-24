import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const VideoCall = () => {
  const [userNames, setUserNames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserNames(user.uid);
    }
  }, [user]);

  const fetchUserNames = async (userId) => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
    const fetchedUserNames = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().userName,
      pushToken: doc.data().pushToken,
      uid: doc.id,
      imageUrl: doc.data().imageUrl,
    }));
    setUserNames(fetchedUserNames);
  };

  const startVideoCall = async (calleeUid) => {
    router.push({
      pathname: '/VideoSDK2',
      params: { calleeUid: calleeUid }
    });
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.cardContainer, {
        backgroundColor: index === activeIndex ? '#f3b718' : '#f09030',
        transform: index === activeIndex ? [{ scale: 1 }] : [{ scale: 0.8 }],
      },
       {
        height: viewportWidth > viewportHeight
          ? Math.round(Dimensions.get("window").height * 0.3)
          : Math.round(Dimensions.get("window").height * 0.25),
      },
]}
      onPress={() => startVideoCall(item.uid)}
    >
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container,
      {height: viewportWidth > viewportHeight
        ? 320
        : 450,}
    ]}>
      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.3)}
        height={Math.round(viewportWidth * 0.3)}
        style={{ width: Math.round(viewportWidth * 0.9), height: Math.round(viewportWidth * 0.5) }}
        autoPlay={false}
        snapEnabled
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        onSnapToItem={handleSnapToItem}
        ref={scrollViewRef}
      />
      <Text style={styles.prompt}>{userNames[activeIndex]?.prompt}</Text>

      <TouchableOpacity style={[styles.arrowLeft,
          {left: viewportWidth > viewportHeight
            ? -17
            : -22,
          top: viewportWidth > viewportHeight
            ? "40%"
            : "30%",}
        ]}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ count: -1, animated: true });
        }}
      >
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.arrowRight,
          {right: viewportWidth > viewportHeight
            ? -25
            : -22,
          top: viewportWidth > viewportHeight
            ? "40%"
            : "30%",}
        ]}
        onPress={() => {
          scrollViewRef.current?.scrollTo({ count: 1, animated: true });
        }}
      >
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    // height: 320,
    height: viewportHeight * 0.7
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    height: viewportHeight * 0.3,
    // marginLeft: 250,  //edits the centering of the carousel
    backgroundColor: '#f09030',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  prompt: {
    fontSize: 20,
    color: '#393939',
    fontWeight: '700',
    marginTop: 15,
  },
  arrowLeft: {
    position: 'absolute',
    // top: '40%',
    // left: -17,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: 'absolute',
    // top: '40%',
    // right: -25,
    transform: [{ translateY: -50 }],
  },
});

export default VideoCall;
