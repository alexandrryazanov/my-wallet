"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
} from "@firebase/database";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { toast } from "react-toastify";
import { FaRegTrashCan } from "react-icons/fa6";
import { Divider } from "@nextui-org/divider";
import { COLORS } from "@/config/colors";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@nextui-org/skeleton";

//TODO:
// - don't add existed wallet name  - ✅
// - remove wallet - ✅
// - date as array (or timestamp of the day start)
// - add coins
// - remove coins
// - create summary table

interface WalletsProps {
  timestamp: string;
}

const Wallets = ({ timestamp }: WalletsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<string[]>([]);
  const [existedWallets, setExistedWallets] = useState<{ name: string }[]>([]);
  const [value, setValue] = useState("");
  const [newName, setNewName] = useState("");

  const onAdd = () => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());
      const walletName = (value === "new" ? newName : value).trim();

      if (!walletName.length) return toast.error("Select correct wallet");
      if (list.includes(walletName))
        return toast.error("Such wallet already exists");

      const walletPath = `data/${auth.currentUser.uid}/${timestamp}/wallets/${walletName}`;

      set(child(dbRef, walletPath), { coins: "empty" });

      toast.success(`Wallet ${walletName} has been added!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add wallet");
    }
  };

  const onRemove = (walletName: string) => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());

      const walletPath = `data/${auth.currentUser.uid}/${timestamp}/wallets/${walletName}`;

      remove(child(dbRef, walletPath));

      toast.success(`Wallet ${walletName} has been removed!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not remove wallet");
    }
  };

  useEffect(() => {
    if (!timestamp) return;

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
        const walletNames = [
          ...new Set(
            Object.values(results).reduce<string[]>(
              (acc, { wallets }: any) => [...acc, ...Object.keys(wallets)],
              [],
            ),
          ),
        ];

        setExistedWallets(walletNames.map((name) => ({ name })));
      } catch (error) {
        toast.error(String(error));
      }
    };

    const onWalletsListChangeListener = (user: User) => {
      const db = getDatabase();
      const starCountRef = ref(db, `data/${user.uid}/${timestamp}/wallets`);

      onValue(starCountRef, (snapshot) => {
        setList(Object.keys(snapshot.val() || {}));
        setIsLoading(false);
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getWallets();
      onWalletsListChangeListener(user);
    });
  }, [timestamp]);

  return (
    <div className={"mb-4"}>
      {isLoading ? (
        <div className={"flex flex-col gap-6 p-4 mt-2"}>
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-4 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-4 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      ) : (
        <Listbox aria-label="Wallets" onAction={(key) => alert(key)}>
          {list.map((walletName) => (
            <ListboxItem
              key={walletName}
              textValue={walletName}
              className={"flex justify-between w-full"}
            >
              <div className={"w-full justify-between flex items-center"}>
                <span>🏦 &emsp;{walletName}</span>
                <Button
                  isIconOnly
                  variant={"light"}
                  className={"hover:border-danger hover:border-1"}
                  onClick={() => onRemove(walletName)}
                >
                  <FaRegTrashCan color={COLORS.FUCHSIA} />
                </Button>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}

      <Divider className={"my-8"} />

      <div className={"flex gap-2 flex-no-wrap"}>
        <Select
          placeholder="Select a wallet"
          className="w-10/12"
          value={value}
          onChange={(e) => setValue(e.target.value)}
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
        {value === "new" && (
          <Input
            type="name"
            size={"md"}
            placeholder="Enter wallet name"
            minLength={2}
            value={newName}
            onValueChange={setNewName}
            className={"w-5/12"}
          />
        )}
        <Button className={"w-1/5"} onClick={onAdd} disabled={!value}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default Wallets;
