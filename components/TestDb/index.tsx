"use client";

import React from "react";

const TestDb = () => {
  const onGet = () => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => console.log(data?.user || "???"));
  };

  const onPost = () => {
    fetch("/users", { method: "POST" }).then((res) => {
      console.log("DONE!");
    });
  };

  return (
    <div>
      <button onClick={onGet}>AdminRead</button>
      <br />
      <button onClick={onPost}>AdminPost</button>
    </div>
  );
};

export default TestDb;
