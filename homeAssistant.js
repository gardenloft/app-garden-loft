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

// this is for water logs
const HOME_ASSISTANT_URL = process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_URL;
const HOME_ASSISTANT_TOKEN = process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_TOKEN;

export const subscribeToEntityState = (entityId, callback) => {
  const ws = new WebSocket(`${HOME_ASSISTANT_URL}/api/websocket`);

  ws.onopen = () => {
    console.log("Connected to Home Assistant WebSocket");
    ws.send(
      JSON.stringify({ type: "auth", access_token: HOME_ASSISTANT_TOKEN })
    );
    ws.send(
      JSON.stringify({
        id: 1,
        type: "subscribe_events",
        event_type: "state_changed",
      })
    );
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (
      data.event &&
      data.event.data &&
      data.event.data.entity_id === entityId
    ) {
      callback(data.event.data.new_state.state);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  return () => ws.close();
};

// Configuration for all Home Assistant instances
const homeAssistantConfig = {
  home1: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME1_TOKEN, // Replace with your token
    reolinkRTSP: process.env.EXPO_PUBLIC_HOME_ASSISTANT_REOLINK_RSTP_URL_SALLY,
  },
  home2: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME2_TOKEN,
    reolinkRTSP: process.env.EXPO_PUBLIC_HOME_ASSISTANT_REOLINK_RSTP_URL_MESSI,
  },
  home3: {
    url: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_URL,
    token: process.env.EXPO_PUBLIC_HOME_ASSISTANT_HOME3_TOKEN,
    reolinkRTSP: process.env.EXPO_PUBLIC_HOME_ASSISTANT_REOLINK_RSTP_URL_GL,
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

// Fetch Water Sensor Data and pass to WaterSensor.js
export const fetchWaterUsageData = async () => {

  // Step 1: Fetch homeId first
  const homeId = await fetchUserHomeId();
  console.log(`🚰 Fetching water usage data for homeId: ${homeId}`);

  const apiClient = createApiClient(homeId);
  try {
    const [dailyUsage, sessionUsage, sessionHistory ] = await Promise.all([
      apiClient.get("/api/states/sensor.daily_water_usage_log"),
      apiClient.get("/api/states/sensor.water_event_log"),
      apiClient.get("/api/states/input_text.water_session_history"),
    ]);

    return {
      dailyUsage: dailyUsage.data.state,
      sessionUsage: sessionUsage.data.state,
      sessionHistory: sessionHistory.data.state, // This is the full log text
    };
  } catch (error) {
    console.error(`Failed to fetch water usage data for ${homeId}:`, error);
    throw error;
  }
};


// Fetch the live stream URL for a camera
export const fetchStreamUrl = async (homeId, cameraEntityId) => {
  console.log(
    `Fetching stream for homeId: ${homeId}, entityId: ${cameraEntityId}`
  );
  const config = homeAssistantConfig[homeId];

  if (!config) {
    throw new Error(`Configuration for homeId ${homeId} not found.`);
  }

  // Attempt to fetch HLS stream first
  // const hlsUrl = `https://${cameraEntityId}/hls/stream.m3u8`; // Replace with your HLS URL logic
  const hlsUrl = `http://<IP_ADDRESS>:8123/local/hls/stream.m3u8`; // Replace with your HLS URL logic
  try {
    const hlsResponse = await axios.get(hlsUrl, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Allow self-signed certificates
      }),
    });

    if (hlsResponse.status === 200) {
      console.log("HLS Stream Found:", hlsUrl);
      return hlsUrl;
    }
  } catch (error) {
    // console.warn("HLS Stream not available, falling back to RTSP.");
  }

  // Fallback to RTSP stream

  // const rtspUrl = config.reolinkRTSP; // Sally's House
  console.log(`Fallback RTSP URL: ${rtspUrl}`);
  return rtspUrl;
};

// // Setting up custom frame and bitrate for reolink camera
// const REOLINK_IP = ""; // Change this to your camera's IP
// const REOLINK_USERNAME = "admin"; // Update with your username
// const REOLINK_PASSWORD = ""; // Update with your password

// // Function to login and get the session token from Reolink API
// export const getReolinkToken = async () => {
//   try {
//     const response = await axios.post(
//       // `https://${REOLINK_IP}/api.cgi?cmd=Login`,
//       {
//         cmd: "Login",
//         // action: "0",
//         param: {
//           User: {
//             version: "0",
//             userName: REOLINK_USERNAME,
//             password: REOLINK_PASSWORD,
//           },
//         },
//       },
//       { httpsAgent: { rejectUnauthorized: false } } // Bypass SSL certificate issues
//     );

//     if (response.data && response.data[0].code === 0) {
//       const token = response.data[0].value.Token.name;
//       console.log("Reolink Token:", token);
//       return token;
//     } else {
//       console.error("Failed to authenticate with Reolink:", response.data);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching Reolink token:", error);
//     return null;
//   }
// };

// // Function to set the frame rate and bitrate dynamically
// export const setReolinkVideoSettings = async (frameRate = 20, bitRate = 4096) => {
//   const token = await getReolinkToken();
//   if (!token) {
//     console.error("No token received. Unable to set video settings.");
//     return;
//   }

//   try {
//     const response = await axios.post(
//       `https://${REOLINK_IP}/api.cgi?cmd=SetEnc`,
//       {
//         cmd: "SetEnc",
//         token,
//         param: {
//           Enc: {
//             channel: 0,
//             mainStream: {
//               frameRate,
//               bitRate,
//             },
//           },
//         },
//       },
//       { httpsAgent: { rejectUnauthorized: false } } // Bypass SSL certificate issues
//     );

//     if (response.data && response.data[0].code === 0) {
//       console.log(`Successfully updated video settings: FrameRate=${frameRate}, BitRate=${bitRate}`);
//     } else {
//       console.error("Failed to update video settings:", response.data);
//     }
//   } catch (error) {
//     console.error("Error updating Reolink video settings:", error);
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
      case "remote":
        if (action === "turn_on" || action === "turn_off") {
          service = action;
        } else if (action === "send_command") {
          service = "send_command";
          data.command = value;
        } else {
          throw new Error(`Unsupported action for remote: ${action}`);
        }
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
      case "binary_sensor":
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
