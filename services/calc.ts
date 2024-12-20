import { CoinSymbol, Rates, Wallets } from "@/types/firebase";

// { Binance: 100, Bybit: 10, total: 110 }
export function calcWalletValues(wallets: Wallets, rates: Rates) {
  const walletResults = Object.entries(wallets || {}).reduce<
    Record<string, number>
  >((acc, [walletName, values]) => {
    const walletValue = Object.entries(values).reduce(
      (acc, [coinSymbol, value]) =>
        acc + value * (rates[coinSymbol as CoinSymbol] || 1),
      0,
    );

    acc[walletName] = (acc[walletName] || 0) + walletValue;
    return acc;
  }, {});

  const total = Object.values(walletResults).reduce(
    (acc, value) => acc + value,
    0,
  );

  return { ...walletResults, total };
}

export function calcCoinValues(wallets: Wallets, rates: Rates) {
  const coinResults = Object.values(wallets).reduce((acc, wallet) => {
    Object.entries(wallet).forEach(([coin, value]) => {
      acc[coin] = (acc[coin] || 0) + value * (rates[coin as CoinSymbol] || 1);
    });

    return acc;
  }, {});

  const total = Object.values(coinResults).reduce(
    (acc, value) => acc + value,
    0,
  );

  return { ...coinResults, total };
}

export const formatValue = (x: number, full?: boolean): string => {
  const [int] = x.toString().split(".");
  if (int.length <= 3 || full) return x.toLocaleString();
  if (int.length > 12) return "999B+";
  if (int.length > 9) return +(+int / 10 ** 9).toFixed(3) + "B";
  if (int.length > 6) return +(+int / 10 ** 6).toFixed(2) + "M";
  if (int.length > 3) return +(+int / 10 ** 3).toFixed(0) + "K";
  return x.toLocaleString();
};
