import { validateSession } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, platform }) => {
  const sessionId = cookies.get('session');
  if (!sessionId || !platform?.env?.DB) return { user: null };

  const user = await validateSession(platform.env.DB, sessionId);
  if (!user) {
    cookies.delete('session', { path: '/' });
    return { user: null };
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  };
};
