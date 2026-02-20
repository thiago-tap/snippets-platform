# SnipHub

> Plataforma open-source para salvar, organizar e compartilhar code snippets com syntax highlighting server-side e explicação por IA.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-snippets.catiteo.com-6366f1?style=for-the-badge)](https://snippets.catiteo.com/)

**Live:** [snippets.catiteo.com](https://snippets.catiteo.com/) · **Repositório:** [github.com/thiago-tap/snippets-platform](https://github.com/thiago-tap/snippets-platform)

![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00?logo=svelte&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-5_(runes)-FF3E00?logo=svelte&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/licença-MIT-22c55e)

---

## Sobre o projeto

O **SnipHub** é uma plataforma para desenvolvedores salvarem snippets de código com syntax highlighting, organizarem por linguagem e tags, e receberem explicações geradas por IA. O projeto foi construído para demonstrar o ecossistema **SvelteKit 2 + Svelte 5 (runes)** como alternativa ao React/Next.js, com infraestrutura 100% no edge da Cloudflare.

### Por que SvelteKit?

- **Zero Virtual DOM** — Svelte compila para JavaScript vanilla, sem overhead de runtime
- **Runes (`$state`, `$derived`, `$effect`)** — reatividade explícita e previsível, sem hooks
- **Form Actions + `use:enhance`** — formulários progressivos sem JavaScript client-side necessário
- **SSR nativo** — tudo renderizado no servidor por padrão
- **Bundle minúsculo** — sem React (45kb) ou outros frameworks no bundle final

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| Syntax Highlighting | 25+ linguagens com Shiki (server-side, sem flash) |
| GitHub OAuth | Login seguro via OAuth 2.0 com sessões persistentes |
| CRUD de Snippets | Criar, editar, excluir com validação server-side |
| Visibilidade | Snippets públicos (visíveis a todos) ou privados (só dono) |
| Tags | Organização por tags livres + filtro por linguagem |
| Contagem de views | Incremento assíncrono (não bloqueia o render) |
| Explicação por IA | Llama 3 8B via Cloudflare Workers AI explica o código em PT-BR |
| Edge Deploy | Deploy global via Cloudflare Pages + D1 na edge |

---

## Stack tecnológica

```
Framework:    SvelteKit 2.x + Svelte 5 (runes)
Linguagem:    TypeScript 5
Estilo:       Tailwind CSS 4 (via @tailwindcss/vite)
Database:     Cloudflare D1 (SQLite distribuído na edge)
ORM:          Drizzle ORM (type-safe, zero overhead)
Auth:         GitHub OAuth 2.0 via Arctic v2
Highlight:    Shiki 1.x (server-side, cached no módulo)
IA:           Cloudflare Workers AI — @cf/meta/llama-3-8b-instruct
Deploy:       Cloudflare Pages (adapter-cloudflare)
```

---

## Comparativo: SvelteKit vs Next.js

Este projeto existe ao lado do [DevToolbox](https://github.com/thiago-tap/developer-toolbox) (Next.js 15) para demonstrar os dois paradigmas na prática.

| Aspecto | DevToolbox — Next.js 15 | SnipHub — SvelteKit 2 |
|---|---|---|
| Reatividade | `useState`, `useEffect`, `useMemo` | `$state`, `$derived`, `$effect` (runes) |
| Componentes | JSX + React runtime (45kb) | Templates compilados — zero runtime |
| Formulários | Server Actions | Form Actions + `use:enhance` |
| Renderização | React Server Components | SSR nativo com `+page.server.ts` |
| Database | — | Cloudflare D1 + Drizzle ORM |
| Auth | — | GitHub OAuth + cookie sessions |
| Bundle | React no cliente | Compilado, sem framework no bundle |
| Deploy | Cloudflare Pages (OpenNext) | Cloudflare Pages (adapter nativo) |

---

## Arquitetura

```
snippets-platform/
├── src/
│   ├── app.html                          # Template HTML base
│   ├── app.css                           # Estilos globais + Tailwind
│   ├── app.d.ts                          # Types globais (Platform, Locals)
│   ├── hooks.server.ts                   # Middleware: valida sessão em toda requisição
│   │
│   ├── lib/
│   │   ├── auth.ts                       # GitHub OAuth, sessions, upsert de usuário
│   │   ├── highlight.ts                  # Shiki (inicializado uma vez, cached)
│   │   ├── utils.ts                      # parseTags, formatDate, LANGUAGES, generateId
│   │   ├── db/
│   │   │   ├── schema.ts                 # Tabelas: users, sessions, snippets (Drizzle)
│   │   │   └── index.ts                  # getDb(D1Database) → DrizzleD1Database
│   │   └── components/
│   │       ├── Navbar.svelte             # Barra de navegação com user avatar
│   │       └── SnippetCard.svelte        # Card de snippet com preview e metadados
│   │
│   └── routes/
│       ├── +layout.server.ts             # Passa user para todas as páginas
│       ├── +layout.svelte                # Layout global com Navbar
│       ├── +page.svelte                  # Home: lista snippets públicos + filtro
│       ├── +page.server.ts               # Load: busca snippets públicos do D1
│       │
│       ├── auth/
│       │   ├── github/+server.ts         # GET → gera state, redireciona para GitHub
│       │   ├── callback/+server.ts       # GET → troca code por token, cria sessão
│       │   └── logout/+server.ts         # POST → deleta sessão, limpa cookie
│       │
│       ├── snippets/
│       │   ├── +page.svelte              # "Meus Snippets" (requer auth)
│       │   ├── +page.server.ts           # Load: snippets do usuário logado
│       │   ├── new/
│       │   │   ├── +page.svelte          # Formulário de criação
│       │   │   └── +page.server.ts       # Action: valida + insere no D1
│       │   └── [id]/
│       │       ├── +page.svelte          # Visualização com código highlighted + IA
│       │       ├── +page.server.ts       # Load + action delete
│       │       └── edit/
│       │           ├── +page.svelte      # Formulário de edição
│       │           └── +page.server.ts   # Actions: update + delete
│       │
│       └── api/
│           └── ai/explain/+server.ts     # POST → Workers AI explica o snippet
│
├── drizzle/
│   └── 0000_init.sql                     # Migration SQL inicial (users, sessions, snippets)
│
├── svelte.config.js                      # Adapter Cloudflare + vitePreprocess
├── vite.config.ts                        # @tailwindcss/vite plugin
├── tsconfig.json                         # Extends .svelte-kit/tsconfig.json
├── drizzle.config.ts                     # Config do Drizzle Kit (migrations)
└── wrangler.toml                         # D1 binding, AI binding, Pages config
```

---

## Schema do banco de dados

```sql
-- Usuários autenticados via GitHub
users (id, github_id, username, name, avatar_url, created_at)

-- Sessões de autenticação (cookie httpOnly, 30 dias)
sessions (id, user_id → users, expires_at)

-- Snippets de código
snippets (
  id, user_id → users,
  title, description, code,
  language,          -- ex: "javascript", "python"
  tags,              -- JSON array armazenado como text: '["react","hooks"]'
  is_public,         -- 0 = privado, 1 = público
  views,             -- incrementado assincronamente
  created_at, updated_at
)
```

**Índices:** `user_id`, `language`, `created_at`, `is_public` — otimizados para os filtros mais comuns.

---

## Como rodar localmente

### Pré-requisitos

- Node.js 22+
- Conta na [Cloudflare](https://cloudflare.com) (gratuita)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) instalado globalmente ou via `npx`
- OAuth App criado no GitHub

### 1. Clone e instale

```bash
git clone https://github.com/thiago-tap/snippets-platform.git
cd snippets-platform
npm install
```

### 2. Crie o banco D1

```bash
# Fazer login no Cloudflare (abre o browser)
npx wrangler login

# Criar o banco D1
npx wrangler d1 create snippets-db
```

Copie o `database_id` gerado e atualize o `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "snippets-db"
database_id = "SEU_DATABASE_ID_AQUI"
```

### 3. Rode a migration inicial

```bash
# Criar as tabelas no banco local
npx wrangler d1 execute snippets-db --local --file=./drizzle/0000_init.sql

# Criar as tabelas no banco remoto (produção)
npx wrangler d1 execute snippets-db --remote --file=./drizzle/0000_init.sql
```

### 4. Configure o GitHub OAuth

1. Acesse [github.com/settings/applications/new](https://github.com/settings/applications/new)
2. Preencha:
   - **Application name**: SnipHub (dev)
   - **Homepage URL**: `http://localhost:5173`
   - **Callback URL**: `http://localhost:5173/auth/callback`
3. Clique em **Register application**
4. Gere um **Client Secret**

Crie um arquivo `.dev.vars` na raiz (nunca commitar):

```bash
GITHUB_CLIENT_ID=seu_client_id
GITHUB_CLIENT_SECRET=seu_client_secret
```

### 5. Inicie o servidor

```bash
# Desenvolvimento com bindings reais (D1, AI) simulados pelo Wrangler
npx wrangler pages dev -- npm run dev

# Ou apenas Vite (sem bindings — auth não funciona)
npm run dev
```

Acesse: `http://localhost:5173`

---

## Deploy no Cloudflare Pages

### Via GitHub (recomendado)

1. No [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages**
2. Conecte o repositório `thiago-tap/snippets-platform`
3. Configure o build:
   - **Framework preset**: SvelteKit
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/cloudflare`
4. Clique em **Save and Deploy**

### Variáveis de ambiente obrigatórias

No Cloudflare Pages → **Settings** → **Variables and Secrets**:

| Variável | Descrição |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID do OAuth App do GitHub |
| `GITHUB_CLIENT_SECRET` | Client Secret do OAuth App do GitHub |

### Bindings obrigatórios

No Cloudflare Pages → **Settings** → **Functions**:

| Tipo | Binding | Recurso |
|---|---|---|
| D1 Database | `DB` | `snippets-db` |
| Workers AI | `AI` | (ativar AI no projeto) |

> Esses bindings também podem ser declarados no `wrangler.toml`, que já está configurado no repositório.

### Atualizar o GitHub OAuth App para produção

No GitHub → **Settings → Developer settings → OAuth Apps → Snippets Platform**:
- **Homepage URL**: `https://snippets.catiteo.com`
- **Callback URL**: `https://snippets.catiteo.com/auth/callback`

---

## Scripts disponíveis

```bash
npm run dev          # Servidor de desenvolvimento Vite
npm run build        # Build de produção (.svelte-kit/cloudflare)
npm run preview      # Preview do build local
npm run deploy       # Deploy manual para Cloudflare Pages
npm run db:generate  # Gerar nova migration com Drizzle Kit
npm run db:studio    # Abrir Drizzle Studio (interface visual do banco)
npm run type-check   # Verificação TypeScript completa
npm run lint         # Lint com svelte-check
```

---

## Decisões técnicas

### Por que Cloudflare D1?

D1 é SQLite distribuído na edge, o que significa latência ultra-baixa para leituras e zero custo no plano gratuito (5GB de armazenamento, 25M rows lidos/dia). O Drizzle ORM gera queries type-safe sem overhead, e as migrations são simples arquivos `.sql`.

### Por que Shiki server-side?

Shiki gera HTML com syntax highlighting no servidor (SSR), eliminando o flash de código sem highlight que acontece com soluções client-side como highlight.js. O highlighter é inicializado uma vez e cached no módulo — em Cloudflare Workers, isso persiste entre requisições na mesma instância.

### Por que Arctic para OAuth?

Arctic é uma biblioteca TypeScript minimalista para OAuth 2.0 que suporta 50+ providers. Diferente do NextAuth/Auth.js, não impõe uma estrutura de banco de dados e funciona perfeitamente em ambientes edge como Cloudflare Workers, onde Node.js crypto APIs podem não estar disponíveis.

### Sessions via cookie httpOnly

As sessões são armazenadas na tabela `sessions` do D1 com expiração de 30 dias. O cookie é `httpOnly` (protegido contra XSS) e `sameSite=lax`. A validação ocorre em `hooks.server.ts` — executado antes de toda requisição — e o resultado é injetado em `event.locals.user`.

---

## Licença

MIT — use à vontade, inclusive comercialmente.

---

Construído com SvelteKit 2, Svelte 5 (runes), Tailwind CSS 4, Drizzle ORM e Cloudflare Workers AI.
