import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const { code, language } = (await request.json()) as { code: string; language: string };

    if (!code || typeof code !== 'string') {
      return json({ error: 'Código inválido' }, { status: 400 });
    }

    if (!platform?.env?.AI) {
      return json({ error: 'IA indisponível em ambiente local' }, { status: 503 });
    }

    const ai = platform.env.AI as {
      run: (model: string, options: unknown) => Promise<{ response?: string }>;
    };

    const prompt = `Você é um especialista em programação. Explique o seguinte código ${language} de forma clara e didática em português.
Descreva: o que ele faz, como funciona, e para que pode ser usado.
Seja conciso mas completo. Máximo 200 palavras.

Código:
\`\`\`${language}
${code.slice(0, 2000)}
\`\`\``;

    const result = await ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
    });

    return json({ explanation: result.response ?? 'Não foi possível gerar a explicação.' });
  } catch (e) {
    return json({ error: 'Erro interno: ' + (e as Error).message }, { status: 500 });
  }
};
