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
2. No `.env`, defina `SITE_ADDRESS=seudominio.com.br`, `HTTP_PORT=80` e `HTTPS_PORT=443`.
3. Rode `docker compose up -d --build`. O Caddy emite o certificado HTTPS sozinho.

Para atualizar: `git pull && docker compose up -d --build`.

A decisão de arquitetura está em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).
