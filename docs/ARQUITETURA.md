# Arquitetura do portfólio

## Requisitos

**Funcionais**
- Abertura com uma bancada eletrônica interativa: ESP32 numa protoboard com HC-SR04, display OLED, LED e servo (cancela), o firmware sendo digitado num editor e um monitor serial ao vivo. O sensor mede a distância até o cursor; abaixo de 30 cm a vaga fica ocupada, o LED acende e a cancela abre. O botão EN reinicia a placa.
- Depois da abertura, página no formato de ficha técnica (datasheet) de componente: no desktop, barra lateral fixa com perfil, "características" e índice numerado que acompanha a rolagem; à direita, as seções 01 Sobre, 02 Atividade (Figura 1, ao vivo), 03 Projetos, 04 Pinagem (Figura 2: a stack como um CI DIP-18), 05 Trajetória e 06 Contato. No celular, tudo vira uma coluna e a pinagem vira tabela de pinos.
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
| Bancada | `components/bancada/Bancada.tsx` | Estado da "placa": boot com atrasos reais (espera a resposta do GitHub até 5 s), depois um ponteiro de execução anda pelas linhas do `loop()` a cada 110 ms e cada linha tem efeito (`sonar.read` mede, `digitalWrite` acende o LED, `cancela.write` move o servo, `Serial.printf` escreve no monitor). Sem mouse (toque), a distância vem de um objeto simulado. |
| Desenho da placa | `components/bancada/Placa.tsx` | SVG com as peças em cores reais; ondas do sonar e pulsos nos fios de dados em CSS, desligados com `prefers-reduced-motion`. |
| Editor | `components/bancada/Editor.tsx`, `codigo.ts` | Digita o firmware e depois destaca a linha em execução; abas com TypeScript e PHP. Realce de sintaxe com um tokenizador de uma regex, sem biblioteca. |
| Monitor serial | `components/bancada/Serial.tsx` | Log com etiquetas coloridas; só rola sozinho se a pessoa não subiu para ler. |
| Traço lógico | `components/Onda.tsx` | Sinal digital rolando ao lado do título de cada seção. |
| Barra lateral | `components/Lateral.tsx` | Perfil, tabela "Características" (status, local, hora com fuso relativo ao visitante, formação, e-mail), índice numerado e redes. Fixa (`sticky`) no desktop; no celular vira o topo da página. |
| Índice ativo | `useSecaoAtiva` em `App.tsx` | `IntersectionObserver` nas seções para acender o item do índice que está na tela. |
| Pinagem | `components/Pinagem.tsx` | A stack como um CI DIP-18 em SVG: pinos 1–9 descem à esquerda, 10–18 sobem à direita, 9 = GND e 18 = VCC. Hover ou foco no pino mostra a função e em quantos projetos a tecnologia aparece. No celular, tabela de pinos. |
| Contribuições | `components/Contribuicoes.tsx`, `lib/atividade.ts` | Calendário do último ano em SVG que escala com a coluna, 5 níveis de âmbar, dica no hover; no celular rola e começa nas semanas recentes. Cache de 5 min e nova busca a cada 5 min com a aba visível. |
| Página inicial | `components/Inicio.tsx` | As seis seções numeradas, na ordem. |
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
| **SVG desenhado à mão** (pinagem, calendário) em vez de biblioteca de gráficos | Traço nítido em qualquer resolução, segue o tema via variáveis CSS, sem dependência | Mais código próprio para manter |
| **Barra lateral fixa** no desktop | Ocupa a largura da tela e deixa perfil e navegação sempre à mão | Em telas entre 1024 e 1200 px a coluna de conteúdo fica mais estreita |
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
