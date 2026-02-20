import { redirect } from '@sveltejs/kit';
import { generateState, getGitHubOAuth } from '$lib/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, platform }) => {
  if (!platform?.env) redirect(302, '/');

  const github = getGitHubOAuth(platform.env);
  const state = generateState();
  const authUrl = github.createAuthorizationURL(state, ['user:email']);

  cookies.set('github_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  redirect(302, authUrl.toString());
};
