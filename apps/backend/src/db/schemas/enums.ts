import { pgEnum } from "drizzle-orm/pg-core";

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "paused",
  "expired",
  "closed",
]);

export const pollModeEnum = pgEnum("poll_mode", ["anonymous", "authenticated"]);

export const resultVisibilityEnum = pgEnum("result_visibility", [
  "private",
  "public",
]);

export const metadataFieldTypeEnum = pgEnum("metadata_field_type", [
  "name",
  "email",
  "phone",
  "custom_text",
]);

export const responseStatusEnum = pgEnum("response_status", [
  "in_progress",
  "completed",
  "abandoned",
]);
