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
import { COLORS } from "@/config/colors";
import { Skeleton } from "@nextui-org/skeleton";
import { IoAddCircle } from "react-icons/io5";
import { getAllWalletNames } from "@/services/firebase";

//TODO:
// - don't add existed wallet name  - ✅
// - remove wallet - ✅
// - date as array (or timestamp of the day start)
// - add coins
// - remove coins
// - create summary table

interface WalletsProps {
  timestamp: number;
  onChange: (walletName: string) => void;
}

const Wallets = ({ timestamp, onChange }: WalletsProps) => {
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

      set(child(dbRef, walletPath), "");

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

    const getAndSetWalletNames = async (user: User) => {
      const dbRef = ref(getDatabase());

      const userSnapshot = await get(child(dbRef, `data/${user.uid}`));
      const walletNames = getAllWalletNames(userSnapshot);
      setExistedWallets(walletNames.map((name) => ({ name })));
    };

    const onWalletsListChangeListener = (user: User) => {
      const db = getDatabase();
      const starCountRef = ref(db, `data/${user.uid}/${timestamp}/wallets`);

      onValue(starCountRef, (snapshot) => {
        setIsLoading(false);
        setList(Object.keys(snapshot.val() || {}));
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getAndSetWalletNames(user);
      onWalletsListChangeListener(user);
    });
  }, [timestamp]);

  return (
    <div className={"mb-4 flex flex-col gap-2"}>
      {isLoading ? (
        <div
          className={
            "flex flex-col gap-6 p-4 mt-2 bg-white rounded-2xl shadow-md"
          }
        >
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-4 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
      ) : (
        <Listbox
          aria-label="Wallets"
          onAction={(key) => onChange(String(key))}
          className={"bg-white p-3 rounded-2xl shadow-small"}
          selectionMode={"single"}
          emptyContent={"No wallets yet"}
        >
          {list.map((walletName) => (
            <ListboxItem
              key={walletName}
              textValue={walletName}
              className={"flex justify-between w-full pr-0 pl-4"}
            >
              <div className={"w-full justify-between flex items-center"}>
                <span>🏦 &emsp;{walletName}</span>
                <Button
                  isIconOnly
                  variant={"light"}
                  className={"hover:border-danger hover:border-1 z-50"}
                  onClick={() => onRemove(walletName)}
                >
                  <FaRegTrashCan color={COLORS.FUCHSIA} />
                </Button>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      )}

      <div
        className={
          "flex gap-2 flex-no-wrap bg-white p-4 rounded-2xl shadow-small items-center"
        }
      >
        <div className={"flex flex-col gap-1 w-full"}>
          <Select
            label={"Add Wallet"}
            placeholder="Select a wallet"
            className="w-full"
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
              label={"New wallet"}
              type="name"
              size={"md"}
              placeholder="Enter name"
              minLength={2}
              value={newName}
              onValueChange={setNewName}
              className={"w-full"}
            />
          )}
        </div>

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

export default React.memo(Wallets);
