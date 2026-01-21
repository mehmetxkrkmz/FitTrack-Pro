import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Kendi Firebase anahtarlarını buraya yapıştır
const firebaseConfig = {
    apiKey: "AIzaSyA3QzSmnGv6WPIsTvlbiTgrTfFe5UUvuYU",
    authDomain: "fittrack-pro-b12f0.firebaseapp.com",
    projectId: "fittrack-pro-b12f0",
    storageBucket: "fittrack-pro-b12f0.firebasestorage.app",
    messagingSenderId: "348197435834",
    appId: "1:348197435834:web:61d18ddf7345ac681ec583"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
