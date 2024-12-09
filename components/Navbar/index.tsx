"use client";

import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { RiMenuFill } from "react-icons/ri";
import { COLORS } from "@/config/colors";
import { FiLogIn } from "react-icons/fi";
import { NAV_ITEMS } from "@/components/Navbar/constants";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();

  const onSignOut = async () => {
    const auth = getAuth();
    await auth.signOut();
  };

  return (
    <Navbar maxWidth={"full"} isBordered className={"bg-black"}>
      <NavbarContent className="flex gap-4" justify="start">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button variant={"light"} isIconOnly className={"text-2xl"}>
                <RiMenuFill color={COLORS.WHITE} />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            className="w-[340px]"
            itemClasses={{ base: "gap-4" }}
            onAction={(key) => router.push(String(key))}
          >
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
        <Link href={"/summary"} className="font-bold text-white">
          M Y · W A L L E T
        </Link>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            variant={"light"}
            isIconOnly
            className={"text-2xl"}
            onClick={onSignOut}
          >
            <FiLogIn color={COLORS.WHITE} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
