import { RiNftFill } from "react-icons/ri";
import React from "react";
import { COLORS } from "@/config/colors";
import { IoAddCircle } from "react-icons/io5";
import { ImTable } from "react-icons/im";

export const NAV_ITEMS = [
  {
    title: "Summary",
    path: "/summary",
    icon: <ImTable size={24} color={COLORS.FUCHSIA} />,
    description: "Summary for all wallets",
  },
  {
    title: "Add record",
    path: "/add",
    icon: <IoAddCircle size={24} color={COLORS.MINT_GREEN} />,
    description: "Add a new record to wallets",
  },
];
