import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAT4AqxofcVnIAOKDFHMvbREjZcciWqS5I",
  authDomain: "fcsm-888dd.firebaseapp.com",
  projectId: "fcsm-888dd",
  storageBucket: "fcsm-888dd.appspot.com",
  messagingSenderId: "67986104274",
  appId: "1:67986104274:web:d4c7468cd5eb7dca21320b",
  measurementId: "G-GPHZH882L0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };