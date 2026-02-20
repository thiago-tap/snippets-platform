import { redirect, fail } from '@sveltejs/kit';
import { getDb, snippets } from '$lib/db';
import { generateSnippetId } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/auth/github');
  return {};
};

export const actions = {
  default: async ({ request, locals, platform }) => {
    if (!locals.user) redirect(302, '/auth/github');
    if (!platform?.env?.DB) return fail(500, { error: 'Banco de dados indisponível' });

    const data = await request.formData();
    const title = (data.get('title') as string)?.trim();
    const code = (data.get('code') as string)?.trim();
    const language = (data.get('language') as string) || 'plaintext';
    const description = (data.get('description') as string)?.trim() || null;
    const tagsRaw = (data.get('tags') as string)?.trim() || '';
    const isPublic = data.get('is_public') === 'on';

    if (!title || title.length < 3) {
      return fail(400, { error: 'Título deve ter pelo menos 3 caracteres', title, code, language, description, tagsRaw });
    }
    if (!code || code.length < 1) {
      return fail(400, { error: 'O código não pode estar vazio', title, code, language, description, tagsRaw });
    }

    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const db = getDb(platform.env.DB);
    const now = Math.floor(Date.now() / 1000);
    const id = generateSnippetId();

    await db.insert(snippets).values({
      id,
      userId: locals.user.id,
      title,
      description,
      code,
      language,
      tags: JSON.stringify(tags),
      isPublic,
      views: 0,
      createdAt: now,
      updatedAt: now,
    });

    redirect(302, `/snippets/${id}`);
  },
} satisfies Actions;
