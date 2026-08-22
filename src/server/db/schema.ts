import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  submissionType: text("submission_type").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  organisation: text("organisation").notNull().default(""),
  availability: text("availability").notNull().default(""),
  donationAmount: text("donation_amount").notNull().default(""),
  donationFrequency: text("donation_frequency").notNull().default(""),
  message: text("message").notNull().default(""),
  details: text("details").notNull().default("{}"),
  language: text("language").notNull().default("en"),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  sourceUrl: text("source_url").notNull().default(""),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const newsletterSubscriptions = sqliteTable(
  "newsletter_subscriptions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    language: text("language").notNull().default("en"),
    sourceUrl: text("source_url").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("newsletter_email_unique").on(table.email),
  ],
);

export const donationCheckouts = sqliteTable("donation_checkouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  currency: text("currency").notNull(),
  amount: integer("amount").notNull(),
  frequency: text("frequency").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  sourceUrl: text("source_url").notNull().default(""),
  status: text("status").notNull().default("pending_gateway"),
  gatewayProvider: text("gateway_provider").notNull().default(""),
  gatewayReference: text("gateway_reference").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
