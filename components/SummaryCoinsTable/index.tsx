"use client";

import React, { useEffect, useState } from "react";
import {
  getKeyValue,
  Table as NextUITable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { getDatabase, onValue, ref, Unsubscribe } from "@firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllCoinNames, getCoinsTableData } from "@/services/firebase";
import { Spinner } from "@nextui-org/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

import ComparingValue from "@/components/ComparingValue";
import { renderCell } from "@/services/ui";

const SummaryCoinsTable = () => {
  const router = useRouter();

  const [rows, setRows] = useState<Record<string, number | string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [columnNames, setColumnNames] = useState<string[]>([]);

  useEffect(() => {
    let unsubscribeDb: Unsubscribe | null;
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const db = getDatabase();
      const userRef = ref(db, `data/${user.uid}`);

      unsubscribeDb = onValue(userRef, async (userSnapshot) => {
        setIsLoading(true);
        setColumnNames(getAllCoinNames(userSnapshot));
        setRows(getCoinsTableData(userSnapshot));
        setIsLoading(false);
      });
    });

    return () => {
      unsubscribeDb?.();
      unsubscribeAuth();
    };
  }, []);

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
