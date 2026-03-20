import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core"

export const establishmentsTable = pgTable("establishments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  location: varchar({ length: 255 }).notNull(),
  province: varchar({ length: 100 }).notNull(),
  description: text(),
  mediaUrls: text().default("[]"),
  upvotes: integer().default(0),
  verified: boolean().default(false),
  createdAt: timestamp().defaultNow(),
})

export const reportsTable = pgTable("reports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  establishmentId: integer().references(() => establishmentsTable.id),
  testimony: text().notNull(),
  mediaUrls: text().default("[]"),
  reporterName: varchar({ length: 255 }),
  upvotes: integer().default(0),
  createdAt: timestamp().defaultNow(),
})
