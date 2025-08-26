import * as Markets from "./markets";
import * as Trades from "./trades";
import * as Wallets from "./wallets";

// Runtime API object (for imports in JS/Express)
export const API = {
  Markets,
  Trades,
  Wallets,
};

// Named exports for tree-shaking / direct imports
export * from "./markets";
export * from "./trades";
export * from "./wallets";
