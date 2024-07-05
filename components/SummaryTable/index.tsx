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
} from "@nextui-org/table";
import { getDatabase, onValue, ref, Unsubscribe } from "@firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllWalletNames, getTableData } from "@/services/firebase";
import { Spinner } from "@nextui-org/spinner";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { formatValue } from "@/services/calc";

const renderCell = <T,>(item: T, columnKey: string | number) => {
  const value = getKeyValue(item, columnKey);
  if (!value) return "-";
  if (typeof value === "number") return formatValue(value);
  return value;
};

const SummaryTable = () => {
  const router = useRouter();

  const [rows, setRows] = useState<Record<string, string | number>[]>([]);
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
        setColumnNames(getAllWalletNames(userSnapshot));
        setRows(getTableData(userSnapshot));
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
      aria-label="Spendings"
      selectionMode="single"
      onRowAction={(key) => router.push(`/record/${key}`)}
    >
      <TableHeader columns={columnsWithService}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell className={clsx(columnKey === "total" && "font-bold")}>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};

export default SummaryTable;
