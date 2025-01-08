import axios from "axios";
const homeAssistantUrl = process.env.EXPO_PUBLIC_HOME_ASSISTANT_URL;
const homeAssistantToken = process.env.EXPO_PUBLIC_HOME_ASSISTANT_TOKEN;

const apiClient = axios.create({
  baseURL: homeAssistantUrl,
  headers: {
    Authorization: `Bearer ${homeAssistantToken}`,
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Toggle Lights code 
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

// Toggle Smart TV (media_player)
export const toggleTV = async (entityId, turnOn = true) => {
  try {
    const service = turnOn ? "turn_on" : "turn_off";
    console.log(service);
    console.log("Sending Request to Home Assistant:");
    console.log("URL:", apiClient.defaults.baseURL);
    console.log("Service:", service);
    console.log("Entity ID:", entityId);
    const response = await apiClient.post(
      `api/services/media_player/${service}`,
      {
        entity_id: entityId,
      }
    );
    console.log(`TV toggled ${turnOn ? "on" : "off"}:`, response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from Home Assistant:", error.response.data);
    } else if (error.request) {
      console.error("No response received from Home Assistant Green.");
      console.log("Home Assistant URL:", process.env.HOME_ASSISTANT_URL);
      console.log("Home Assistant Token:", process.env.HOME_ASSISTANT_TOKEN);
    } else {
      console.error("Axios error:", error.message);
    }
    throw error;
  }
};
