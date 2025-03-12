// VideoSDK API 

// initiate videosdk
import { register } from "@videosdk.live/react-native-sdk";
register();

//Please go into .env file and copy and paste TOKEN into this line below:
export const token =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0OTMyMWQxMy02YTY5LTQyMGYtOWJiZC1jZjY2YWE2MTJlY2IiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcxNzc4MTI3NywiZXhwIjoxNzQ5MzE3Mjc3fQ.W7ou1MgBfqJitdYb4fy-atNWrhCsIRkmkl5LwPE2sBM';
// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch("https://api.videosdk.live/v1/meetings", {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ region: "sg001" }),
  });

  const { meetingId } = await res.json();
  return meetingId;
};