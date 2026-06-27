import {
  DataSnapshot,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  Unsubscribe,
  update,
} from "@firebase/database";
import { dbPaths } from "@/services/db/paths";
import { walletNamesFrom, coinSymbolsFrom } from "@/services/db/transforms";
import {
  CoinSymbol,
  Rates,
  UserData,
  UserDataOnDate,
  UserUID,
  WalletName,
  Wallets,
} from "@/types/firebase";

type Ts = string | number;

const db = () => getDatabase();
const node = (path: string) => ref(db(), path);

const flagMap = (names: string[]): Record<string, true> =>
  Object.fromEntries(names.map((name) => [name, true as const]));

/** Shape of a denormalised name index: see `dbPaths` for the rationale. */
type NameIndex = { built?: boolean; names?: Record<string, true> };
const builtIndex = (names: string[]): NameIndex => ({
  built: true,
  names: flagMap(names),
});

/**
 * Fire-and-forget maintenance of the denormalised `meta/{uid}` indexes.
 *
 * The indexes are an optimisation, not a source of truth. The security rules
 * live in the Firebase console (not in this repo), so writing to `meta/` may be
 * denied. A denied/failed index write must never break a real data write or a
 * read, so it is always best-effort and the readers fall back to history.
 */
function bestEffort(run: () => Promise<unknown>): void {
  run().catch(() => {});
}

// --- Subscriptions (live) ----------------------------------------------------

/**
 * Subscribes to a value and hands the parsed payload to `onData`. Returns the
 * Firebase `Unsubscribe` so every caller (hooks) can tear the listener down —
 * the previous hand-rolled subscriptions leaked because they never did.
 */
function subscribe<T>(
  path: string,
  parse: (snapshot: DataSnapshot) => T,
  onData: (value: T) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onValue(
    node(path),
    (snapshot) => onData(parse(snapshot)),
    onError,
  );
}

export function subscribeUserData(
  uid: UserUID,
  onData: (data: UserData) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribe(
    dbPaths.user(uid),
    (snap) => (snap.val() as UserData) || {},
    onData,
    onError,
  );
}

export function subscribeRecord(
  uid: UserUID,
  ts: Ts,
  onData: (record: UserDataOnDate) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribe(
    dbPaths.record(uid, ts),
    (snap) => (snap.val() as UserDataOnDate) || {},
    onData,
    onError,
  );
}

export function subscribeRecordWallets(
  uid: UserUID,
  ts: Ts,
  onData: (wallets: Wallets) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribe(
    dbPaths.wallets(uid, ts),
    (snap) => (snap.val() as Wallets) || {},
    onData,
    onError,
  );
}

export function subscribeWalletCoins(
  uid: UserUID,
  ts: Ts,
  walletName: WalletName,
  onData: (coins: Record<CoinSymbol, number>) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return subscribe(
    dbPaths.wallet(uid, ts, walletName),
    (snap) => (snap.val() as Record<CoinSymbol, number>) || {},
    onData,
    onError,
  );
}

// --- One-shot reads ----------------------------------------------------------

export async function getUserData(uid: UserUID): Promise<UserData> {
  return ((await get(node(dbPaths.user(uid)))).val() as UserData) || {};
}

export async function getRates(uid: UserUID, ts: Ts): Promise<Rates> {
  return ((await get(node(dbPaths.rates(uid, ts)))).val() as Rates) || {};
}

/**
 * Distinct names ever used, for an "add" dropdown.
 *
 * Reads the tiny denormalised index instead of the whole history. Only a
 * `built` index (a completed backfill) is trusted; otherwise the names are
 * derived from history once and the index is backfilled, so a stray flag
 * written by an add before the first backfill can't shadow the real history.
 * The index is append-only ("names ever used") — deleting a wallet/coin keeps
 * it offered so it can be re-added.
 */
async function getNames(
  uid: UserUID,
  indexPath: string,
  deriveFromHistory: (data: UserData) => string[],
): Promise<string[]> {
  try {
    const index = (await get(node(indexPath))).val() as NameIndex | null;
    if (index?.built) return Object.keys(index.names || {});
  } catch {
    // `meta` not readable — derive from history below.
  }

  const names = deriveFromHistory(await getUserData(uid));
  if (names.length) bestEffort(() => set(node(indexPath), builtIndex(names)));
  return names;
}

/** Distinct wallet names for the "add wallet" dropdown. */
export function getWalletNames(uid: UserUID): Promise<string[]> {
  return getNames(uid, dbPaths.walletNames(uid), walletNamesFrom);
}

/** Distinct coin symbols for the "add coin" dropdown. */
export function getCoinNames(uid: UserUID): Promise<string[]> {
  return getNames(uid, dbPaths.coinNames(uid), coinSymbolsFrom);
}

// --- Writes ------------------------------------------------------------------

/**
 * Adds a coin to a wallet. The amount and its rate are written atomically (both
 * live under `data/`, which the app may always write). The coin-name index is
 * updated separately and best-effort, so it can never block adding a coin.
 */
export async function addCoin(
  uid: UserUID,
  ts: Ts,
  walletName: WalletName,
  symbol: CoinSymbol,
  amount: number,
  rate: number,
): Promise<void> {
  await update(ref(db()), {
    [dbPaths.coin(uid, ts, walletName, symbol)]: amount,
    [dbPaths.rate(uid, ts, symbol)]: rate,
  });
  bestEffort(() => set(node(dbPaths.coinNameFlag(uid, symbol)), true));
}

export async function removeCoin(
  uid: UserUID,
  ts: Ts,
  walletName: WalletName,
  symbol: CoinSymbol,
): Promise<void> {
  await remove(node(dbPaths.coin(uid, ts, walletName, symbol)));
}

/** Adds an (empty) wallet to a date and records its name in the index. */
export async function addWallet(
  uid: UserUID,
  ts: Ts,
  walletName: WalletName,
): Promise<void> {
  await set(node(dbPaths.wallet(uid, ts, walletName)), "");
  bestEffort(() => set(node(dbPaths.walletNameFlag(uid, walletName)), true));
}

export async function removeWallet(
  uid: UserUID,
  ts: Ts,
  walletName: WalletName,
): Promise<void> {
  await remove(node(dbPaths.wallet(uid, ts, walletName)));
}

export async function removeRecord(uid: UserUID, ts: Ts): Promise<void> {
  await remove(node(dbPaths.record(uid, ts)));
}
