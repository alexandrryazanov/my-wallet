const loadRateFromCryptoCompare = async (symbols: string[], markupPercent = 4) => {
  const fsyms = symbols.map((s) => s.toUpperCase()).join(',');
  const tsyms = 'RUB';

  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${tsyms}`
    );
    const data = await response.json();

    const result: Record<string, number> = {};

    for (const symbol of symbols) {
      const upper = symbol.toUpperCase();
      const mid = data[upper]?.RUB;
      if (!mid) continue;

      const ask = mid * (1 + markupPercent / 100);
      result[upper] = +ask.toFixed(2);
    }

    return result;
  } catch (e) {
    return {};
  }
};

const loadRatesFromBinance = async (symbols: string[], quote: string = 'RUB') => {
  const results: Record<string, number> = {};

  for (const symbol of symbols) {
    const pair = `${symbol.toUpperCase()}${quote.toUpperCase()}`;

    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/bookTicker?symbol=${pair}`
      );

      if (!res.ok) continue;

      const data = await res.json();
      results[symbol.toUpperCase()] = +Number(data.askPrice).toFixed(2);
    } catch {
      continue;
    }
  }

  return results;
}

export const loadRatesFromProvider = (symbols: string[])  => loadRateFromCryptoCompare(symbols)
