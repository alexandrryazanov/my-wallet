"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { child, get, getDatabase, ref, set } from "@firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Selection } from "@nextui-org/table";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

const Wallets = () => {
  const [existedWallets, setExistedWallets] = useState<{ name: string }[]>([]);
  const [value, setValue] = React.useState<Selection>(new Set([]));
  const [inputVisible, setInputVisible] = useState(false);

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

  useEffect(() => {
    const auth = getAuth();

    const getWallets = async () => {
      if (!auth.currentUser) return;

      try {
        const dbRef = ref(getDatabase());

        const snapshot = await get(
          child(dbRef, `data/${auth.currentUser.uid}`),
        );

        if (!snapshot.exists()) return;

        const results = snapshot.val();
        const walletNames = Object.values(results).reduce<string[]>(
          (acc, { wallets }: any) => [...acc, ...Object.keys(wallets)],
          [],
        );

        setExistedWallets(walletNames.map((name) => ({ name })));
      } catch (error) {
        console.log(error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getWallets();
    });
  }, []);

  const onSelect = (keys: Selection) => {
    if (typeof keys === "string") return;
    setInputVisible(keys.has("new"));

    setValue(keys);
  };

  return (
    <div className={"h-full"}>
      <Listbox aria-label="Wallets" onAction={(key) => alert(key)}>
        {existedWallets.map((wallet) => (
          <ListboxItem key={wallet.name}>{wallet.name}</ListboxItem>
        ))}
      </Listbox>

      <div className={"flex gap-2 flex-wrap"}>
        <Select
          placeholder="Select a wallet"
          className="w-5/12"
          selectedKeys={value}
          onSelectionChange={onSelect}
          aria-label={"Select Wallet"}
        >
          <SelectSection showDivider>
            {existedWallets.map((wallet) => (
              <SelectItem
                key={wallet.name}
                textValue={wallet.name}
                aria-label={wallet.name}
              >
                {wallet.name}
              </SelectItem>
            ))}
          </SelectSection>

          <SelectSection>
            <SelectItem key={"new"} textValue={"Enter name..."}>
              Create a new wallet
            </SelectItem>
          </SelectSection>
        </Select>
        {inputVisible && (
          <Input
            type="name"
            size={"md"}
            placeholder="Enter wallet name"
            minLength={2}
            value={name}
            onValueChange={setName}
            className={"w-4/12"}
          />
        )}
        <Button onClick={onAdd}>Add</Button>
      </div>
    </div>
  );
};

export default Wallets;
