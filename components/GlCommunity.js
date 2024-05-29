import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { FontAwesome } from "@expo/vector-icons";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const defaultImage = {
  elizabeth: require("../assets/images/pexels-anna-nekrashevich-8993561.jpg"),
  shari: require("../assets/images/portrait2.jpg"),
  pat: require("../assets/images/portrait4.jpg"),
  john: require("../assets/images/portrait3.jpg"),
  matthew: require("../assets/images/portrait5.jpg"),
};

const GLCommunity = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Elizabeth",
      meetingId: "1o31-vt61-zxdw",
      imageUrl: defaultImage.elizabeth,
    },
    {
      id: 2,
      name: "Shari",
      meetingId: "2o9t-84vd-l56t",
      imageUrl: defaultImage.shari,
    },
    {
      id: 3,
      name: "Pat",
      meetingId: "35qc-oixz-zvdd",
      imageUrl: defaultImage.pat,
    },
    {
      id: 4,
      name: "John",
      meetingId: "3s2v-9h43-d1ap",
      imageUrl: defaultImage.john,
    },
    {
      id: 5,
      name: "Matthew",
      meetingId: "42ck-ivw3-71ya",
      imageUrl: defaultImage.matthew,
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      checkContactsInDatabase(user.uid);
    }
  }, [user]);

  const checkContactsInDatabase = async (uid) => {
    const contactsQuery = query(
      collection(FIRESTORE_DB, `users/${uid}/contacts`)
    );
    const querySnapshot = await getDocs(contactsQuery);
    const dbContacts = querySnapshot.docs.map((doc) => doc.data().name);

    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      isAdded: dbContacts.includes(contact.name),
    }));

    setContacts(updatedContacts);
  };

  const handleAddContact = async (contact) => {
    if (!user) {
      Alert.alert("No user signed in");
      return;
    }

    if (contact.isAdded) {
      Alert.alert("Contact already added.");
      return;
    }

    try {
      await addDoc(collection(FIRESTORE_DB, `users/${user.uid}/contacts`), {
        name: contact.name,
        meetingId: contact.meetingId,
        imageUrl: contact.imageUrl,
      });
      Alert.alert("Contact added successfully");
      checkContactsInDatabase(user.uid);
    } catch (error) {
      console.error("Error adding contact: ", error);
      Alert.alert("Error adding contact.");
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      key={item.id}
      style={[
        styles.cardContainer,
        {
          backgroundColor:
            item.id === contacts[activeIndex].id ? "#f3b718" : "#f09030",
        },
      ]}
      onPress={() => handleAddContact(item)}>
      <Image source={item.imageUrl} style={styles.image} />
      <Text style={styles.cardText}>{item.name}</Text>
      <FontAwesome
        name={item.isAdded ? "check-circle" : "plus-circle"}
        size={24}
        color={item.isAdded ? "green" : "white"}
        style={styles.iconStyle}
      />
    </Pressable>
  );

  const handleArrowPress = (direction) => {
    let newIndex = activeIndex;
    if (direction === "left") {
      newIndex = (activeIndex - 1 + contacts.length) % contacts.length;
    } else if (direction === "right") {
      newIndex = (activeIndex + 1) % contacts.length;
    }
    scrollViewRef.current.scrollTo({ index: newIndex, animated: true });
    setActiveIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={scrollViewRef}
        data={contacts}
        renderItem={renderItem}
        width={Math.round(viewportWidth * 0.6)}
        height={viewportHeight * 0.4}
        loop
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pressable
        style={styles.arrowLeft}
        onPress={() => handleArrowPress("left")}>
        <FontAwesome name="angle-left" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
      <Pressable
        style={styles.arrowRight}
        onPress={() => handleArrowPress("right")}>
        <FontAwesome name="angle-right" size={100} color="rgb(45, 62, 95)" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    height: 290,
  },
  cardContainer: {
    width: viewportWidth * 0.3,
    height: viewportHeight * 0.3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginHorizontal: 5,
  },
  cardText: {
    fontSize: 36,
    color: "black",
    fontWeight: "700",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  iconStyle: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  arrowLeft: {
    position: "absolute",
    top: "40%",
    left: -17,
    transform: [{ translateY: -50 }],
  },
  arrowRight: {
    position: "absolute",
    top: "40%",
    right: -25,
    transform: [{ translateY: -50 }],
  },
});

export default GLCommunity;
