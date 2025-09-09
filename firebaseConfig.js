import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvY0JjNesF1guRKnBz5glTgnEJz6eS1Vc",
  authDomain: "megillah-data.firebaseapp.com",
  projectId: "megillah-data",
  storageBucket: "megillah-data.firebasestorage.app",
  messagingSenderId: "165546650382",
  appId: "1:165546650382:web:f258aadf0c017280efc55f",
  measurementId: "G-C05JJKGL4G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
