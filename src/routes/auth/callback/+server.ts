import { redirect, error } from '@sveltejs/kit';
import { getGitHubOAuth, upsertUser, createSession } from '$lib/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('github_oauth_state');

  if (!code || !state || state !== storedState) {
    error(400, 'OAuth state inválido. Tente novamente.');
  }

  if (!platform?.env) error(500, 'Plataforma indisponível');

  const github = getGitHubOAuth(platform.env);
  const tokens = await github.validateAuthorizationCode(code);
  const accessToken = tokens.accessToken();

  const githubRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'SnipHub' },
  });

  if (!githubRes.ok) error(500, 'Falha ao buscar dados do GitHub');

  const githubUser = (await githubRes.json()) as {
    id: number;
    login: string;
    name: string | null;
    avatar_url: string;
  };

  const user = await upsertUser(platform.env.DB, githubUser);
  const sessionId = await createSession(platform.env.DB, user.id);

  cookies.delete('github_oauth_state', { path: '/' });
  cookies.set('session', sessionId, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(302, '/snippets');
};
