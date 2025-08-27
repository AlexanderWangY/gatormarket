import { LSMR } from "./index.js";
import { expect, test, describe } from "vitest";

describe("LSMR Tests", () => {
  test("LSMR Exists", () => {
    expect(LSMR).toBeDefined();
  });

  test("Initial Prices", () => {
    const qYes = 0.0;
    const qNo = 0.0;
    const b = 100.0;

    const { priceYes, priceNo } = LSMR.price(qYes, qNo, b);

    expect(priceYes).toBe(0.5);
    expect(priceNo).toBe(0.5);
  });

  test("Prices after some shares bought", () => {
    const qYes = 50.0;
    const qNo = 0.0;
    const b = 100.0;

    const { priceYes, priceNo } = LSMR.price(qYes, qNo, b);

    expect(priceYes).toBeGreaterThan(0.5);
    expect(priceNo).toBeLessThan(0.5);
  });

  test("Cost function symmetry", () => {
    const qYes = 30.0;
    const qNo = 70.0;
    const b = 100.0;

    const cost1 = LSMR.cost(qYes, qNo, b);
    const cost2 = LSMR.cost(qNo, qYes, b);

    expect(cost1).toBeCloseTo(cost2);
  });

  test("Calculate shares to buy from cents amount", () => {
    const qYes = 50.0;
    const qNo = 50.0;
    const b = 2500000;
    const centsToSpend = 1000; // $10.00

    const x = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend, "YES");
    expect(x).toBeCloseTo(2000, 0); // Should be ~1999 actually
  });

  test("Buy then sell immediately", () => {
    let walletCents = 10000; // $100.00
    let qYes = 0.0;
    let qNo = 0.0;

    const b = 100000;

    const centsToSpend = 5000; // $50.00

    const sharesBought = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend, "YES");
    walletCents -= centsToSpend;
    qYes += sharesBought;

    const sellValue = LSMR.sellSharesValue(qYes, qNo, b, sharesBought, "YES");
    walletCents += sellValue;
    qYes -= sharesBought;

    walletCents = Math.round(walletCents); // Normalize rounding errors

    expect(walletCents).toBe(10000);
  });

  test("Earn profit from 2 buyers", () => {
    let wallet1 = 10000; // $100.00
    let wallet2 = 10000; // $100.00
    let qYes = 0.0;
    let qNo = 0.0;

    const b = 100000;

    // Buyer 1 buys $50 of YES
    const centsToSpend1 = 5000; // $50.00
    const sharesBought1 = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend1, "YES");
    wallet1 -= centsToSpend1;
    qYes += sharesBought1;

    // Buyer 2 buys $50 of YES
    const centsToSpend2 = 5000; // $50.00
    const sharesBought2 = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend2, "YES");
    wallet2 -= centsToSpend2;
    qYes += sharesBought2;

    // Buyer 1 sells all their shares
    const sellValue1 = LSMR.sellSharesValue(qYes, qNo, b, sharesBought1, "YES");
    wallet1 += sellValue1;
    qYes -= sharesBought1;

    wallet1 = Math.round(wallet1); // Normalize rounding errors
    console.log("Wallet1 after 2 buyers:", wallet1);
    expect(wallet1).toBeGreaterThan(10000);

    // Buyer 2 sells all their shares
    const sellValue2 = LSMR.sellSharesValue(qYes, qNo, b, sharesBought2, "YES");
    wallet2 += sellValue2;
    qYes -= sharesBought2;
    wallet2 = Math.round(wallet2); // Normalize rounding errors

    console.log("Wallet2 after 2 buyers:", wallet2);
    expect(wallet2).toBeLessThan(10000);

    expect(wallet1 + wallet2).toBe(20000); // Market maker makes profit
  });

  test("Buying 0 shares costs 0", () => {
    const qYes = 50.0;
    const qNo = 30.0;
    const b = 100.0;
    expect(LSMR.sharesToBuy(qYes, qNo, b, 0, "YES")).toBe(0);
  });

  test("Total prices sum to 1", () => {
    const qYes = 1234.0;
    const qNo = 5678.0;
    const b = 1000.0;
    const { priceYes, priceNo } = LSMR.price(qYes, qNo, b);
    expect(priceYes + priceNo).toBeCloseTo(1.0);
  });

  test("Buying shares increases price", () => {
    let qYes = 100.0;
    let qNo = 100.0;
    const b = 1000.0;

    const { priceYes: priceBefore } = LSMR.price(qYes, qNo, b);
    const sharesToBuy = LSMR.sharesToBuy(qYes, qNo, b, 1000, "YES");
    qYes += sharesToBuy;
    const { priceYes: priceAfter } = LSMR.price(qYes, qNo, b);

    expect(priceAfter).toBeGreaterThan(priceBefore);
  });

  test("Selling shares on smaller outcome incurs loss", () => {
    let wallet1 = 10000; // $100.00
    let wallet2 = 10000; // $100.00
    let qYes = 0.0;
    let qNo = 0.0;

    const b = 100000;

    // Buyer 1 buys $50 of YES
    const centsToSpend1 = 5000; // $50.00
    const sharesBought1 = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend1, "YES");
    wallet1 -= centsToSpend1;
    qYes += sharesBought1;

    // Buyer 2 buys $100 on NO
    const centsToSpend2 = 10000; // $100.00
    const sharesBought2 = LSMR.sharesToBuy(qYes, qNo, b, centsToSpend2, "NO");
    wallet2 -= centsToSpend2;
    qNo += sharesBought2;

    // Buyer 1 sells all their shares
    const sellValue1 = LSMR.sellSharesValue(qYes, qNo, b, sharesBought1, "YES");
    wallet1 += sellValue1;
    qYes -= sharesBought1;

    wallet1 = Math.round(wallet1); // Normalize rounding errors
    console.log("Wallet1 after 2 buyers:", wallet1);
    expect(wallet1).toBeLessThan(10000);

    // Buyer 2 sells all their shares
    const sellValue2 = LSMR.sellSharesValue(qYes, qNo, b, sharesBought2, "NO");
    wallet2 += sellValue2;
    qYes -= sharesBought2;
    wallet2 = Math.round(wallet2); // Normalize rounding errors

    console.log("Wallet2 after 2 buyers:", wallet2);
    expect(wallet2).toBeGreaterThan(10000);

    expect(wallet1 + wallet2).toBe(20000); // Market maker makes profit
  });

  test("Larger liquidity parameter b reduces price impact", () => {
    const qYes = 100.0;
    const qNo = 100.0;
    const bSmall = 100.0;
    const bLarge = 10000.0;

    const { priceYes: priceBeforeSmall } = LSMR.price(qYes, qNo, bSmall);
    const sharesToBuySmall = LSMR.sharesToBuy(qYes, qNo, bSmall, 1000, "YES");
    const { priceYes: priceAfterSmall } = LSMR.price(qYes + sharesToBuySmall, qNo, bSmall);
    const priceImpactSmall = priceAfterSmall - priceBeforeSmall;

    const { priceYes: priceBeforeLarge } = LSMR.price(qYes, qNo, bLarge);
    const sharesToBuyLarge = LSMR.sharesToBuy(qYes, qNo, bLarge, 1000, "YES");
    const { priceYes: priceAfterLarge } = LSMR.price(qYes + sharesToBuyLarge, qNo, bLarge);
    const priceImpactLarge = priceAfterLarge - priceBeforeLarge;

    expect(priceImpactLarge).toBeLessThan(priceImpactSmall);
  })
});
