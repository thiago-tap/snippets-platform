<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: () => unknown } = $props();
</script>

<svelte:head>
  <title>SnipHub — Plataforma de Code Snippets</title>
  <meta
    name="description"
    content="Salve, organize e compartilhe seus snippets de código com syntax highlighting e explicação por IA."
  />
</svelte:head>

<Navbar user={data.user} />

<main class="min-h-screen">
  {@render children()}
</main>
