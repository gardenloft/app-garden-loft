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

//////////////// Code with Unified Device Control Function /////////////
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
    // url: "http://192.168.50.97:8123",
    // token:
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhMmZiMTkzNGNhODE0YzlhOGI3MmM5ZGJjODQ5MWZmYiIsImlhdCI6MTczNjI3MDk1MiwiZXhwIjoyMDUxNjMwOTUyfQ.qecEr6qYeKYzsfFLBCoFogF8C5BXssYP0gkbuDkddbs",
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
    },
    timeout: 35000,
  });
};

// Get filtered entities from Home Assistant
export const getFilteredEntities = async (homeId, domains) => {
  const apiClient = createApiClient(homeId);
  console.log("API Client Configuration:", apiClient.defaults);
  try {
    const response = await apiClient.get("/api/states");
    const entities = response.data.filter((entity) =>
      domains.some((domain) => entity.entity_id.startsWith(`${domain}.`))
    );
    return entities;
  } catch (error) {
    console.error(
      `Failed to fetch filtered entities for ${homeId}:`,
      error.message
    );
    throw error;
  }
};

// // Toggle Smart TV (or any compatible device)
// export const toggleTV = async (homeId, entityId, turnOn = true) => {
//   const apiClient = createApiClient(homeId);
//   const service = turnOn ? "turn_on" : "turn_off";

//   try {
//     console.log(`Sending Request to Home Assistant (${homeId}):`);
//     console.log(`URL: ${apiClient.defaults.baseURL}`);
//     console.log(`Service: ${service}`);
//     console.log(`Entity ID: ${entityId}`);

//     const response = await apiClient.post(`/api/services/media_player/${service}`, {
//       entity_id: entityId,
//     });
//     console.log(`Device toggled ${turnOn ? "on" : "off"}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to toggle device (${entityId}) for ${homeId}:`, error.message);
//     throw error;
//   }
// };

// Unified Device Control Function
export const controlDevice = async ({
  homeId,
  domain,
  entityId,
  action,
  value,
}) => {
  if (!homeId) {
    throw new Error("Home ID is required to control a device.");
  }
  const apiClient = createApiClient(homeId);
  let service = "";
  const data = { entity_id: entityId };
  console.log(`Sending Request to Home Assistant:`);
  console.log(`URL: ${apiClient.defaults.baseURL}`);
  console.log(`Entity ID: ${entityId}`);

  try {
    switch (domain) {
      case "light":
        service =
          action === "toggle" ? (value ? "turn_on" : "turn_off") : "turn_on";
        if (action === "dim") data.brightness = value;
        console.log(`Service type light: ${service}`);
        break;
      case "media_player":
        service = action;
        if (value) data[action] = value;
        console.log(`Service type media_player: ${service}`);
        break;
      case "climate":
        service = action;
        if (action === "set_temperature") data.temperature = value;
        console.log(`Service type climate: ${service}`);
        break;
      case "switch":
        service = value ? "turn_on" : "turn_off";
        console.log(`Service type switch: ${service}`);
        break;
      // case "remote":
      //   service = value ? "turn_on" : "turn_off";
      //   console.log(`Sensors are read-only: ${service} & ${value}`)
      //   break;
      case "remote":
        if (action === "turn_on" || action === "turn_off") {
          service = action;
        } else if (action === "send_command") {
          service = "send_command";
          data.command = value;
        } else {
          throw new Error(`Unsupported action for remote: ${action}`);
        }
        console.log(`Sensors are read-only: ${service} & ${value}`);
        console.log(`Service type remote: ${service}`);
        break;
      case "lock":
        service = value ? "lock" : "unlock";
        console.log(`Service type lock: ${service}`);
        break;
      case "camera":
        service = action; // Example: snapshot
        console.log(`Service type camera: ${service}`);
        break;
      case "sensor":
        console.log(`Sensors are read-only: ${entityId}`);
        return;
      default:
        console.error(`Unsupported domain: ${domain}`);
        return;
    }

    const response = await apiClient.post(
      `/api/services/${domain}/${service}`,
      data
    );
    console.log(`${domain} ${action} successful:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to control ${domain} (${entityId}):`, error.message);
    throw error;
  }
};
