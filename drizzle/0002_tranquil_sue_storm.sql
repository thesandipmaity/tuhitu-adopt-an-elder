CREATE TABLE `donation_checkouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text NOT NULL,
	`currency` text NOT NULL,
	`amount` integer NOT NULL,
	`frequency` text NOT NULL,
	`consent` integer NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending_gateway' NOT NULL,
	`gateway_provider` text DEFAULT '' NOT NULL,
	`gateway_reference` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
