import { z } from "zod";

// --------------------
// Wallet Object
// --------------------
export const WalletSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  balance: z.number().min(0), // NUMERIC(20,10) as number
  locked_balance: z.number().min(0), // NUMERIC(20,10) as number
  created_at: z.string(), // ISO timestamp
  updated_at: z.string(), // ISO timestamp
});

export type Wallet = z.infer<typeof WalletSchema>;

// --------------------
// GET /wallet/:user_id
// --------------------
export const GetWalletResponseSchema = WalletSchema;
export type GetWalletResponse = z.infer<typeof GetWalletResponseSchema>;

// --------------------
// PATCH /wallet/:user_id (update balances)
// --------------------
export const UpdateWalletBodySchema = z.object({
  balance: z.number().min(0).optional(),
  locked_balance: z.number().min(0).optional(),
});

export const UpdateWalletResponseSchema = WalletSchema;
export type UpdateWalletBody = z.infer<typeof UpdateWalletBodySchema>;
export type UpdateWalletResponse = z.infer<typeof UpdateWalletResponseSchema>;

// --------------------
// POST /wallet (create wallet, optional, usually auto-created)
// --------------------
export const CreateWalletBodySchema = z.object({
  user_id: z.string(),
  balance: z.number().min(0).optional().default(0),
  locked_balance: z.number().min(0).optional().default(0),
});

export const CreateWalletResponseSchema = WalletSchema;
export type CreateWalletBody = z.infer<typeof CreateWalletBodySchema>;
export type CreateWalletResponse = z.infer<typeof CreateWalletResponseSchema>;
