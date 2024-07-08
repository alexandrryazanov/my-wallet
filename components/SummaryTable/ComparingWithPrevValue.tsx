import { formatValue } from "@/services/calc";
import clsx from "clsx";
import React from "react";

const ComparingWithPrevValue = ({
  current,
  prev,
}: {
  current: number | string;
  prev: number | string;
}) => {
  if (
    !current ||
    !prev ||
    typeof current !== "number" ||
    typeof prev !== "number"
  )
    return null;
  const value = current - prev;
  const absValue = Math.abs(value);
  const formattedValue = (value >= 0 ? "+" : "-") + formatValue(absValue);

  return (
    <span
      className={clsx("absolute text-[8px] -right-4 -top-3", {
        ["text-success-900"]: value > 0,
        ["text-danger"]: value < 0,
      })}
    >
      {value === 0 ? "-" : formattedValue}
    </span>
  );
};

export default ComparingWithPrevValue;
