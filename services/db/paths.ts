import { CoinSymbol, Timestamp, UserUID, WalletName } from "@/types/firebase";

type Ts = Timestamp | number;

/**
 * Single source of truth for every Realtime Database path used in the app.
 *
 * RTDB has no schema and no projections: reading a node returns its whole
 * subtree. So the only lever we have to avoid over-fetching is reading a
 * narrower path. Centralising the paths here keeps those paths consistent and
 * makes a typo a compile error instead of a silent empty read.
 *
 * Data layout:
 *   data/{uid}/{timestamp}/wallets/{walletName}/{coinSymbol} = amount
 *   data/{uid}/{timestamp}/rates/{coinSymbol}               = rate
 *   meta/{uid}/walletNames/{walletName}                     = true  (denormalised index)
 *   meta/{uid}/coinNames/{coinSymbol}                       = true  (denormalised index)
 */
export const dbPaths = {
  user: (uid: UserUID) => `data/${uid}`,
  record: (uid: UserUID, ts: Ts) => `data/${uid}/${ts}`,
  wallets: (uid: UserUID, ts: Ts) => `data/${uid}/${ts}/wallets`,
  wallet: (uid: UserUID, ts: Ts, name: WalletName) =>
    `data/${uid}/${ts}/wallets/${name}`,
  coin: (uid: UserUID, ts: Ts, name: WalletName, symbol: CoinSymbol) =>
    `data/${uid}/${ts}/wallets/${name}/${symbol}`,
  rates: (uid: UserUID, ts: Ts) => `data/${uid}/${ts}/rates`,
  rate: (uid: UserUID, ts: Ts, symbol: CoinSymbol) =>
    `data/${uid}/${ts}/rates/${symbol}`,

  // Denormalised indexes of every name ever used, so the "add" dropdowns can be
  // populated without reading the user's whole history. Each index node is
  // `{ built: true, names: { <name>: true } }`: `built` marks a full backfill
  // from history, so a stray flag written by an add can't be mistaken for a
  // complete index (which would suppress the one-time backfill).
  walletNames: (uid: UserUID) => `meta/${uid}/walletNames`,
  walletNameFlag: (uid: UserUID, name: WalletName) =>
    `meta/${uid}/walletNames/names/${name}`,
  coinNames: (uid: UserUID) => `meta/${uid}/coinNames`,
  coinNameFlag: (uid: UserUID, symbol: CoinSymbol) =>
    `meta/${uid}/coinNames/names/${symbol}`,
} as const;
