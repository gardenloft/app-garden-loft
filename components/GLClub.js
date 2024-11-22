import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_STORAGE } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications"; // Import for notifications
import { callUser } from "../app/VideoSDK2"; // Import from VideoCall
import { getDownloadURL, ref } from "firebase/storage"; // Firebase Storage methods
import TextComponent from "./Text.js";
import ComingSoon from "./ComingSoon";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const defaultImage = {
  elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
  shari: require("../assets/images/portrait2.jpg"),
  pat: require("../assets/images/portrait4.jpg"),
  john: require("../assets/images/portrait3.jpg"),
  matthew: require("../assets/images/portrait5.jpg"),
};

const GLClub = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState("all");
  const [friendRequests, setFriendRequests] = useState({});
  const [friends, setFriends] = useState([]);
  const [isCalling, setIsCalling] = useState(false); // Add for call logic
  const [isDeclined, setIsDeclined] = useState(false); //Add for decline logic
  const [showMoreDetails, setShowMoreDetails] = useState(false); // Control for showing more details
  const [threeDotsVisible, setThreeDotsVisible] = useState(false); // Control for the three-dot modal
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the box is expanded
  const [chatModalVisible, setChatModalVisible] = useState(false); //For Chat Modal

  const carouselRef = useRef(null);
  const notificationListenerRef = useRef(null); // Ref for the notification listener

  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserNames();
      listenToFriendRequests();
      listenToFriends();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortContacts();
  }, [contacts, filter, friendRequests, friends]);

  const fetchUserNames = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, "users"));
      const fetchedContacts = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          let imageUrl =
            data.imageUrl || defaultImage[data.userName] || defaultImage.john; // Using the direct URL if available

          return {
            id: doc.id,
            uid: data.uid,
            name: data.userName || "Unknown User",
            city: data.city || "Calgary",
            hobbies: data.hobbies
              ? data.hobbies.split(", ")
              : ["Reading", "Painting"], // Split hobbies into an array
            clubs: data.clubs ? data.clubs.split(", ") : ["Book", "Knitting"],
            meetingId: data.meetingId || "",
            imageUrl: data.imageUrl, // Direct URL from Firestore
          };
        })
        .filter(
          (contact) => contact.uid !== user.uid // Filter out the logged-in user and null users
        );

      setContacts(fetchedContacts);
    } catch (error) {
      console.error("Error fetching user names: ", error.message);
    }
  };

  const listenToFriendRequests = () => {
    const friendRequestsRef = collection(
      FIRESTORE_DB,
      `users/${user.uid}/friendRequests`
    );
    const unsubscribe = onSnapshot(friendRequestsRef, (snapshot) => {
      const requests = {};
      snapshot.forEach((doc) => {
        const request = doc.data();
        const role = request.senderId === user.uid ? "sender" : "receiver";
        requests[doc.id] = { ...request, role };
      });
      setFriendRequests(requests);
    });

    return () => unsubscribe();
  };

  const listenToFriends = () => {
    const friendsRef = collection(FIRESTORE_DB, `users/${user.uid}/friends`);
    const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
      const friendsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriends(friendsList);
    });

    return () => unsubscribe();
  };

  const filterAndSortContacts = () => {
    let filtered = contacts;
    if (filter === "friends") {
      filtered = contacts.filter((contact) =>
        friends.some((friend) => friend.id === contact.id)
      );
    }
    filtered.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
    setFilteredContacts([...new Set(filtered)]);
  };

  const handleAddFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await setDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
        {
          status: "pending",
          senderName: user.displayName || user.email,
          senderId: user.uid,
        }
      );

      Alert.alert("Friend request sent successfully");

      setFriendRequests((prevRequests) => ({
        ...prevRequests,
        [contact.id]: { status: "pending", role: "sender" },
      }));
    } catch (error) {
      console.error("Error sending friend request: ", error);
      Alert.alert("Error sending friend request.");
    }
  };

  const handleAcceptFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      // Fetch current user profile data from Firestore
      const currentUserRef = doc(FIRESTORE_DB, "users", user.uid);
      const currentUserSnap = await getDoc(currentUserRef);

      if (currentUserSnap.exists()) {
        const currentUserData = currentUserSnap.data();
        const currentUserName = currentUserData.userName || user.email;
        const currentUserImageUrl = currentUserData.imageUrl || null;

        // Accept the friend request by updating both users' friendRequests
        await setDoc(
          doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id),
          { status: "accepted" }
        );
        await setDoc(
          doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid),
          { status: "accepted" }
        );

        // Add the contact to the current user's friends list
        await setDoc(
          doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id),
          {
            name: contact.name,
            city: contact.city,
            hobbies: contact.hobbies,
            clubs: contact.clubs,
            imageUrl: contact.imageUrl,
          }
        );

        // Add the current user to the contact's friends list with proper userName and imageUrl
        await setDoc(
          doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid),
          {
            name: currentUserName, // userName from Firestore or email
            city: currentUserData.city || "Calgary", // Default to Calgary if not available
            hobbies: currentUserData.hobbies || ["Reading", "Painting"], // Default hobbies
            clubs: currentUserData.clubs || ["Book", "Knitting"], // Default clubs
            imageUrl: currentUserImageUrl, // Use the fetched imageUrl
          }
        );

        setFriendRequests((prevRequests) => ({
          ...prevRequests,
          [contact.id]: "accepted",
        }));

        Alert.alert("Friend request accepted");
      } else {
        Alert.alert("Error retrieving current user profile");
      }
    } catch (error) {
      console.error("Error accepting friend request: ", error);
      Alert.alert("Error accepting friend request.");
    }
  };

  const handleDeclineFriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
      );
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
      );

      setFriendRequests((prevRequests) => {
        const newRequests = { ...prevRequests };
        delete newRequests[contact.id];
        return newRequests;
      });

      Alert.alert("Friend request declined");
    } catch (error) {
      console.error("Error declining friend request: ", error);
      Alert.alert("Error declining friend request.");
    }
  };

  const handleUnfriend = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    try {
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friends`, contact.id)
      );

      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friends`, user.uid)
      );

      await deleteDoc(
        doc(FIRESTORE_DB, `users/${user.uid}/friendRequests`, contact.id)
      );
      await deleteDoc(
        doc(FIRESTORE_DB, `users/${contact.id}/friendRequests`, user.uid)
      );

      setFriendRequests((prevRequests) => {
        const updatedRequests = { ...prevRequests };
        delete updatedRequests[contact.id];
        return updatedRequests;
      });

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== contact.id)
      );

      Alert.alert("Unfriended successfully");
      setThreeDotsVisible(false);
    } catch (error) {
      console.error("Error unfriending:", error);
      Alert.alert("Error unfriending.");
    }
  };

  const toggleThreeDots = () => {
    setThreeDotsVisible(!threeDotsVisible);
  };

  const startVideoCall = async (calleeUid) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    setIsCalling(true); // Show the calling modal
    setIsDeclined(false); // Reset the decline state when starting a new call

    await callUser(calleeUid, user); // Use the imported callUser function

    notificationListenerRef.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { accept, decline, meetingId } =
          notification.request.content.data;
        if (accept) {
          setIsCalling(false); // Hide the calling modal
          onCalleeAccept(meetingId);
          removeNotificationListener();
        } else if (decline) {
          setIsCalling(false); // Handle call decline
          setIsDeclined(true);
          removeNotificationListener();
        }
      });
  };

  const onCalleeAccept = (meetingId) => {
    router.push({
      pathname: "/VideoSDK2",
      params: { meetingId, autoJoin: true },
    });
  };

  const removeNotificationListener = () => {
    if (notificationListenerRef.current) {
      Notifications.removeNotificationSubscription(
        notificationListenerRef.current
      );
      notificationListenerRef.current = null;
    }
  };

  const handleCall = (contactId) => {
    setModalVisible(false); // Close modal
    startVideoCall(contactId); // Start the video call using the contact's ID
  };

  const cancelCall = () => {
    setIsCalling(false);
    removeNotificationListener(); // Remove the notification listener
  };

  const handleChatPress = () => {
    setChatModalVisible(true);
  };

  const closeChatModal = () => {
    setChatModalVisible(false);
  };

  const handleCardPress = (contact) => {
    setSelectedContact(contact);
    setModalVisible(true);
  };

  const renderItem = ({ item, index }) => (
    <Pressable
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor: "transparent",
          transform: [{ scale: 1.1 }],
        },
        {
          height:
            SCREEN_WIDTH > SCREEN_HEIGHT
              ? Math.round(Dimensions.get("window").height * 0.3)
              : Math.round(Dimensions.get("window").height * 0.25),
        },
      ]}
      onPress={() => handleCardPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={[styles.image, phoneStyles.image]} />
      <Text style={[styles.cardText, phoneStyles.cardText]}>
        {item.name}
        {friendRequests[item.id]?.status === "accepted" && (
          <FontAwesome
            name="check-circle"
            size={SCREEN_WIDTH <= 413 ? 20: 40} // Bigger tick mark
            color="green"
            style={styles.nameIconStyle}
          />
        )}
        {friendRequests[item.id]?.status === "pending" && (
          <FontAwesome
            name="question-circle"
            size={SCREEN_WIDTH <= 413 ? 20: 40} // Bigger pending icon
            color="orange"
            style={styles.nameIconStyle}
          />
        )}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          phoneStyles.container,
          {
            height: SCREEN_WIDTH > SCREEN_HEIGHT ? 920 : 450,
            marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : 45,
          },
        ]}>
        <View style={styles.filterButtons}>
          <Pressable
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("all")}>
            <Text
              style={[
                styles.filterButtonText,
                filter === "all" && styles.activeFilterButtonText,
              ]}>
              All
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              filter === "friends" && styles.activeFilterButton,
            ]}
            onPress={() => setFilter("friends")}>
            <Text
              style={[
                styles.filterButtonText,
                filter === "friends" && styles.activeFilterButtonText,
              ]}>
              My Friends
            </Text>
          </Pressable>
        </View>

        <Carousel
          ref={carouselRef}
          data={filteredContacts}
          renderItem={renderItem}
          width={SCREEN_WIDTH * 0.3}
          height={SCREEN_WIDTH * 0.3}
          style={{
            width: Math.round(SCREEN_WIDTH * 0.9),
            height: Math.round(SCREEN_HEIGHT * 0.5),
            ...phoneStyles.carousel,
          }}
          loop
          onSnapToItem={(index) => setActiveIndex(index)}
          pagingEnabled
        />

<Pressable
  style={[styles.arrowLeft, phoneStyles.arrowLeft]}
  onPress={() => carouselRef.current?.scrollTo({ count: -1, animated: true })}
>
  <FontAwesome
    name="angle-left"
    size={SCREEN_WIDTH <= 413 ? 65 : 100}
    color="rgb(45, 62, 95)"
  />
</Pressable>

<Pressable
  style={[styles.arrowRight, phoneStyles.arrowRight]}
  onPress={() => carouselRef.current?.scrollTo({ count: 1, animated: true })}
>
  <FontAwesome
    name="angle-right"
    size={SCREEN_WIDTH <= 413 ? 65 : 100}
    color="rgb(45, 62, 95)"
  />
</Pressable>



        {/* <Pressable
          style={[
            styles.arrowLeft,
            {
              left: SCREEN_WIDTH > SCREEN_HEIGHT ? -17 : -22,
              top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
            },
          ]}
          onPress={() => {
            carouselRef.current?.scrollTo({ count: -1, animated: true });
          }}>
          <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
        </Pressable>
        <Pressable
          style={[
            styles.arrowRight,
            {
              right: SCREEN_WIDTH > SCREEN_HEIGHT ? -25 : -22,
              top: SCREEN_WIDTH > SCREEN_HEIGHT ? "40%" : "100%",
            },
          ]}
          onPress={() => {
            carouselRef.current?.scrollTo({ count: 1, animated: true });
          }}>
          <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
        </Pressable> */}

        {selectedContact && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <View style={[styles.modalContainer, phoneStyles.modalContainer]}>
              <ScrollView
                contentContainerStyle={[
                  styles.modalContent,
                  phoneStyles.modalContent,
                  {
                    flexDirection:
                      SCREEN_WIDTH > SCREEN_HEIGHT ? "row" : "column",
                  },
                ]}>
                <Pressable
                  style={[styles.closeButton, phoneStyles.closeButton]}
                  onPress={() => setModalVisible(false)}>
                  <FontAwesome name="close" size={30} color="black" />
                </Pressable>
                <View style={[styles.modalImageButtons, phoneStyles.modalImageButtons]}>
                  <View style={styles.modalImageContainer}>
                    <Image
                      source={{ uri: selectedContact.imageUrl }}
                      style={[
                        styles.modalImage,
                        phoneStyles.modalImage,
                        {
                          width: SCREEN_WIDTH > SCREEN_HEIGHT ? 400 : 350,
                          height: SCREEN_WIDTH > SCREEN_HEIGHT ? 650 : 400,
                          marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : 20,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.modalInfoContainer,
                    {
                      marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? -30 : -100,
                    },
                  ]}>
                  <View
                    style={[
                      styles.actionContainer,
                      phoneStyles.actionContainer,
                      {
                        marginLeft: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : -250,
                        marginTop: SCREEN_WIDTH > SCREEN_HEIGHT ? -220 : 120,
                      },
                    ]}>
                    {!friendRequests[selectedContact.id] && (
                      <Pressable
                        onPress={() => handleAddFriend(selectedContact)}
                        style={[styles.actionButton, phoneStyles.actionButton]}>
                        <FontAwesome
                          name="user-plus"
                          size={24}
                          color="#4169E1"
                          style={styles.modalIcon}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            phoneStyles.actionButtonText,
                            styles.unFriendText,
                          ]}>
                          Add Friend
                        </Text>
                      </Pressable>
                    )}
                    {friendRequests[selectedContact.id]?.role === "receiver" &&
                      friendRequests[selectedContact.id].status ===
                        "pending" && (
                        <>
                          <Pressable
                            onPress={() => handleAcceptFriend(selectedContact)}
                            style={styles.actionButton}>
                            <FontAwesome
                              name="check-circle"
                              size={35}
                              color="green"
                              style={styles.modalIcon}
                            />
                            <Text
                              style={[
                                styles.actionButtonText,
                                styles.unFriendText,
                              ]}>
                              Accept
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={() => handleDeclineFriend(selectedContact)}
                            style={styles.actionButton}>
                            <FontAwesome
                              name="times-circle"
                              size={35}
                              color="red"
                              style={styles.modalIcon}
                            />
                            <Text
                              style={[
                                styles.actionButtonText,
                                styles.unFriendText,
                              ]}>
                              Decline
                            </Text>
                          </Pressable>
                        </>
                      )}
                    {friendRequests[selectedContact.id]?.role === "sender" &&
                      friendRequests[selectedContact.id].status ===
                        "pending" && (
                        <Text style={styles.pendingText}>
                          Friend request sent
                        </Text>
                      )}
                    {friendRequests[selectedContact.id]?.status ===
                      "accepted" && (
                      <>
                        <Pressable
                          onPress={() => handleCall(selectedContact.id)}
                          style={[
                            styles.actionButton,
                            ,
                            styles.callButton,
                            phoneStyles.actionButton,
                            phoneStyles.callButton,
                            {
                              marginLeft: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : 30,
                            },
                          ]}>
                          <FontAwesome
                            name="video-camera"
                            size={35}
                            color="white"
                            style={[styles.modalIcon, phoneStyles.modalIcon]}
                          />
                          <Text style={[styles.actionButtonText, phoneStyles.actionButtonText]}  numberOfLines={1} 
                               adjustsFontSizeToFit >Call</Text>
                        </Pressable>
                        <Pressable
                          onPress={handleChatPress}
                          style={[
                            styles.actionButton,
                            ,
                            styles.messageButton,
                            phoneStyles.actionButton,
                            phoneStyles.messageButton,
                            {
                              backgroundColor: "#0266E0",
                            },
                          ]}>
                          <FontAwesome
                            name="comment"
                            size={35}
                            color="white"
                            style={[styles.modalIcon, phoneStyles.modalIcon]}
                          />
                          <Text 
                                 style={[styles.actionButtonText, phoneStyles.actionButtonText]} 
                                  numberOfLines={1} 
                               adjustsFontSizeToFit
                                       >
                                          Message
                              </Text>
                        </Pressable>

                        {/* Modal for Chat Component */}
                        {selectedContact && (
                          <Modal
                            visible={chatModalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={closeChatModal}>
                            <SafeAreaView style={styles.chatContainer}>
                              <Pressable
                                style={styles.closeButton}
                                onPress={closeChatModal}>
                                <FontAwesome
                                  name="close"
                                  size={30}
                                  color="black"
                                />
                              </Pressable>
                              {/* <ComingSoon /> */}
                              {/* below id the Text Component */}
                              <TextComponent
                                friendId={selectedContact.id}
                                friendName={selectedContact.name}
                                currentUser={user}
                              />
                            </SafeAreaView>
                          </Modal>
                        )}

                        <Pressable
                          onPress={toggleThreeDots}
                          style={[styles.threeDotsButton]}>
                          <Text
                            style={[
                              styles.actionButtonText,
                              {
                                fontSize: 50,
                              },
                            ]}>
                            :
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                  {threeDotsVisible && (
                    <View
                      style={[
                        styles.threeDotsMenu,
                        {
                          right: SCREEN_WIDTH > SCREEN_HEIGHT ? 20 : -250,
                        },
                      ]}>
                      {friendRequests[selectedContact.id]?.status ===
                        "accepted" && (
                        <Pressable
                          onPress={() => handleUnfriend(selectedContact)}
                          style={[styles.actionButton, styles.unFriendButton]}>
                          <FontAwesome
                            name="user-times"
                            size={35}
                            color="red"
                            style={styles.modalIcon}
                          />
                          <Text
                            style={[
                              styles.actionButtonText,
                              styles.unFriendText,
                            ]}>
                            Unfriend
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                  <Text
                    style={[
                      styles.modalName,
                      {
                        top: SCREEN_WIDTH > SCREEN_HEIGHT ? -75 : 250,
                        marginLeft: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : -140,
                      },
                    ]}>
                    {selectedContact.name}
                  </Text>
                  <View
                    style={[
                      styles.moreDetailsContainer,
                      isExpanded && [
                        styles.moreDetailsContainerExpanded,
                        {
                          height:
                            SCREEN_WIDTH > SCREEN_HEIGHT
                              ? SCREEN_HEIGHT * 0.35
                              : SCREEN_HEIGHT * 0.23, // Dynamic height based on screen orientation
                        },
                      ],
                      {
                        top: SCREEN_WIDTH > SCREEN_HEIGHT ? 10 : 350,
                        marginLeft: SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : -200,

                        alignItems:
                          SCREEN_WIDTH > SCREEN_HEIGHT ? "left" : "center",
                        justifyContent:
                          SCREEN_WIDTH > SCREEN_HEIGHT ? "left" : "center",
                      },
                    ]}>
                    <ScrollView
                      style={styles.scrollableDetails}
                      showsVerticalScrollIndicator={true}
                      persistentScrollbar={true}>
                      <Text
                        style={[
                          styles.modalText,
                          {
                            alignSelf:
                              SCREEN_WIDTH > SCREEN_HEIGHT ? "left " : "center",
                          },
                        ]}>
                        City: {selectedContact.city}
                      </Text>

                      <View style={styles.interestContainer}>
                        <Text
                          style={[
                            styles.modalInterestsTitle,
                            {
                              alignSelf:
                                SCREEN_WIDTH > SCREEN_HEIGHT
                                  ? "left "
                                  : "center",
                            },
                          ]}>
                          Interests:
                        </Text>
                        {selectedContact.hobbies.map((hobby, index) => (
                          <Text
                            key={index}
                            style={[
                              styles.modalInterests,
                              {
                                alignSelf:
                                  SCREEN_WIDTH > SCREEN_HEIGHT
                                    ? "left "
                                    : "center",
                              },
                            ]}>
                            - {hobby}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.hobbyContainer}>
                        <Text
                          style={[
                            styles.modalInterestsTitle,
                            {
                              alignSelf:
                                SCREEN_WIDTH > SCREEN_HEIGHT
                                  ? "left "
                                  : "center",
                            },
                          ]}>
                          Clubs:
                        </Text>
                        {selectedContact.clubs.map((club, index) => (
                          <Text
                            key={index}
                            style={[
                              styles.modalInterests,
                              {
                                alignSelf:
                                  SCREEN_WIDTH > SCREEN_HEIGHT
                                    ? "left "
                                    : "center",
                              },
                            ]}>
                            - {club}
                          </Text>
                        ))}
                      </View>
                    </ScrollView>
                    <Pressable onPress={() => setIsExpanded(!isExpanded)}>
                      <Text style={styles.readMoreText}>
                        {isExpanded ? "Show Less" : "Read More"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
        )}

        <Modal visible={isCalling} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#f3b718" />
            <Image
              source={require("../assets/garden-loft-logo2.png")}
              style={styles.logo}
            />
            <Text style={styles.modalTextCall}>Calling . . .</Text>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelCall}>
              <Text style={styles.buttonText}>Cancel Call</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={isDeclined}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../assets/garden-loft-logo2.png")}
              style={styles.logo}
            />
            <Text style={styles.modalTextCall}>
              They are not available right now
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.dismissButton]}
              onPress={() => setIsDeclined(false)}>
              <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};


const phoneStyles =
  SCREEN_WIDTH <= 413
    ? {
        container: {
          marginTop: SCREEN_HEIGHT * 0.2, // Adjust spacing for phones
          height: SCREEN_WIDTH > SCREEN_HEIGHT ? 820 : 350,
           
        },
        cardContainer: {
          width: SCREEN_WIDTH * 0.43,
          height: SCREEN_HEIGHT * 0.25,
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 12,
          alignItems: "center",
          paddingVertical: SCREEN_HEIGHT * 0.02,
          backgroundColor: "#fff",
          shadowColor: "transparent", // Remove shadow
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        image: {
          width: 97, // Adjust size for phones
          height: 97, // Adjust size for phones
          borderRadius: 50, // Keep the image circular
          marginBottom: 6,
          margin: 8,
          shadowColor: "transparent",
           backgroundColor: "transparent",
          shadowOffset: { width: 0, height: 0},
          shadowOpacity: 0, // Slightly reduce shadow for smaller screens
          shadowRadius: 0,
          elevation: 0,
        },
        iconStyle: {
          position: "absolute",
          top: SCREEN_HEIGHT * 0.01, // Adjust top positioning for phones
          right: SCREEN_WIDTH * 0.05, // Slightly larger margin for phones
        },
        nameIconStyle: {
          marginLeft: 3, // Smaller margin for phones
          fontSize: 18, 
        },
        cardText: {
          fontSize: 16,
          textAlign: "center",
          color: "#333",
          marginTop: SCREEN_HEIGHT * 0.005,
          height: SCREEN_HEIGHT * 0.05,
          overflow: "hidden",
        },
     
        arrowLeft: {
          position: "absolute",
          left: -5, // Flush with the screen edge
          top: "65%", // Centered vertically relative to the carousel
          transform: [{ translateY: -50 }],
          zIndex: 10,
        },
        arrowRight: {
          position: "absolute",
          right: -5, // Flush with the screen edge
          top: "65%", // Centered vertically relative to the carousel
          transform: [{ translateY: -50 }],
          zIndex: 10,
        },
        filterButtons: {
          flexDirection: "row",
          justifyContent: "center",
          marginTop: SCREEN_HEIGHT * 0.18,
          marginBottom: SCREEN_HEIGHT * 0.03,
        },
        filterButton: {
          paddingHorizontal: SCREEN_WIDTH * 0.05,
          paddingVertical: SCREEN_HEIGHT * 0.015,
          borderRadius: 15,
          marginHorizontal: SCREEN_WIDTH * 0.02,
        },
        filterButtonText: {
          fontSize: 16,
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background for focus
          paddingHorizontal: 10, // Reduce padding for smaller screens
          width: SCREEN_WIDTH * 0.95, // Make modal wider for phones
          height: SCREEN_HEIGHT * 0.85, // Increase modal length
        },
        modalContent: {
          width:SCREEN_WIDTH * 0.9, // Adjust width to fit phone screens
          height: SCREEN_HEIGHT * 0.9, // Reduce height for smaller screens
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 10, // Compact padding for phone screens
          alignItems: "center",
          justifyContent: "flex-start",
        },

        modalIcon: {
          marginBottom: 5, // Reduced margin for better spacing
        },
        
        closeButton: {
          position: "absolute",
          top: 15, // Adjust position for smaller screens
          right: 15,
          backgroundColor: "#ccc", // Neutral color for clarity
          padding: 8,
          borderRadius: 12,
        },
        modalImageButtons: {
          flexDirection: "column",
          alignItems: "center",
          marginTop: 20, // Add spacing from the top
        },
        modalImage: {
          width: SCREEN_WIDTH * 0.2, // Adjust image width
          height: SCREEN_HEIGHT * 0.1, // Adjust image height
          borderRadius: 10,
          marginBottom: 10,
        },

        modalInfoContainer: {
          flex: 1,
          marginTop: -20, // Adjust alignment
          alignItems: "center",
        },
        
        
        actionContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
          width: SCREEN_WIDTH * 0.8, // Adjust button container width
          marginVertical: 10,
        },
        actionButton: {
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
          padding: 10,
          width: SCREEN_WIDTH * 0.35, // Adjust button size
          height:SCREEN_HEIGHT * 0.07,
          paddingVertical: SCREEN_HEIGHT * 0.015, // Smaller padding
          paddingHorizontal: SCREEN_WIDTH* 0.03,
          alignItems: "center",
          justifyContent: "center",
        },
        actionButtonText: {
          fontSize: 14, // Reduce font size
          color: "#333",
          marginTop: 5,
        },
        callButton: {
          backgroundColor: "green",
        },
        messageButton: {
          backgroundColor: "#0266E0",
        },
        
          chatContainer: {
            width: SCREEN_WIDTH * 0.9,
            height: SCREEN_HEIGHT * 0.8,
            borderRadius: 15,
            backgroundColor: "#fff",
            padding: 15,
            alignItems: "center",
          },
          threeDotsButton: {
            backgroundColor: "grey",
  width: 30, // Smaller width
  height: 30,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
          },
          threeDotsMenu: {
            position: "absolute",
            bottom: 50,
            alignSelf: "center",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          scrollView: {
            width: SCREEN_WIDTH * 0.9, // Full width for phones
            paddingHorizontal: 10, // Add padding for better spacing
          },
          modalName: {
            fontSize: 16, // Adjust font size for smaller screens
            fontWeight: "bold",
            color: "#333",
            marginBottom: 10,
            textAlign: "center",
          },
          moreDetailsContainer: {
            height: 50, // Reduce collapsed height
            marginVertical: 10,
            alignItems: "center",
            overflow: "hidden",
          },
          moreDetailsContainerExpanded: {
            height: SCREEN_HEIGHT * 0.3, // Adjust expanded height
            overflow: "visible",
          },
          readMoreText: {
            fontSize: 14, // Reduced size for phones
            color: "#0EC2E9",
            marginTop: 10,
            textAlign: "center",
          },
          modalInterestsTitle: {
            fontSize: 14, // Adjust for phones
            fontWeight: "bold",
            color: "#666",
            marginBottom: 5,
            textAlign: "center",
          },
          modalInterests: {
            fontSize: 12, // Smaller font size for phones
            color: "#666",
            marginBottom: 5,
            textAlign: "center",
          },  
          

      callButton: {
        backgroundColor: "green",
        padding: SCREEN_HEIGHT * 0.015,
        borderRadius: 8,
        marginHorizontal: SCREEN_WIDTH * 0.02,
      },
      chatButton: {
        backgroundColor: "#0266E0",
        padding: SCREEN_HEIGHT * 0.015,
        borderRadius: 8,
        marginHorizontal: SCREEN_WIDTH * 0.02,
      },

      unfriendButton: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: SCREEN_HEIGHT * 0.02,
        marginHorizontal: SCREEN_WIDTH * 0.03,
      },
      unfriendText: {
        color: "red",
        fontSize: 14,
        fontWeight: "600",
      },
      callingModal: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
      },
      modalTextCall: {
        fontSize: 18, // Reduce font size
        color: "#fff",
        marginVertical: 10,
      },
      dismissButton: {
        backgroundColor: "orange",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
      },
      buttonText: {
        fontSize: 14,
        color: "#fff",
      },
      
    
      carousel: {
        width: SCREEN_WIDTH * 0.9, // Full-width for the carousel
        height: SCREEN_HEIGHT * 0.3, // Adjust height as needed
      },
      
      }
    : {};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    position: "relative",
    ...phoneStyles.container,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.04,
    marginTop: SCREEN_HEIGHT * 0.22,
    ...phoneStyles.filterButtons,
  },
  filterButton: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 20,
    backgroundColor: "grey",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...phoneStyles.filterButton,
  },
  activeFilterButton: {
    backgroundColor: "orange",
  },
  filterButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    ...phoneStyles.filterButtonText,
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  arrowLeft: {
    position: "absolute",
    transform: [{ translateY: -50 }],
    ...phoneStyles.arrowLeft,
  },
  arrowRight: {
    position: "absolute",
    transform: [{ translateY: -50 }],
    ...phoneStyles.arrowRight,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 9.22,
    elevation: 12,
    ...phoneStyles.cardContainer,
  },
  cardText: {
    fontSize: 30,
    color: "black",
    fontWeight: "700",
    ...phoneStyles.cardText,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 180,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    ...phoneStyles.image,
  },
  iconStyle: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.02,
    right: SCREEN_WIDTH * 0.03,
    ...phoneStyles.iconStyle,
  },
  nameIconStyle: {
    marginLeft: 10,
    ...phoneStyles.nameIconStyle,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF8E3",
    ...phoneStyles.modalContainer,
  },
  modalTextCall: {
    fontSize: 40,
    color: "black",
    marginTop: 20,
    ...phoneStyles. modalTextCall,
  },
  modalContent: {
    marginTop: 30,
    gap: 30,
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.93,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    ...phoneStyles.modalContent,
  },
  modalImage: {
    // borderRadius:30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 4,
    marginLeft: 30,
    marginRight: 40,
    borderColor: "#FFD700",
    zIndex: 1,
    // marginBottom: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    ...phoneStyles.modalImage,
  },
  modalImageButtons: {
    flexDirection: "column",
    alignItems: "center",
    ...phoneStyles.modalImageButtons
  },
  modalInfoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    ...phoneStyles.

  },
  modalName: {
    fontSize: 55,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
    position: "absolute",
    zIndex: 10, // Keep it above other content
    ...phoneStyles.modalName,
  },
  modalText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#666",
    marginBottom: SCREEN_HEIGHT * 0.005,
    ...phoneStyles.modalText,
  },
  modalInterestsTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#333",
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.005,
    ...phoneStyles.modalInterestsTitle,
  },
  modalInterests: {
    fontSize: 23,
    color: "#666",
    marginBottom: SCREEN_HEIGHT * 0.005,
    marginLeft: 30,
    ...phoneStyles.modalInterests,
  },

  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 30,
    // marginTop: -220,
    // marginLeft: 30,
    height: "20%",
    position: "absolute",
    zIndex: 10, // Keep it above other content
    ...phoneStyles.actionContainer,
  },
  actionButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    gap: 5,
    padding: 50,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    // paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    ...phoneStyles.actionButton,
  },
  callButton: {
    backgroundColor: "green",
    ...phoneStyles.callButton,
  },
  unFriendText: {
    color: "black",
    ...phoneStyles.unfriendText,
  },
  unFriendButton: {
    marginTop: 30,
    flexDirection: "row",
    width: 300,
    gap: 30,
    ...phoneStyles.unfriendButton,
  },
  actionButtonText: {
    fontSize: 25,
    fontWeight: "600",
    color: "white",
    // marginRight: SCREEN_WIDTH * 0.02,
    ...phoneStyles.actionButtonText,
  },
  modalIcon: {
    marginLeft: SCREEN_WIDTH * 0.02,
    ...phoneStyles.modalIcon,
  },
  readMoreText: {
    fontSize: 23,
    color: "#0EC2E9",
    ...phoneStyles.readMoreText,
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 30,
    backgroundColor: "lightblue",
    padding: 13,
    borderRadius: 5,
    zIndex: 1,
    ...phoneStyles.closeButton,
  },
  closeButtonText: {
    fontSize: 35,
    color: "#fff",
    fontWeight: "bold",
    ...phoneStyles.closeButtonText,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  dismissButton: {
    backgroundColor: "orange",
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: "red",
    marginTop: 30,
  },
  button: {
    padding: 20,
    borderRadius: 10,
  },
  scrollableDetails: {
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.45,
  },
  moreDetailsContainer: {
    position: "absolute",
    height: 30, // Initially collapsed
    overflow: "hidden", // Ensure the content is hidden when not expanded
    transition: "height 2s ease", // Smooth transition for height change
  },
  moreDetailsContainerExpanded: {
    height: SCREEN_HEIGHT * 0.35, // Expand downwards to desired height
    overflow: "visible", // Allow content to be shown
  },
  threeDotsButton: {
    backgroundColor: "grey",
    marginTop: 0,
    width: 45,
    height: 90,
    borderRadius: 30,
    paddingVertical: SCREEN_HEIGHT * 0.015,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.01,
    ...phoneStyles.threeDotsButton,
  },
  threeDotsMenu: {
    position: "absolute",
    top: -70,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    zIndex: 100,
    ...phoneStyles.threeDotsMenu,
  },
  chatContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: "#fff",
    borderRadius: 35,
    marginLeft: 20,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    ...phoneStyles.chatContainer,
  },
});

export default GLClub;
