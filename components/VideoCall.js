// // import React, { useState, useRef } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
// // import { FontAwesome } from '@expo/vector-icons';
// // import Carousel from 'react-native-reanimated-carousel';
// // import { FIRESTORE_DB } from '../FirebaseConfig';
// // import { doc, getDoc } from 'firebase/firestore';
// // // import YoutubePlayer from 'react-native-youtube-iframe';
// // // import VideoSDK from './VideoSDK';

// // const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// // const VideoCall = () => {
// //   const [contacts, setContacts] = useState([
// //     { id: 1, name: 'Carina', meetingId: '1o31-vt61-zxdw',  },
// //     { id: 2, name: 'Sally', meetingId: '2o9t-84vd-l56t', },
// //     { id: 3, name: 'Meseret', meetingId: '35qc-oixz-zvdd',},
// //     { id: 4, name: 'Prapti', meetingId: '3s2v-9h43-d1ap', },
// //     { id: 5, name: 'Ruth', meetingId: '42ck-ivw3-71ya',  },
// //   ]);

// //   const [youtubeId, setYoutubeId] = useState('');
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [isModalVisible, setIsModalVisible] = useState(false);

// //   const fetchAndPlayVideo = async (docId) => {
// //     const docRef = doc(FIRESTORE_DB, 'contacts', docId);
// //     const docSnap = await getDoc(docRef);
// //     if (docSnap.exists()) {
// //       console.log('Document data:', docSnap.data());
// //       setYoutubeId(docSnap.data().youtubeId); // Assuming the document contains a field `youtubeId`
// //       setIsModalVisible(true); // Open the modal to play video
// //     } else {
// //       console.log('No such document!');
// //     }
// //   };

// //   const handleSnapToItem = (index) => {
// //     setActiveIndex(index);
// //   };

// //   const scrollViewRef = useRef(null);

// //   const renderItem = ({ item, index }) => (
// //     <TouchableOpacity
// //       key={item.id}
// //       style={[styles.cardContainer, { backgroundColor: index === activeIndex + 3 ? '#f3b718' : '#f09030' }]}
// //       onPress={() => fetchAndPlayVideo(item.id)}
// //     >
// //       <Image source={item.imageUrl} style={styles.image} />
// //       <Text style={styles.cardText}>{item.name}</Text>
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <Carousel
// //         data={contacts}
// //         renderItem={renderItem}
// //         width={viewportWidth * 0.9}
// //         height={viewportHeight * 0.3}
// //         mode="horizontal-stack"
// //         modeConfig={{
// //           stackInterval: 18
// //         }}
// //         autoPlay={false}
// //         autoPlayInterval={2000}
// //         scrollAnimationDuration={1000}
// //         onSnapToItem={handleSnapToItem}
// //         ref={scrollViewRef}
// //       />
// //       <Text style={styles.prompt}>{contacts[activeIndex]?.prompt}</Text>

// //       <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollViewRef.current?.scrollTo({ x: -viewportWidth * 0.3, animated: true })}>
// //         <FontAwesome name="angle-left" size={124} color="rgb(45, 62, 95)" />
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.arrowRight} onPress={() => scrollViewRef.current?.scrollTo({ x: viewportWidth * 0.3, animated: true })}>
// //         <FontAwesome name="angle-right" size={124} color="rgb(45, 62, 95)" />
// //       </TouchableOpacity>

// //       {/* Modal for YouTube Player */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={isModalVisible}
// //         onRequestClose={() => {
// //           setIsModalVisible(!isModalVisible);
// //         }}
// //       >
// //         <View style={styles.modalView}>
// //           <TouchableOpacity
// //             style={styles.closeButton}
// //             onPress={() => setIsModalVisible(!isModalVisible)}
// //           >
// //             <FontAwesome name="arrow-left" size={24} color="black" />
// //             <Text style={styles.closeText}>Back To Garden Loft App</Text>
// //           </TouchableOpacity>
// //           {/* {youtubeId && (
// //             <YoutubePlayer
// //               height={viewportHeight * 0.8}
// //               width={viewportWidth * 0.8}
// //               videoId={youtubeId}
// //               play={true}
// //             />
// //           )} */}
// //           {/* <VideoSDK /> */}
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     position: 'relative',
// //     alignItems: 'center',
// //     height: 290,
// //   },
// //   cardContainer: {
// //     width: viewportWidth * 0.3,
// //     height: viewportHeight * 0.3,
// //     backgroundColor: '#f09030',
// //     borderRadius: 30,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginHorizontal: 5,
// //     shadowOffset: {
// //       width: 6,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 12,
// //     elevation: 10,
// //   },
// //   cardText: {
// //     fontSize: 36,
// //     color: '#393939',
// //     fontWeight: '700',
// //   },
// //   prompt: {
// //     fontSize: 30,
// //     color: '#393939',
// //     fontWeight: '700',
// //     marginTop: 15,
// //   },
// //   arrowLeft: {
// //     position: 'absolute',
// //     top: '40%',
// //     left: -17,
// //     transform: [{ translateY: -50 }],
// //   },
// //   arrowRight: {
// //     position: 'absolute',
// //     top: '40%',
// //     right: -25,
// //     transform: [{ translateY: -50 }],
// //   },
// //   image: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     marginBottom: 10,
// //   },
// //   modalView: {
// //     margin: 20,
// //     height: viewportHeight * 0.9,
// //     marginTop: 30,
// //     backgroundColor: 'white',
// //     borderRadius: 20,
// //     padding: 3,
// //     paddingTop: 90,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 3.84,
// //     elevation: 5,
// //   },
// //   closeButton: {
// //     position: 'absolute',
// //     left: 400,
// //     top: 30,
// //     backgroundColor: 'lightblue',
// //     padding: 15,
// //     borderRadius: 5,
// //   },
// //   closeText: {
// //     fontSize: 24,
// //     position: 'absolute',
// //     left: 40,
// //     top: 0,
// //     width: 320,
// //     backgroundColor: 'lightblue',
// //     padding: 10,
// //     borderRadius: 70,
// //   },
// // });

// // export default VideoCall;
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import Carousel from 'react-native-reanimated-carousel';
// import { FIRESTORE_DB } from '../FirebaseConfig';
// import { collection, getDocs } from 'firebase/firestore';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const VideoCall = () => {
//   const [contacts, setContacts] = useState([]);
//   const [youtubeId, setYoutubeId] = useState('');
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const scrollViewRef = useRef(null);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
//       const fetchedContacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setContacts(fetchedContacts);
//     };
//     fetchContacts();
//   }, []);

//   const fetchAndPlayVideo = async (docId) => {
//     const docRef = doc(FIRESTORE_DB, 'users', docId);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       console.log('Document data:', docSnap.data());
//       setYoutubeId(docSnap.data().youtubeId); // Assuming the document contains a field `youtubeId`
//       setIsModalVisible(true); // Open the modal to play video
//     } else {
//       console.log('No such document!');
//     }
//   };

//   const handleSnapToItem = (index) => {
//     setActiveIndex(index);
//   };

//   const renderItem = ({ item, index }) => (
//     <TouchableOpacity
//       key={item.id}
//       style={[styles.cardContainer, { backgroundColor: index === activeIndex ? '#f3b718' : '#f09030' }]}
//       onPress={() => fetchAndPlayVideo(item.id)}
//     >
//       <Text style={styles.cardText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Carousel
//         data={contacts}
//         renderItem={renderItem}
//         width={viewportWidth * 0.8}
//         height={viewportHeight * 0.3}
//         mode="horizontal-stack"
//         modeConfig={{
//           stackInterval: 30 // Adjust this to increase/decrease the gap
//         }}
//         autoPlay={false}
//         autoPlayInterval={2000}
//         scrollAnimationDuration={1000}
//         onSnapToItem={handleSnapToItem}
//         ref={scrollViewRef}
//       />
//       <Text style={styles.prompt}>{contacts[activeIndex]?.prompt}</Text>

//       <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollViewRef.current?.scrollTo({ x: -viewportWidth * 0.3, animated: true })}>
//         <FontAwesome name="angle-left" size={64} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.arrowRight} onPress={() => scrollViewRef.current?.scrollTo({ x: viewportWidth * 0.3, animated: true })}>
//         <FontAwesome name="angle-right" size={64} color="rgb(45, 62, 95)" />
//       </TouchableOpacity>

//       {/* Modal for YouTube Player */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => {
//           setIsModalVisible(!isModalVisible);
//         }}
//       >
//         <View style={styles.modalView}>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setIsModalVisible(!isModalVisible)}
//           >
//             <FontAwesome name="arrow-left" size={24} color="black" />
//             <Text style={styles.closeText}>Back To Garden Loft App</Text>
//           </TouchableOpacity>
//           {/* {youtubeId && (
//             <YoutubePlayer
//               height={viewportHeight * 0.8}
//               width={viewportWidth * 0.8}
//               videoId={youtubeId}
//               play={true}
//             />
//           )} */}
//           {/* <VideoSDK /> */}
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     alignItems: 'center',
//     height: 290,
//   },
//   cardContainer: {
//     width: viewportWidth * 0.3,
//     height: viewportHeight * 0.3,
//     backgroundColor: '#f09030',
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10, // Add margin to create gap between cards
//     shadowOffset: {
//       width: 6,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 10,
//   },
//   cardText: {
//     fontSize: 36,
//     color: '#393939',
//     fontWeight: '700',
//   },
//   prompt: {
//     fontSize: 30,
//     color: '#393939',
//     fontWeight: '700',
//     marginTop: 15,
//   },
//   arrowLeft: {
//     position: 'absolute',
//     top: '40%',
//     left: -17,
//     transform: [{ translateY: -50 }],
//   },
//   arrowRight: {
//     position: 'absolute',
//     top: '40%',
//     right: -25,
//     transform: [{ translateY: -50 }],
//   },
//   modalView: {
//     margin: 20,
//     height: viewportHeight * 0.9,
//     marginTop: 30,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 3,
//     paddingTop: 90,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   closeButton: {
//     position: 'absolute',
//     left: 400,
//     top: 30,
//     backgroundColor: 'lightblue',
//     padding: 15,
//     borderRadius: 5,
//   },
//   closeText: {
//     fontSize: 24,
//     position: 'absolute',
//     left: 40,
//     top: 0,
//     width: 320,
//     backgroundColor: 'lightblue',
//     padding: 10,
//     borderRadius: 70,
//   },
// });

// export default VideoCall;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const VideoCall = () => {
  const [userNames, setUserNames] = useState([]);
  const [youtubeId, setYoutubeId] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUserNames = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
      const fetchedUserNames = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().userName }));
      setUserNames(fetchedUserNames);
    };
    fetchUserNames();
  }, []);

  const fetchAndPlayVideo = async (docId) => {
    const docRef = doc(FIRESTORE_DB, 'users', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setYoutubeId(docSnap.data().youtubeId); // Assuming the document contains a field `youtubeId`
      setIsModalVisible(true); // Open the modal to play video
    } else {
      console.log('No such document!');
    }
  };

  const handleSnapToItem = (index) => {
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.cardContainer, { backgroundColor: index === activeIndex ? '#f3b718' : '#f09030' }]}
      onPress={() => fetchAndPlayVideo(item.id)}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={userNames}
        renderItem={renderItem}
        width={viewportWidth * 0.7}
        height={viewportHeight * 0.3}
        mode="horizontal-stack"
        modeConfig={{
          stackInterval: 30 // Adjust this to increase/decrease the gap
        }}
        autoPlay={false}
        autoPlayInterval={2000}
        scrollAnimationDuration={1000}
        onSnapToItem={handleSnapToItem}
        ref={scrollViewRef}
      />
      <Text style={styles.prompt}>{userNames[activeIndex]?.prompt}</Text>

      <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollViewRef.current?.scrollTo({ x: -viewportWidth * 0.3, animated: true })}>
        <FontAwesome name="angle-left" size={64} color="rgb(45, 62, 95)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowRight} onPress={() => scrollViewRef.current?.scrollTo({ x: viewportWidth * 0.3, animated: true })}>
        <FontAwesome name="angle-right" size={64} color="rgb(45, 62, 95)" />
      </TouchableOpacity>

      {/* Modal for YouTube Player */}
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
          {/* {youtubeId && (
            <YoutubePlayer
              height={viewportHeight * 0.8}
              width={viewportWidth * 0.8}
              videoId={youtubeId}
              play={true}
            />
          )} */}
          {/* <VideoSDK /> */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    height: 290,
  },
  cardContainer: {
    width: viewportWidth * 0.6,
    height: viewportHeight * 0.3,
    backgroundColor: '#f09030',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 24,
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
  },
});

export default VideoCall;

