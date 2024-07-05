"use client";

import React, { useEffect, useState } from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import { DateInput } from "@nextui-org/date-input";
import { DateValue, parseAbsoluteToLocal } from "@internationalized/date";
import { useRouter } from "next/navigation";

interface WalletsWithCoinsProps {
  timestamp: number;
}

export default function WalletsWithCoins({ timestamp }: WalletsWithCoinsProps) {
  const router = useRouter();
  const [walletName, setWalletName] = useState("");
  const [date, setDate] = React.useState<DateValue>(
    parseAbsoluteToLocal("2021-01-01T00:00:00Z"),
  );

  useEffect(() => {
    setDate(parseAbsoluteToLocal(new Date(timestamp).toISOString()));
  }, [timestamp]);

  const onDateLeaveFocus = () => {
    router.replace(`/record/${date.toDate("").getTime()}`);
  };

  return (
    <div className={"flex gap-4 w-full"}>
      <section className={`${walletName ? "w-1/2" : "w-full"} min-w-[500px`}>
        <h2 className={"mb-2"}>
          Wallets on
          <DateInput
            className={"max-w-sm my-4"}
            granularity="second"
            label="Date and time"
            value={date}
            onChange={setDate}
            onBlur={onDateLeaveFocus}
          />
        </h2>
        <Wallets timestamp={timestamp} onChange={setWalletName} />
      </section>

      {walletName && (
        <section className={"w-full min-w-[500px min-h-2"}>
          <h2 className={"mb-2"}>Coins of {walletName}</h2>
          <Coins timestamp={timestamp} walletName={walletName} />
        </section>
      )}
    </div>
  );
}
