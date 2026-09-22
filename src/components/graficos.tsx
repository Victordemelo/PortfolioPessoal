import { useState, type CSSProperties } from 'react'
import type { Dia } from '../lib/atividade'
import { mesAno } from '../lib/datas'

// Escala sequencial de um só matiz (cobre), do fundo da placa até o cobre cheio.
// Nível 0 é neutro, para "sem commit" não parecer dado.
const NIVEIS = [
  'var(--placa-2)',
  'color-mix(in oklab, var(--cobre) 32%, var(--placa-2))',
  'color-mix(in oklab, var(--cobre) 58%, var(--placa-2))',
  'color-mix(in oklab, var(--cobre) 82%, var(--placa-2))',
  'var(--cobre-claro)',
]

const fmtDia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const plural = (n: number) => `${n} ${n === 1 ? 'contribuição' : 'contribuições'}`

type Dica = { x: number; y: number; texto: string } | null

function Dica({ dica }: { dica: Dica }) {
  if (!dica) return null
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-linha bg-fundo px-2 py-1 font-mono text-[11px] whitespace-nowrap text-texto shadow-lg"
      style={{ left: dica.x, top: dica.y - 6 }}
    >
      {dica.texto}
    </div>
  )
}

/** Calendário de contribuições: colunas = semanas, linhas = dias (dom → sáb) */
export function Heatmap({ dias, semanas, rotulosMes = false }: { dias: Dia[]; semanas?: number; rotulosMes?: boolean }) {
  const [dica, setDica] = useState<Dica>(null)

  // Recorta nas últimas N semanas e completa a primeira coluna até o domingo
  let lista = dias
  if (semanas) {
    const ultimo = new Date(dias[dias.length - 1].data + 'T00:00:00Z')
    const qtd = (semanas - 1) * 7 + ultimo.getUTCDay() + 1
    lista = dias.slice(-qtd)
  }
  const primeiroDiaSemana = new Date(lista[0].data + 'T00:00:00Z').getUTCDay()
  const celulas: (Dia | null)[] = [...Array(primeiroDiaSemana).fill(null), ...lista]
  const colunas = Math.ceil(celulas.length / 7)

  // Rótulo de mês na coluna em que o mês começa
  const meses: { col: number; texto: string }[] = []
  if (rotulosMes) {
    celulas.forEach((c, i) => {
      if (c && c.data.endsWith('-01')) meses.push({ col: Math.floor(i / 7), texto: mesAno(c.data.slice(0, 7)).split(' ')[0] })
    })
  }

  return (
    <div className="relative" onPointerLeave={() => setDica(null)}>
      {rotulosMes && (
        <div className="relative mb-1.5 h-4 font-mono text-[10px] text-suave">
          {meses.map((m) => (
            <span key={m.col} className="absolute" style={{ left: `${(m.col / colunas) * 100}%` }}>
              {m.texto}
            </span>
          ))}
        </div>
      )}
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateRows: 'repeat(7, auto)', gridAutoFlow: 'column', gridAutoColumns: '1fr' } as CSSProperties}
        role="img"
        aria-label={`Calendário de contribuições: ${plural(lista.reduce((a, d) => a + d.qtd, 0))} no período`}
      >
        {celulas.map((c, i) =>
          c ? (
            <span
              key={c.data}
              className="aspect-square rounded-[3px] transition-transform hover:scale-125"
              style={{ background: NIVEIS[c.nivel] }}
              onPointerEnter={(e) => {
                const alvo = e.currentTarget.getBoundingClientRect()
                const pai = e.currentTarget.closest('.relative')!.getBoundingClientRect()
                setDica({ x: alvo.left - pai.left + alvo.width / 2, y: alvo.top - pai.top, texto: `${plural(c.qtd)} · ${fmtDia.format(new Date(c.data))}` })
              }}
            />
          ) : (
            <span key={`vazio-${i}`} />
          ),
        )}
      </div>
      <Dica dica={dica} />
    </div>
  )
}

export function LegendaNiveis() {
  return (
    <div className="flex items-center gap-1.5 font-mono text-[10px] text-suave">
      menos
      {NIVEIS.map((cor) => (
        <span key={cor} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: cor }} />
      ))}
      mais
    </div>
  )
}

/** Barras por mês, uma série só (sem legenda: o título nomeia) */
export function BarrasMensais({ dados }: { dados: { mes: string; qtd: number }[] }) {
  const [ativo, setAtivo] = useState<number | null>(null)
  const max = Math.max(1, ...dados.map((d) => d.qtd))
  const maior = dados.findIndex((d) => d.qtd === max)

  return (
    <div className="relative" onPointerLeave={() => setAtivo(null)}>
      <div className="flex h-40 items-end gap-[2px] border-b border-linha">
        {dados.map((d, i) => {
          const rotulo = `${d.qtd} em ${mesAno(d.mes)}`
          return (
            <div
              key={d.mes}
              className="relative flex h-full flex-1 items-end justify-center"
              onPointerEnter={() => setAtivo(i)}
              aria-label={rotulo}
            >
              {(ativo === i || (ativo === null && i === maior)) && (
                <span className="absolute -translate-y-1 font-mono text-[11px] text-texto" style={{ bottom: `${(d.qtd / max) * 100}%` }}>
                  {d.qtd}
                </span>
              )}
              <div
                className="w-full max-w-7 rounded-t-[4px] transition-colors"
                style={{
                  height: `${Math.max(d.qtd ? 3 : 0, (d.qtd / max) * 100)}%`,
                  background: ativo === i ? 'var(--cobre-claro)' : 'var(--cobre)',
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-[2px] font-mono text-[10px] text-suave">
        {dados.map((d, i) => (
          <span key={d.mes} className="flex-1 text-center">
            {i % 2 === 0 || dados.length < 8 ? mesAno(d.mes).split(' ')[0] : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
