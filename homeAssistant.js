
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
