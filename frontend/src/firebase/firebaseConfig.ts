// Firebase client config - replace with your project's config or set via env
const firebaseConfig = {
  apiKey: "AIzaSyB6A2wZ4Ok8bM5izHuj-PBYISsKRmdfsK4",
  authDomain: "dbms-project-71c9d.firebaseapp.com",
  projectId: "dbms-project-71c9d",
  storageBucket: "dbms-project-71c9d.firebasestorage.app",
  messagingSenderId: "580916893669",
  appId: "1:580916893669:web:9cb125db69253f9f97010c",
  measurementId: "G-X38Z0J1E9S"
};

// Simple validity check: apiKey must exist and look like a string of reasonable length
export const isFirebaseConfigured = typeof firebaseConfig.apiKey === "string" && firebaseConfig.apiKey.length > 10;

export default firebaseConfig;
