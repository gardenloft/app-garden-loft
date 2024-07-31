import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Logout: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("rememberedUser");
      console.log("User signed out!");
      navigation.reset({
        index: 0,
        routes: [{ name: "index" }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={[
      styles.container,
      { height: viewportWidth > viewportHeight ? 320 : 500 },
    ]}>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <View
          style={[
            styles.logoutButton,
            {
              width:
                viewportWidth > viewportHeight
                  ? Math.round(Dimensions.get("window").width * 0.3)
                  : Math.round(Dimensions.get("window").width * 0.45),
            },
            {    marginTop: viewportWidth > viewportHeight ? -30 : -80,
            }
          ]}
        >
          <FontAwesome name="sign-out" size={80} color="black" />
          <Text style={styles.buttonText}>Logout</Text>
        </View>
      </Pressable>
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to log out of Garden Loft?
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLogout]}
                onPress={() => {
                  handleLogout();
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginTop: -40,
    position: "relative",
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    height: viewportHeight * 0.25,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#f3b718",
    padding: 50,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 38,
    fontFamily: "Arial",
    color: "black",
    marginLeft: 25,
    alignItems: "center",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: viewportWidth * 0.6

  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 5,
  },
  buttonCancel: {
    backgroundColor: "#f3b718",
  },
  buttonLogout: {
    backgroundColor: "#d9534f",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default Logout;
