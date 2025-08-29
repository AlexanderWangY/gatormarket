import { z } from "zod";

// --------------------
// Enums & Common Types
// --------------------
export const MarketStatusEnum = z.enum([
  "open",
  "closed",
  "resolved",
]);

export type MarketStatus = z.infer<typeof MarketStatusEnum>;

// Single market object
export const MarketSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  course_code: z.string(),
  exam_name: z.string(),
  exam_start_time: z.string(), // ISO timestamp
  exam_end_time: z.string(), // ISO timestamp
  status: MarketStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
});

export type Market = z.infer<typeof MarketSchema>;

// --------------------
// GET /markets
// --------------------
export const GetMarketsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: MarketStatusEnum.optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const GetMarketsResponseSchema = z.object({
  items: z.array(MarketSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type GetMarketsQuery = z.infer<typeof GetMarketsQuerySchema>;
export type GetMarketsResponse = z.infer<typeof GetMarketsResponseSchema>;

// --------------------
// GET /markets/:id
// --------------------
export const GetMarketResponseSchema = MarketSchema;
export type GetMarketResponse = z.infer<typeof GetMarketResponseSchema>;

// --------------------
// POST /markets (Create Market)
// --------------------
export const CreateMarketBodySchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  course_code: z.string(),
  exam_name: z.string(),
  exam_start_time: z.string(),
  exam_end_time: z.string(),
  status: MarketStatusEnum.optional().default("open"),
});

export const CreateMarketResponseSchema = MarketSchema;

export type CreateMarketBody = z.infer<typeof CreateMarketBodySchema>;
export type CreateMarketResponse = z.infer<typeof CreateMarketResponseSchema>;

// --------------------
// PATCH /markets/:id (Update Market)
// --------------------
export const UpdateMarketBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  course_code: z.string().optional(),
  exam_name: z.string().optional(),
  exam_start_time: z.string().optional(),
  exam_end_time: z.string().optional(),
  status: MarketStatusEnum.optional(),
});

export const UpdateMarketResponseSchema = MarketSchema;

export type UpdateMarketBody = z.infer<typeof UpdateMarketBodySchema>;
export type UpdateMarketResponse = z.infer<typeof UpdateMarketResponseSchema>;

// --------------------
// DELETE /markets/:id
// --------------------
export const DeleteMarketResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteMarketResponse = z.infer<typeof DeleteMarketResponseSchema>;

export const GetMarketSnapshotsBodySchema = z.object({
  fromTime: z.iso.datetime().optional(),
  toTime: z.iso.datetime().optional(),
}).optional()

export type GetMarketSnapshotsBody = z.infer<typeof GetMarketSnapshotsBodySchema>;
