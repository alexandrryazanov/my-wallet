import { RiNftFill } from "react-icons/ri";
import React from "react";
import { COLORS } from "@/config/colors";

export const NAV_ITEMS = [
  {
    title: "Summary",
    path: "/summary",
    icon: <RiNftFill size={24} color={COLORS.SOFT_PURPLE} />,
    description: "Summary for all wallets",
  },
];
