import { redirect } from '@sveltejs/kit';
import { getDb, snippets } from '$lib/db';
import { eq, desc } from 'drizzle-orm';
import { parseTags } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.user) redirect(302, '/auth/github');
  if (!platform?.env?.DB) return { snippets: [] };

  const db = getDb(platform.env.DB);
  const rows = await db
    .select()
    .from(snippets)
    .where(eq(snippets.userId, locals.user.id))
    .orderBy(desc(snippets.updatedAt));

  return {
    snippets: rows.map((r) => ({
      ...r,
      tags: parseTags(r.tags),
      codePreview: r.code.split('\n').slice(0, 4).join('\n'),
    })),
  };
};
