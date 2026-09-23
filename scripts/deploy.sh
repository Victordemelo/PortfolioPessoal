#!/usr/bin/env bash
# Deploy no servidor: atualiza o código, reconstrói o container e confere se subiu.
#
# Roda de dois jeitos:
#   - pelo GitHub Actions: a chave de deploy no authorized_keys tem
#     command="/opt/apps/victordemelo/scripts/deploy.sh", então o SSH só executa isto
#   - na mão, no servidor: /opt/apps/victordemelo/scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

# Porta interna vem do .env do servidor (não versionado)
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi
PORTA="${HTTP_PORT:-8080}"

echo "==> Atualizando código"
git fetch --quiet origin main
# --ff-only: se alguém mexeu no código direto no servidor, para aqui em vez de sobrescrever
git merge --ff-only origin/main
echo "    commit: $(git log -1 --format='%h %s')"

echo "==> Build e subida do container"
docker compose up -d --build --remove-orphans

echo "==> Conferindo http://127.0.0.1:${PORTA}"
for tentativa in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORTA}"; then
    echo "    ok (tentativa ${tentativa})"
    break
  fi
  if [[ $tentativa -eq 20 ]]; then
    echo "    o site não respondeu; últimos logs:" >&2
    docker compose logs --tail=40 >&2
    exit 1
  fi
  sleep 3
done

echo "==> Limpando imagens antigas"
docker image prune -f >/dev/null

echo "==> Deploy concluído"
