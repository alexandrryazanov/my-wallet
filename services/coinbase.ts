// USD price for an arbitrary crypto ticker. No hardcoded coin list: the symbol
// is resolved server-side by each exchange. Tries several keyless, CORS-enabled
// providers in order so it keeps working if one is geo-blocked or misses a coin.
const fetchCryptoUsd = async (symbol: string): Promise<number | null> => {
  // Binance
  try {
    const r = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
    );
    if (r.ok) {
      const price = Number((await r.json()).price);
      if (price) return price;
    }
  } catch {}

  //OKX
  try {
    const r = await fetch(
      `https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`
    );
    if (r.ok) {
      const price = Number((await r.json())?.data?.[0]?.last);
      if (price) return price;
    }
  } catch {}

  // Bybit
  try {
    const r = await fetch(
      `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}USDT`
    );
    if (r.ok) {
      const price = Number((await r.json())?.result?.list?.[0]?.lastPrice);
      if (price) return price;
    }
  } catch {}

  return null;
};

const loadRates = async (
  symbols: string[],
  markupPercent = 0
): Promise<Record<string, number>> => {
  const upper = symbols.map((s) => s.toUpperCase());

  // Fiat rates with RUB as base: rates[X] is how many X make 1 RUB.
  let fiat: Record<string, number> = {};
  try {
    const r = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
    if (r.ok) fiat = (await r.json()).rates || {};
  } catch {}

  const rubPerUsd = fiat.USD ? 1 / fiat.USD : 0;

  const entries = await Promise.all(
    upper.map(async (symbol) => {
      let priceRub: number | null = null;

      if (symbol === 'RUB') {
        priceRub = 1;
      } else if (fiat[symbol]) {
        // fiat currency (USD, EUR, ...)
        priceRub = 1 / fiat[symbol];
      } else if (symbol === 'USDT') {
        // stablecoin: it's the quote currency on the exchanges, so ~1 USD
        priceRub = rubPerUsd || null;
      } else if (rubPerUsd) {
        const usd = await fetchCryptoUsd(symbol);
        if (usd) priceRub = usd * rubPerUsd;
      }

      if (!priceRub) return null;

      const ask = symbol === 'RUB' ? 1 : priceRub * (1 + markupPercent / 100);
      return [symbol, +ask.toFixed(2)] as const;
    })
  );

  return Object.fromEntries(
    entries.filter((e): e is [string, number] => e !== null)
  );
};

export const loadRatesFromProvider = (symbols: string[]) => loadRates(symbols);
