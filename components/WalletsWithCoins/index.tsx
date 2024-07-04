"use client";

import React, { useState } from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import { format } from "date-fns";

interface WalletsWithCoinsProps {
  timestamp: number;
}

export default function WalletsWithCoins({ timestamp }: WalletsWithCoinsProps) {
  const [walletName, setWalletName] = useState("");

  return (
    <div className={"flex gap-4 w-full"}>
      <section className={`${walletName ? "w-1/2" : "w-full"} min-w-[500px`}>
        <h2 className={"mb-2"}>
          Wallets on {format(new Date(timestamp), "dd.MM.yyyy")}
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
