"use client";

import React, { useEffect, useState } from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import { DateInput } from "@nextui-org/date-input";
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import WalletPieChart from "@/components/WalletPieChart";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "@firebase/database";
import { UserDataOnDate } from "@/types/firebase";
import { CoinsForChartData } from "@/types/coins";
import { Button } from "@nextui-org/button";
import { AiOutlineClose } from "react-icons/ai";

interface WalletsWithCoinsProps {
  timestamp: number;
}

export default function WalletsWithCoins({ timestamp }: WalletsWithCoinsProps) {
  const router = useRouter();
  const [walletName, setWalletName] = useState("");
  const [date, setDate] = React.useState<DateValue>(
    parseAbsoluteToLocal("2021-01-01T00:00:00Z"),
  );
  const [walletChartData, setWalletChartData] = useState<CoinsForChartData[]>(
    [],
  );
  const [allWalletsChartData, setAllWalletsChartData] = useState<
    CoinsForChartData[]
  >([]);

  useEffect(() => {
    setDate(parseAbsoluteToLocal(new Date(timestamp).toISOString()));
  }, [timestamp]);

  const onDateLeaveFocus = () => {
    router.replace(`/record/${date.toDate("").getTime()}`);
  };

  //TODO: RFC
  useEffect(() => {
    if (!timestamp) return;
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const db = getDatabase();
      const starCountRef = ref(db, `data/${user.uid}/${timestamp}`);

      onValue(starCountRef, (snapshot) => {
        if (!snapshot.exists()) return;

        const { wallets, rates } = snapshot.val() as UserDataOnDate;
        const dataObject = Object.values(wallets || {}).reduce<
          Record<string, number>
        >((acc, coins) => {
          Object.entries(coins).forEach(([symbol, amount]) => {
            acc[symbol] = (acc[symbol] || 0) + amount * (rates?.[symbol] || 1);
          });
          return acc;
        }, {});

        setAllWalletsChartData(
          Object.entries(dataObject).map(([symbol, total]) => ({
            symbol,
            total,
          })),
        );
      });
    });
  }, [timestamp]);

  const chartData = walletName ? walletChartData : allWalletsChartData;

  return (
    <div className={"flex gap-4 w-full flex-wrap"}>
      <section className={clsx("flex-1", walletName && "max-w-80")}>
        <h2 className={"mb-2 flex items-center gap-1 h-12"}>
          <span className={"min-w-22 text-nowrap"}>Wallets on</span>
          <DateInput
            className={"w-full"}
            granularity="second"
            value={date}
            onChange={setDate}
            onBlur={onDateLeaveFocus}
            size={"sm"}
          />
        </h2>
        <Wallets timestamp={timestamp} onChange={setWalletName} />
      </section>

      {walletName && (
        <section className={"flex-1 relative"}>
          <Coins
            timestamp={timestamp}
            walletName={walletName}
            onDataLoaded={setWalletChartData}
          />
          <Button
            isIconOnly
            className={"absolute right-0 top-3 pb-12 pt-5"}
            onClick={() => setWalletName("")}
            variant={"bordered"}
          >
            <AiOutlineClose size={18} />
          </Button>
        </section>
      )}
      {chartData.length > 0 && (
        <section
          className={
            walletName ? "w-[450px] h-[450px]" : "md:w-1/2 w-full h-[650px]"
          }
        >
          <WalletPieChart chartData={chartData} />
        </section>
      )}
    </div>
  );
}
