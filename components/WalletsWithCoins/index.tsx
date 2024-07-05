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
    <div className={"flex gap-4 w-full md:flex-nowrap flex-wrap"}>
      <section
        className={`md:${walletName ? "w-1/2" : "w-full"} w-full min-w-[500px`}
      >
        <h2 className={"mb-2 flex items-center gap-1 h-12"}>
          <span className={"min-w-24"}>Wallets on</span>
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
        <section className={"w-full min-w-[500px]"}>
          <Coins timestamp={timestamp} walletName={walletName} />
        </section>
      )}
    </div>
  );
}
