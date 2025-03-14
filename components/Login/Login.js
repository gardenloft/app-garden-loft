import { useState, useEffect } from "react";
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
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router/build/useNavigation";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { createClient } from "@supabase/supabase-js";
import supabase from "../../SupabaseConfig"; // ✅ Correct import
import { getResidentId, createNewResident } from "../Supabase/SupabaseService";
import { logUserActivity } from "../Supabase/EventLogger";






const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const Login = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptEULA, setAcceptEULA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEULAModal, setShowEULAModal] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [acceptYouTubeTerms, setAcceptYouTubeTerms] = useState(false);

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

  // const signIn = async () => {
  //   if (!acceptEULA) {
  //     alert("You must accept the EULA to proceed.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const response = await signInWithEmailAndPassword(
  //       auth,
  //       email.trim(),
  //       password
  //     );
  //     if (rememberMe) {
  //       await AsyncStorage.setItem(
  //         "rememberedUser",
  //         JSON.stringify({ email, password })
  //       );
  //     }
  //     console.log(response);
  //     navigation.navigate("home");
  //   } catch (error) {
  //     console.log(error);
  //     alert("Sign in failed: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const signUp = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await createUserWithEmailAndPassword(
  //       auth,
  //       email.trim(),
  //       password
  //     );
  //     const user = response.user;
  //     await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
  //       email: email,
  //       userName: userName,
  //       uid: user.uid, // Ensure the UID is saved
  //     });
  //     alert("Account created successfully! Check your email.");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Sign up failed: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = response.user; // ✅ Keeping this as 'user'
  
      // 🔄 Save user data in Firestore
      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        email: email,
        userName: userName,
        uid: user.uid,
      });
  
     // ✅ Insert into Supabase `residents` table
     await createNewResident(user.uid, email);

     alert("Account created successfully!");

     // ✅ Log Signup Activity
     await logUserActivity(user.uid, "New resident registered");
   } catch (error) {
     console.error("Sign up failed:", error);
     alert("Sign up failed: " + error.message);
   } finally {
     setLoading(false);
   }
    //   // ✅ Insert into Supabase residents table
    //   let { data, error } = await supabase
    //     .from("residents") // ✅ Ensure you're using `residents`
    //     .insert([{ 
    //       firebase_uid: user.uid, // ✅ Using 'user.uid' as before
    //       name: userName,
    //       email: email,
    //     }], { returning: "representation" })// ✅ Force return inserted data
    //     .select("resident_id"); // ✅ Get the resident ID
    //     console.log("Supabase Insert Response:", data); // 🔍 Debugging
  
    //   if (error) throw error;
  
    //   alert("Account created successfully!");
  
    //   // ✅ Log signup activity
    //   await logResidentActivity(user.uid, "New resident registered");
  
    // } catch (error) {
    //   console.error("Sign up failed:", error);
    //   alert("Sign up failed: " + error.message);
    // } finally {
    //   setLoading(false);
    // }
  };
  

  //     // 🔄 Sync user to Supabase
  //     await syncUserWithSupabase(user.uid, email, userName);

  //     alert("Account created successfully! Check your email.");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Sign up failed: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const logResidentActivity = async (firebaseUid, eventType, metadata = {}) => {
  //   // Find resident ID using Firebase UID
  //   let { data: resident, error } = await supabase
  //     .from("residents")
  //     .select("resident_id")
  //     .eq("firebase_uid", firebaseUid)
  //     .single();
  
  //   if (error || !resident) {
  //     console.error("Error fetching resident ID:", error);
  //     return;
  //   }
  
  //   // Insert activity log
  //   await supabase.from("activities").insert([
  //     {
  //       resident_id: resident.resident_id,
  //       event_type: eventType,
  //       metadata: metadata,
  //     }
  //   ]);
  // };
  

  

  // ✅ Sign In (Firebase Auth + Supabase Check)
  const signIn = async () => {
    if (!acceptEULA) {
      alert("You must accept the EULA to proceed.");
      return;
    }
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = response.user;

      // 🔄 Ensure user exists in Supabase (Sync Firebase UID)
      // await syncUserWithSupabase(user.uid, email);

      // 🔄 Ensure user exists in Supabase (Sync Firebase UID)
      await getResidentId(user.uid, email);

      if (rememberMe) {
        await AsyncStorage.setItem(
          "rememberedUser",
          JSON.stringify({ email, password })
        );
      }
      navigation.navigate("home");

      // 📜 Log user login in Supabase
      await logUserActivity(user.uid, "User signed in");
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync Firebase User to Supabase (Ensures UID Linking)
  const syncUserWithSupabase = async (firebase_uid, email, userName = "") => {
    // 🔎 Check if user exists in Supabase
    const { data, error } = await supabase
      .from("residents")
      .select("firebase_uid")
      .eq("firebase_uid", firebase_uid)
      .single();

    if (error || !data) {
      // 🔄 User doesn't exist, create new record in Supabase
      const { error: insertError } = await supabase.from("residents").insert([
        {
          firebase_uid,  // ✅ Ensure correct column name
        email,
        name: userName, // ✅ Ensure correct column name
        created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting user into Supabase:", insertError);
      } else {
        console.log("User synced with Supabase:", firebase_uid);
      }
    }
  };

 // ✅ Function to Log User Activity in Supabase
const logUserActivity = async (firebaseUid, eventType) => {
  const residentId = await getResidentId(firebaseUid, "");

  if (!residentId) return;

  await supabase.from("activities").insert([
    {
      resident_id: residentId,
      event_type: eventType,
      timestamp: new Date(),
    },
  ]);
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
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={acceptYouTubeTerms}
            onValueChange={setAcceptYouTubeTerms}
            style={styles.checkbox}
          />
          <View>
            <Text style={styles.checkboxLabel}>
              I Accept the{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://www.youtube.com/t/terms")
                }
              >
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL(
                    "https://developers.google.com/youtube/terms/api-services-terms-of-service"
                  )
                }
              >
                YouTube API Services Terms of Service
              </Text>
                YouTube Terms of Service
              </Text>
              ,{" "}
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL("https://policies.google.com/privacy")
                }
              >
                Google Privacy Policy
              </Text>
              , and{" "}
              .
            </Text>
          </View>
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
              <Text style={styles.eulaTitle}>
                End User License Agreement (EULA)
              </Text>
              <Text style={styles.eulaText}>
                <Text style={{ fontWeight: "bold" }}>
                  End User License Agreement (EULA)
                </Text>
                {"\n"}
                <Text style={{ fontWeight: "bold" }}>
                  Effective Date: Nov 27{" "}
                </Text>
                {"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  1. Acceptance of Terms
                </Text>
                {"\n"}
                By downloading, installing, or using the Garden Loft app, you
                agree to be bound by this EULA. If you do not agree to these
                terms, you must not use the app.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}> 2. License Grant </Text>
                {"\n"}
                Garden Loft grants you a limited, non-exclusive,
                non-transferable, and revocable license to use this app for
                personal, non-commercial purposes, provided you comply with all
                terms outlined in this EULA.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  3. User-Generated Content{" "}
                </Text>
                {"\n"}
                As a user, you are responsible for all content, including text,
                images, video, and audio, that you create, upload, or share
                within the app ("User-Generated Content"). By using GardenLoft,
                you agree to:{"\n"}- Prohibited Content: Avoid sharing content
                that is unlawful, abusive, defamatory, obscene, offensive, or
                otherwise objectionable.{"\n"}- Reporting: Use the app’s tools
                to report any objectionable content or abusive behavior.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  4. Zero Tolerance for Objectionable Content{" "}
                </Text>
                {"\n"}
                Garden Loft strictly prohibits objectionable content or abusive
                behavior. Any violations may result in immediate account
                suspension or termination without prior notice.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  5. Reporting and Moderation{" "}
                </Text>
                {"\n"}
                Garden Loft offers in-app tools for users to flag inappropriate
                content or behavior. Upon receiving a report, our team will
                review the flagged material and take action—such as removing
                content or banning users—within 24 hours.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}> 6. Restrictions </Text>
                {"\n"}
                You agree not to:{"\n"}- Reverse engineer, modify, or create
                derivative works of the app.{"\n"}- Use the app for illegal,
                harmful, or unauthorized purposes.{"\n"}- Harass, abuse, or harm
                other users, directly or indirectly.{"\n"}
                Violations of these restrictions may result in legal action and
                termination of your access to the app.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}> 7. Privacy Policy </Text>
                {"\n"}
                By using Garden Loft, you consent to the collection and
                processing of your personal data as described in our Privacy
                Policy{" "}
                <Text style={{ fontWeight: "bold" }}>
                  (https://www.gardenloft.ca/app-privacypolicy){" "}
                </Text>
                .{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  8. Liability Disclaimer
                </Text>
                {"\n"}
                The Garden Loft app is provided "as is" without any warranties,
                express or implied. We are not responsible for:{"\n"}- Technical
                issues, interruptions, or errors within the app.{"\n"}- Loss or
                damage caused by your interactions with other users or your
                reliance on app content.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  9.Intellectual Property
                </Text>
                {"\n"}
                All rights, titles, and interests in the app, its content, and
                any associated intellectual property are the exclusive property
                of Fabhome Ltd. Unauthorized use or reproduction is strictly
                prohibited.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>10. Termination</Text>
                {"\n"}
                This license remains effective until terminated. GardenLoft
                reserves the right to:{"\n"}- Terminate your access if you
                violate any terms in this EULA.{"\n"}- Suspend or discontinue
                the app at any time without prior notice.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>
                  11. Changes to the EULA
                </Text>
                {"\n"}
                Garden Loft reserves the right to update or modify this EULA at
                any time. Continued use of the app after any such changes
                constitutes your acceptance of the revised terms.{"\n\n"}
                <Text style={{ fontWeight: "bold" }}>Contact Us</Text>
                {"\n"}
                If you have any questions, concerns, or feedback, contact us at{" "}
                <Text style={{ fontWeight: "bold" }}>Info@gardenloft.ca</Text>
                {"\n"}
              </Text>
              <Button title="Close" onPress={() => setShowEULAModal(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const phoneStyles =
  viewportWidth <= 413
    ? {
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
          flexDirection: "row", // Horizontal layout
          alignItems: "center", // Align items vertically
          marginBottom: 20, // Reduced spacing
        },
        checkboxLabel: {
          flex: 1, // Allow text to wrap
          lineHeight: 20,
          fontSize: 16, // Reduce font size
        },
        logo: {
          width: viewportWidth * 0.7, // Scale down for phones
          height: viewportHeight * 0.2, // Adjust height proportionally
          marginBottom: 15, // Reduced spacing
        },
      }
    : {};

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
    textAlign: "center",
    marginBottom: 30,
    ...phoneStyles.welcome,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "flex-start",
    width: viewportWidth * 0.8,
    marginBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
    ...phoneStyles.checkboxContainer,
  },
  checkbox: {
    marginRight: 10,
    lineHeight: 20,
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
    objectFit: 'contain',
    width: viewportWidth * 0.8,
    // height: 220,
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
  link: {
    color: "black",
    textDecorationLine: "underline",
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

