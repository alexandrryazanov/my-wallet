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
        <div className={"bg-white p-4 rounded-md shadow-md ]"}>
          <Wallets timestamp={timestamp} onChange={setWalletName} />
        </div>
      </section>

      {walletName && (
        <section className={"w-full min-w-[500px min-h-2"}>
          <h2 className={"mb-2"}>Coins of {walletName}</h2>
          <div
            className={
              "bg-white min-h-40 p-4 rounded-md shadow-md min-w-[500px]"
            }
          >
            <Coins timestamp={timestamp} walletName={walletName} />
          </div>
        </section>
      )}
    </div>
  );
}
