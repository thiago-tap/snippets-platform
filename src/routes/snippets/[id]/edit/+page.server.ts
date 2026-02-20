import { error, redirect, fail } from '@sveltejs/kit';
import { getDb, snippets } from '$lib/db';
import { eq } from 'drizzle-orm';
import { parseTags } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, platform }) => {
  if (!locals.user) redirect(302, '/auth/github');
  if (!platform?.env?.DB) error(500, 'Banco de dados indisponível');

  const db = getDb(platform.env.DB);
  const snippet = await db
    .select()
    .from(snippets)
    .where(eq(snippets.id, params.id))
    .get();

  if (!snippet) error(404, 'Snippet não encontrado');
  if (snippet.userId !== locals.user.id) error(403, 'Sem permissão');

  return { snippet: { ...snippet, tags: parseTags(snippet.tags) } };
};

export const actions = {
  default: async ({ request, params, locals, platform }) => {
    if (!locals.user) redirect(302, '/auth/github');
    if (!platform?.env?.DB) return fail(500, { error: 'Banco de dados indisponível' });

    const data = await request.formData();
    const title = (data.get('title') as string)?.trim();
    const code = (data.get('code') as string)?.trim();
    const language = (data.get('language') as string) || 'plaintext';
    const description = (data.get('description') as string)?.trim() || null;
    const tagsRaw = (data.get('tags') as string)?.trim() || '';
    const isPublic = data.get('is_public') === 'on';

    if (!title || !code) return fail(400, { error: 'Título e código são obrigatórios' });

    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const db = getDb(platform.env.DB);

    // Verify ownership
    const existing = await db.select().from(snippets).where(eq(snippets.id, params.id)).get();
    if (!existing || existing.userId !== locals.user.id) error(403, 'Sem permissão');

    await db
      .update(snippets)
      .set({ title, description, code, language, tags: JSON.stringify(tags), isPublic, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(snippets.id, params.id));

    redirect(302, `/snippets/${params.id}`);
  },

  delete: async ({ params, locals, platform }) => {
    if (!locals.user) redirect(302, '/auth/github');
    if (!platform?.env?.DB) return fail(500, { error: 'Banco de dados indisponível' });

    const db = getDb(platform.env.DB);
    const snippet = await db.select().from(snippets).where(eq(snippets.id, params.id)).get();
    if (!snippet || snippet.userId !== locals.user.id) error(403, 'Sem permissão');

    await db.delete(snippets).where(eq(snippets.id, params.id));
    redirect(302, '/snippets');
  },
} satisfies Actions;
