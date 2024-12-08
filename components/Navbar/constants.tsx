import React from "react";
import { COLORS } from "@/config/colors";
import { IoAddCircle, IoWalletOutline } from "react-icons/io5";
import { CiBitcoin } from "react-icons/ci";
import { FaRegChartBar } from "react-icons/fa6";

export const NAV_ITEMS = [
  {
    title: "Wallets summary",
    path: "/summary",
    icon: <IoWalletOutline size={24} color={COLORS.MID_YELLOW} />,
    description: "Summary for all wallets",
  },
  {
    title: "Coins summary",
    path: "/summary/coins/table",
    icon: <CiBitcoin size={24} color={COLORS.FUCHSIA} />,
    description: "Summary for all coins",
  },
  {
    title: "Coins chart",
    path: "/summary/coins/chart",
    icon: <FaRegChartBar size={24} color={COLORS.FUCHSIA} />,
    description: "Chart for all coins",
  },
  {
    title: "Add record",
    path: `/record/${new Date().getTime()}`,
    icon: <IoAddCircle size={24} color={COLORS.MINT_GREEN} />,
    description: "Add a new record to wallets",
  },
];
