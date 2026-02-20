<script lang="ts">
  import { enhance } from '$app/forms';
  import { AlertCircle } from 'lucide-svelte';
  import { LANGUAGES } from '$lib/utils';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  // State for form fields — initialized empty, updated from server on validation error
  let title = $state('');
  let code = $state('');
  let language = $state('javascript');
  let description = $state('');
  let tagsRaw = $state('');
  let isPublic = $state(true);
  let submitting = $state(false);

  // Repopulate fields when server returns form data (e.g., after validation error)
  $effect(() => {
    if (form) {
      title = (form.title as string) ?? title;
      code = (form.code as string) ?? code;
      language = (form.language as string) ?? language;
      description = (form.description as string) ?? description;
      tagsRaw = (form.tagsRaw as string) ?? tagsRaw;
    }
  });
</script>

<svelte:head>
  <title>Novo Snippet — SnipHub</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-zinc-100">Novo Snippet</h1>
    <p class="text-sm text-zinc-500 mt-1">Salve um trecho de código para usar mais tarde ou compartilhar</p>
  </div>

  {#if form?.error}
    <div class="flex items-center gap-2 p-3 mb-6 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
      <AlertCircle class="w-4 h-4 shrink-0" />
      {form.error}
    </div>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        await update();
        submitting = false;
      };
    }}
    class="space-y-5"
  >
    <!-- Title -->
    <div>
      <label for="title" class="block text-sm font-medium text-zinc-300 mb-1.5">
        Título <span class="text-red-400">*</span>
      </label>
      <input
        id="title"
        name="title"
        type="text"
        bind:value={title}
        placeholder="Ex: Hook useDebounce em React"
        required
        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>

    <!-- Language + Visibility -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="language" class="block text-sm font-medium text-zinc-300 mb-1.5">Linguagem</label>
        <select
          id="language"
          name="language"
          bind:value={language}
          class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
        >
          {#each LANGUAGES as lang}
            <option value={lang.value}>{lang.label}</option>
          {/each}
        </select>
      </div>

      <div>
        <span class="block text-sm font-medium text-zinc-300 mb-1.5">Visibilidade</span>
        <label for="is_public" class="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 cursor-pointer hover:border-zinc-600 transition-colors">
          <input
            id="is_public"
            type="checkbox"
            name="is_public"
            bind:checked={isPublic}
            class="w-4 h-4 rounded accent-indigo-500"
          />
          <span class="text-sm text-zinc-300">{isPublic ? 'Público' : 'Privado'}</span>
        </label>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-zinc-300 mb-1.5">
        Descrição <span class="text-zinc-600">(opcional)</span>
      </label>
      <input
        id="description"
        name="description"
        type="text"
        bind:value={description}
        placeholder="Breve descrição do que esse snippet faz"
        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>

    <!-- Code -->
    <div>
      <label for="code" class="block text-sm font-medium text-zinc-300 mb-1.5">
        Código <span class="text-red-400">*</span>
      </label>
      <textarea
        id="code"
        name="code"
        bind:value={code}
        placeholder="Cole ou escreva seu código aqui..."
        required
        rows={16}
        spellcheck={false}
        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
      ></textarea>
    </div>

    <!-- Tags -->
    <div>
      <label for="tags" class="block text-sm font-medium text-zinc-300 mb-1.5">
        Tags <span class="text-zinc-600">(separadas por vírgula, máx. 5)</span>
      </label>
      <input
        id="tags"
        name="tags"
        type="text"
        bind:value={tagsRaw}
        placeholder="react, hooks, typescript"
        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>

    <!-- Submit -->
    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={submitting}
        class="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
      >
        {submitting ? 'Salvando...' : 'Salvar Snippet'}
      </button>
      <a
        href="/snippets"
        class="px-6 py-2.5 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 rounded-lg text-sm font-medium transition-colors"
      >
        Cancelar
      </a>
    </div>
  </form>
</div>
