"use client";

import React, { useEffect, useState } from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import { DateInput } from "@nextui-org/react";
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import WalletPieChart from "@/components/WalletPieChart";
import { CoinsForChartData } from "@/types/coins";
import { Button } from "@nextui-org/react";
import { AiOutlineClose } from "react-icons/ai";
import { useRecordCoinTotals } from "@/hooks/db";
import WalletsOnNowModal from "../WalletsOnNowModal";

interface WalletsWithCoinsProps {
  timestamp: number;
}

export default function WalletsWithCoins({ timestamp }: WalletsWithCoinsProps) {
  const router = useRouter();
  const [walletName, setWalletName] = useState("");
  // Start as null so SSR and the first client render match. The real,
  // timezone-dependent value is set on the client in the effect below,
  // avoiding a hydration mismatch on the date segments.
  const [date, setDate] = React.useState<DateValue | null>(null);
  const [walletChartData, setWalletChartData] = useState<CoinsForChartData[]>(
    [],
  );
  const allWalletsChartData = useRecordCoinTotals(timestamp);

  useEffect(() => {
    setDate(parseAbsoluteToLocal(new Date(timestamp).toISOString()));
  }, [timestamp]);

  const onDateLeaveFocus = () => {
    if (!date) return;
    router.replace(`/record/${date.toDate("").getTime()}`);
  };

  const chartData = walletName ? walletChartData : allWalletsChartData;

  return (
    <div className={"flex gap-4 w-full flex-wrap"}>
      <section className={clsx("flex-1", walletName && "md:max-w-80")}>
        <h2 className={"mb-2 flex items-center gap-1 h-12"}>
          {/* Rendered only after `date` is set on the client (in the effect
              above). DateInput's segments depend on the runtime timezone, so
              rendering it on the server causes a hydration mismatch. */}
          {date && (
            <DateInput
              className={"w-full"}
              granularity="second"
              value={date}
              onChange={setDate}
              onBlur={onDateLeaveFocus}
              size={"sm"}
            />
          )}
          {!walletName && <WalletsOnNowModal data={allWalletsChartData} />}
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
            onClick={() => {
              setWalletName("");
            }}
            onTouchEnd={() => setWalletName("")}
            variant={"bordered"}
          >
            <AiOutlineClose size={18} />
          </Button>
        </section>
      )}
      {chartData.length > 0 && (
        <section
          className={
            walletName
              ? "md:w-[450px] w-full h-[450px]"
              : "md:w-1/2 w-full h-[650px]"
          }
        >
          <WalletPieChart chartData={chartData} className={"mt-12"} />
        </section>
      )}
    </div>
  );
}
