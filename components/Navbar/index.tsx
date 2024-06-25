"use client";

import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
// import Logo from "./logos/lukso_logo.svg";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { RiMenuFill } from "react-icons/ri";
import { COLORS } from "@/config/colors";
import { FiLogIn } from "react-icons/fi";
import { NAV_ITEMS } from "@/components/Navbar/constants";

export default function NavBar() {
  return (
    <Navbar maxWidth={"full"} isBordered className={"bg-primary"}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button variant={"light"} isIconOnly className={"text-2xl"}>
                <RiMenuFill color={COLORS.WHITE} />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu className="w-[340px]" itemClasses={{ base: "gap-4" }}>
            {NAV_ITEMS.map((item) => (
              <DropdownItem
                key={item.path}
                description={item.description}
                startContent={item.icon}
                href={item.path}
              >
                {item.title}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarContent justify="center">
        <p className="font-bold text-white">My wallet</p>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant={"light"} isIconOnly className={"text-2xl"}>
            <FiLogIn color={COLORS.WHITE} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
