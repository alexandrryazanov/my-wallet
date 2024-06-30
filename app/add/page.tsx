import React from "react";
import Wallets from "@/components/Wallets";

export default function AddPage() {
  return (
    <div className={"flex gap-4 h-full"}>
      <section
        className={
          "bg-white w-1/2 h-full p-4 rounded-md shadow-md min-w-[500px]"
        }
      >
        <Wallets />
      </section>
      <section
        className={
          "bg-white w-1/2 h-full p-4 rounded-md shadow-md min-w-[500px]"
        }
      >
        Coins
      </section>
    </div>
  );
}
