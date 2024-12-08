import { getKeyValue } from "@nextui-org/react";
import { formatValue } from "@/services/calc";

export const renderCell = <T>(item: T, columnKey: string | number) => {
  const value = getKeyValue(item, columnKey);
  if (!value) return "-";
  if (typeof value === "number") return formatValue(value);
  return value;
};
