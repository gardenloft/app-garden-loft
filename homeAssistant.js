
//////////code that works with array inside of Light.js

// import axios from "axios";

// // Load environment variables
// const homeAssistantUrl = process.env.EXPO_PUBLIC_HOME_ASSISTANT_URL;
// const homeAssistantToken = process.env.EXPO_PUBLIC_HOME_ASSISTANT_TOKEN;

// // Create an Axios API client for Home Assistant
// const apiClient = axios.create({
//   baseURL: homeAssistantUrl,
//   headers: {
//     Authorization: `Bearer ${homeAssistantToken}`,
//     "Content-Type": "application/json",
//   },
//   timeout: 5000,
// });

// // Toggle Smart TV (media_player)
// export const toggleTV = async (entityId, turnOn = true) => {
//   try {
//     // Get the current state of the TV
//     const stateResponse = await apiClient.get(`api/states/${entityId}`);
//     const currentState = stateResponse.data.state;

//     console.log(`Current TV state: ${currentState}`);

//     // Only send the toggle command if the state differs
//     if ((turnOn && currentState !== "on") || (!turnOn && currentState !== "off" && currentState !== "idle")) {

//       const service = turnOn ? "turn_on" : "turn_off";

//       console.log(`Sending Request to Home Assistant:`);
//       console.log(`URL: ${apiClient.defaults.baseURL}`);
//       console.log(`Service: ${service}`);
//       console.log(`Entity ID: ${entityId}`);

//       const response = await apiClient.post(
//         `api/services/media_player/${service}`,
//         {
//           entity_id: entityId,
//         }
//       );

//       console.log(`TV toggled ${turnOn ? "on" : "off"}:`, response.data);
//       return response.data;
//     } else {
//       console.log("TV is already in the desired state.");
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error("Error response from Home Assistant:", error.response.data);
//     } else if (error.request) {
//       console.error("No response received from Home Assistant.");
//     } else {
//       console.error("Axios error:", error.message);
//     }
//     throw error;
//   }
// };

// Example: Toggle Lights (Commented Out)
// export const toggleLight = async (entityId, turnOn = true) => {
//   try {
//     const service = turnOn ? "turn_on" : "turn_off";
//     const response = await apiClient.post(
//       `api/services/light/${service}`,
//       {
//         entity_id: entityId,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error toggling light:", error);
//     throw error;
//   }
// };


///////////Code with Home Assistant Instances fetched from .env file
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios";

export const fetchUserHomeId = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is logged in.");
  }

  const db = getFirestore();
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User data not found.");
  }

  const { homeId } = userDoc.data();
  if (!homeId) {
    throw new Error("Home Assistant instance ID (homeId) not found for user.");
  }

  return homeId;
};

// Configuration for all Home Assistant instances
const homeAssistantConfig = {
  home1: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_TOKEN,
  },
  home2: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_TOKEN,
  },
  home3: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_TOKEN,
  },
};

// Create an Axios API client for the specified Home Assistant instance
const createApiClient = (homeId) => {
  const config = homeAssistantConfig[homeId];
  if (!config) {
    throw new Error(`Configuration for ${homeId} not found.`);
  }
  return axios.create({
    baseURL: config.url,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });
};

// Get filtered entities from Home Assistant
export const getFilteredEntities = async (homeId, domains) => {
  const apiClient = createApiClient(homeId);
  try {
    const response = await apiClient.get("/api/states");
    const entities = response.data.filter((entity) =>
      domains.some((domain) => entity.entity_id.startsWith(`${domain}.`))
    );
    return entities;
  } catch (error) {
    console.error(`Failed to fetch filtered entities for ${homeId}:`, error.message);
    throw error;
  }
};

// Toggle Smart TV (or any compatible device)
export const toggleTV = async (homeId, entityId, turnOn = true) => {
  const apiClient = createApiClient(homeId);
  const service = turnOn ? "turn_on" : "turn_off";

  try {
    console.log(`Sending Request to Home Assistant (${homeId}):`);
    console.log(`URL: ${apiClient.defaults.baseURL}`);
    console.log(`Service: ${service}`);
    console.log(`Entity ID: ${entityId}`);

    const response = await apiClient.post(`/api/services/media_player/${service}`, {
      entity_id: entityId,
    });
    console.log(`Device toggled ${turnOn ? "on" : "off"}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle device (${entityId}) for ${homeId}:`, error.message);
    throw error;
  }
};








/////////code that grabs devices manually from Home Assistant, and displays name and state they are on
// import axios from "axios";

// const homeAssistantUrl = process.env.EXPO_PUBLIC_HOME_ASSISTANT_URL;
// const homeAssistantToken = process.env.EXPO_PUBLIC_HOME_ASSISTANT_TOKEN;

// const apiClient = axios.create({
//   baseURL: homeAssistantUrl,
//   headers: {
//     Authorization: `Bearer ${homeAssistantToken}`,
//     "Content-Type": "application/json",
//   },
//   timeout: 15000,
// });

// // Get all entities from Home Assistant
// export const getAllEntities = async () => {
//   try {
//     const response = await apiClient.get("/api/states");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch entities:", error.message);
//     throw error;
//   }
// };

// // Toggle Smart TV (media_player)
// export const toggleTV = async (entityId, turnOn = true) => {
//   try {
//     const service = turnOn ? "turn_on" : "turn_off";
//     console.log(`Sending Request to Home Assistant:`);
//       console.log(`URL: ${apiClient.defaults.baseURL}`);
//       console.log(`Service: ${service}`);
//       console.log(`Entity ID: ${entityId}`);

//     const response = await apiClient.post(`/api/services/media_player/${service}`, {
//       entity_id: entityId,
//     });
//     console.log(`TV toggled ${turnOn ? "on" : "off"}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to toggle TV (${entityId}):`, error.message);
//     throw error;
//   }
// };
