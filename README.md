# SnipHub

> Plataforma para salvar, organizar e compartilhar code snippets com syntax highlighting e IA.
> Disponível em: [snippets.catiteo.com](https://snippets.catiteo.com)

![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00)
![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/licença-MIT-green)

---

## Sobre o projeto

O **SnipHub** é uma plataforma open-source para desenvolvedores salvarem e compartilharem snippets de código. Construído com **SvelteKit 2** e **Svelte 5 (runes)**, demonstrando um paradigma completamente diferente do React/Next.js.

### Funcionalidades

- Syntax highlighting para 25+ linguagens (Shiki, server-side)
- Login com GitHub OAuth
- Criar, editar e excluir snippets
- Visibilidade pública/privada por snippet
- Tags e filtros por linguagem
- Contagem de visualizações
- **IA**: explicação de código com Cloudflare Workers AI (Llama 3)

---

## Stack tecnológica

```
Framework:   SvelteKit 2 + Svelte 5 (runes)
Database:    Cloudflare D1 (SQLite na edge) + Drizzle ORM
Auth:        GitHub OAuth via Arctic
Highlight:   Shiki (server-side)
Deploy:      Cloudflare Pages
IA:          Cloudflare Workers AI — Llama 3 8B
```

---

## Diferenciais vs DevToolbox (Next.js)

| Aspecto | DevToolbox (Next.js) | SnipHub (SvelteKit) |
| --- | --- | --- |
| Reatividade | `useState`, `useEffect` | Runes: `$state`, `$derived`, `$effect` |
| Componentes | JSX | Templates Svelte (sem Virtual DOM) |
| Forms | Server Actions | SvelteKit Form Actions + `use:enhance` |
| Bundle | React runtime | Compilado — zero runtime |
| Database | Nenhuma | Cloudflare D1 + Drizzle ORM |
| Auth | Nenhuma | GitHub OAuth + Sessions |

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Conta Cloudflare (para D1 e AI)
- App OAuth no GitHub

### 1. Clone e instale

```bash
git clone https://github.com/SEU_USUARIO/snippets-platform.git
cd snippets-platform
npm install
```

### 2. Configure o GitHub OAuth

1. Acesse [github.com/settings/applications/new](https://github.com/settings/applications/new)
2. **Homepage URL**: `http://localhost:5173`
3. **Callback URL**: `http://localhost:5173/auth/callback`
4. Copie o `Client ID` e `Client Secret`

Adicione ao `wrangler.toml` em `[vars]`:
```toml
GITHUB_CLIENT_ID = "seu_client_id"
GITHUB_CLIENT_SECRET = "seu_client_secret"
```

### 3. Crie o banco D1

```bash
# Criar banco no Cloudflare
wrangler d1 create snippets-db

# Copie o database_id gerado para wrangler.toml

# Rodar migration local
wrangler d1 execute snippets-db --local --file=./drizzle/0000_init.sql
```

### 4. Inicie o servidor

```bash
# Servidor de desenvolvimento local (com D1 local e bindings simulados)
wrangler pages dev --compatibility-flag=nodejs_compat -- npm run build

# Ou para desenvolvimento rápido sem bindings:
npm run dev
```

---

## Deploy no Cloudflare Pages

```bash
# 1. Build
npm run build

# 2. Deploy
npm run deploy

# 3. Rodar migration em produção
wrangler d1 execute snippets-db --remote --file=./drizzle/0000_init.sql
```

### Configurar variáveis no dashboard

No Cloudflare Pages → Settings → Environment Variables, adicione:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Atualize também o **Callback URL** do GitHub OAuth para `https://snippets.catiteo.com/auth/callback`.

---

## Estrutura do projeto

```
snippets-platform/
├── src/
│   ├── hooks.server.ts          # Middleware: valida sessão em toda requisição
│   ├── app.html / app.css / app.d.ts
│   ├── lib/
│   │   ├── auth.ts              # GitHub OAuth + sessions
│   │   ├── highlight.ts         # Shiki server-side
│   │   ├── utils.ts             # Utilitários + lista de linguagens
│   │   ├── db/
│   │   │   ├── schema.ts        # Schema Drizzle (users, sessions, snippets)
│   │   │   └── index.ts         # Cliente Drizzle D1
│   │   └── components/
│   │       ├── Navbar.svelte
│   │       └── SnippetCard.svelte
│   └── routes/
│       ├── +layout.svelte / +layout.server.ts
│       ├── +page.svelte / +page.server.ts  # Home: snippets públicos
│       ├── auth/
│       │   ├── github/+server.ts           # Inicia OAuth
│       │   ├── callback/+server.ts         # Callback OAuth
│       │   └── logout/+server.ts           # Logout
│       ├── snippets/
│       │   ├── +page.svelte / +page.server.ts    # Meus snippets
│       │   ├── new/+page.svelte / +page.server.ts
│       │   └── [id]/
│       │       ├── +page.svelte / +page.server.ts
│       │       └── edit/+page.svelte / +page.server.ts
│       └── api/ai/explain/+server.ts       # IA: explicar snippet
├── drizzle/
│   └── 0000_init.sql            # Migration inicial
├── svelte.config.js
├── vite.config.ts
├── wrangler.toml
└── drizzle.config.ts
```

---

## Scripts

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run deploy       # Deploy Cloudflare Pages
npm run db:generate  # Gerar migrations Drizzle
npm run type-check   # Verificação TypeScript
```

---

## Licença

MIT — use à vontade, inclusive comercialmente.

---

Feito com SvelteKit, Tailwind CSS, Drizzle ORM e Cloudflare Workers AI.
