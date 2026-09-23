# Deploy automático (GitHub Actions)

A cada push na `main`, o workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

1. **Build**: `npm ci` e `npm run build`. Se o TypeScript ou o Vite falharem, nada vai para o servidor.
2. **Deploy**: entra no servidor por SSH e roda [`scripts/deploy.sh`](../scripts/deploy.sh), que faz `git merge --ff-only origin/main`, `docker compose up -d --build`, confere `http://127.0.0.1:8080` e limpa imagens antigas.
3. **Conferência**: espera `https://victordemelo.com.br` responder 200.

Também dá para disparar na mão: aba **Actions → Deploy → Run workflow**.

Enquanto os secrets não estiverem configurados, o job de deploy só avisa e pula (o build roda normalmente).

## Segurança do acesso

A chave do GitHub Actions entra no `authorized_keys` com **forced command**: qualquer conexão com ela executa só `scripts/deploy.sh`, sem shell, sem túnel, sem encaminhamento. Se a chave vazar, o máximo que alguém consegue é rodar um deploy da `main` do GitHub.

O servidor é identificado por `known_hosts` fixo no secret; o workflow recusa conectar em outra máquina.

## Configuração (uma vez)

### 1. No servidor: chave exclusiva para o deploy

Com o usuário que já roda os containers (precisa estar no grupo `docker` e ter acesso a `/opt/apps/victordemelo`):

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions-victordemelo" -f ~/gh-deploy
```

Autorize a chave pública **só para o script de deploy**:

```bash
echo "command=\"/opt/apps/victordemelo/scripts/deploy.sh\",no-port-forwarding,no-agent-forwarding,no-X11-forwarding,no-pty $(cat ~/gh-deploy.pub)" >> ~/.ssh/authorized_keys
```

Garanta que o script é executável (vem assim do Git, mas não custa):

```bash
chmod +x /opt/apps/victordemelo/scripts/deploy.sh
```

Mostre a chave privada para copiar no GitHub e depois apague do servidor:

```bash
cat ~/gh-deploy
```

```bash
rm ~/gh-deploy ~/gh-deploy.pub
```

### 2. Identidade do servidor (known_hosts)

Rode no seu PC, com o **IP público real** do servidor. O domínio não serve: ele passa pela Cloudflare, que não repassa SSH.

```bash
ssh-keyscan -t ed25519 IP_DO_SERVIDOR
```

Ou no próprio servidor, lendo a chave direto do disco (troque `IP_DO_SERVIDOR` pelo IP):

```bash
echo "IP_DO_SERVIDOR $(cut -d' ' -f1,2 /etc/ssh/ssh_host_ed25519_key.pub)"
```

### 3. Secrets no GitHub

Em **github.com/Victordemelo/PortfolioPessoal → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `DEPLOY_HOST` | IP público do servidor |
| `DEPLOY_USER` | usuário do servidor (ex.: `ubuntu`) |
| `DEPLOY_SSH_KEY` | conteúdo inteiro de `~/gh-deploy` (de `-----BEGIN` até `END-----`) |
| `DEPLOY_KNOWN_HOSTS` | a linha que o `ssh-keyscan` imprimiu |
| `DEPLOY_PORT` | opcional; só se o SSH não estiver na 22 |

### 4. Testar

Aba **Actions → Deploy → Run workflow**. Os dois jobs (Build e Deploy no servidor) devem ficar verdes.

O repositório é público: o Actions não gasta minutos da conta. Os secrets continuam fechados (não aparecem nos logs nem para PR vindo de fork), e o workflow só roda em push na `main` ou disparo manual, então ninguém de fora consegue acionar um deploy.

## Deploy na mão (se o GitHub estiver fora)

```bash
/opt/apps/victordemelo/scripts/deploy.sh
```
