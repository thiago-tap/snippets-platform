import { createHighlighter } from 'shiki';

// Module-level cache — persists across requests in the same worker instance
// Reset on failure so subsequent requests can retry
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
    // Reset cache on failure so the next request retries
    highlighterPromise.catch(() => {
      highlighterPromise = null;
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

function escapeHtml(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    const resolvedLang = LANG_ALIASES[lang] ?? lang;
    try {
      return highlighter.codeToHtml(code, { lang: resolvedLang, theme: 'github-dark' });
    } catch {
      return highlighter.codeToHtml(code, { lang: 'plaintext', theme: 'github-dark' });
    }
  } catch {
    // Fallback: plain HTML sem highlighting se o Shiki falhar completamente
    return `<pre class="shiki github-dark" style="background-color:#0d1117;color:#e6edf3"><code>${escapeHtml(code)}</code></pre>`;
  }
}
