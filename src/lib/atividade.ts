import { useEffect, useState } from 'react'
import { perfil } from '../data/perfil'

// Atividade no GitHub, buscada direto do navegador (o site não tem backend).
//
// - Calendário de contribuições: github-contributions-api.jogruber.de, que lê o
//   mesmo gráfico do perfil do GitHub e libera CORS. Inclui commits em repositórios
//   privados SE a opção "Private contributions" estiver ligada no perfil.
// - Pushes recentes: API pública do GitHub (60 req/h por IP, sem token). Só
//   repositórios públicos.
//
// Os dois ficam em cache no sessionStorage por alguns minutos e são
// rebuscados enquanto a aba estiver aberta.

export type Dia = { data: string; qtd: number; nivel: 0 | 1 | 2 | 3 | 4 }
export type Push = { repo: string; quando: string; vezes: number }

export type Atividade = {
  dias: Dia[]
  total: number
  pushes: Push[]
  atualizadoEm: number
}

const CHAVE = 'atividade-v1'
const VALIDADE_MS = 5 * 60 * 1000
const INTERVALO_MS = 5 * 60 * 1000

function lerCache(): Atividade | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE)
    if (!bruto) return null
    const a = JSON.parse(bruto) as Atividade
    return Date.now() - a.atualizadoEm < VALIDADE_MS ? a : null
  } catch {
    return null
  }
}

function salvarCache(a: Atividade) {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify(a))
  } catch {
    // sem storage: só não guarda
  }
}

async function buscarCalendario(): Promise<Pick<Atividade, 'dias' | 'total'>> {
  const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${perfil.github}?y=last`)
  if (!r.ok) throw new Error(`calendário: ${r.status}`)
  const j = (await r.json()) as { total: { lastYear: number }; contributions: { date: string; count: number; level: Dia['nivel'] }[] }
  return {
    total: j.total.lastYear,
    dias: j.contributions.map((c) => ({ data: c.date, qtd: c.count, nivel: c.level })),
  }
}

async function buscarPushes(): Promise<Push[]> {
  const r = await fetch(`https://api.github.com/users/${perfil.github}/events/public?per_page=50`)
  if (!r.ok) return []
  const eventos = (await r.json()) as { type: string; repo: { name: string }; created_at: string; payload: unknown }[]
  // Agrupa pushes seguidos no mesmo repositório no mesmo dia. (Desde 2025 a API
  // não traz mais a lista de commits do push, então contamos pushes.)
  const pushes: Push[] = []
  for (const e of eventos) {
    if (e.type !== 'PushEvent') continue
    const repo = e.repo.name.split('/')[1]
    const ultimo = pushes.at(-1)
    if (ultimo && ultimo.repo === repo && ultimo.quando.slice(0, 10) === e.created_at.slice(0, 10)) {
      ultimo.vezes++
    } else {
      pushes.push({ repo, quando: e.created_at, vezes: 1 })
    }
  }
  return pushes.slice(0, 8)
}

async function buscar(): Promise<Atividade> {
  const [cal, pushes] = await Promise.all([buscarCalendario(), buscarPushes().catch(() => [])])
  const a = { ...cal, pushes, atualizadoEm: Date.now() }
  salvarCache(a)
  return a
}

export function useAtividade() {
  const [dados, setDados] = useState<Atividade | null>(lerCache)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let vivo = true
    const atualizar = () => {
      if (document.hidden) return
      buscar()
        .then((a) => vivo && (setDados(a), setErro(false)))
        .catch(() => vivo && setErro(true))
    }
    if (!lerCache()) atualizar()
    const t = setInterval(atualizar, INTERVALO_MS)
    document.addEventListener('visibilitychange', atualizar)
    return () => {
      vivo = false
      clearInterval(t)
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [])

  return { dados, erro }
}

/** Sequência atual de dias com contribuição (hoje sem commit não quebra a sequência) */
export function sequenciaAtual(dias: Dia[]) {
  let n = 0
  for (let i = dias.length - 1; i >= 0; i--) {
    if (dias[i].qtd > 0) n++
    else if (i === dias.length - 1) continue
    else break
  }
  return n
}

export function porMes(dias: Dia[]) {
  const mapa = new Map<string, number>()
  for (const d of dias) {
    const m = d.data.slice(0, 7)
    mapa.set(m, (mapa.get(m) ?? 0) + d.qtd)
  }
  return [...mapa.entries()].map(([mes, qtd]) => ({ mes, qtd }))
}
