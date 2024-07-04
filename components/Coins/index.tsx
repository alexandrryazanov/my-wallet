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
import { toast } from "react-toastify";
import { COLORS } from "@/config/colors";
import { Skeleton } from "@nextui-org/skeleton";
import { IoAddCircle } from "react-icons/io5";
import {
  getKeyValue,
  Table as NextUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { FaRegTrashCan } from "react-icons/fa6";
import { AiOutlineCloudDownload } from "react-icons/ai";

interface CoinsProps {
  timestamp: number;
  walletName: string;
}

const Coins = ({ timestamp, walletName }: CoinsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<
    { symbol: string; amount: number; rate: number }[]
  >([]);
  const [existedCoins, setExistedCoins] = useState<{ name: string }[]>([]);
  const [addingCoin, setAddingCoin] = useState<{
    listValue: string;
    newValue: string;
    amount: number;
    rate: number;
  }>({ listValue: "", newValue: "", amount: 0, rate: 0 });

  const onAdd = async () => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());
      const coinSymbol = (
        addingCoin.listValue === "new"
          ? addingCoin.newValue
          : addingCoin.listValue
      )
        .trim()
        .toUpperCase();

      if (!coinSymbol.length) return toast.error("Select correct coin");
      if (list.find((coin) => coin.symbol === coinSymbol)) {
        return toast.error("Such coin already exists");
      }

      const coinPath = `data/${auth.currentUser.uid}/${timestamp}/wallets/${walletName}/${coinSymbol}`;
      const coinRatePath = `data/${auth.currentUser.uid}/${timestamp}/rates/${coinSymbol}`;

      await set(child(dbRef, coinRatePath), addingCoin.rate);
      await set(child(dbRef, coinPath), addingCoin.amount);

      toast.success(`Coin ${coinSymbol} has been added to ${walletName}!`);
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
              (acc, { rates }: any) => [...acc, ...Object.keys(rates)],
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
      const walletRef = ref(
        db,
        `data/${user.uid}/${timestamp}/wallets/${walletName}`,
      );

      onValue(walletRef, async (snapshot) => {
        setIsLoading(true);
        const rates =
          (
            await get(child(ref(db), `data/${user.uid}/${timestamp}/rates`))
          ).val() || {};

        setList(
          Object.entries<any>(snapshot.val() || {}).map(([symbol, amount]) => ({
            symbol,
            amount,
            rate: rates[symbol] || 1,
            total: Math.ceil((rates[symbol] || 1) * amount),
          })),
        );
        setIsLoading(false);
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getCoins();
      onCoinsListChangeListener(user);
    });
  }, [timestamp, walletName]);

  const loadRateFromCoinbase = async () => {
    const coinSymbol = (
      addingCoin.listValue === "new"
        ? addingCoin.newValue
        : addingCoin.listValue
    )
      .trim()
      .toUpperCase();

    if (!coinSymbol) return;

    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/${coinSymbol}-RUB/buy`,
      );

      const responseJson = await response.json();
      const rate = Math.ceil(Number(responseJson.data.amount));
      setAddingCoin((p) => ({ ...p, rate }));
    } catch (e) {
      setAddingCoin((p) => ({ ...p, rate: 0 }));
    }
  };

  return (
    <div className={"mb-4 flex flex-col gap-4"}>
      {isLoading ? (
        <div className={"flex flex-col gap-8 p-4 mt-0"}>
          <Skeleton className="w-full rounded-lg">
            <div className="h-9 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-5 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-5 w-4/5 rounded-lg bg-default-300" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-5 w-4/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      ) : (
        <NextUITable aria-label="Spendings">
          <TableHeader
            columns={[
              { key: "symbol", label: "Symbol" },
              { key: "amount", label: "Amount" },
              { key: "rate", label: "Rate" } as const,
              { key: "total", label: "Total", align: "end" } as const,
              { key: "actions", label: "Actions", align: "end" } as const,
            ]}
          >
            {(column) => (
              <TableColumn key={column.key} align={column.align}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={list} emptyContent={"No coins"}>
            {(item) => (
              <TableRow key={item.symbol}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "actions" ? (
                      <Button
                        isIconOnly
                        variant={"light"}
                        className={"hover:border-danger hover:border-1"}
                        onClick={() => onRemove(item.symbol)}
                      >
                        <FaRegTrashCan color={COLORS.FUCHSIA} />
                      </Button>
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </NextUITable>
      )}

      <div
        className={
          "flex gap-2 flex-no-wrap items-center bg-white p-4 rounded-2xl shadow-md"
        }
      >
        <Select
          label={"Coin"}
          placeholder="Select a coin"
          className="w-full"
          value={addingCoin.listValue}
          onChange={(e) =>
            setAddingCoin((p) => ({ ...p, listValue: e.target.value }))
          }
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
            <SelectItem key={"new"} textValue={"Enter coin symbol..."}>
              Add a new coin
            </SelectItem>
          </SelectSection>
        </Select>
        {addingCoin.listValue === "new" && (
          <Input
            label={"New coin"}
            type="text"
            size={"md"}
            placeholder="Symbol"
            minLength={2}
            value={addingCoin.newValue}
            onValueChange={(symbol) =>
              setAddingCoin((p) => ({ ...p, newValue: symbol }))
            }
            className={"w-5/12"}
          />
        )}
        <Input
          label={"Amount"}
          type="number"
          size={"md"}
          placeholder="Amount"
          value={String(addingCoin.amount)}
          onValueChange={(amount) =>
            setAddingCoin((p) => ({ ...p, amount: +amount }))
          }
          className={"w-5/12"}
        />
        <Input
          label={"Rate"}
          type="number"
          size={"md"}
          placeholder="Rate"
          value={String(addingCoin.rate)}
          onValueChange={(rate) =>
            setAddingCoin((p) => ({ ...p, rate: +rate }))
          }
          className={"w-5/12"}
          endContent={
            <AiOutlineCloudDownload
              size={32}
              className={"cursor-pointer pt-3 ml-2"}
              onClick={loadRateFromCoinbase}
            />
          }
        />
        <Button
          size={"lg"}
          onClick={onAdd}
          disabled={!addingCoin.listValue}
          color={"primary"}
          variant={"light"}
        >
          <IoAddCircle size={28} color={COLORS.MINT_GREEN} />
        </Button>
      </div>
    </div>
  );
};

export default Coins;
