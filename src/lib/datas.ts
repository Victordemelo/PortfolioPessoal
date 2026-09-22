import type { Projeto } from '../data/projetos'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function mesAno(aaaamm: string) {
  const [a, m] = aaaamm.split('-')
  return `${MESES[Number(m) - 1]} ${a}`
}

export function periodo(p: Pick<Projeto, 'inicio' | 'fim'>) {
  if (!p.fim) return mesAno(p.inicio)
  if (p.fim === 'atual') return `${mesAno(p.inicio)} → agora`
  const [ai] = p.inicio.split('-')
  const [af] = p.fim.split('-')
  // mesmo ano: "mar → set 2026"
  if (ai === af) return `${MESES[Number(p.inicio.split('-')[1]) - 1]} → ${mesAno(p.fim)}`
  return `${mesAno(p.inicio)} → ${mesAno(p.fim)}`
}

const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export function haQuanto(data: Date | string | number, agora = Date.now()) {
  const seg = (new Date(data).getTime() - agora) / 1000
  const passos: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.35, 'week'],
    [12, 'month'],
    [Infinity, 'year'],
  ]
  let v = seg
  for (const [div, unidade] of passos) {
    if (Math.abs(v) < div) return rtf.format(Math.round(v), unidade)
    v /= div
  }
  return ''
}
