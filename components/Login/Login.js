import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import CheckBox from "expo-checkbox";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router/build/useNavigation";
import { FontAwesome } from "@expo/vector-icons";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptEULA, setAcceptEULA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEULAModal, setShowEULAModal] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  useEffect(() => {
    const checkRememberedUser = async () => {
      const rememberedUser = await AsyncStorage.getItem("rememberedUser");
      if (rememberedUser) {
        setLoading(true);
        try {
          const user = JSON.parse(rememberedUser);
          await signInWithEmailAndPassword(auth, user.email, user.password);
          navigation.navigate("home");
        } catch (error) {
          console.log("Auto sign in failed:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    checkRememberedUser();
  }, []);

  const signIn = async () => {
    if (!acceptEULA) {
      alert("You must accept the EULA to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (rememberMe) {
        await AsyncStorage.setItem(
          "rememberedUser",
          JSON.stringify({ email, password })
        );
      }
      console.log(response);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

    const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = response.user;
      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        email: email,
        userName: userName,
        uid: user.uid, // Ensure the UID is saved
      });
      alert("Account created successfully! Check your email.");
    } catch (error) {
      console.error(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/garden-loft-logo2.png")}
        style={styles.logo}
      />
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>

          {/* <TextInput
//           value={userName}
//           style={styles.input}
//           placeholder="Name"
//           autoCapitalize="none"
//           onChangeText={(text) => setUserName(text)}
//         /> */}
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            style={styles.passwordInput}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={24}
              color="black"
            />
          </Pressable>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={acceptEULA}
            onValueChange={setAcceptEULA}
            style={styles.checkbox}
          />
          <Text
            style={styles.checkboxLabel}
            onPress={() => setShowEULAModal(true)} // Open EULA modal
          >
            I Read and Accept the End User License Agreement (EULA).
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="orange" />
        ) : (
          <Button title="Login" onPress={signIn} />
                 /* <Button title="Create Account" onPress={signUp} /> */
        )}
      </KeyboardAvoidingView>

      {/* EULA Modal */}
      <Modal
        visible={showEULAModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEULAModal(false)}
      >
        <View style={styles.modalContainer}>
  <View style={styles.modalContent}>
    <ScrollView>
      <Text style={styles.eulaTitle}>End User License Agreement (EULA)</Text>
      <Text style={styles.eulaText}>
        End User License Agreement (EULA){"\n"}
        Effective Date: Nov 27{"\n\n"}

        1. **Acceptance of Terms**{"\n"}
        By downloading, installing, or using the Garden Loft app, you agree to be bound by this EULA. If you do not agree to these terms, you must not use the app.{"\n\n"}

        2. **License Grant**{"\n"}
        Garden Loft grants you a limited, non-exclusive, non-transferable, and revocable license to use this app for personal, non-commercial purposes, provided you comply with all terms outlined in this EULA.{"\n\n"}

        3. **User-Generated Content**{"\n"}
        As a user, you are responsible for all content, including text, images, video, and audio, that you create, upload, or share within the app ("User-Generated Content"). By using GardenLoft, you agree to:{"\n"}
        - **Prohibited Content:** Avoid sharing content that is unlawful, abusive, defamatory, obscene, offensive, or otherwise objectionable.{"\n"}
        - **Reporting:** Use the app’s tools to report any objectionable content or abusive behavior.{"\n\n"}

        4. **Zero Tolerance for Objectionable Content**{"\n"}
        GardenLoft strictly prohibits objectionable content or abusive behavior. Any violations may result in immediate account suspension or termination without prior notice.{"\n\n"}

        5. **Reporting and Moderation**{"\n"}
        GardenLoft offers in-app tools for users to flag inappropriate content or behavior. Upon receiving a report, our team will review the flagged material and take action—such as removing content or banning users—within 24 hours.{"\n\n"}

        6. **Restrictions**{"\n"}
        You agree not to:{"\n"}
        - Reverse engineer, modify, or create derivative works of the app.{"\n"}
        - Use the app for illegal, harmful, or unauthorized purposes.{"\n"}
        - Harass, abuse, or harm other users, directly or indirectly.{"\n"}
        Violations of these restrictions may result in legal action and termination of your access to the app.{"\n\n"}

        7. **Privacy Policy**{"\n"}
        By using GardenLoft, you consent to the collection and processing of your personal data as described in our Privacy Policy (https://www.gardenloft.ca/app-privacypolicy).{"\n\n"}

        8. **Liability Disclaimer**{"\n"}
        The GardenLoft app is provided "as is" without any warranties, express or implied. We are not responsible for:{"\n"}
        - Technical issues, interruptions, or errors within the app.{"\n"}
        - Loss or damage caused by your interactions with other users or your reliance on app content.{"\n\n"}

        9. **Intellectual Property**{"\n"}
        All rights, titles, and interests in the app, its content, and any associated intellectual property are the exclusive property of Fabhome Ltd. Unauthorized use or reproduction is strictly prohibited.{"\n\n"}

        10. **Termination**{"\n"}
        This license remains effective until terminated. GardenLoft reserves the right to:{"\n"}
        - Terminate your access if you violate any terms in this EULA.{"\n"}
        - Suspend or discontinue the app at any time without prior notice.{"\n\n"}

        11. **Changes to the EULA**{"\n"}
        GardenLoft reserves the right to update or modify this EULA at any time. Continued use of the app after any such changes constitutes your acceptance of the revised terms.{"\n\n"}

        **Contact Us**{"\n"}
        If you have any questions, concerns, or feedback, contact us at Info@gardenloft.ca.{"\n"}
      </Text>
      <Button title="Close" onPress={() => setShowEULAModal(false)} />
    </ScrollView>
  </View>
</View>

      </Modal>
    </View>
  );
};



const phoneStyles = viewportWidth <= 413 ? {
  container: {
    paddingHorizontal: 10, // Reduced horizontal padding for smaller screens
    width: viewportWidth,
    height: viewportHeight,
  },
  input: {
    width: viewportWidth * 0.9, // Adjust width for phones
    height: viewportHeight * 0.07, // Reduce height slightly
    padding: 15, // Smaller padding
    fontSize: 16, // Reduce font size
    marginBottom: 15, // Reduced spacing
  },
  passwordContainer: {
    width: viewportWidth * 0.9, // Adjust width for phones
    height: viewportHeight * 0.07, // Reduce height slightly
    marginBottom: 15, // Reduced spacing
    paddingHorizontal: 10, // Adjusted padding
  },
  passwordInput: {
    padding: 15, // Adjusted padding for input
    fontSize: 16, // Smaller font size
  },
  eyeIcon: {
    padding: 5, // Reduced padding for icon
    marginRight: 5, // Adjust margin
  },
  welcome: {
    fontSize: 30, // Reduce font size for phones
    marginBottom: 20, // Adjust spacing
    textAlign: "center", // Center align the text
  },
  checkboxContainer: {
    marginBottom: 20, // Reduced spacing
  },
  checkboxLabel: {
    fontSize: 16, // Reduce font size
  },
  logo: {
    width: viewportWidth * 0.7, // Scale down for phones
    height: viewportHeight * 0.2, // Adjust height proportionally
    marginBottom: 15, // Reduced spacing
  },
} : {};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#FCF8E3",
    width: viewportWidth,
    height: viewportHeight,
    alignSelf: "center",
    alignItems: "center",
    ...phoneStyles.container,
   
  },
  input: {
    borderColor: "black",
    backgroundColor: "white",
    padding: 20,
    width: viewportWidth * 0.8,
    height: viewportHeight * 0.08,
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 20,
    color: "black",
    ...phoneStyles.input,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: viewportWidth * 0.8,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 30,
    marginBottom: 20,
    borderColor: "black",
    borderWidth: 1,
    ...phoneStyles.passwordContainer,
  },
  passwordInput: {
    flex: 1,
    padding: 20,
    height: viewportHeight * 0.08,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    color: "black",
    ...phoneStyles.passwordInput,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 10,
    ...phoneStyles.eyeIcon,
  },
  welcome: {
    fontSize: 40,
    fontWeight: "300",
    color: "#f09030",
    alignSelf: "center",
    marginBottom: 30,
    ...phoneStyles.welcome,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "center",
    ...phoneStyles.checkboxContainer,
  },
  checkbox: {
    alignSelf: "center",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 18,
    ...phoneStyles.checkboxLabel,
  },
  logo: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
    width: 450,
    height: 220,
    ...phoneStyles.logo,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  eulaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eulaText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "justify",
  },
});

export default Login;



// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Button,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Dimensions,
//   Pressable,
//   Image,
// } from "react-native";
// import CheckBox from "expo-checkbox";
// import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "expo-router/build/useNavigation";
// import { FontAwesome } from "@expo/vector-icons";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const auth = FIREBASE_AUTH;
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkRememberedUser = async () => {
//       const rememberedUser = await AsyncStorage.getItem("rememberedUser");
//       if (rememberedUser) {
//         setLoading(true);
//         try {
//           const user = JSON.parse(rememberedUser);
//           await signInWithEmailAndPassword(auth, user.email, user.password);
//           navigation.navigate("home");
//         } catch (error) {
//           console.log("Auto sign in failed:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     checkRememberedUser();
//   }, []);

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       const response = await signInWithEmailAndPassword(
//         auth,
//         email.trim(),
//         password
//       );
//       if (rememberMe) {
//         await AsyncStorage.setItem(
//           "rememberedUser",
//           JSON.stringify({ email, password })
//         );
//       }
//       console.log(response);
//       navigation.navigate("home");
//     } catch (error) {
//       console.log(error);
//       alert("Sign in failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       const response = await createUserWithEmailAndPassword(
//         auth,
//         email.trim(),
//         password
//       );
//       const user = response.user;
//       await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
//         email: email,
//         userName: userName,
//         uid: user.uid, // Ensure the UID is saved
//       });
//       alert("Account created successfully! Check your email.");
//     } catch (error) {
//       console.error(error);
//       alert("Sign up failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//             source={require("../../assets/garden-loft-logo2.png")}
//             style={styles.logo}
//           />
//       <KeyboardAvoidingView behavior="padding">
//         <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>

//         {/* <TextInput
//           value={userName}
//           style={styles.input}
//           placeholder="Name"
//           autoCapitalize="none"
//           onChangeText={(text) => setUserName(text)}
//         /> */}
//         <TextInput
//           value={email}
//           style={styles.input}
//           placeholder="Email"
//           autoCapitalize="none"
//           onChangeText={(text) => setEmail(text)}
//         />
//         <View style={styles.passwordContainer}>
//           <TextInput
//             secureTextEntry={!showPassword}
//             value={password}
//             style={styles.passwordInput}
//             placeholder="Password"
//             autoCapitalize="none"
//             onChangeText={(text) => setPassword(text)}
//           />
//           <Pressable
//             onPress={() => setShowPassword(!showPassword)}
//             style={styles.eyeIcon}>
//             <FontAwesome
//               name={showPassword ? "eye" : "eye-slash"}
//               size={24}
//               color="black"
//             />
//           </Pressable>
//         </View>
//         <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={rememberMe}
//             onValueChange={setRememberMe}
//             style={styles.checkbox}
//           />
//           <Text style={styles.checkboxLabel}>Remember Me</Text>
//         </View>
//         {loading ? (
//           <ActivityIndicator size="large" color="orange" />
//         ) : (
//           <>
//             <Button title="Login" onPress={signIn} />
//             {/* <Button title="Create Account" onPress={signUp} /> */}
//           </>
//         )}
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const phoneStyles = viewportWidth <= 413 ? {
//   container: {
//     paddingHorizontal: 10, // Reduced horizontal padding for smaller screens
//     width: viewportWidth,
//     height: viewportHeight,
//   },
//   input: {
//     width: viewportWidth * 0.9, // Adjust width for phones
//     height: viewportHeight * 0.07, // Reduce height slightly
//     padding: 15, // Smaller padding
//     fontSize: 16, // Reduce font size
//     marginBottom: 15, // Reduced spacing
//   },
//   passwordContainer: {
//     width: viewportWidth * 0.9, // Adjust width for phones
//     height: viewportHeight * 0.07, // Reduce height slightly
//     marginBottom: 15, // Reduced spacing
//     paddingHorizontal: 10, // Adjusted padding
//   },
//   passwordInput: {
//     padding: 15, // Adjusted padding for input
//     fontSize: 16, // Smaller font size
//   },
//   eyeIcon: {
//     padding: 5, // Reduced padding for icon
//     marginRight: 5, // Adjust margin
//   },
//   welcome: {
//     fontSize: 30, // Reduce font size for phones
//     marginBottom: 20, // Adjust spacing
//     textAlign: "center", // Center align the text
//   },
//   checkboxContainer: {
//     marginBottom: 20, // Reduced spacing
//   },
//   checkboxLabel: {
//     fontSize: 16, // Reduce font size
//   },
//   logo: {
//     width: viewportWidth * 0.7, // Scale down for phones
//     height: viewportHeight * 0.2, // Adjust height proportionally
//     marginBottom: 15, // Reduced spacing
//   },
// } : {};


// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     flex: 1,
//     marginHorizontal: 20,
//     backgroundColor: "#FCF8E3",
//     width: viewportWidth,
//     height: viewportHeight,
//     alignSelf: "center",
//     alignItems: "center",
//     ...phoneStyles.container,
   
//   },
//   input: {
//     borderColor: "black",
//     backgroundColor: "white",
//     padding: 20,
//     width: viewportWidth * 0.8,
//     height: viewportHeight * 0.08,
//     alignSelf: "center",
//     borderRadius: 30,
//     marginBottom: 20,
//     color: "black",
//     ...phoneStyles.input,
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: viewportWidth * 0.8,
//     alignSelf: "center",
//     backgroundColor: "white",
//     borderRadius: 30,
//     marginBottom: 20,
//     borderColor: "black",
//     borderWidth: 1,
//     ...phoneStyles.passwordContainer,
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 20,
//     height: viewportHeight * 0.08,
//     borderTopLeftRadius: 30,
//     borderBottomLeftRadius: 30,
//     color: "black",
//     ...phoneStyles.passwordInput,
//   },
//   eyeIcon: {
//     padding: 10,
//     marginRight: 10,
//     ...phoneStyles.eyeIcon,
//   },
//   welcome: {
//     fontSize: 40,
//     fontWeight: "300",
//     color: "#f09030",
//     alignSelf: "center",
//     marginBottom: 30,
//     ...phoneStyles.welcome,
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//     justifyContent: "center",
//     ...phoneStyles.checkboxContainer,
//   },
//   checkbox: {
//     alignSelf: "center",
//   },
//   checkboxLabel: {
//     marginLeft: 8,
//     fontSize: 18,
//     ...phoneStyles.checkboxLabel,
//   },
//   logo: {
//     position: "relative",
//     alignItems: "center",
//     marginBottom: 20,
//     width: 450,
//     height: 220,
//     ...phoneStyles.logo,
//   }
// });

// export default Login;

// import {
//   StyleSheet,
//   TextInput,
//   View,
//   Text,
//   ActivityIndicator,
//   Button,
//   KeyboardAvoidingView,
//   Dimensions,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import CheckBox from "expo-checkbox"; // Import CheckBox from expo-checkbox
// import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "expo-router/build/useNavigation";

// const { width: viewportWidth, height: viewportHeight } =
//   Dimensions.get("window");

// const Login = ({}) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userName, setUserName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false); // Remember Me state
//   const auth = FIREBASE_AUTH;
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkRememberedUser = async () => {
//       const rememberedUser = await AsyncStorage.getItem("rememberedUser");
//       if (rememberedUser) {
//         setLoading(true);
//         try {
//           const user = JSON.parse(rememberedUser);
//           await signInWithEmailAndPassword(auth, user.email, user.password);
//           navigation.navigate("home"); // Navigate to CarouselOne screen
//         } catch (error) {
//           console.log("Auto sign in failed:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     checkRememberedUser();
//   }, []);

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       const response = await signInWithEmailAndPassword(
//         auth,
//         email.trim(),
//         password
//       );
//       if (rememberMe) {
//         await AsyncStorage.setItem(
//           "rememberedUser",
//           JSON.stringify({ email, password })
//         );
//       }
//       console.log(response);
//       navigation.navigate("home"); // Navigate to CarouselOne screen
//     } catch (error) {
//       console.log(error);
//       alert("Sign in failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async () => {
//     setLoading(true); // Start loading
//     try {
//       const response = await createUserWithEmailAndPassword(
//         auth,
//         email.trim(),
//         password
//       );
//       const user = response.user;
//       await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
//         email: email,
//         userName: userName,
//       });
//       alert("Account created successfully! Check your email.");
//       // navigation.navigate("Home"); // Navigate to home  screen
//     } catch (error) {
//       console.error(error);
//       alert("Sign up failed: " + error.message); // Show error message
//     } finally {
//       setLoading(false); // Stop loading irrespective of success or failure
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <KeyboardAvoidingView behavior="padding">
//         <Text style={styles.welcome}>Welcome Garden Loft Residents</Text>

//         <TextInput
//           value={userName}
//           style={styles.input}
//           placeholder="name"
//           autoCapitalize="none"
//           onChangeText={(text) => setUserName(text)}></TextInput>
//         <TextInput
//           value={email}
//           style={styles.input}
//           placeholder="email"
//           autoCapitalize="none"
//           onChangeText={(text) => setEmail(text)}></TextInput>
//         <TextInput
//           secureTextEntry={true}
//           value={password}
//           style={styles.input}
//           placeholder="password"
//           autoCapitalize="none"
//           onChangeText={(text) => setPassword(text)}></TextInput>
//         <View style={styles.checkboxContainer}>
//           <CheckBox
//             value={rememberMe}
//             onValueChange={setRememberMe}
//             style={styles.checkbox}
//           />
//           <Text style={styles.checkboxLabel}>Remember Me</Text>
//         </View>
//         {loading ? (
//           <ActivityIndicator size="large" color="orange" />
//         ) : (
//           <>
//             <Button title="Login" onPress={signIn} />
//             <Button title="Create Account" onPress={signUp} />
//           </>
//         )}
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     flex: 1,
//     marginHorizontal: 20,
//     backgroundColor: "#FCF8E3",
//     width: viewportWidth * 1,
//     height: viewportHeight * 1,
//     alignSelf: "center",
//   },
//   input: {
//     borderColor: "black",
//     backgroundColor: "white",
//     padding: 30,
//     width: viewportWidth * 0.4,
//     height: viewportHeight * 0.1,
//     alignSelf: "center",
//     borderRadius: 30,
//     marginBottom: 30,
//   },
//   welcome: {
//     fontSize: 40,
//     color: "#f09030",
//     alignSelf: "center",
//     marginBottom: 30,
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//     justifyContent: "center",
//   },
//   checkbox: {
//     alignSelf: "center",
//   },
//   checkboxLabel: {
//     marginLeft: 8,
//     fontSize: 18,
//   },
// });
