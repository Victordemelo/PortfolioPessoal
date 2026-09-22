import { useEffect, useRef, useState } from 'react'
import { perfil } from '../data/perfil'
import { sequenciaAtual, useAtividade, type Dia } from '../lib/atividade'
import { haQuanto } from '../lib/datas'

// Calendário de contribuições numa escala de um só matiz (âmbar), uma série.
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
        <svg viewBox={`0 0 ${largura} ${altura + 18}`} className="block w-full min-w-[560px]" role="img" aria-label={`Calendário de contribuições: ${plural(dias.reduce((a, d) => a + d.qtd, 0))}`}>
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
  const recorde = dados.dias.reduce((a, d) => (d.qtd > a.qtd ? d : a), dados.dias[0])
  const medidas = [
    { k: 'dias com commit', v: String(dados.dias.filter((d) => d.qtd > 0).length) },
    { k: 'sequência atual', v: `${sequenciaAtual(dados.dias)} d` },
    { k: 'recorde num dia', v: String(recorde.qtd) },
    { k: 'último commit', v: ativo ? (dados.dias.at(-1)!.qtd > 0 ? 'hoje' : 'ontem') : ultimo ? haQuanto(ultimo.quando) : '—', vivo: ativo },
  ]

  return (
    <figure>
      <div className="rounded-lg border border-linha bg-superficie p-4">
        <Grade dias={dados.dias} />
        <div className="mt-3 flex justify-end gap-1 text-[11px] text-apagado">
          menos
          {NIVEIS.map((n) => (
            <span key={n} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: n }} />
          ))}
          mais
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-suave">
        <span className="font-mono text-xs text-apagado">Figura 1 —</span> {plural(dados.total)} de {fmtCurto(dados.dias[0].data)} a{' '}
        {fmtCurto(dados.dias.at(-1)!.data)}, lidas do{' '}
        <a href={perfil.contato.github} target="_blank" rel="noreferrer" className="text-texto underline decoration-linha underline-offset-4 hover:decoration-destaque">
          GitHub
        </a>{' '}
        a cada 5 minutos. Inclui repositórios privados, sem mostrar quais.
      </figcaption>
      <dl className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-linha sm:grid-cols-4">
        {medidas.map((m, i) => (
          <div key={m.k} className={`flex flex-col-reverse gap-1 border-linha p-3 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} sm:border-r sm:last:border-r-0`}>
            <dt className="flex items-center gap-1.5 text-xs text-apagado">
              {m.vivo && <span className="pisca h-1.5 w-1.5 rounded-full bg-vivo" />}
              {m.k}
            </dt>
            <dd className="font-mono text-lg tabular-nums">{m.v}</dd>
          </div>
        ))}
      </dl>
      {ultimo && (
        <p className="mt-3 font-mono text-xs text-apagado">
          último push público: <span className="text-suave">{ultimo.repo}</span>, {haQuanto(ultimo.quando)}
        </p>
      )}
    </figure>
  )
}
