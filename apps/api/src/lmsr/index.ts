export class LSMR {
  static cost(qYes: number, qNo: number, b: number): number {
    return b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b));
  }

  static price(
    qYes: number,
    qNo: number,
    b: number
  ): { priceYes: number; priceNo: number } {
    const expYes = Math.exp(qYes / b);
    const expNo = Math.exp(qNo / b);
    const denom = expYes + expNo;
    const priceYes = expYes / denom;
    const priceNo = expNo / denom;
    return { priceYes, priceNo };
  }

  static sharesToBuy(
    qYes: number,
    qNo: number,
    b: number,
    amount_cents: number,
    outcome: "YES" | "NO"
  ): number {
    const expYes = Math.exp(qYes / b);
    const expNo = Math.exp(qNo / b);

    const eAmountB = Math.exp(amount_cents / b);

    if (outcome === "YES") {
      const deltaQ = b * Math.log(eAmountB * (expYes + expNo) - expNo) - qYes;
      return deltaQ;
    } else {
      const deltaQ = b * Math.log(eAmountB * (expYes + expNo) - expYes) - qNo;
      return deltaQ;
    }
  }

  static sellSharesValue(
    qYes: number,
    qNo: number,
    b: number,
    sharesToSell: number,
    outcome: "YES" | "NO"
  ): number {
    if (outcome === "YES") {
      return LSMR.cost(qYes, qNo, b) - LSMR.cost(qYes - sharesToSell, qNo, b);
    } else {
      return LSMR.cost(qYes, qNo, b) - LSMR.cost(qYes, qNo - sharesToSell, b);
    }
  }
}
