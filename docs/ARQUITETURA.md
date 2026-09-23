# Arquitetura do portfólio

## Requisitos

**Funcionais**
- Abertura com a apresentação em primeiro plano (quem sou, o que faço, botão para o WhatsApp com mensagem pronta) e, no fundo, uma bancada eletrônica animada: ESP32 numa protoboard com HC-SR04, display OLED, LED e servo. O sensor mede a distância até o cursor, o LED acende quando algo chega perto e o servo acompanha. Embaixo, uma faixa de telemetria com automações e integrações.
- Depois da abertura, página no formato de ficha técnica (datasheet) de componente: no desktop, barra lateral fixa com perfil, "características" e índice numerado que acompanha a rolagem; à direita, as seções 01 Sobre, 02 Atividade (Figura 1, ao vivo), 03 Projetos, 04 Pinagem (Figura 2: a stack como um CI DIP-18), 05 Trajetória e 06 Contato. No celular, tudo vira uma coluna e a pinagem vira tabela de pinos.
- Projetos agrupados por categoria, com data de execução, do mais recente ao mais antigo; cada um com página própria (`/projetos/<id>`), com anterior/próximo.
- Atividade do GitHub ao vivo, para mostrar que o trabalho continua.
- Links diretos para seções (`/#stack`) e botão voltar funcionando.
- SEO: cada página com título, descrição, canônico, Open Graph e JSON-LD próprios; conteúdo em HTML puro antes do JS; `robots.txt`, `sitemap.xml` e `llms.txt`; IndexNow a cada deploy.
- Tema claro e escuro; funciona no celular.

**Não funcionais**
- Sem backend e sem banco: nada para manter ou proteger além de arquivos estáticos.
- Carregamento rápido; animações que respeitam `prefers-reduced-motion`.
- HTTPS no Nginx do servidor (Certbot) e deploy com um comando.
- Conteúdo editável sem mexer em componente.

**Premissas**
- Tráfego baixo (dezenas a centenas de visitas por dia). Um container pequeno sobra.
- Uma pessoa mantém o site.

## Visão geral

```
  visitante ──HTTPS──▶ Cloudflare (proxy, SSL Full strict)
                             │
                             ▼
  VPS Oracle Cloud (Ubuntu 24.04 ARM64) ─ só 22, 80 e 443 abertas
   ┌──────────────────────────────────────────────────────────┐
   │ Nginx no host :443 (Certbot) ── real_ip via CF-Connecting-IP
   │        │
   │        ▼ 127.0.0.1:8080  (publicado só em localhost)
   │ container /opt/apps/victordemelo: Caddy :80 → /srv (dist/ do Vite)
   │   headers de segurança, cache, redirect www → domínio principal
   └──────────────────────────────────────────────────────────┘

  No navegador do visitante (sem passar pelo servidor):
    github-contributions-api.jogruber.de  → calendário de contribuições (CORS liberado)
    api.github.com/users/…/events/public  → pushes recentes (60 req/h por IP)
    avatars / raw.githubusercontent.com   → foto e imagens
```

O Dockerfile é multi-stage: o estágio `node` gera o `dist/` e o estágio final leva só o Caddy e os arquivos.

Regras do container para conviver com o servidor:
1. O Caddy não emite certificado nem escuta 443: `SITE_ADDRESS` é sempre `:80`, nunca o domínio.
2. A porta é publicada só em localhost: `"127.0.0.1:${HTTP_PORT:-8088}:80"` (o Docker ignora o firewall do host quando publica em `0.0.0.0`).
3. `.env` do servidor, fora do Git: `SITE_ADDRESS=:80` e `HTTP_PORT=8080`. Local continua em `http://localhost:8088`.
4. Deploy automático: push na `main` → GitHub Actions compila → SSH com forced command roda `scripts/deploy.sh` em `/opt/apps/victordemelo` (clonado com Deploy Key só leitura) → confere o site. Detalhes em [DEPLOY.md](DEPLOY.md).

## Componentes

| Peça | Arquivo | Papel |
|---|---|---|
| Abertura | `components/bancada/Bancada.tsx` | Texto de apresentação sobre a placa (que fica atrás, esmaecida e sem receber clique). A cada 450 ms mede a distância até o cursor (ou de um objeto simulado, no toque), pisca o LED da placa e atualiza LED, servo e display. Faixa de telemetria rolando em CSS. |
| Desenho da placa | `components/bancada/Placa.tsx` | SVG com as peças em cores reais; ondas do sonar e pulsos nos fios de dados em CSS, desligados com `prefers-reduced-motion`. |
| Traço lógico | `components/Onda.tsx` | Sinal digital rolando ao lado do título de cada seção. |
| Barra lateral | `components/Lateral.tsx` | Perfil, "Características" (só na página inicial), conquistas do GitHub, índice e redes. Na página inicial, o índice lista as seções; na página de um projeto, lista as partes do projeto e os outros projetos. Conquistas em `data/conquistas.ts`, emblemas em `public/conquistas/`. Fixa (`sticky`) no desktop. |
| Índice ativo | `useSecaoAtiva` em `App.tsx` | A seção ativa é a última cujo topo passou de uma linha de referência que desce com a rolagem (35% da tela no topo da página, 90% no fim): em página curta cada seção ainda acende em ordem, e no fim acende a última. Serve para o início e para a página do projeto. |
| Pinagem | `components/Pinagem.tsx` | A stack como um CI DIP-18 em SVG: pinos 1–9 descem à esquerda, 10–18 sobem à direita, 9 = GND e 18 = VCC. A cada 3,2 s um pulso de corrente atravessa o chip entre dois pinos que trabalham juntos (lista `PARES`), só com a figura na tela. Com o mouse num pino, a corrente sai dele para todos os parceiros e a legenda mostra a função e as conexões. No celular, tabela de pinos. |
| Contribuições | `components/Contribuicoes.tsx`, `lib/atividade.ts` | Calendário do último ano em SVG que escala com a coluna, 5 níveis de âmbar, dica no hover; no celular rola e começa nas semanas recentes. Cache de 5 min e nova busca a cada 5 min com a aba visível. |
| Página inicial | `components/Inicio.tsx` | As seis seções numeradas, na ordem. |
| Página de projeto | `components/PaginaProjeto.tsx` | Foto ou capa gerada, metadados, destaques, stack, links e navegação anterior/próximo. |
| Rotas | `lib/rota.ts` | Caminhos de verdade (`/projetos/<id>`) para cada projeto ser indexável; seções por âncora (`/#projetos`). Cliques em links internos são interceptados (sem recarregar); links antigos com `#/` são convertidos. |
| SEO | `seo.ts` (plugin do Vite) | No build, a partir de `src/data`: `<head>` de cada página (título, descrição, canônico, Open Graph, Twitter, JSON-LD `Person`/`ProfilePage`/`SoftwareSourceCode` com `sameAs` para GitHub, LinkedIn, Instagram e WhatsApp), conteúdo em HTML puro dentro do `#root`, `projetos/<id>/index.html` pré-gerado, `robots.txt` (robôs de IA liberados explicitamente), `sitemap.xml` e `llms.txt`. O JSON-LD da pessoa inclui `makesOffer` (serviços de `perfil.servicos`, com `areaServed`) e `knowsLanguage`. O domínio vem de `perfil.site`. |
| Imagens de compartilhamento | `public/og.png`, ícones | Prévia 1200×630 e ícones (192, 512, Apple) renderizados a partir de HTML; `site.webmanifest` para instalar no celular. |
| Capas dos projetos | `components/Capas.tsx`, `components/marcas.ts` | Uma ilustração SVG animada por projeto, a partir do que o repositório faz: Remote Wake (simulador: LIGAR manda o magic packet e o PC dá boot no Linux e fica ligado; DESLIGAR faz o agente digitar `sudo shutdown -h now` e o PC desliga; clicável na página do projeto, demonstração automática na miniatura), StabilMoney (ícone do app vetorizado do repositório + reservado e disponível variando), Fluxo de Agentes (etapas acendendo uma a uma), BigData (barras, rosca e linha em movimento), Empréstimos (seleção percorrendo a tabela). Animações em CSS, estado final estático com `prefers-reduced-motion`. |
| Capa genérica | `components/Capa.tsx` | Trecho de placa gerado do id, para projeto novo que ainda não tem capa própria. |
| Última atividade | `lib/repos.ts` | Data do último push de cada repositório público (API do GitHub, cache de 10 min); projeto em andamento mostra "última atividade em DD/MM/AAAA". Privado usa `ultimaAtividade` do arquivo de dados. |
| Ícones da stack | `data/stack.ts` | Caminhos SVG do pacote simple-icons, em currentColor (monocromático nos dois temas). |

## Decisões e trade-offs

| Decisão | Por quê | O que se perde |
|---|---|---|
| **Vite + React** (SPA) em vez de Next.js/Astro | Sem servidor de SSR para manter; build simples | Nada de SSR: o `seo.ts` compensa gerando no build o HTML de cada página (meta tags e conteúdo) |
| **Conteúdo em `.ts`** em vez de CMS | Tipado: o TypeScript acusa campo faltando; muda com um commit | Precisa de rebuild para atualizar texto |
| **Projetos curados à mão** | A maioria dos projetos relevantes é privada; a curadoria conta melhor a história | Repositório novo não aparece sozinho |
| **Atividade via API de terceiros** (jogruber) | É o único jeito de ler o calendário de contribuições do navegador sem token | Se o serviço cair, o cartão mostra "não consegui falar com o GitHub" e o resto do site segue normal |
| **Commits privados só como número** | O calendário conta contribuições privadas (com a opção ligada no perfil) sem expor nome de repositório | Não dá para dizer em qual projeto privado foi o commit |
| **SVG desenhado à mão** (pinagem, calendário) em vez de biblioteca de gráficos | Traço nítido em qualquer resolução, segue o tema via variáveis CSS, sem dependência | Mais código próprio para manter |
| **Barra lateral fixa** no desktop | Ocupa a largura da tela e deixa perfil e navegação sempre à mão | Em telas entre 1024 e 1200 px a coluna de conteúdo fica mais estreita |
| **Caddy dentro do container, atrás do Nginx do servidor** | O Nginx + Certbot já cuidam do HTTPS de todos os apps do servidor; o Caddy só serve os arquivos com headers, cache e redirect de www, que ficam versionados junto com o site | Dois servidores web na frente de um site estático; o modo "Caddy sozinho com HTTPS" deixou de ser suportado |

## Segurança e privacidade

- Sem formulário e sem backend: o contato é por link do WhatsApp (`wa.me` com mensagem pronta) e `mailto:`, então não há endpoint para abusar.
- Cabeçalhos no Caddy: `nosniff`, `X-Frame-Options DENY`, `Referrer-Policy`, `Permissions-Policy`.
- Projetos da empresa não entram no portfólio; a categoria "Profissional" só aparece quando houver projeto nela.

## O que revisitar se crescer

- **Blog ou estudos de caso longos** → migrar para Astro (páginas pré-renderizadas, MDX) mantendo os componentes React.
- **Prints dos sistemas** → colocar em `public/` e usar no campo `imagem` do projeto.
- **Inglês** → duplicar `src/data` por idioma e adicionar um seletor.
- **Métricas de visita** → Plausible ou Umami self-hosted no mesmo compose, sem cookies.
- **Imagem pronta no registro** → hoje o build do Docker roda no servidor (ARM64); se ficar lento, o Actions pode gerar a imagem multi-arquitetura no GHCR e o servidor só faz `docker compose pull`.
