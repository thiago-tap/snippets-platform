export function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(
    new Date(timestamp * 1000)
  );
}

export function relativeTime(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d atrás`;
  return formatDate(timestamp);
}

export function generateSnippetId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { value: 'python', label: 'Python', color: '#3776ab' },
  { value: 'rust', label: 'Rust', color: '#ce412b' },
  { value: 'go', label: 'Go', color: '#00add8' },
  { value: 'java', label: 'Java', color: '#ed8b00' },
  { value: 'csharp', label: 'C#', color: '#68217a' },
  { value: 'cpp', label: 'C++', color: '#00599c' },
  { value: 'c', label: 'C', color: '#a8b9cc' },
  { value: 'php', label: 'PHP', color: '#777bb4' },
  { value: 'ruby', label: 'Ruby', color: '#cc342d' },
  { value: 'swift', label: 'Swift', color: '#fa7343' },
  { value: 'kotlin', label: 'Kotlin', color: '#7f52ff' },
  { value: 'html', label: 'HTML', color: '#e34f26' },
  { value: 'css', label: 'CSS', color: '#1572b6' },
  { value: 'sql', label: 'SQL', color: '#336791' },
  { value: 'bash', label: 'Shell/Bash', color: '#4eaa25' },
  { value: 'yaml', label: 'YAML', color: '#cb171e' },
  { value: 'json', label: 'JSON', color: '#f4c430' },
  { value: 'markdown', label: 'Markdown', color: '#083fa1' },
  { value: 'svelte', label: 'Svelte', color: '#ff3e00' },
  { value: 'vue', label: 'Vue', color: '#42b883' },
  { value: 'docker', label: 'Dockerfile', color: '#2496ed' },
  { value: 'graphql', label: 'GraphQL', color: '#e10098' },
  { value: 'plaintext', label: 'Texto simples', color: '#71717a' },
] as const;

export type Language = (typeof LANGUAGES)[number]['value'];

export function getLanguage(value: string) {
  return LANGUAGES.find((l) => l.value === value) ?? LANGUAGES[LANGUAGES.length - 1];
}
