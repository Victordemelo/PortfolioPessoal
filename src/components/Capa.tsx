import { useMemo } from 'react'

// Capa gerada para projeto sem foto: um trecho de placa único por projeto
// (mesma semente = mesmo desenho) com as iniciais em destaque.

function semente(texto: string) {
  let h = 2166136261
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const L = 400
const A = 180
const C = 20

function trilhas(id: string) {
  const rnd = semente(id)
  const caminhos: string[] = []
  const pads: [number, number][] = []
  for (let i = 0; i < 16; i++) {
    let x = Math.floor(rnd() * (L / C)) * C
    let y = Math.floor(rnd() * (A / C)) * C
    let dx = rnd() < 0.5 ? C : -C
    let dy = 0
    let d = `M${x} ${y}`
    pads.push([x, y])
    const passos = 3 + Math.floor(rnd() * 5)
    for (let p = 0; p < passos; p++) {
      const comp = 1 + Math.floor(rnd() * 4)
      x += dx * comp
      y += dy * comp
      d += ` L${x} ${y}`
      // curva de 45°
      if (dy === 0) {
        dy = rnd() < 0.5 ? C : -C
        dx = rnd() < 0.5 ? 0 : dx
      } else {
        dx = rnd() < 0.5 ? C : -C
        dy = 0
      }
    }
    caminhos.push(d)
    pads.push([x, y])
  }
  return { caminhos, pads }
}

export function Capa({ id, nome, className = '' }: { id: string; nome: string; className?: string }) {
  const { caminhos, pads } = useMemo(() => trilhas(id), [id])
  const iniciais = nome
    .split(/\s+/)
    .filter((p) => p.length > 2 || /^[A-Z]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  return (
    <div className={`relative overflow-hidden bg-placa-2 ${className}`}>
      <svg viewBox={`0 0 ${L} ${A}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="var(--linha)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {caminhos.map((d, i) => (
            <path key={i} d={d} stroke={i % 5 === 0 ? 'var(--cobre)' : undefined} opacity={i % 5 === 0 ? 0.7 : 1} />
          ))}
        </g>
        {pads.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="var(--placa-2)" stroke="var(--linha)" strokeWidth="1.6" />
        ))}
      </svg>
      <span className="absolute right-4 bottom-1 font-display text-6xl font-extrabold tracking-tighter text-texto/85 select-none">
        {iniciais}
      </span>
    </div>
  )
}
