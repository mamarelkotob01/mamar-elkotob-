import { pgTable, text, uuid, timestamp, numeric, boolean, integer, pgEnum, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookFormatEnum = pgEnum("book_format", ["digital", "physical", "both"]);
export const languageEnum = pgEnum("language", ["ar", "en", "both"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "cancelled", "delivered"]);

// Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(), // References auth.users
  email: text("email").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  imagePublicId: text("image_public_id"),
  imageStorageType: text("image_storage_type").default("local"),
});

// Authors
export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  photoUrl: text("photo_url"),
  nationality: text("nationality"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  imagePublicId: text("image_public_id"),
  imageStorageType: text("image_storage_type").default("local"),
});

// Worlds
export const worlds = pgTable("worlds", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  bannerUrl: text("banner_url"),
  colorPrimary: text("color_primary").default("#8B1D3D"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  imagePublicId: text("image_public_id"),
  imageStorageType: text("image_storage_type").default("local"),
});

// Books
export const books = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  authorId: uuid("author_id").references(() => authors.id, { onDelete: "set null" }),
  worldId: uuid("world_id").references(() => worlds.id, { onDelete: "set null" }),
  coverUrl: text("cover_url"),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  genre: text("genre").notNull().default("General"),
  genreAr: text("genre_ar").notNull().default("عام"),
  format: text("format").notNull().default("both"),
  language: text("language").notNull().default("ar"),
  pages: integer("pages").notNull().default(0),
  publishedDate: date("published_date"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  readingOrderInWorld: integer("reading_order_in_world"),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  imagePublicId: text("image_public_id"),
  imageStorageType: text("image_storage_type").default("local"),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentMethod: text("payment_method"),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  bookId: uuid("book_id").notNull().references(() => books.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(profiles, { fields: [orders.userId], references: [profiles.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  book: one(books, { fields: [orderItems.bookId], references: [books.id] }),
}));

export const booksRelations = relations(books, ({ one }) => ({
  author: one(authors, { fields: [books.authorId], references: [authors.id] }),
  world: one(worlds, { fields: [books.worldId], references: [worlds.id] }),
}));
