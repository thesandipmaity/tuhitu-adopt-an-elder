CREATE TABLE `newsletter_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_email_unique` ON `newsletter_subscriptions` (`email`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`submission_type` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`organisation` text DEFAULT '' NOT NULL,
	`availability` text DEFAULT '' NOT NULL,
	`donation_amount` text DEFAULT '' NOT NULL,
	`donation_frequency` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`consent` integer NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
