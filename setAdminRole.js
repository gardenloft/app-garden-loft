const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

async function setAdmin(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin role assigned to user: ${uid}`);
  } catch (error) {
    console.error("Error assigning admin role:", error);
  }
}

// Replace 'USER_UID' with the UID of the user you want to assign as admin
const userId = "mq7eztuWzqa6OU0YUy4HqrPrBei1"; // Replace with the actual UID
setAdmin(userId);
