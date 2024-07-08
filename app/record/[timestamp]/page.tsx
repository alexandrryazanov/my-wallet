import React from "react";
import WalletsWithCoins from "@/components/WalletsWithCoins";

export default function RecordEditPage({
  params: { timestamp },
}: {
  params: { timestamp: string };
}) {
  return <WalletsWithCoins timestamp={+timestamp} />;
}
