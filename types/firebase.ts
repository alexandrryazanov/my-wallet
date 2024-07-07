export interface FirebaseStructure {
  data: FirebaseData;
}

export interface UserDataOnDate {
  wallets?: Wallets;
  rates?: Rates;
}

export type UserUID = string;
export type Timestamp = string;
export type UserData = Record<Timestamp, UserDataOnDate>;
export type FirebaseData = Record<UserUID, UserData>;
export type CoinSymbol = string;
export type Rates = Record<CoinSymbol, number>;
export type WalletName = string;
export type Wallets = Record<WalletName, Record<CoinSymbol, number>>;
