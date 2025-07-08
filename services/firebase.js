import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVhkaqU5GNQnvL16wy0tdu6tVl_YoXsD0",
  authDomain: "connectverse-d7e89.firebaseapp.com",
  projectId: "connectverse-d7e89",
  storageBucket: "connectverse-d7e89.firebasestorage.app",
  messagingSenderId: "558918735773",
  appId: "1:558918735773:web:4b145852309580cf964174",
  measurementId: "G-BJM55B0X92"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
