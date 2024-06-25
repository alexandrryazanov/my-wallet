import { RiNftFill } from "react-icons/ri";
import React from "react";
import { FaPeopleArrows } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { LiaFileContractSolid } from "react-icons/lia";
import { COLORS } from "@/config/colors";

export const NAV_ITEMS = [
  {
    title: "Items",
    path: "/items",
    icon: <RiNftFill size={24} color={COLORS.SOFT_PURPLE} />,
    description: "All available items with collections, partners, etc.",
  },
  {
    title: "Partners",
    path: "/partners",
    icon: <FaPeopleArrows size={24} color={COLORS.FUCHSIA} />,
    description: "All connected to LPT partners. API keys, permissions, etc.",
  },
  {
    title: "Users",
    path: "/users",
    icon: <LuUsers size={24} color={COLORS.MINT_GREEN} />,
    description:
      "All connected to LPT users. Blocking, claimed items, addresses, etc.",
  },
  {
    title: "Contracts",
    path: "/contracts",
    icon: <LiaFileContractSolid size={24} color={COLORS.MID_YELLOW} />,
    description: "Lukso contracts. Deploy, verification, metadata, etc.",
  },
];
