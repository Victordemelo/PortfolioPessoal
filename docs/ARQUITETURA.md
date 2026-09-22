# Arquitetura do portfólio

## Requisitos

**Funcionais**
- Página inicial em painel (bento) com cartões: identificação, projetos, atividade, hardware, stack, trajetória e contato.
- Cada cartão abre um painel detalhado; projetos agrupados por categoria (profissional, pessoal, acadêmico), com data de execução, em ordem do mais recente ao mais antigo, e cada um com página própria.
- Atividade do GitHub ao vivo (calendário de contribuições, barras por mês, pushes recentes), para mostrar que o trabalho continua.
- Links diretos compartilháveis (`#/projetos/stabilmoney`) e botão voltar funcionando.
- Tema claro e escuro; funciona no celular.

**Não funcionais**
- Sem backend e sem banco: nada para manter ou proteger além de arquivos estáticos.
- Carregamento rápido; animações que respeitam `prefers-reduced-motion`.
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

  No navegador do visitante (sem passar pelo servidor):
    github-contributions-api.jogruber.de  → calendário de contribuições (CORS liberado)
    api.github.com/users/…/events/public  → pushes recentes (60 req/h por IP)
    avatars / raw.githubusercontent.com   → foto e imagens
```

O Dockerfile é multi-stage: o estágio `node` gera o `dist/` e o estágio final leva só o Caddy e os arquivos.

## Componentes

| Peça | Arquivo | Papel |
|---|---|---|
| Fundo de circuito | `components/FundoCircuito.tsx` | Canvas com trilhas geradas (curvas de 45°), pulsos de sinal e "ponta de prova" no cursor. As trilhas são pré-renderizadas em canvas fora da tela; cada quadro só copia a base, recorta a área acesa em volta do cursor e desenha os pulsos. Pausa com a aba oculta. |
| Painel (bento) | `components/Bento.tsx`, `.bento` no CSS | Grade com `grid-template-areas`: 6 colunas no desktop, 2 no tablet, 1 no celular. |
| Cartão | `components/Cartao.tsx` | Moldura com designador de componente (U1, J1, D1…), brilho que segue o cursor e botão que cobre o cartão inteiro. |
| Gaveta | `components/Gaveta.tsx` | Painel que nasce no retângulo do cartão e cresce até o centro. Anima `top/left/width/height` (não `scale`) para o texto não deformar. Esc fecha, trava a rolagem e devolve o foco. |
| Rotas | `lib/rota.ts` | Hash (`#/painel/item`): funciona em qualquer servidor estático, sem regra de rewrite. |
| Atividade | `lib/atividade.ts`, `components/graficos.tsx` | Busca, cache de 5 min no `sessionStorage`, nova busca a cada 5 min com a aba visível. Heatmap em escala de um só matiz (cobre) e barras mensais, ambos com dica no hover. |
| Capas | `components/Capa.tsx` | Trecho de placa em SVG gerado a partir do id do projeto (sempre o mesmo desenho para o mesmo projeto) para quem não tem foto. |

## Decisões e trade-offs

| Decisão | Por quê | O que se perde |
|---|---|---|
| **Vite + React** (SPA) em vez de Next.js/Astro | Sem servidor de SSR para manter; build simples | SEO um pouco pior que HTML pré-renderizado; as meta tags do `index.html` cobrem o básico |
| **Conteúdo em `.ts`** em vez de CMS | Tipado: o TypeScript acusa campo faltando; muda com um commit | Precisa de rebuild para atualizar texto |
| **Projetos curados à mão** | A maioria dos projetos relevantes é privada; a curadoria conta melhor a história | Repositório novo não aparece sozinho |
| **Atividade via API de terceiros** (jogruber) | É o único jeito de ler o calendário de contribuições do navegador sem token | Se o serviço cair, o cartão mostra "não consegui falar com o GitHub" e o resto do site segue normal |
| **Commits privados só como número** | O calendário conta contribuições privadas (com a opção ligada no perfil) sem expor nome de repositório | Não dá para dizer em qual projeto privado foi o commit |
| **Canvas 2D** em vez de WebGL/Three.js | Leve, sem dependência, suficiente para linhas e pontos | Sem efeitos 3D |
| **Caddy** em vez de Nginx | HTTPS automático sem certbot; config curta | — |

## Segurança e privacidade

- Sem formulário e sem backend: o contato é `mailto:`, então não há endpoint para abusar.
- Cabeçalhos no Caddy: `nosniff`, `X-Frame-Options DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Projetos da empresa aparecem só em nível de produto, sem link para código privado, painel administrativo ou detalhe interno.

## O que revisitar se crescer

- **Blog ou estudos de caso longos** → migrar para Astro (páginas pré-renderizadas, MDX) mantendo os componentes React.
- **Prints dos sistemas** → colocar em `public/` e usar no campo `imagem` do projeto.
- **Inglês** → duplicar `src/data` por idioma e adicionar um seletor.
- **Métricas de visita** → Plausible ou Umami self-hosted no mesmo compose, sem cookies.
- **Deploy automático** → GitHub Actions construindo a imagem e publicando na VPS por SSH.
