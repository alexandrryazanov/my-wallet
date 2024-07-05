import { CoinSymbol, Rates, Wallets } from "@/types/firebase";

// { Binance: 100, Bybit: 10, total: 110 }
export function calcWalletValues(wallets: Wallets, rates: Rates) {
  const walletResults = Object.entries(wallets).reduce<Record<string, number>>(
    (acc, [walletName, values]) => {
      const walletValue = Object.entries(values).reduce(
        (acc, [coinSymbol, value]) =>
          acc + value * (rates[coinSymbol as CoinSymbol] || 1),
        0,
      );

      acc[walletName] = (acc[walletName] || 0) + walletValue;
      return acc;
    },
    {},
  );

  const total = Object.values(walletResults).reduce(
    (acc, value) => acc + value,
    0,
  );

  return { ...walletResults, total };
}
