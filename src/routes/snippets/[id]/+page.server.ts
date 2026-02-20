import { error, redirect, fail } from '@sveltejs/kit';
import { getDb, snippets, users } from '$lib/db';
import { eq } from 'drizzle-orm';
import { parseTags } from '$lib/utils';
import { highlightCode } from '$lib/highlight';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, platform }) => {
  if (!platform?.env?.DB) error(500, 'Banco de dados indisponível');

  const db = getDb(platform.env.DB);
  const result = await db
    .select({ snippet: snippets, author: users })
    .from(snippets)
    .innerJoin(users, eq(snippets.userId, users.id))
    .where(eq(snippets.id, params.id))
    .get();

  if (!result) error(404, 'Snippet não encontrado');

  const { snippet, author } = result;

  if (!snippet.isPublic && snippet.userId !== locals.user?.id) {
    error(403, 'Este snippet é privado');
  }

  // Increment views asynchronously (don't block render)
  if (snippet.userId !== locals.user?.id) {
    db.update(snippets)
      .set({ views: snippet.views + 1 })
      .where(eq(snippets.id, params.id))
      .run()
      .catch(() => {});
  }

  const highlighted = await highlightCode(snippet.code, snippet.language);

  return {
    snippet: { ...snippet, tags: parseTags(snippet.tags) },
    author,
    highlighted,
    isOwner: locals.user?.id === snippet.userId,
  };
};

export const actions = {
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
