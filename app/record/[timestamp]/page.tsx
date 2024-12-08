import React from "react";
import WalletsWithCoins from "@/components/WalletsWithCoins";

export default async function RecordEditPage({
  params,
}: {
  params: Promise<{ timestamp: string }>;
}) {
  const timestamp = (await params).timestamp;
  return <WalletsWithCoins timestamp={+timestamp} />;
}
