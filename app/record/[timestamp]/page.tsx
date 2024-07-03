import React from "react";
import Wallets from "@/components/Wallets";
import Coins from "@/components/Coins";
import WalletsWithCoins from "@/components/WalletsWithCoins";

export default function RecordEditPage({
  params: { timestamp },
}: {
  params: { timestamp: string };
}) {
  return <WalletsWithCoins timestamp={+timestamp} />;
}
