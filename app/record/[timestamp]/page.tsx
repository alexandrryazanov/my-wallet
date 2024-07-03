import React from "react";
import Wallets from "@/components/Wallets";

export default function RecordEditPage({
  params: { timestamp },
}: {
  params: { timestamp: string };
}) {
  return (
    <div className={"flex gap-4 w-full"}>
      <section className={"w-1/2 min-w-[500px"}>
        <h2 className={"mb-2"}>Wallets</h2>
        <div className={"bg-white p-4 rounded-md shadow-md ]"}>
          <Wallets timestamp={timestamp} />
        </div>
      </section>

      <section className={"w-1/2 min-w-[500px min-h-2"}>
        <h2 className={"mb-2"}>Coins</h2>
        <div
          className={"bg-white min-h-40 p-4 rounded-md shadow-md min-w-[500px]"}
        >
          <div />
        </div>
      </section>
    </div>
  );
}
