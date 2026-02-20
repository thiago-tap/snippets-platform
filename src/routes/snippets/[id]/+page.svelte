<script lang="ts">
  import { Copy, Check, Edit, Trash2, Lock, Eye, Bot, Loader2, ArrowLeft } from 'lucide-svelte';
  import { enhance } from '$app/forms';
  import { getLanguage, relativeTime, formatDate } from '$lib/utils';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const lang = getLanguage(data.snippet.language);

  let copied = $state(false);
  let explaining = $state(false);
  let explanation = $state('');
  let showDeleteConfirm = $state(false);

  async function copyCode() {
    await navigator.clipboard.writeText(data.snippet.code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  async function explain() {
    explaining = true;
    explanation = '';
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.snippet.code, language: data.snippet.language }),
      });
      const json = (await res.json()) as { explanation?: string; error?: string };
      explanation = json.explanation ?? json.error ?? 'Não foi possível gerar a explicação.';
    } catch {
      explanation = 'Erro ao conectar com a IA.';
    } finally {
      explaining = false;
    }
  }
</script>

<svelte:head>
  <title>{data.snippet.title} — SnipHub</title>
  <meta name="description" content={data.snippet.description ?? `Snippet de ${lang.label} por ${data.author.username}`} />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <!-- Back -->
  <a href="javascript:history.back()" class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
    <ArrowLeft class="w-4 h-4" />
    Voltar
  </a>

  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <span
            class="text-xs font-semibold px-2.5 py-1 rounded-full"
            style="background-color: {lang.color}20; color: {lang.color};"
          >
            {lang.label}
          </span>
          {#if !data.snippet.isPublic}
            <span class="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
              <Lock class="w-3 h-3" />
              Privado
            </span>
          {/if}
        </div>
        <h1 class="text-2xl font-bold text-zinc-100">{data.snippet.title}</h1>
        {#if data.snippet.description}
          <p class="text-zinc-400 mt-1">{data.snippet.description}</p>
        {/if}
      </div>

      <!-- Owner actions -->
      {#if data.isOwner}
        <div class="flex items-center gap-2 shrink-0">
          <a
            href="/snippets/{data.snippet.id}/edit"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-md text-sm transition-colors"
          >
            <Edit class="w-4 h-4" />
            Editar
          </a>
          {#if !showDeleteConfirm}
            <button
              onclick={() => (showDeleteConfirm = true)}
              class="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-md text-sm transition-colors"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          {:else}
            <form action="?/delete" method="POST" use:enhance class="flex items-center gap-2">
              <span class="text-xs text-zinc-400">Confirmar?</span>
              <button type="submit" class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-xs font-medium transition-colors">
                Excluir
              </button>
              <button type="button" onclick={() => (showDeleteConfirm = false)} class="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-md text-xs transition-colors">
                Cancelar
              </button>
            </form>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Meta -->
    <div class="flex items-center gap-4 mt-4 text-sm text-zinc-500">
      <div class="flex items-center gap-1.5">
        <img
          src={data.author.avatarUrl ?? `https://github.com/${data.author.username}.png`}
          alt={data.author.username}
          class="w-5 h-5 rounded-full"
        />
        <span>{data.author.username}</span>
      </div>
      <span class="flex items-center gap-1">
        <Eye class="w-3.5 h-3.5" />
        {data.snippet.views} visualizações
      </span>
      <span title={formatDate(data.snippet.createdAt)}>{relativeTime(data.snippet.createdAt)}</span>
    </div>

    <!-- Tags -->
    {#if data.snippet.tags.length > 0}
      <div class="flex flex-wrap gap-1.5 mt-3">
        {#each data.snippet.tags as tag}
          <span class="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">#{tag}</span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Code block -->
  <div class="relative group">
    <div class="absolute top-3 right-3 flex gap-2 z-10">
      <button
        onclick={copyCode}
        class="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-md text-xs transition-colors backdrop-blur-sm"
      >
        {#if copied}
          <Check class="w-3.5 h-3.5 text-green-400" />
          <span class="text-green-400">Copiado!</span>
        {:else}
          <Copy class="w-3.5 h-3.5" />
          Copiar
        {/if}
      </button>
    </div>
    {@html data.highlighted}
  </div>

  <!-- AI Explanation -->
  <div class="mt-6">
    {#if !explanation && !explaining}
      <button
        onclick={explain}
        class="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 rounded-lg text-sm font-medium transition-all"
      >
        <Bot class="w-4 h-4" />
        Explicar com IA
      </button>
    {/if}

    {#if explaining}
      <div class="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400">
        <Loader2 class="w-4 h-4 animate-spin" />
        Gerando explicação...
      </div>
    {/if}

    {#if explanation}
      <div class="bg-zinc-900 border border-indigo-500/20 rounded-lg p-5">
        <div class="flex items-center gap-2 mb-3 text-indigo-400 text-sm font-medium">
          <Bot class="w-4 h-4" />
          Explicação por IA
        </div>
        <p class="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
        <button
          onclick={() => (explanation = '')}
          class="mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Fechar
        </button>
      </div>
    {/if}
  </div>
</div>
