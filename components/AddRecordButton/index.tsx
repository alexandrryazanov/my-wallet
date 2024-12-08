"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { IoAddCircle } from "react-icons/io5";
import { COLORS } from "@/config/colors";

const AddRecordButton = () => {
  const router = useRouter();

  return (
    <div className={"w-full flex justify-center my-6"}>
      <Button
        color={"primary"}
        onClick={() => router.push(`/record/${new Date().getTime()}`)}
      >
        <IoAddCircle size={20} color={COLORS.MINT_GREEN} className={"mr-1"} />{" "}
        Add record
      </Button>
    </div>
  );
};

export default AddRecordButton;
