import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDJnP034ejMLzBO-oTFk-ER08Bv5fAnCoA",
  authDomain: "world-cup-sweep-a2761.firebaseapp.com",
  databaseURL: "https://world-cup-sweep-a2761-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "world-cup-sweep-a2761",
  storageBucket: "world-cup-sweep-a2761.firebasestorage.app",
  messagingSenderId: "558351393996",
  appId: "1:558351393996:web:bb0eb40d612ce87d0a4e69",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
