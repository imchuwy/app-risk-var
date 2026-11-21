export type PriceHistory = Map<string, Map<string, number>>;

export function parsePriceHistory(csv: string): PriceHistory {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  if (header !== 'tradedate,instrumentsymbol,midprice') {
    throw new Error('The pricing file has unexpected columns.');
  }

  const prices: PriceHistory = new Map();
  for (const row of rows) {
    const [rawDate, rawSymbol, rawPrice, extra] = row.split(',');
    const date = rawDate?.trim();
    const symbol = rawSymbol?.trim();
    const price = Number(rawPrice);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !symbol || extra !== undefined ||
        !Number.isFinite(price) || price <= 0) {
      throw new Error('The pricing file contains an invalid observation.');
    }

    let history = prices.get(symbol);
    if (!history) {
      history = new Map();
      prices.set(symbol, history);
    }
    if (history.has(date)) {
      throw new Error('The pricing file contains duplicate observations.');
    }
    history.set(date, price);
  }
  if (!prices.size) throw new Error('The pricing file has no observations.');
  return prices;
}
