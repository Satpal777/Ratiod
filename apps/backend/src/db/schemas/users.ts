import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  inet,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    email: varchar("email", { length: 320 }).notNull().unique(),

    displayName: varchar("display_name", { length: 100 }).notNull(),

    username: varchar("username", { length: 50 }).notNull(),

    passwordHash: text("password_hash").notNull(),

    isEmailVerified: boolean("is_email_verified").notNull().default(false),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),

    uniqueIndex("users_username_idx").on(table.username),
  ]
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    isRevoked: boolean("is_revoked").notNull().default(false),

    ipAddress: inet("ip_address"),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("refresh_tokens_hash_idx").on(table.tokenHash),

    index("refresh_tokens_user_id_idx").on(table.userId),

    index("refresh_tokens_expires_at_idx").on(table.expiresAt),

    index("refresh_tokens_user_active_idx").on(
      table.userId,
      table.isRevoked,
      table.expiresAt
    ),
  ]
);
