"use client";

import React from "react";
import {
  Table as NextUITable,
  getKeyValue,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

const rows = [
  {
    key: "1",
    date: "20.04.2023",
    kaspi: 20,
    freedom: "-",
    binance: 860,
    meta: 740,
    brave: "-",
    "t-inv": 260,
    t: 160,
    sber: 70,
    alfa: 1550,
    cash: 75,
    total: 3735,
  },
  {
    key: "2",
    date: "20.04.2023",
    kaspi: 20,
    freedom: "-",
    binance: 860,
    meta: 740,
    brave: "-",
    "t-inv": 260,
    t: 160,
    sber: 70,
    alfa: 1550,
    cash: 75,
    total: 3735,
  },
];

const columns = [
  { label: "Date", key: "date" },
  { label: "Kaspi", key: "kaspi" },
  { label: "Freedom", key: "freedom" },
  { label: "Binance", key: "binance" },
  { label: "Meta", key: "meta" },
  { label: "Brave", key: "brave" },
  { label: "T-Inv", key: "t-inv" },
  { label: "T", key: "t" },
  { label: "Sber", key: "sber" },
  { label: "Alfa", key: "alfa" },
  { label: "Cash", key: "cash" },
  { label: "TOTAL", key: "total" },
];

const Table = () => {
  return (
    <NextUITable aria-label="Spendings">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};

export default Table;
