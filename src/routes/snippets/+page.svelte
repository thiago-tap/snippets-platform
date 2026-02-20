<script lang="ts">
  import { Plus, Code2, Lock } from 'lucide-svelte';
  import SnippetCard from '$lib/components/SnippetCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const publicCount = $derived(data.snippets.filter((s) => s.isPublic).length);
  const privateCount = $derived(data.snippets.filter((s) => !s.isPublic).length);
</script>

<svelte:head>
  <title>Meus Snippets — SnipHub</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-zinc-100">Meus Snippets</h1>
      <p class="text-sm text-zinc-500 mt-1">
        {publicCount} público{publicCount !== 1 ? 's' : ''} · {privateCount} privado{privateCount !==
        1
          ? 's'
          : ''}
      </p>
    </div>
    <a
      href="/snippets/new"
      class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      <Plus class="w-4 h-4" />
      Novo Snippet
    </a>
  </div>

  {#if data.snippets.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each data.snippets as snippet (snippet.id)}
        <SnippetCard {snippet} username={data.user?.username ?? ''} avatarUrl={data.user?.avatarUrl ?? null} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-24 border border-dashed border-zinc-800 rounded-2xl">
      <Code2 class="w-12 h-12 mx-auto mb-4 text-zinc-700" />
      <p class="text-zinc-400 font-medium mb-2">Nenhum snippet ainda</p>
      <p class="text-zinc-600 text-sm mb-6">Crie seu primeiro snippet e compartilhe com a comunidade</p>
      <a
        href="/snippets/new"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <Plus class="w-4 h-4" />
        Criar primeiro snippet
      </a>
    </div>
  {/if}
</div>
