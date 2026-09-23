import { useEffect, useState } from 'react'
import { perfil } from '../data/perfil'
import type { Projeto } from '../data/projetos'

// Data do último push de cada repositório público, lida da API do GitHub
// (uma requisição, cache de 10 min). Projeto privado usa `ultimaAtividade`
// do arquivo de dados.

const CHAVE = 'repos-v1'
const VALIDADE_MS = 10 * 60 * 1000

type Cache = { quando: number; pushes: Record<string, string> }

function lerCache(): Record<string, string> | null {
  try {
    const c = JSON.parse(sessionStorage.getItem(CHAVE) ?? 'null') as Cache | null
    return c && Date.now() - c.quando < VALIDADE_MS ? c.pushes : null
  } catch {
    return null
  }
}

let emAndamento: Promise<Record<string, string>> | null = null

function buscar() {
  emAndamento ??= fetch(`https://api.github.com/users/${perfil.github}/repos?per_page=100`)
    .then((r) => (r.ok ? r.json() : []))
    .then((lista: { name: string; pushed_at: string }[]) => {
      const pushes = Object.fromEntries(lista.map((r) => [r.name.toLowerCase(), r.pushed_at.slice(0, 10)]))
      try {
        sessionStorage.setItem(CHAVE, JSON.stringify({ quando: Date.now(), pushes }))
      } catch {
        // sem storage: só não guarda
      }
      return pushes
    })
    .catch(() => ({}))
  return emAndamento
}

export function useUltimosPushes() {
  const [pushes, setPushes] = useState<Record<string, string>>(() => lerCache() ?? {})
  useEffect(() => {
    if (!lerCache()) buscar().then(setPushes)
  }, [])
  return pushes
}

/** Última atividade do projeto: push real no GitHub ou a data do arquivo de dados */
export function ultimaAtividade(p: Projeto, pushes: Record<string, string>) {
  const nome = p.repo?.split('/').pop()?.toLowerCase()
  return (nome && pushes[nome]) || p.ultimaAtividade
}
