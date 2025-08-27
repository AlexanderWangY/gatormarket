import type { DB } from "./db.js";

export type SelectPartialWithExtras<T extends keyof DB, Extras = {}> = Partial<
  DB[T]
> &
  Extras;
