CREATE TABLE `users` (
  `id` text PRIMARY KEY NOT NULL,
  `github_id` integer NOT NULL UNIQUE,
  `username` text NOT NULL,
  `name` text,
  `avatar_url` text,
  `created_at` integer NOT NULL
);

CREATE TABLE `sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `expires_at` integer NOT NULL
);

CREATE TABLE `snippets` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `title` text NOT NULL,
  `description` text,
  `code` text NOT NULL,
  `language` text NOT NULL DEFAULT 'plaintext',
  `tags` text NOT NULL DEFAULT '[]',
  `is_public` integer NOT NULL DEFAULT 1,
  `views` integer NOT NULL DEFAULT 0,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE INDEX `idx_snippets_user_id` ON `snippets` (`user_id`);
CREATE INDEX `idx_snippets_language` ON `snippets` (`language`);
CREATE INDEX `idx_snippets_created_at` ON `snippets` (`created_at`);
CREATE INDEX `idx_snippets_public` ON `snippets` (`is_public`);
