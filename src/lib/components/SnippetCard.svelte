<script lang="ts">
  import { Eye, Lock } from 'lucide-svelte';
  import { relativeTime, getLanguage } from '$lib/utils';

  let {
    snippet,
  }: {
    snippet: {
      id: string;
      title: string;
      description: string | null;
      codePreview: string;
      language: string;
      tags: string[];
      views: number;
      createdAt: number;
      isPublic: boolean;
      username: string;
      avatarUrl: string | null;
    };
  } = $props();

  const lang = getLanguage(snippet.language);
</script>

<a href="/snippets/{snippet.id}" class="block group h-full">
  <div
    class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/40 transition-all h-full flex flex-col gap-3"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        style="background-color: {lang.color}20; color: {lang.color};"
      >
        {lang.label}
      </span>
      {#if !snippet.isPublic}
        <Lock class="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
      {/if}
    </div>

    <!-- Title + description -->
    <div>
      <h3
        class="font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate text-sm"
      >
        {snippet.title}
      </h3>
      {#if snippet.description}
        <p class="text-xs text-zinc-500 mt-0.5 line-clamp-1">{snippet.description}</p>
      {/if}
    </div>

    <!-- Code preview -->
    <pre
      class="text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2.5 overflow-hidden max-h-[80px] text-zinc-400 leading-relaxed flex-1">{snippet.codePreview}</pre>

    <!-- Tags -->
    {#if snippet.tags.length > 0}
      <div class="flex flex-wrap gap-1">
        {#each snippet.tags.slice(0, 3) as tag}
          <span class="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">#{tag}</span>
        {/each}
      </div>
    {/if}

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-zinc-500">
      <div class="flex items-center gap-1.5">
        <img
          src={snippet.avatarUrl ?? `https://github.com/${snippet.username}.png`}
          alt={snippet.username}
          class="w-4 h-4 rounded-full"
        />
        <span>{snippet.username}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          <Eye class="w-3 h-3" />
          {snippet.views}
        </span>
        <span>{relativeTime(snippet.createdAt)}</span>
      </div>
    </div>
  </div>
</a>
