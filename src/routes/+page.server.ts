import { getDb, snippets, users } from '$lib/db';
import { desc, eq } from 'drizzle-orm';
import { parseTags, getLanguage } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
  if (!platform?.env?.DB) return { snippets: [], languages: [], total: 0 };

  const db = getDb(platform.env.DB);

  const rows = await db
    .select({
      id: snippets.id,
      title: snippets.title,
      description: snippets.description,
      code: snippets.code,
      language: snippets.language,
      tags: snippets.tags,
      views: snippets.views,
      isPublic: snippets.isPublic,
      createdAt: snippets.createdAt,
      userId: snippets.userId,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(snippets)
    .innerJoin(users, eq(snippets.userId, users.id))
    .where(eq(snippets.isPublic, true))
    .orderBy(desc(snippets.createdAt))
    .limit(60);

  const snips = rows.map((r) => ({
    ...r,
    tags: parseTags(r.tags),
    codePreview: r.code.split('\n').slice(0, 7).join('\n'),
  }));

  // Language breakdown for filter
  const langCounts: Record<string, number> = {};
  for (const s of snips) langCounts[s.language] = (langCounts[s.language] ?? 0) + 1;

  const languages = Object.entries(langCounts)
    .map(([value, count]) => ({ value, count, label: getLanguage(value).label }))
    .sort((a, b) => b.count - a.count);

  return { snippets: snips, languages, total: snips.length };
};
