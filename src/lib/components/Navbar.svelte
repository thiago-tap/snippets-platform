<script lang="ts">
  import { Code2, Plus, LogOut, Github } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { user }: { user: App.Locals['user'] } = $props();
</script>

<header class="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-bold text-lg shrink-0">
      <Code2 class="w-5 h-5 text-indigo-400" />
      <span class="text-zinc-100">SnipHub</span>
    </a>

    <!-- Nav links -->
    <nav class="flex items-center gap-1 flex-1">
      <a
        href="/"
        class="px-3 py-1.5 text-sm rounded-md transition-colors {$page.url.pathname === '/'
          ? 'text-zinc-100 bg-zinc-800'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'}"
      >
        Explorar
      </a>
      {#if user}
        <a
          href="/snippets"
          class="px-3 py-1.5 text-sm rounded-md transition-colors {$page.url.pathname.startsWith('/snippets') && $page.url.pathname !== '/snippets/new'
            ? 'text-zinc-100 bg-zinc-800'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'}"
        >
          Meus Snippets
        </a>
      {/if}
    </nav>

    <!-- Actions -->
    <div class="flex items-center gap-2 shrink-0">
      {#if user}
        <a
          href="/snippets/new"
          class="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span class="hidden sm:inline">Novo</span>
        </a>
        <div class="flex items-center gap-2 pl-3 border-l border-zinc-800">
          <img
            src={user.avatarUrl ?? `https://github.com/${user.username}.png`}
            alt={user.username}
            class="w-7 h-7 rounded-full ring-1 ring-zinc-700"
          />
          <span class="text-sm text-zinc-300 hidden sm:inline">{user.username}</span>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              title="Sair"
              class="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors rounded-md hover:bg-zinc-800"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </form>
        </div>
      {:else}
        <a
          href="/auth/github"
          class="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          <Github class="w-4 h-4" />
          Entrar
        </a>
      {/if}
    </div>
  </div>
</header>
