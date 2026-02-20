import { createHighlighter } from 'shiki';

// Module-level cache — persists across requests in the same worker instance
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript',
        'typescript',
        'python',
        'rust',
        'go',
        'java',
        'c',
        'cpp',
        'csharp',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'html',
        'css',
        'sql',
        'bash',
        'shell',
        'yaml',
        'json',
        'markdown',
        'svelte',
        'vue',
        'dockerfile',
        'graphql',
        'plaintext',
      ],
    });
  }
  return highlighterPromise;
}

const LANG_ALIASES: Record<string, string> = {
  csharp: 'csharp',
  bash: 'bash',
  docker: 'dockerfile',
  sh: 'bash',
};

export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const resolvedLang = LANG_ALIASES[lang] ?? lang;
  try {
    return highlighter.codeToHtml(code, { lang: resolvedLang, theme: 'github-dark' });
  } catch {
    return highlighter.codeToHtml(code, { lang: 'plaintext', theme: 'github-dark' });
  }
}
