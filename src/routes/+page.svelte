<script lang="ts">
  import { Code2 } from 'lucide-svelte';
  import SnippetCard from '$lib/components/SnippetCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let selectedLang = $state('');

  const filtered = $derived(
    selectedLang ? data.snippets.filter((s) => s.language === selectedLang) : data.snippets
  );
</script>

<svelte:head>
  <title>SnipHub — Snippets de código para desenvolvedores</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-10">
  <!-- Hero -->
  <div class="text-center mb-12">
    <div
      class="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
    >
      <Code2 class="w-4 h-4" />
      {data.total} snippets públicos
    </div>
    <h1 class="text-4xl font-bold tracking-tight mb-3 text-zinc-50">SnipHub</h1>
    <p class="text-zinc-400 text-lg max-w-xl mx-auto">
      Salve, organize e compartilhe snippets de código. Syntax highlighting e explicação por IA.
    </p>
    {#if !data.user}
      <a
        href="/auth/github"
        class="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        Entrar com GitHub para começar
      </a>
    {:else}
      <a
        href="/snippets/new"
        class="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        + Novo Snippet
      </a>
    {/if}
  </div>

  <!-- Language filter -->
  {#if data.languages.length > 0}
    <div class="flex flex-wrap gap-2 mb-8 justify-center">
      <button
        onclick={() => (selectedLang = '')}
        class="px-3 py-1 rounded-full text-xs font-medium transition-colors {selectedLang === ''
          ? 'bg-indigo-600 text-white'
          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'}"
      >
        Todos
      </button>
      {#each data.languages as lang}
        <button
          onclick={() => (selectedLang = selectedLang === lang.value ? '' : lang.value)}
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors {selectedLang ===
          lang.value
            ? 'bg-indigo-600 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100'}"
        >
          {lang.label}
          <span class="opacity-60 ml-1">({lang.count})</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Grid -->
  {#if filtered.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filtered as snippet (snippet.id)}
        <SnippetCard {snippet} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-24 text-zinc-600">
      <Code2 class="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p class="text-sm">Nenhum snippet encontrado.</p>
    </div>
  {/if}
</div>
