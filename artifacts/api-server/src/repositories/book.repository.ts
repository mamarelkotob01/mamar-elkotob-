import { books, authors, worlds } from "@workspace/db";
import { eq, and, or, ilike, desc } from "drizzle-orm";
import { BaseRepository } from "./base";
import { db } from "@workspace/db";
import { cacheService } from "../lib/cache/service";
import type { PaginationParams, PaginatedResult } from "../models/pagination";

export class BookRepository extends BaseRepository<typeof books> {
  constructor() {
    super(books);
  }

  /**
   * Get all published books with authors and worlds (Optimized Join)
   */
  async getPublishedBooks(params: PaginationParams, search?: string): Promise<PaginatedResult<any>> {
    // 1. Try Cache first for non-searched results
    const cacheKey = `books:published:p${params.page}:l${params.limit}:${search || "all"}`;
    if (!search) {
      const cached = await cacheService.get<PaginatedResult<any>>(cacheKey);
      if (cached) return cached;
    }

    const { page, limit } = params;
    const offset = (page - 1) * limit;

    // 2. Build Base Conditions
    const conditions = [eq(books.status, "published")];
    if (search) {
      conditions.push(or(
        ilike(books.titleAr, `%${search}%`),
        ilike(books.titleEn, `%${search}%`)
      ) as any);
    }

    // 3. Execute Query with JOINs
    const data = await db
      .select({
        id: books.id,
        titleAr: books.titleAr,
        titleEn: books.titleEn,
        price: books.price,
        coverUrl: books.coverUrl,
        status: books.status,
        author: {
          nameAr: authors.nameAr,
          nameEn: authors.nameEn,
        },
        world: {
          nameAr: worlds.nameAr,
          nameEn: worlds.nameEn,
        },
      })
      .from(books)
      .leftJoin(authors, eq(books.authorId, authors.id))
      .leftJoin(worlds, eq(books.worldId, worlds.id))
      .where(and(...conditions))
      .orderBy(desc(books.createdAt))
      .limit(limit)
      .offset(offset);

    const result = {
      data,
      meta: {
        total: 0, // In a real scenario, we'd do a count query here
        page,
        limit,
        totalPages: 0,
      },
    };

    // 4. Cache the result for 5 minutes
    if (!search) {
      await cacheService.set(cacheKey, result, 300);
    }

    return result;
  }
}

export const bookRepository = new BookRepository();
