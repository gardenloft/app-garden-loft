
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


/// new code for all the home assistant green instances

// import axios from "axios";

// // Configuration for all Home Assistant instances
// const homeAssistantConfig = {
//   home1: {
//     url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_URL,
//     token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_TOKEN,
//   },
//   home2: {
//     url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_URL,
//     token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_TOKEN,
//   },
//   home3: {
//     url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_URL,
//     token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_TOKEN,
//   },
// };

// // Create an Axios API client for the specified Home Assistant instance
// const createApiClient = (homeId) => {
//   const config = homeAssistantConfig[homeId];
//   if (!config) {
//     throw new Error(`Configuration for ${homeId} not found.`);
//   }
//   return axios.create({
//     baseURL: config.url,
//     headers: {
//       Authorization: `Bearer ${config.token}`,
//       "Content-Type": "application/json",
//     },
//     timeout: 15000,
//   });
// };

// // Get all entities from the specified Home Assistant instance
// export const getAllEntities = async (homeId) => {
//   const apiClient = createApiClient(homeId);
//   try {
//     const response = await apiClient.get("/api/states");
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch entities for ${homeId}:`, error.message);
//     throw error;
//   }
// };

// // Toggle a Smart TV (media_player) in the specified Home Assistant instance
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
//     console.log(`TV toggled ${turnOn ? "on" : "off"}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to toggle TV (${entityId}) for ${homeId}:`, error.message);
//     throw error;
//   }
// };

// // Toggle a Light (light) in the specified Home Assistant instance
// export const toggleLight = async (homeId, entityId, turnOn = true) => {
//   const apiClient = createApiClient(homeId);
//   const service = turnOn ? "turn_on" : "turn_off";

//   try {
//     console.log(`Sending Request to Home Assistant (${homeId}):`);
//     console.log(`URL: ${apiClient.defaults.baseURL}`);
//     console.log(`Service: ${service}`);
//     console.log(`Entity ID: ${entityId}`);

//     const response = await apiClient.post(`/api/services/light/${service}`, {
//       entity_id: entityId,
//     });
//     console.log(`Light toggled ${turnOn ? "on" : "off"}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to toggle Light (${entityId}) for ${homeId}:`, error.message);
//     throw error;
//   }
// };

// // Fetch only light entities from the specified Home Assistant instance
// export const getLights = async (homeId) => {
//   try {
//     const entities = await getAllEntities(homeId);
//     const lights = entities.filter((entity) => entity.entity_id.startsWith("light."));
//     console.log(`Fetched ${lights.length} lights for ${homeId}`);
//     return lights.map((light) => ({
//       id: light.entity_id,
//       name: light.attributes.friendly_name || light.entity_id,
//       state: light.state,
//     }));
//   } catch (error) {
//     console.error(`Failed to fetch lights for ${homeId}:`, error.message);
//     throw error;
//   }
// };




/////////code that grabs devices manually from Home Assistant, and displays name and state they are on
import axios from "axios";

const homeAssistantUrl = process.env.EXPO_PUBLIC_HOME_ASSISTANT_URL;
const homeAssistantToken = process.env.EXPO_PUBLIC_HOME_ASSISTANT_TOKEN;

const apiClient = axios.create({
  baseURL: homeAssistantUrl,
  headers: {
    Authorization: `Bearer ${homeAssistantToken}`,
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Get all entities from Home Assistant
export const getAllEntities = async () => {
  try {
    const response = await apiClient.get("/api/states");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch entities:", error.message);
    throw error;
  }
};

// Toggle Smart TV (media_player)
export const toggleTV = async (entityId, turnOn = true) => {
  try {
    const service = turnOn ? "turn_on" : "turn_off";
    console.log(`Sending Request to Home Assistant:`);
      console.log(`URL: ${apiClient.defaults.baseURL}`);
      console.log(`Service: ${service}`);
      console.log(`Entity ID: ${entityId}`);

    const response = await apiClient.post(`/api/services/media_player/${service}`, {
      entity_id: entityId,
    });
    console.log(`TV toggled ${turnOn ? "on" : "off"}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to toggle TV (${entityId}):`, error.message);
    throw error;
  }
};
