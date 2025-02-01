import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyBQUTLU2owLu0oJx_MLubkBXWc6IUVsqUc",
  authDomain: "product-1c20f.firebaseapp.com",
  projectId: "product-1c20f",
  storageBucket: "product-1c20f.firebasestorage.app",
  messagingSenderId: "435650079506",
  appId: "1:435650079506:web:0fd9673d298b7178f221cb"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app;