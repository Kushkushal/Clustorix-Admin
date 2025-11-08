// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDONrzXfW21YqWVCvlnjopgGi5RUwGYNqs",
    authDomain: "clustorix-238b1.firebaseapp.com",
    projectId: "clustorix-238b1",
    storageBucket: "clustorix-238b1.firebasestorage.app",
    messagingSenderId: "51138458449",
    appId: "1:51138458449:web:104546f8a9190490e4d970",
    measurementId: "G-WL3F948BNY"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
