"use client";

import React, { useEffect, useMemo } from "react";
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
import { Button } from "@nextui-org/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { COLORS } from "@/config/colors";
import { toast } from "react-toastify";
import useConfirmation from "@/hooks/useConfirmation";
import { useCurrentUser, useUserData } from "@/hooks/db";
import { removeRecord } from "@/services/db/walletRepository";
import { walletNamesFrom, walletsTableData } from "@/services/db/transforms";
import ComparingValue from "@/components/ComparingValue";
import { renderCell } from "@/services/ui";

const SummaryTable = () => {
  const { showConfirmationPopup } = useConfirmation();
  const router = useRouter();

  const user = useCurrentUser();
  const { data, isLoading } = useUserData();

  const columnNames = useMemo(() => walletNamesFrom(data), [data]);
  const rows = useMemo(() => walletsTableData(data), [data]);

  // Warm the record routes ahead of the click. Navigation goes through
  // `router.push` (NextUI's onRowAction), which — unlike <Link> — doesn't
  // prefetch, so without this the first click on a row waits for a cold RSC
  // fetch before anything (even the loading spinner) shows.
  useEffect(() => {
    rows.forEach((row) => router.prefetch(`/record/${row.key}`));
  }, [rows, router]);

  const onRemove = async (timestamp: string | number) => {
    if (!user) return;

    try {
      await removeRecord(user.uid, timestamp);
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
              <TableCell>
                {columnKey === "actions" ? (
                  <Button
                    isIconOnly
                    variant={"light"}
                    className={"hover:border-danger hover:border-1"}
                    onClick={showConfirmationPopup(
                      () => onRemove(row.key),
                      `Remove record of ${row.date}?`,
                    )}
                  >
                    <FaRegTrashCan color={COLORS.FUCHSIA} />
                  </Button>
                ) : (
                  <div className={"relative w-fit"}>
                    <span
                      className={clsx(columnKey === "total" && "font-bold")}
                    >
                      {renderCell(row, columnKey)}
                    </span>
                    <ComparingValue
                      current={getKeyValue(row, columnKey)}
                      prev={getKeyValue(rows[rowNumber - 1], columnKey)}
                    />
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </NextUITable>
  );
};

export default SummaryTable;
