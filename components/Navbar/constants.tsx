import React from "react";
import { COLORS } from "@/config/colors";
import { IoAddCircle, IoWalletOutline } from "react-icons/io5";
import { CiBitcoin } from "react-icons/ci";

export const NAV_ITEMS = [
  {
    title: "Wallets summary",
    path: "/summary",
    icon: <IoWalletOutline size={24} color={COLORS.FUCHSIA} />,
    description: "Summary for all wallets",
  },
  {
    title: "Coins summary",
    path: "/summary/coins",
    icon: <CiBitcoin size={24} color={COLORS.FUCHSIA} />,
    description: "Summary for all coins",
  },
  {
    title: "Add record",
    path: `/record/${new Date().getTime()}`,
    icon: <IoAddCircle size={24} color={COLORS.MINT_GREEN} />,
    description: "Add a new record to wallets",
  },
];
