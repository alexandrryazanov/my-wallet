"use client";

import React, { useEffect, useState } from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import { DateInput } from "@nextui-org/date-input";
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import WalletPieChart from "@/components/WalletPieChart";
import { CoinsTableRow } from "@/types/coins";

interface WalletsWithCoinsProps {
  timestamp: number;
}

export default function WalletsWithCoins({ timestamp }: WalletsWithCoinsProps) {
  const router = useRouter();
  const [walletName, setWalletName] = useState("");
  const [date, setDate] = React.useState<DateValue>(
    parseAbsoluteToLocal("2021-01-01T00:00:00Z"),
  );
  const [walletData, setWalletData] = useState<CoinsTableRow[]>([]);

  useEffect(() => {
    setDate(parseAbsoluteToLocal(new Date(timestamp).toISOString()));
  }, [timestamp]);

  const onDateLeaveFocus = () => {
    router.replace(`/record/${date.toDate("").getTime()}`);
  };

  return (
    <div className={"flex gap-4 w-full flex-wrap"}>
      <section className={clsx("flex-1", walletName && "max-w-80")}>
        <h2 className={"mb-2 flex items-center gap-1 h-12"}>
          <span className={"min-w-22 text-nowrap"}>Wallets on</span>
          <DateInput
            className={"w-full"}
            granularity="second"
            label=""
            value={date}
            onChange={setDate}
            onBlur={onDateLeaveFocus}
            size={"sm"}
          />
        </h2>
        <Wallets timestamp={timestamp} onChange={setWalletName} />
      </section>

      {walletName && (
        <>
          <section className={"flex-1"}>
            <Coins
              timestamp={timestamp}
              walletName={walletName}
              onDataLoaded={setWalletData}
            />
          </section>
          <section className={"w-[450px] h-[450px]"}>
            <WalletPieChart walletData={walletData} />
          </section>
        </>
      )}
    </div>
  );
}
