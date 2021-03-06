
import {Candle, PriceHistory} from "../../src/types/PriceHistory";
import {GdaxPriceHistoryAdapter} from "../../src/sources/gdax/GdaxPriceHistorySource";

describe("Price History", () => {
  it("ctor", () => {

    const items = [];
    items.push(new Candle(100000, 10, 20, 0, 0, 0));
    const h = new PriceHistory(items);
    expect(h.Items).toBeTruthy();
  });
});

describe("Parses price history data to candles", () => {
  it("parses", () => {
    const response = "[" +
        "[1510269120,7110.01,7110.02,7110.01,7110.02,3.489994839999999]," +
        "[1510269060,7110,7110.01,7110.01,7110,4.042463090000001]" +
        "]";
    const json = JSON.parse(response);
    const adapter = new GdaxPriceHistoryAdapter();
    const priceHistory = adapter.convert(json);

    expect(priceHistory).toBeTruthy();
    expect(priceHistory.Items).toBeTruthy();
    expect(priceHistory.Items.length).toBeGreaterThan(0);

    const item1 = priceHistory.Items[0];
    expect(item1.Time).toEqual(1510269120);
  });
});
