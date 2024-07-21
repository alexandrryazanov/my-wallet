export const loadRateFromCoinbase = async (coinSymbol: string) => {
  try {
    const response = await fetch(
      `https://api.coinbase.com/v2/prices/${coinSymbol}-RUB/buy`,
    );

    const responseJson = await response.json();
    return +Number(responseJson.data.amount).toFixed(2);
  } catch (e) {
    return null;
  }
};
