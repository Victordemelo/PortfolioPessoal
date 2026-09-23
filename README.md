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

## Publicar numa VPS

1. Aponte o domínio (registro A) para o IP da VPS.
2. No `.env`, defina `SITE_ADDRESS=victordemelo.com.br, www.victordemelo.com.br`, `HTTP_PORT=80` e `HTTPS_PORT=443`. O `www` redireciona para o domínio principal.
3. Rode `docker compose up -d --build`. O Caddy emite o certificado HTTPS sozinho.

Para atualizar: `git pull && docker compose up -d --build`.

A decisão de arquitetura está em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## SEO

O build gera, a partir de `src/data`: título, descrição, link canônico, Open Graph e JSON-LD de cada página, uma página pronta para cada projeto em `/projetos/<id>`, `robots.txt` e `sitemap.xml` (ver `seo.ts`). O domínio fica em `perfil.site`.

Depois de publicar: cadastre o site no [Google Search Console](https://search.google.com/search-console), envie `https://victordemelo.com.br/sitemap.xml` e coloque o link do site no LinkedIn, GitHub e Instagram.
