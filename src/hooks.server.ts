import { validateSession } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get('session');

  if (sessionId && event.platform?.env?.DB) {
    const user = await validateSession(event.platform.env.DB, sessionId);
    event.locals.user = user
      ? { id: user.id, username: user.username, name: user.name, avatarUrl: user.avatarUrl }
      : null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
