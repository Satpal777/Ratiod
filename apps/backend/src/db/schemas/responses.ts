import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  inet,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { responseStatusEnum } from "./enums";
import { user } from "./auth";
import {
  polls,
  pollQuestions,
  questionOptions,
  respondentMetadataFields,
} from "./polls";

export const pollResponses = pgTable(
  "poll_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),

    respondentId: text("respondent_id").references(() => user.id, {
      onDelete: "set null",
    }),

    anonymousSessionToken: varchar("anonymous_session_token", {
      length: 64,
    }),

    status: responseStatusEnum("status").notNull().default("in_progress"),

    submittedAt: timestamp("submitted_at", { withTimezone: true }),

    ipAddress: inet("ip_address"),

    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("poll_responses_poll_id_idx").on(table.pollId),

    index("poll_responses_respondent_id_idx").on(table.respondentId),

    index("poll_responses_poll_status_idx").on(table.pollId, table.status),

    index("poll_responses_auth_respondent_idx").on(
      table.pollId,
      table.respondentId
    ),

    index("poll_responses_anon_token_idx").on(
      table.pollId,
      table.anonymousSessionToken
    ),
  ]
);

export const responseAnswers = pgTable(
  "response_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    responseId: uuid("response_id")
      .notNull()
      .references(() => pollResponses.id, { onDelete: "cascade" }),

    questionId: uuid("question_id")
      .notNull()
      .references(() => pollQuestions.id, { onDelete: "restrict" }),

    selectedOptionId: uuid("selected_option_id")
      .notNull()
      .references(() => questionOptions.id, { onDelete: "restrict" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("response_answers_response_question_idx").on(
      table.responseId,
      table.questionId
    ),

    index("response_answers_option_idx").on(table.selectedOptionId),

    index("response_answers_question_idx").on(table.questionId),

    index("response_answers_response_id_idx").on(table.responseId),
  ]
);

export const respondentMetadataValues = pgTable(
  "respondent_metadata_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    responseId: uuid("response_id")
      .notNull()
      .references(() => pollResponses.id, { onDelete: "cascade" }),

    fieldId: uuid("field_id")
      .notNull()
      .references(() => respondentMetadataFields.id, {
        onDelete: "cascade",
      }),

    value: varchar("value", { length: 2000 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("respondent_metadata_values_response_field_idx").on(
      table.responseId,
      table.fieldId
    ),

    index("respondent_metadata_values_response_id_idx").on(table.responseId),

    index("respondent_metadata_values_field_id_idx").on(table.fieldId),
  ]
);
