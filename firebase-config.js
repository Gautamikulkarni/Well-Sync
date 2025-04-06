import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, 
         GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX0i4v0QD_k906aGmQvwCXlj3FekjtX00",
  authDomain: "well-sync.firebaseapp.com",
  projectId: "well-sync",
  storageBucket: "well-sync.firebasestorage.app",
  messagingSenderId: "147360419810",
  appId: "1:147360419810:web:7c711673b287e9d295f3bb",
  measurementId: "G-1M47JB2N9K"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };

