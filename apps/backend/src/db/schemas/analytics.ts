import {
  pgTable,
  uuid,
  integer,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { polls } from "./polls";

export const analyticsSnapshots = pgTable(
  "analytics_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    pollId: uuid("poll_id")
      .notNull()
      .unique()
      .references(() => polls.id, { onDelete: "cascade" }),

    totalResponses: integer("total_responses").notNull().default(0),

    uniqueRespondents: integer("unique_respondents").notNull().default(0),

    questionSummaries: jsonb("question_summaries"),

    lastCalculatedAt: timestamp("last_calculated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("analytics_snapshots_poll_id_idx").on(table.pollId),

    index("analytics_snapshots_question_summaries_gin_idx").using(
      "gin",
      table.questionSummaries
    ),
  ]
);

export const pollResultPublications = pgTable(
  "poll_result_publications",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    pollId: uuid("poll_id")
      .notNull()
      .unique()
      .references(() => polls.id, { onDelete: "cascade" }),

    publishedById: uuid("published_by_id").references(() => users.id, {
      onDelete: "set null",
    }),

    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    isPublic: boolean("is_public").notNull().default(true),

    snapshotData: jsonb("snapshot_data").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("poll_result_publications_poll_id_idx").on(table.pollId),

    index("poll_result_publications_published_by_idx").on(table.publishedById),
  ]
);
