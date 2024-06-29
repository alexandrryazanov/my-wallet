"use client";

import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "@firebase/database";

//TODO: set permissions: user can change only owned data

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

const TestDb = () => {
  const onGet = async () => {
    try {
      const dbRef = ref(getDatabase());

      const snapshot = await get(child(dbRef, "users/1"));

      if (snapshot.exists()) {
        console.log({ user: snapshot.val() });
      } else {
        console.log("fail");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPost = () => {
    try {
      const dbRef = ref(getDatabase());

      set(child(dbRef, "users/1"), {
        name: "Mike",
        email: "test@test.ru",
      });

      console.log({ status: "ok" });
    } catch (error) {
      console.log({ error: "Failed to POSTING users" });
    }
  };

  const auth = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken || "???";
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        console.log(token, user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log({ errorCode, errorMessage, email, credential });
      });
  };

  return (
    <div>
      <button onClick={onGet}>AdminRead</button>
      <br />
      <button onClick={onPost}>AdminPost</button>
      <br />
      <button onClick={auth}>Auth</button>
    </div>
  );
};

export default TestDb;
