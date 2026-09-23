# Portfólio · Victor de Melo da Rosa

Site pessoal com projetos, trajetória, stack e contato. É 100% estático: React + TypeScript + Tailwind, gerado pelo Vite e servido pelo Caddy num container.

## Editar o conteúdo

Todo o texto fica em `src/data`. Os componentes só leem esses arquivos.

| Arquivo | O que tem |
|---|---|
| `src/data/perfil.ts` | nome, frase, texto "sobre" e contatos |
| `src/data/projetos.ts` | projetos: categoria, período de execução (`inicio`/`fim`), stack, destaques e links |
| `src/data/trajetoria.ts` | experiência e formação |
| `src/data/stack.ts` | ferramentas agrupadas |

Os projetos aparecem agrupados por categoria e ordenados pela data (`fim: 'atual'` = em andamento, vai para o topo). Sem `imagem`, o projeto ganha uma capa gerada automaticamente.

A atividade do GitHub é buscada no navegador de quem visita. Para os commits de repositórios privados entrarem na contagem, ligue **Private contributions** em github.com → seu perfil → Contribution settings.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:5173.

## Rodar com Docker

```bash
cp .env.example .env
docker compose up -d --build
```

Abre em http://localhost:8088.

## Produção

```
Visitante → Cloudflare (proxy, SSL Full strict) → Nginx do servidor (443, Certbot)
          → 127.0.0.1:8080 → container (Caddy na porta 80) → arquivos estáticos
```

O HTTPS é do Nginx + Certbot do servidor; o Caddy só serve HTTP interno e a porta é publicada apenas em `127.0.0.1` (o Docker ignora o firewall do host se publicar em `0.0.0.0`).

`.env` do servidor (não versionado):

```bash
SITE_ADDRESS=:80
HTTP_PORT=8080
```

**Deploy automático:** cada push na `main` compila o site no GitHub Actions e, se passar, roda [`scripts/deploy.sh`](scripts/deploy.sh) no servidor por SSH (atualiza o código, reconstrói o container e confere se subiu). Configuração do servidor e dos secrets em [`docs/DEPLOY.md`](docs/DEPLOY.md).

Deploy na mão, com o repositório em `/opt/apps/victordemelo`:

```bash
/opt/apps/victordemelo/scripts/deploy.sh
```

Teste interno: `curl -I http://127.0.0.1:8080` deve responder `200 OK`.

A decisão de arquitetura está em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## SEO

O build gera, a partir de `src/data`: título, descrição, link canônico, Open Graph e JSON-LD de cada página, uma página pronta para cada projeto em `/projetos/<id>`, `robots.txt` (com os robôs de busca e de IA liberados de forma explícita), `sitemap.xml` e `llms.txt`, um resumo em Markdown para assistentes de IA (ver `seo.ts`). Os serviços e a região atendida (`perfil.servicos` e `perfil.areaAtendida`) aparecem na seção Contato e no JSON-LD. O domínio fica em `perfil.site`.

Imagens em WebP e fontes (IBM Plex, via `@fontsource`) servidas pelo próprio site, sem Google Fonts. A cada deploy, o workflow avisa Bing/Yandex pelo IndexNow (chave em `public/<chave>.txt`).

Depois de publicar: cadastre o site no [Google Search Console](https://search.google.com/search-console) e no [Bing Webmaster Tools](https://www.bing.com/webmasters) (é o índice que o ChatGPT e o Copilot consultam), envie `https://victordemelo.com.br/sitemap.xml` e coloque o link do site no LinkedIn, GitHub e Instagram. Na Cloudflare, confira que **Security → Bots → Block AI bots** está desligado e que o **robots.txt gerenciado** não está ativo, senão os assistentes de IA ficam de fora.
