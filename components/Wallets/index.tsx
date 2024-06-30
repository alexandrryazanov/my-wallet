"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { child, getDatabase, ref, set } from "@firebase/database";
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

const Wallets = () => {
  const [name, setName] = useState("");

  const onAdd = () => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    const date = format(new Date(), "dd:MM:yyyy");

    try {
      const dbRef = ref(getDatabase());

      set(
        child(dbRef, `data/${auth.currentUser.uid}/${date}/wallets/${name}`),
        { coins: "empty" },
      );

      console.log({ status: "ok" });
    } catch (error) {
      console.log({ message: "Failed to POSTING", error });
    }
  };

  return (
    <div className={"h-full"}>
      {/*TODO list*/}
      <div className={"flex w-full flex-wrap md:flex-nowrap gap-4"}>
        <Input
          type="name"
          size={"md"}
          placeholder="Enter wallet name"
          minLength={2}
          value={name}
          onValueChange={setName}
        />
        <Button onClick={onAdd}>Add</Button>
      </div>
    </div>
  );
};

export default Wallets;
