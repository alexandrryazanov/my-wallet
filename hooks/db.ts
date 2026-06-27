"use client";

import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Unsubscribe } from "@firebase/database";
import { toast } from "react-toastify";
import {
  getCoinNames,
  getRates,
  getWalletNames,
  subscribeRecord,
  subscribeRecordWallets,
  subscribeUserData,
  subscribeWalletCoins,
} from "@/services/db/walletRepository";
import {
  recordCoinTotals,
  walletCoinRows,
} from "@/services/db/transforms";
import { UserData, UserDataOnDate } from "@/types/firebase";
import { CoinsForChartData } from "@/types/coins";

/**
 * Data-access hooks. They own the auth + subscription lifecycle so components
 * never touch Firebase directly and every listener is torn down on unmount
 * (the old inline subscriptions leaked). Reads go through the repository; the
 * pure shaping of payloads stays in transforms.
 */

/** `undefined` while auth is resolving, `null` when signed out. */
export function useCurrentUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(getAuth(), setUser), []);

  return user;
}

/** Subscribes a component to a DB value for the current user with cleanup. */
function useSubscription<T>(
  fallback: T,
  start: (uid: string, onData: (value: T) => void) => Unsubscribe,
  // `start` is recreated each render; deps say when to re-subscribe.
  deps: ReadonlyArray<unknown>,
): { data: T; isLoading: boolean } {
  const user = useCurrentUser();
  const [data, setData] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return; // auth still resolving — keep the spinner
    if (user === null) {
      // signed out — drop the previous user's data, stop the spinner
      setData(fallback);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = start(user.uid, (value) => {
      setData(value);
      setIsLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, ...deps]);

  return { data, isLoading };
}

/** Whole history for the current user — needed by the summary views. */
export function useUserData(): { data: UserData; isLoading: boolean } {
  return useSubscription<UserData>(
    {},
    (uid, onData) =>
      subscribeUserData(uid, onData, (e) =>
        toast.error("Error when getting data\n" + String(e)),
      ),
    [],
  );
}

/** A single dated record (wallets + rates). */
export function useRecord(timestamp: number): {
  record: UserDataOnDate;
  isLoading: boolean;
} {
  const { data, isLoading } = useSubscription<UserDataOnDate>(
    {},
    (uid, onData) => subscribeRecord(uid, timestamp, onData),
    [timestamp],
  );
  return { record: data, isLoading: isLoading && !!timestamp };
}

/** Per-coin totals of a record, summed across its wallets (for the chart). */
export function useRecordCoinTotals(timestamp: number): CoinsForChartData[] {
  const { record } = useRecord(timestamp);
  // Memoised on `record`, which only changes identity on a new subscription
  // emission — so unrelated parent re-renders don't rebuild the array (and
  // re-fire consumers that use it as an effect dependency).
  return useMemo(() => recordCoinTotals(record), [record]);
}

/** Wallet names present on a single date (the list shown for that record). */
export function useRecordWallets(timestamp: number): {
  walletNames: string[];
  isLoading: boolean;
} {
  const { data, isLoading } = useSubscription(
    {} as Record<string, unknown>,
    (uid, onData) => subscribeRecordWallets(uid, timestamp, onData),
    [timestamp],
  );
  return { walletNames: Object.keys(data), isLoading };
}

/** Coins of one wallet on one date, joined with that date's rates. */
export function useWalletCoins(
  timestamp: number,
  walletName: string,
): {
  coins: { symbol: string; amount: number; rate: number; total: number }[];
  isLoading: boolean;
} {
  const user = useCurrentUser();
  const [coins, setCoins] = useState<
    { symbol: string; amount: number; rate: number; total: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !timestamp || !walletName) return;

    let active = true;
    setIsLoading(true);
    const unsubscribe = subscribeWalletCoins(
      user.uid,
      timestamp,
      walletName,
      async (amounts) => {
        try {
          const rates = await getRates(user.uid, timestamp);
          // The rates fetch is async: bail if we re-subscribed or unmounted
          // while it was in flight, so we never write stale coins.
          if (!active) return;
          setCoins(walletCoinRows(amounts, rates));
        } catch (e) {
          if (active) toast.error("Could not get rates\n" + String(e));
        } finally {
          // Always clear the spinner, even if rates failed, so the coins list
          // can't hang in a perpetual loading state.
          if (active) setIsLoading(false);
        }
      },
      (e) => toast.error("Could not get coins\n" + String(e)),
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, timestamp, walletName]);

  return { coins, isLoading };
}

/** Distinct wallet names ever used — for the "add wallet" dropdown. */
export function useWalletNames(): string[] {
  return useNameIndex(getWalletNames, "Could not get existed wallets");
}

/** Distinct coin symbols ever used — for the "add coin" dropdown. */
export function useCoinNames(): string[] {
  return useNameIndex(getCoinNames, "Could not get existed coins");
}

function useNameIndex(
  load: (uid: string) => Promise<string[]>,
  errorMessage: string,
): string[] {
  const user = useCurrentUser();
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    load(user.uid)
      .then((list) => {
        if (!cancelled) setNames(list);
      })
      .catch((e) => toast.error(errorMessage + "\n" + String(e)));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return names;
}
