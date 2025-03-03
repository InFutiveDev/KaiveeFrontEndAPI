
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage} = require("firebase-admin/storage");
const serviceAccount = require("./firebase.json");

// const handleFormData = () => {
initializeApp({
  credential: cert(serviceAccount),
});

const bucket = getStorage().bucket("kaivee.firebasestorage.app");
// };
module.exports = { bucket };
