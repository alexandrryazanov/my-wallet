"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import {
  Select,
  SelectItem,
  SelectSection,
  Skeleton,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import { toast } from "react-toastify";
import { FaRegTrashCan } from "react-icons/fa6";
import { COLORS } from "@/config/colors";
import { IoAddCircle } from "react-icons/io5";
import useConfirmation from "@/hooks/useConfirmation";
import {
  useCurrentUser,
  useRecordWallets,
  useWalletNames,
} from "@/hooks/db";
import { addWallet, removeWallet } from "@/services/db/walletRepository";

interface WalletsProps {
  timestamp: number;
  onChange: (walletName: string) => void;
}

const Wallets = ({ timestamp, onChange }: WalletsProps) => {
  const { showConfirmationPopup } = useConfirmation();

  const user = useCurrentUser();
  const { walletNames: list, isLoading } = useRecordWallets(timestamp);
  const existedWallets = useWalletNames().map((name) => ({ name }));

  const [value, setValue] = useState("");
  const [newName, setNewName] = useState("");

  const onAdd = async () => {
    if (!user) return;

    const walletName = (value === "new" ? newName : value).trim();

    if (!walletName.length) return toast.error("Select correct wallet");
    if (list.includes(walletName))
      return toast.error("Such wallet already exists");

    try {
      await addWallet(user.uid, timestamp, walletName);
      toast.success(`Wallet ${walletName} has been added!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not add wallet");
    }
  };

  const onRemove = async (walletName: string) => {
    if (!user) return;

    try {
      await removeWallet(user.uid, timestamp, walletName);
      toast.success(`Wallet ${walletName} has been removed!`);
    } catch (error) {
      console.error(error);
      toast.error("Could not remove wallet");
    }
  };

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
                  onClick={showConfirmationPopup(
                    () => onRemove(walletName),
                    `Remove ${walletName} wallet from the current date?`,
                  )}
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
