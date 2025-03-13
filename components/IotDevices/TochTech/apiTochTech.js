import { encode as base64Encode } from "base-64";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

//API KEYS AND CODES GO HERE

// Function to generate Secure HMAC Nonce Authentication (Recommended)
const generateHMACNonce = () => {
  const nonce = Math.floor(Date.now() / 1000).toString(); // Current Unix timestamp
  const signature = CryptoJS.HmacSHA1(API_KEY + nonce, API_SECRET).toString(
    CryptoJS.enc.Hex
  );
  return { nonce, signature };
};

// Function to fetch access token
export const getAccessToken = async () => {
  try {
    const { nonce, signature } = generateHMACNonce(); // Use secure authentication

    const response = await fetch(`${API_URL}/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: API_KEY,
        api_secret: signature, // Use the HMAC-SHA1 hash
        nonce: nonce,
      }),
    });

    // Function to store access token in expo-secure-store
    const data = await response.json();
    if (data.access_token) {
      await SecureStore.setItemAsync("access_token", data.access_token);
      await SecureStore.setItemAsync("expire_at", data.expire_at.toString());
      console.log("Access Token Stored Successfully!");
      return data.access_token;
    } else {
      console.error("Error fetching token:", data);
      return null;
    }
  } catch (error) {
    console.error("API Token Request Failed:", error);
  }
};

// Function to ensure/retrieve a valid access token
export const getValidAccessToken = async () => {
  const token = await SecureStore.getItemAsync("access_token");
  const expiry = await SecureStore.getItemAsync("expire_at");

  if (!token || (expiry && Date.now() >= parseInt(expiry) * 1000)) {
    console.log("Token expired or missing, fetching a new one...");
    return await getAccessToken();
  }
  return token;
};

// Retrieve a list of all Residents under a business entity.
export const fetchResidentData = async () => {
  try {
    const token = await getValidAccessToken();
    if (!token) throw new Error("No valid access token available");

    const response = await fetch(
      `${API_URL}/residents?entity_id=${ENTITY_ID}`,
      {
        // Retrieve a list of all Residents under a business entity.
        // const response = await fetch(`${API_URL}/groups`, { // Retrieve a list of all Residents Groups under a business entity.
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("resident data", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch resident data:", error);
  }
};

// Get daily report for a resident or all residents of a business entity.
export const fetchResidentDataDaily = async () => {
  try {
    const token = await getValidAccessToken();
    if (!token) throw new Error("No valid access token available");

    const response = await fetch(
      `${API_URL}/daily_reports?entity_id=${ENTITY_ID}&resident_id=${RESIDENT_ID}&date=${DATE}`,
      {
        // Retrieve a list of all Residents under a business entity.
        // const response = await fetch(`${API_URL}/groups`, { // Retrieve a list of all Residents Groups under a business entity.
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("resident data daily", JSON.stringify(data, null, 2), DATE);
    // console.log("Report data:", JSON.stringify(data.data[0].report, null, 2)); //this is the way you can get object of "report"

    return data;
  } catch (error) {
    console.error("Failed to fetch resident data:", error);
  }
};

// Get daily sleep quality and score for a resident or all residents of a business entity.
export const fetchResidentDailySleep = async () => {
  try {
    const token = await getValidAccessToken();
    if (!token) throw new Error("No valid access token available");

    const response = await fetch(
      `${API_URL}/daily_reports?entity_id=${ENTITY_ID}&resident_id=${RESIDENT_ID}&date=${DATE}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data?.data?.length > 0 && data.data[0].report?.sleep) {
      const { score, sleep_quality } = data.data[0].report.sleep;
      console.log("Sleep Score:", score);
      // console.log("Sleep Quality:", JSON.stringify(sleep_quality, null, 2));

      return { score, sleep_quality };
    } else {
      console.warn("No sleep data found.");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch sleep data:", error);
  }
};
