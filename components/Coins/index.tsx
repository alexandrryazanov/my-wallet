"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input, Button } from "@nextui-org/react";

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
import {
  Select,
  SelectItem,
  SelectSection,
  getKeyValue,
  Table as NextUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Skeleton,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { COLORS } from "@/config/colors";
import { IoAddCircle } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { UserData } from "@/types/firebase";
import { formatValue } from "@/services/calc";
import { CoinsForChartData } from "@/types/coins";
import useConfirmation from "@/hooks/useConfirmation";
import { loadRateFromCoinbase } from "@/services/coinbase";

interface CoinsProps {
  timestamp: number;
  walletName: string;
  onDataLoaded?: (data: CoinsForChartData[]) => void;
}

const renderCell = <T,>(item: T, columnKey: string | number) => {
  const value = getKeyValue(item, columnKey);
  if (!value) return "";
  if (typeof value === "number") return formatValue(value);
  return value;
};

const Coins = ({ timestamp, walletName, onDataLoaded }: CoinsProps) => {
  const { showConfirmationPopup } = useConfirmation();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<
    { symbol: string; amount: number; rate: number; total: number }[]
  >([]);
  const [existedCoins, setExistedCoins] = useState<{ name: string }[]>([]);
  const [addingCoin, setAddingCoin] = useState<{
    listValue: string;
    newValue: string;
    amount: string;
    rate: string;
  }>({ listValue: "", newValue: "", amount: "0", rate: "0" });

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

      await set(child(dbRef, coinRatePath), +addingCoin.rate);
      await set(child(dbRef, coinPath), +addingCoin.amount);

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

        const results = snapshot.val() as UserData;
        const coinNames = [
          ...new Set(
            Object.values(results).reduce<string[]>(
              (acc, userDataOnDate) => [
                ...acc,
                ...Object.keys(userDataOnDate.rates || {}),
              ],
              [],
            ),
          ),
        ];

        setExistedCoins(coinNames.map((name) => ({ name })));
      } catch (error) {
        toast.error("Could not get existed coins\n" + String(error));
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

        const data = Object.entries<any>(snapshot.val() || {}).map(
          ([symbol, amount]) => ({
            symbol,
            amount,
            rate: rates[symbol] || 1,
            total: Math.ceil((rates[symbol] || 1) * amount),
          }),
        );

        setList(data);
        onDataLoaded?.(data);
        setIsLoading(false);
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      getCoins();
      onCoinsListChangeListener(user);
    });
  }, [timestamp, walletName]);

  const loadRate = async (symbol: string) => {
    const coinSymbol = symbol.trim().toUpperCase();

    if (!coinSymbol) return;

    const rate = await loadRateFromCoinbase(coinSymbol);
    setAddingCoin((p) => ({ ...p, rate: String(rate || 0) }));
  };

  const total = useMemo(
    () => list.reduce((acc, row) => acc + row.total, 0),
    [list],
  );

  return (
    <div className={"mb-4 flex flex-col gap-2 z-50 max-w-full"}>
      <h2 className={"flex items-center h-12"}>
        Coins of {walletName} (balance: {formatValue(total)})
      </h2>
      {isLoading ? (
        <div
          className={
            "flex flex-col gap-6 p-4 mt-0 bg-white rounded-2xl shadow-small"
          }
        >
          <Skeleton className="w-full rounded-lg">
            <div className="h-9 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-11/12 rounded-lg mb-4">
            <div className="h-6 rounded-lg bg-default-200" />
          </Skeleton>
        </div>
      ) : (
        <NextUITable
          aria-label="Spendings"
          isStriped
          className={"z-50 w-full max-w-full"}
        >
          <TableHeader
            columns={[
              { key: "symbol", label: "Symbol" },
              { key: "amount", label: "Amount" },
              { key: "rate", label: "Rate" } as const,
              {
                key: "total",
                label: "TOTAL",
                align: "end",
                bold: true,
              } as const,
              { key: "actions", label: "", align: "end" } as const,
            ]}
          >
            {(column) => (
              <TableColumn
                key={column.key}
                align={column.align}
                className={column.bold ? "font-bold" : ""}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={list} emptyContent={"No coins"}>
            {(item) => (
              <TableRow key={item.symbol}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "actions" && item.symbol !== "" ? (
                      <Button
                        isIconOnly
                        variant={"light"}
                        className={
                          "hover:border-danger hover:border-1 md:block hidden"
                        }
                        onClick={showConfirmationPopup(
                          () => onRemove(item.symbol),
                          `Remove ${item.symbol} coin from ${walletName} wallet?`,
                        )}
                      >
                        <FaRegTrashCan color={COLORS.FUCHSIA} />
                      </Button>
                    ) : (
                      renderCell(item, columnKey)
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
          "flex gap-2 flex-wrap items-center bg-white p-4 rounded-2xl shadow-small"
        }
      >
        <Select
          label={"Add Coin"}
          placeholder="Select a coin"
          className="md:w-3/12 w-full"
          value={addingCoin.listValue}
          onChange={(e) => {
            loadRate(e.target.value);
            setAddingCoin((p) => ({ ...p, listValue: e.target.value }));
          }}
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
            label={"Coin"}
            type="text"
            size={"md"}
            placeholder="Symbol"
            minLength={2}
            value={addingCoin.newValue}
            onValueChange={(symbol) =>
              setAddingCoin((p) => ({ ...p, newValue: symbol }))
            }
            className="w-20"
          />
        )}
        <Input
          label={"Amount"}
          type="text"
          size={"md"}
          placeholder="0"
          value={String(addingCoin.amount)}
          onValueChange={(amount) => {
            const onlyNumbers = /^[\d.]*$/;
            if (!onlyNumbers.test(amount)) return;
            setAddingCoin((p) => ({ ...p, amount }));
          }}
          className="w-20"
        />
        <Input
          label={"Rate"}
          type="string"
          size={"md"}
          placeholder="Rate"
          value={String(addingCoin.rate)}
          onValueChange={(rate) => {
            const onlyNumbers = /^[\d.]*$/;
            if (!onlyNumbers.test(rate)) return;
            setAddingCoin((p) => ({ ...p, rate }));
          }}
          className="w-40"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">₽</span>
            </div>
          }
          endContent={
            <AiOutlineCloudDownload
              size={32}
              className={"cursor-pointer pt-3 ml-2"}
              onClick={() =>
                loadRate(
                  addingCoin.listValue === "new"
                    ? addingCoin.newValue
                    : addingCoin.listValue,
                )
              }
            />
          }
        />
        <Button
          size={"lg"}
          onClick={onAdd}
          disabled={!addingCoin.listValue}
          color={"primary"}
          variant={"light"}
          className={"px-1 min-w-12"}
        >
          <IoAddCircle size={28} color={COLORS.MINT_GREEN} />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Coins);
