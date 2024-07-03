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
import { Skeleton } from "@nextui-org/skeleton";
import { IoAddCircle } from "react-icons/io5";

interface CoinsProps {
  timestamp: number;
  walletName: string;
}

const Coins = ({ timestamp, walletName }: CoinsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<string[]>([]);
  const [existedCoins, setExistedCoins] = useState<{ name: string }[]>([]);
  const [value, setValue] = useState("");
  const [newName, setNewName] = useState("");

  const onAdd = () => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());
      const coinName = (value === "new" ? newName : value).trim().toUpperCase();

      if (!coinName.length) return toast.error("Select correct coin");
      if (list.includes(coinName))
        return toast.error("Such coin already exists");

      const coinPath = `data/${auth.currentUser.uid}/${timestamp}/wallets/${walletName}/${coinName}`;

      set(child(dbRef, coinPath), { value: 1 });

      toast.success(`Coin ${coinName} has been added to ${walletName}!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add coin");
    }
  };

  const onRemove = (coinName: string) => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());

      const coinPath = `data/${auth.currentUser.uid}/${timestamp}/wallets/${walletName}/${coinName}`;

      remove(child(dbRef, coinPath));

      toast.success(`Coin ${coinName} has been removed from ${walletName}!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not remove coin");
    }
  };

  useEffect(() => {
    if (!timestamp || !walletName) return;

    const auth = getAuth();

    const getCoins = async () => {
      if (!auth.currentUser) return;

      try {
        const dbRef = ref(getDatabase());

        const snapshot = await get(
          child(dbRef, `data/${auth.currentUser.uid}`),
        );

        if (!snapshot.exists()) return;

        const results = snapshot.val();
        const coinNames = [
          ...new Set(
            Object.values(results).reduce<string[]>(
              (acc, { wallets }: any) => [...acc, ...Object.keys(wallets)],
              [],
            ),
          ),
        ];

        setExistedCoins(coinNames.map((name) => ({ name })));
      } catch (error) {
        toast.error(String(error));
      }
    };

    const onCoinsListChangeListener = (user: User) => {
      const db = getDatabase();
      const starCountRef = ref(
        db,
        `data/${user.uid}/${timestamp}/wallets/${walletName}`,
      );

      onValue(starCountRef, (snapshot) => {
        setList(Object.keys(snapshot.val() || {}));
        setIsLoading(false);
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getCoins();
      onCoinsListChangeListener(user);
    });
  }, [timestamp, walletName]);

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
          {list.map((name) => (
            <ListboxItem
              key={name}
              textValue={name}
              className={"flex justify-between w-full"}
            >
              <div className={"w-full justify-between flex items-center"}>
                <span>🪙 &emsp;{name}</span>
                <Button
                  isIconOnly
                  variant={"light"}
                  className={"hover:border-danger hover:border-1"}
                  onClick={() => onRemove(name)}
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
          placeholder="Select a coin"
          className="w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={"Select coin"}
        >
          <SelectSection showDivider>
            {existedCoins.map((coin) => (
              <SelectItem
                key={coin.name}
                textValue={coin.name}
                aria-label={coin.name}
              >
                {coin.name}
              </SelectItem>
            ))}
          </SelectSection>

          <SelectSection>
            <SelectItem key={"new"} textValue={"Enter coin name..."}>
              Add a new coin
            </SelectItem>
          </SelectSection>
        </Select>
        {value === "new" && (
          <Input
            type="name"
            size={"md"}
            placeholder="Enter coin symbol"
            minLength={2}
            value={newName}
            onValueChange={setNewName}
            className={"w-5/12"}
          />
        )}
        <Button
          onClick={onAdd}
          disabled={!value}
          color={"primary"}
          className={"min-w-5 px-1"}
          variant={"light"}
        >
          <IoAddCircle size={36} color={COLORS.MINT_GREEN} />
        </Button>
      </div>
    </div>
  );
};

export default Coins;
