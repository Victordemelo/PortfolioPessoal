# Arquitetura do portfólio

## Requisitos

**Funcionais**
- Apresentar perfil, projetos (com filtro por categoria), trajetória, stack e contato.
- Links para os sistemas em produção, repositórios públicos e a simulação do Arduino.
- Tema claro e escuro, e layout que funcione no celular.

**Não funcionais**
- Sem backend e sem banco: nada para manter ou proteger além de arquivos estáticos.
- Carregamento rápido (poucos KB de JS, assets com cache longo).
- HTTPS automático e deploy com um comando.
- Conteúdo editável sem mexer em componente.

**Premissas**
- Tráfego baixo (dezenas a centenas de visitas por dia). Um container pequeno sobra.
- Uma pessoa mantém o site.

## Visão geral

```
  build (máquina local ou CI)                     VPS
 ┌───────────────────────────┐      ┌──────────────────────────────┐
 │ src/data/*.ts  (conteúdo) │      │ container caddy:2-alpine     │
 │ src/components (UI)       │ ──▶  │  /srv  ← dist/ do Vite       │ ◀── HTTPS ── visitante
 │ vite build → dist/        │      │  TLS automático (Let's Enc.) │
 └───────────────────────────┘      └──────────────────────────────┘
                                                   │ imagens externas
                                                   ▼
                                    avatars.githubusercontent.com
                                    raw.githubusercontent.com
```

O Dockerfile é multi-stage: o estágio `node` gera o `dist/` e o estágio final leva só o Caddy e os arquivos. A imagem final fica em torno de 50 MB e não tem Node.

## Decisões e trade-offs

| Decisão | Por quê | O que se perde |
|---|---|---|
| **Vite + React** (SPA de página única) em vez de Next.js/Astro | Sem servidor de SSR para manter; build simples; React é o que você já usa no Remote Wake | SEO um pouco pior que HTML pré-renderizado. Para um portfólio de uma página, as meta tags do `index.html` resolvem |
| **Conteúdo em arquivos `.ts`** em vez de CMS ou JSON remoto | Tipado: o TypeScript acusa campo faltando; muda com um commit | Precisa de rebuild para atualizar texto |
| **Projetos curados à mão** em vez de listar repositórios pela API do GitHub | A maioria dos projetos relevantes é privada; a API limita 60 req/h por IP sem token; a curadoria conta melhor a história | Repositório novo não aparece sozinho |
| **Caddy** em vez de Nginx | HTTPS automático sem certbot; config curta | Nenhuma relevante nesse tamanho |
| **Tailwind v4 + variáveis CSS** para os temas | Troca de tema sem JS no caminho crítico (o script no `<head>` aplica antes do primeiro paint) | — |
| **Motion** para animações | Animação de entrada e do filtro com pouco código; respeita `prefers-reduced-motion` via CSS | ~30 KB gzip a mais |

## Segurança

- Sem formulário e sem backend: o contato é `mailto:`, então não há endpoint para abusar.
- Cabeçalhos no Caddy: `nosniff`, `X-Frame-Options DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Projetos da empresa aparecem só em nível de produto, sem link para código privado nem detalhes internos.

## O que revisitar se crescer

- **Blog ou estudos de caso longos** → migrar para Astro (páginas pré-renderizadas, MDX) mantendo os componentes React.
- **Imagens próprias** (prints dos sistemas) → colocar em `public/` e servir pelo próprio Caddy, com `width/height` e formato WebP/AVIF.
- **Inglês** → duplicar `src/data` por idioma e adicionar um seletor.
- **Métricas de visita** → Plausible ou Umami self-hosted no mesmo compose, sem cookies.
- **Deploy automático** → GitHub Actions construindo a imagem e fazendo `docker compose pull && up -d` na VPS por SSH.
