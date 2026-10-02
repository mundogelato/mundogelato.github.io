/*
# Instagram Configuration Table

1. New Tables
- `instagram_config`
  - `id` (uuid, primary key)
  - `key` (text, unique, not null) — identifies the config entry (e.g. "access_token", "ig_user_id")
  - `value` (text, not null) — the secret value (token, user ID, etc.)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Purpose
This table stores the Instagram Graph API credentials (access token and Instagram user ID)
needed by the `instagram-feed` edge function to fetch real posts from @mundo_gelato.
The edge function reads these values using the service role key; the frontend never
touches these values directly.

3. Security
- RLS enabled on `instagram_config`.
- No anon or authenticated SELECT/INSERT/UPDATE/DELETE policies — the table is only
  accessible via the service role key (used by the edge function), which bypasses RLS.
  This ensures the token is never exposed to the browser.
*/

CREATE TABLE IF NOT EXISTS instagram_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instagram_config ENABLE ROW LEVEL SECURITY;
