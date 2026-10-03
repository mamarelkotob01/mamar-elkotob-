import { z } from "zod";

export const PaginationSchema = z.object({
  page: z.string().optional().transform((val) => Math.max(1, parseInt(val || "1"))),
  limit: z.string().optional().transform((val) => Math.min(100, Math.max(1, parseInt(val || "20")))),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
