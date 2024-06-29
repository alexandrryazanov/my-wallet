import { initializeApp } from "firebase/app";

export function initFirebase() {
  initializeApp({
    apiKey: "AIzaSyDkhPaMt3aQHG4kWPGkNb-BTz3ty9QehkA",
    authDomain: "scooter-wallet.firebaseapp.com",
    databaseURL:
      "https://scooter-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scooter-wallet",
    storageBucket: "scooter-wallet.appspot.com",
    messagingSenderId: "985892298962",
    appId: "1:985892298962:web:54f6f6a8ba42c1c60b4d0b",
  });
}
