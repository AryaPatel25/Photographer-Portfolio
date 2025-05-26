const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // your service account file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userEmail = ""; // the user's email to make admin

async function makeAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(userEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Success! User ${userEmail} is now an admin.`);
  } catch (error) {
    console.error("Error making user admin:", error);
  }
}

makeAdmin();
