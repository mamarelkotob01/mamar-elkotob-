import type { Request, Response } from "express";
import { BaseController } from "./base";
import { bookRepository } from "../repositories/book.repository";
import { PaginationSchema } from "../models/pagination";
import { z } from "zod";

export class BookController extends BaseController {
  
  /**
   * GET /api/books
   * Fetch all published books with pagination and optional search
   */
  async list(req: Request, res: Response) {
    try {
      // 1. Validate Query Params
      const pagination = PaginationSchema.parse(req.query);
      const search = z.string().optional().parse(req.query.search);

      // 2. Fetch from Repository
      const result = await bookRepository.getPublishedBooks(pagination, search);

      return this.ok(res, result);
    } catch (error) {
      return this.error(res, error);
    }
  }

  /**
   * GET /api/books/:id
   */
  async detail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (typeof id !== "string") {
        return this.badRequest(res, "Invalid ID parameter");
      }
      const book = await bookRepository.findById(id);

      if (!book) {
        return this.notFound(res, "Book not found");
      }

      return this.ok(res, book);
    } catch (error) {
      return this.error(res, error);
    }
  }
}

export const bookController = new BookController();
