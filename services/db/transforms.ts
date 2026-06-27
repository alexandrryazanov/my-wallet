import { format } from "date-fns";
import { calcCoinValues, calcWalletValues } from "@/services/calc";
import { UserData, UserDataOnDate } from "@/types/firebase";
import { CoinsForChartData } from "@/types/coins";

export type TableRow = Record<string, number | string>;

/**
 * Pure transforms over the RTDB payload. They take already-loaded plain data
 * (never a DataSnapshot) so they stay easy to test and reuse, and so the IO
 * layer is the only place that talks to Firebase.
 *
 * Aggregations (amount * rate, sums across wallets/coins) live here on purpose:
 * Realtime Database cannot compute them server-side, so this is the only place
 * they can happen.
 */

/** Distinct wallet names across the whole history. */
export function walletNamesFrom(data: UserData): string[] {
  return [
    ...new Set(
      Object.values(data).reduce<string[]>(
        (acc, onDate: UserDataOnDate) => [
          ...acc,
          ...Object.keys(onDate?.wallets || {}),
        ],
        [],
      ),
    ),
  ];
}

/** Distinct coin symbols held in wallets across the history (summary columns). */
export function coinNamesFrom(data: UserData): string[] {
  return [
    ...new Set(
      Object.values(data).reduce<string[]>((acc, onDate) => {
        Object.values(onDate?.wallets || {}).forEach((coins) =>
          acc.push(...Object.keys(coins || {})),
        );
        return acc;
      }, []),
    ),
  ];
}

/**
 * Distinct coin symbols ever used — wallet coins UNION recorded rate keys.
 * Built on `coinNamesFrom` so the "what counts as a coin name" rule lives in
 * one place; this just additionally includes symbols that only ever had a rate.
 */
export function coinSymbolsFrom(data: UserData): string[] {
  const symbols = new Set<string>(coinNamesFrom(data));

  Object.values(data).forEach((onDate) =>
    Object.keys(onDate?.rates || {}).forEach((symbol) => symbols.add(symbol)),
  );

  return [...symbols];
}

/** One row per recorded date, each wallet column holding its total value. */
export function walletsTableData(data: UserData): TableRow[] {
  return Object.entries(data).map(([timestamp, onDate]) => ({
    key: timestamp,
    date: format(new Date(+timestamp), "dd.MM.yyyy"),
    ...calcWalletValues(onDate?.wallets || {}, onDate?.rates || {}),
  }));
}

/** One row per recorded date, each coin column holding its total value. */
export function coinsTableData(data: UserData): TableRow[] {
  return Object.entries(data).map(([timestamp, onDate]) => ({
    key: timestamp,
    date: format(new Date(+timestamp), "dd.MM.yyyy"),
    ...calcCoinValues(onDate?.wallets || {}, onDate?.rates || {}),
  }));
}

/** Per-coin totals for a single record, summed across all of its wallets. */
export function recordCoinTotals(record: UserDataOnDate): CoinsForChartData[] {
  const { wallets, rates } = record;

  const byCoin = Object.values(wallets || {}).reduce<
    Record<string, { amount: number; total: number; rate: number }>
  >((acc, coins) => {
    Object.entries(coins || {}).forEach(([symbol, amount]) => {
      acc[symbol] = {
        rate: rates?.[symbol] || 1,
        amount: (acc[symbol]?.amount || 0) + amount,
        total: (acc[symbol]?.total || 0) + amount * (rates?.[symbol] || 1),
      };
    });
    return acc;
  }, {});

  return Object.entries(byCoin).map(([symbol, { amount, total, rate }]) => ({
    symbol,
    amount,
    rate,
    total,
  }));
}

/** Coin rows (amount, rate, total) for one wallet on one date. */
export function walletCoinRows(
  coins: Record<string, number>,
  rates: Record<string, number>,
): { symbol: string; amount: number; rate: number; total: number }[] {
  return Object.entries(coins).map(([symbol, amount]) => ({
    symbol,
    amount,
    rate: rates[symbol] || 1,
    total: Math.ceil((rates[symbol] || 1) * amount),
  }));
}
