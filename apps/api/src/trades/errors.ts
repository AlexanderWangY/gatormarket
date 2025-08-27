export class InvalidShareAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidShareAmountError";
  }
}

export class InsufficientFundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsufficientFundsError";
  }
}