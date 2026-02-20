import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, platform }) => {
  const sessionId = cookies.get('session');
  if (sessionId && platform?.env?.DB) {
    await deleteSession(platform.env.DB, sessionId);
  }
  cookies.delete('session', { path: '/' });
  redirect(302, '/');
};
