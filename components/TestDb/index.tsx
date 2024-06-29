"use client";

import React from "react";

import { child, get, getDatabase, ref, set } from "@firebase/database";

const TestDb = () => {
  const onGet = async () => {
    try {
      const dbRef = ref(getDatabase());

      const snapshot = await get(
        child(dbRef, "data/7jahS2xDd3Ran2BgqPZdiKwlBps2"),
      );

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

      set(child(dbRef, "data/7jahS2xDd3Ran2BgqPZdiKwlBps2"), {
        name: "Mike",
        email: "test@test.ru",
      });

      console.log({ status: "ok" });
    } catch (error) {
      console.log({ error: "Failed to POSTING users" });
    }
  };

  const auth = () => {};

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
