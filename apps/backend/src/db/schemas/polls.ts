import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {
  pollStatusEnum,
  pollModeEnum,
  resultVisibilityEnum,
  metadataFieldTypeEnum,
} from "./enums";

import { users } from "./users";

export const polls = pgTable(
  "polls",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description"),

    slug: varchar("slug", { length: 24 }).notNull(),

    mode: pollModeEnum("mode").notNull().default("anonymous"),

    status: pollStatusEnum("status").notNull().default("draft"),

    allowDuplicateResponses: boolean("allow_duplicate_responses")
      .notNull()
      .default(false),

    maxResponses: integer("max_responses"),

    expiresAt: timestamp("expires_at", { withTimezone: true }),

    isResultPublished: boolean("is_result_published").notNull().default(false),

    resultVisibility: resultVisibilityEnum("result_visibility")
      .notNull()
      .default("private"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("polls_slug_idx").on(table.slug),

    index("polls_creator_id_idx").on(table.creatorId),

    index("polls_status_idx").on(table.status),

    index("polls_expires_at_status_idx").on(table.expiresAt, table.status),

    index("polls_creator_status_idx").on(table.creatorId, table.status),
  ]
);

export const pollQuestions = pgTable(
  "poll_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),

    text: varchar("text", { length: 1000 }).notNull(),

    description: text("description"),

    isRequired: boolean("is_required").notNull().default(true),

    orderIndex: integer("order_index").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("poll_questions_poll_id_order_idx").on(
      table.pollId,
      table.orderIndex
    ),
  ]
);

export const questionOptions = pgTable(
  "question_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    questionId: uuid("question_id")
      .notNull()
      .references(() => pollQuestions.id, {
        onDelete: "cascade",
      }),

    text: varchar("text", { length: 500 }).notNull(),

    orderIndex: integer("order_index").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("question_options_question_id_order_idx").on(
      table.questionId,
      table.orderIndex
    ),
  ]
);

export const respondentMetadataFields = pgTable(
  "respondent_metadata_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),

    fieldType: metadataFieldTypeEnum("field_type").notNull(),

    label: varchar("label", { length: 255 }).notNull(),

    isRequired: boolean("is_required").notNull().default(false),

    orderIndex: integer("order_index").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("respondent_metadata_fields_poll_id_idx").on(
      table.pollId,
      table.orderIndex
    ),
  ]
);
