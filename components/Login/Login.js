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
} from "react-native";
import CheckBox from "expo-checkbox";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router/build/useNavigation";
import { FontAwesome } from "@expo/vector-icons";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
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
          value={userName}
          style={styles.input}
          placeholder="Name"
          autoCapitalize="none"
          onChangeText={(text) => setUserName(text)}
        /> */}
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
            style={styles.eyeIcon}>
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
        {loading ? (
          <ActivityIndicator size="large" color="orange" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            {/* <Button title="Create Account" onPress={signUp} /> */}
          </>
        )}
      </KeyboardAvoidingView>
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
  }
});

export default Login;

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
