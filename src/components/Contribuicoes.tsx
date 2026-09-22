import { useEffect, useRef, useState } from 'react'
import { perfil } from '../data/perfil'
import { sequenciaAtual, useAtividade, type Dia } from '../lib/atividade'
import { haQuanto } from '../lib/datas'

// Calendário de contribuições em escala de cinza (uma série, um matiz).
// Nível 0 fica quase no fundo para "sem commit" não parecer dado.
const NIVEIS = ['var(--n0)', 'var(--n1)', 'var(--n2)', 'var(--n3)', 'var(--n4)']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const fmtDia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const fmtCurto = (iso: string) => iso.split('-').reverse().join('.')
const plural = (n: number) => `${n.toLocaleString('pt-BR')} ${n === 1 ? 'contribuição' : 'contribuições'}`

const CEL = 11
const GAP = 3

function Grade({ dias }: { dias: Dia[] }) {
  const [dica, setDica] = useState<{ x: number; y: number; texto: string } | null>(null)
  const rolagem = useRef<HTMLDivElement>(null)

  // No celular a grade não cabe: começa rolada no fim (semanas mais recentes)
  useEffect(() => {
    const el = rolagem.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [dias.length])

  const inicioSemana = new Date(dias[0].data + 'T00:00:00Z').getUTCDay()
  const celulas: (Dia | null)[] = [...Array(inicioSemana).fill(null), ...dias]
  const colunas = Math.ceil(celulas.length / 7)
  const largura = colunas * (CEL + GAP) - GAP
  const altura = 7 * (CEL + GAP) - GAP

  const meses: { x: number; texto: string }[] = []
  celulas.forEach((c, i) => {
    if (c?.data.endsWith('-01') && i / 7 < colunas - 2) meses.push({ x: Math.floor(i / 7) * (CEL + GAP), texto: MESES[Number(c.data.slice(5, 7)) - 1] })
  })

  return (
    <div className="relative" onPointerLeave={() => setDica(null)}>
      <div ref={rolagem} className="sem-barra overflow-x-auto">
        <svg width={largura} height={altura + 18} className="mx-auto block" role="img" aria-label={`Calendário de contribuições: ${plural(dias.reduce((a, d) => a + d.qtd, 0))}`}>
          {meses.map((m) => (
            <text key={m.x} x={m.x} y={10} className="fill-apagado font-sans text-[11px]">
              {m.texto}
            </text>
          ))}
          <g transform="translate(0 18)">
            {celulas.map((c, i) =>
              c ? (
                <rect
                  key={c.data}
                  x={Math.floor(i / 7) * (CEL + GAP)}
                  y={(i % 7) * (CEL + GAP)}
                  width={CEL}
                  height={CEL}
                  rx={2}
                  fill={NIVEIS[c.nivel]}
                  onPointerEnter={(e) => {
                    const r = (e.target as SVGRectElement).getBoundingClientRect()
                    const pai = rolagem.current!.parentElement!.getBoundingClientRect()
                    setDica({ x: r.left - pai.left + r.width / 2, y: r.top - pai.top, texto: `${plural(c.qtd)} · ${fmtDia.format(new Date(c.data))}` })
                  }}
                />
              ) : null,
            )}
          </g>
        </svg>
      </div>
      {dica && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-linha bg-fundo px-2 py-1 font-mono text-[11px] whitespace-nowrap shadow-lg"
          style={{ left: dica.x, top: dica.y - 6 }}
        >
          {dica.texto}
        </div>
      )}
    </div>
  )
}

export function Contribuicoes() {
  const { dados, erro } = useAtividade()

  if (!dados) {
    return (
      <div className="grid h-[134px] place-items-center font-mono text-xs text-apagado">
        {erro ? 'não consegui falar com o GitHub agora' : 'lendo o GitHub…'}
      </div>
    )
  }

  const ultimo = dados.pushes[0]
  const ativo = dados.dias.slice(-2).some((d) => d.qtd > 0)

  return (
    <div>
      <Grade dias={dados.dias} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <p className="text-suave">
          <span className="text-apagado">Fig. 2.</span> {plural(dados.total)}, {fmtCurto(dados.dias[0].data)} – {fmtCurto(dados.dias.at(-1)!.data)}. Fonte:{' '}
          <a href={perfil.contato.github} target="_blank" rel="noreferrer" className="text-texto underline decoration-linha underline-offset-4 hover:decoration-texto">
            GitHub
          </a>
          .
        </p>
        <div className="flex items-center gap-1 text-xs text-apagado">
          Menos
          {NIVEIS.map((n) => (
            <span key={n} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: n }} />
          ))}
          Mais
        </div>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-xs text-apagado">
        <span className={`h-1.5 w-1.5 rounded-full ${ativo ? 'pisca bg-vivo' : 'bg-apagado'}`} />
        <span>{ativo ? 'commitando agora' : 'ao vivo'}</span>
        <span>//</span>
        <span>sequência de {sequenciaAtual(dados.dias)} d</span>
        {ultimo && (
          <>
            <span>//</span>
            <span>
              último push público em <span className="text-suave">{ultimo.repo}</span> {haQuanto(ultimo.quando)}
            </span>
          </>
        )}
      </p>
    </div>
  )
}
