# Arquitetura do portfólio

## Requisitos

**Funcionais**
- Página única em coluna, no estilo "caderno técnico": capa com placa de circuito isométrica (Fig. 1), perfil, informações, redes, gráfico de contribuições ao vivo (Fig. 2), sobre, projetos, stack, trajetória e contato.
- Projetos agrupados por categoria, com data de execução, do mais recente ao mais antigo; cada um com página própria (`#/projetos/<id>`), com anterior/próximo.
- Atividade do GitHub ao vivo, para mostrar que o trabalho continua.
- Links diretos para seções (`#/stack`) e botão voltar funcionando.
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
| Linhas-guia | `.linha-cima`, `.linha-baixo`, `.linha-direita`, `.listra` no CSS | A coluna central (max-w-3xl) tem bordas laterais; as linhas horizontais e as faixas hachuradas são pseudo-elementos de 200vw, então atravessam a tela sem criar rolagem lateral (`overflow-x: clip` no body). |
| Capa isométrica | `components/CapaIsometrica.tsx` | Placa, chip, conector e trilhas descritos em coordenadas (x, y, z) e projetados em isométrico. Pulsos de sinal com `<animateMotion>` ao longo das trilhas; somem com `prefers-reduced-motion`. |
| Contribuições | `components/Contribuicoes.tsx`, `lib/atividade.ts` | Calendário do último ano em SVG, escala de cinza de 5 níveis, dica no hover; no celular começa rolado nas semanas recentes. Cache de 5 min e nova busca a cada 5 min com a aba visível. |
| Página inicial | `components/Home.tsx` | Todas as seções, na ordem. |
| Página de projeto | `components/PaginaProjeto.tsx` | Foto ou capa gerada, metadados, destaques, stack, links e navegação anterior/próximo. |
| Rotas | `lib/rota.ts` | Hash (`#/secao` ou `#/projetos/<id>`): funciona em qualquer servidor estático. |
| Capas geradas | `components/Capa.tsx` | Trecho de placa em SVG gerado do id do projeto, para quem não tem foto. |
| Ícones da stack | `data/stack.ts` | Caminhos SVG do pacote simple-icons, em currentColor (monocromático nos dois temas). |

## Decisões e trade-offs

| Decisão | Por quê | O que se perde |
|---|---|---|
| **Vite + React** (SPA) em vez de Next.js/Astro | Sem servidor de SSR para manter; build simples | SEO um pouco pior que HTML pré-renderizado; as meta tags do `index.html` cobrem o básico |
| **Conteúdo em `.ts`** em vez de CMS | Tipado: o TypeScript acusa campo faltando; muda com um commit | Precisa de rebuild para atualizar texto |
| **Projetos curados à mão** | A maioria dos projetos relevantes é privada; a curadoria conta melhor a história | Repositório novo não aparece sozinho |
| **Atividade via API de terceiros** (jogruber) | É o único jeito de ler o calendário de contribuições do navegador sem token | Se o serviço cair, o cartão mostra "não consegui falar com o GitHub" e o resto do site segue normal |
| **Commits privados só como número** | O calendário conta contribuições privadas (com a opção ligada no perfil) sem expor nome de repositório | Não dá para dizer em qual projeto privado foi o commit |
| **SVG isométrico** em vez de canvas ou WebGL | Traço nítido em qualquer resolução, segue o tema via variáveis CSS, sem dependência | Cena fixa, sem interação com o cursor |
| **Caddy** em vez de Nginx | HTTPS automático sem certbot; config curta | — |

## Segurança e privacidade

- Sem formulário e sem backend: o contato é `mailto:`, então não há endpoint para abusar.
- Cabeçalhos no Caddy: `nosniff`, `X-Frame-Options DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Projetos da empresa não entram no portfólio; a categoria "Profissional" só aparece quando houver projeto nela.

## O que revisitar se crescer

- **Blog ou estudos de caso longos** → migrar para Astro (páginas pré-renderizadas, MDX) mantendo os componentes React.
- **Prints dos sistemas** → colocar em `public/` e usar no campo `imagem` do projeto.
- **Inglês** → duplicar `src/data` por idioma e adicionar um seletor.
- **Métricas de visita** → Plausible ou Umami self-hosted no mesmo compose, sem cookies.
- **Deploy automático** → GitHub Actions construindo a imagem e publicando na VPS por SSH.
