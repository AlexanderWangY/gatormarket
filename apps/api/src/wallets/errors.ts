export class MissingWalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingWalletError";
  }
}