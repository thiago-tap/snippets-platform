import type { D1Database } from '@cloudflare/workers-types';

declare global {
  namespace App {
    interface Platform {
      env: {
        DB: D1Database;
        AI: Ai;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
      };
      context: ExecutionContext;
    }
    interface Locals {
      user: {
        id: string;
        username: string;
        name: string | null;
        avatarUrl: string | null;
      } | null;
    }
  }
}

export {};
