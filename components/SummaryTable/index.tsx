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
import {
  child,
  getDatabase,
  onValue,
  ref,
  remove,
  Unsubscribe,
} from "@firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAllWalletNames, getTableData } from "@/services/firebase";
import { Spinner } from "@nextui-org/spinner";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { formatValue } from "@/services/calc";
import { Button } from "@nextui-org/button";
import { FaRegTrashCan } from "react-icons/fa6";
import { COLORS } from "@/config/colors";
import { toast } from "react-toastify";

const renderCell = <T,>(item: T, columnKey: string | number) => {
  const value = getKeyValue(item, columnKey);
  if (!value) return "-";
  if (typeof value === "number") return formatValue(value);
  return value;
};

const SummaryTable = () => {
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

  const onRemove = (timestamp: string | number) => {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const dbRef = ref(getDatabase());

      const coinPath = `data/${auth.currentUser.uid}/${timestamp}`;

      remove(child(dbRef, coinPath));

      toast.success(`Record has been removed!`);
    } catch (e) {
      toast.error("Could not remove record\n" + String(e));
    }
  };

  const columns = columnNames.map((column) => ({ key: column, label: column }));
  const columnsWithService = [
    { key: "date", label: "Date" },
    ...columns,
    { key: "total", label: "TOTAL" },
    { key: "actions", label: "" },
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
      aria-label="Summary"
      selectionMode="single"
      color={"danger"}
      onRowAction={(key) => router.push(`/record/${key}`)}
    >
      <TableHeader columns={columnsWithService}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows} emptyContent={"No records yet"}>
        {(row) => (
          <TableRow key={row.key} className={"cursor-pointer"}>
            {(columnKey) => (
              <TableCell className={clsx(columnKey === "total" && "font-bold")}>
                {columnKey === "actions" ? (
                  <Button
                    isIconOnly
                    variant={"light"}
                    className={"hover:border-danger hover:border-1"}
                    onClick={() => onRemove(row.key)}
                  >
                    <FaRegTrashCan color={COLORS.FUCHSIA} />
                  </Button>
                ) : (
                  renderCell(row, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};

export default SummaryTable;
