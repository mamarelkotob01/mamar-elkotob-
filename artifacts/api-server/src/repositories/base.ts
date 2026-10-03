import { db } from "@workspace/db";
import { count, eq, sql } from "drizzle-orm";
import type { PaginatedResult, PaginationParams } from "../models/pagination";

export abstract class BaseRepository<TTable extends any> {
  constructor(protected table: any) {}

  /**
   * Generic paginated finder
   */
  async findPaginated(
    params: PaginationParams,
    whereClause?: any
  ): Promise<PaginatedResult<any>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [data, totalRes] = await Promise.all([
      db.select().from(this.table).where(whereClause).limit(limit).offset(offset),
      db.select({ value: count() }).from(this.table).where(whereClause),
    ]);

    const total = totalRes[0].value;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<any | null> {
    const results = await db.select().from(this.table).where(eq((this.table as any).id, id)).limit(1);
    return results[0] || null;
  }
}
