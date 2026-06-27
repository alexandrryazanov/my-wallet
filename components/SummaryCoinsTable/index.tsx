"use client";

import React, { useMemo } from "react";
import {
  getKeyValue,
  Table as NextUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import { useUserData } from "@/hooks/db";
import { coinNamesFrom, coinsTableData } from "@/services/db/transforms";
import ComparingValue from "@/components/ComparingValue";
import { renderCell } from "@/services/ui";

const SummaryCoinsTable = () => {
  const router = useRouter();

  const { data, isLoading } = useUserData();

  const columnNames = useMemo(() => coinNamesFrom(data), [data]);
  const rows = useMemo(() => coinsTableData(data), [data]);

  const columns = columnNames.map((column) => ({ key: column, label: column }));
  const columnsWithService = [
    { key: "date", label: "Date" },
    ...columns,
    { key: "total", label: "TOTAL" },
  ];

  if (isLoading)
    return (
      <div className={"w-full flex justify-center"}>
        <Spinner color={"white"} />
      </div>
    );

  return (
    <NextUITable
      isStriped
      aria-label="Coins summary"
      selectionMode="single"
      color={"danger"}
      onRowAction={(key) => {
        router.push(`/record/${key}`);
      }}
    >
      <TableHeader columns={columnsWithService}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent={"No records yet"}>
        {rows.map((row, rowNumber) => (
          <TableRow key={row.key} className={"cursor-pointer"}>
            {(columnKey) => (
              <TableCell className={"h-[56px]"}>
                <div className={"relative w-fit "}>
                  <span className={clsx(columnKey === "total" && "font-bold")}>
                    {renderCell(row, columnKey)}
                  </span>
                  <ComparingValue
                    current={getKeyValue(row, columnKey)}
                    prev={getKeyValue(rows[rowNumber - 1], columnKey)}
                  />
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </NextUITable>
  );
};

export default SummaryCoinsTable;
