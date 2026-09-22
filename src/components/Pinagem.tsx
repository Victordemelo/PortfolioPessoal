import { useState } from 'react'
import { projetos } from '../data/projetos'
import { stack, type Tecnologia } from '../data/stack'

// A stack desenhada como a pinagem de um CI DIP-18, vista de cima, como num datasheet.
// Pinos 1–9 descem pela esquerda e 10–18 sobem pela direita (numeração padrão de DIP).
// Pino 9 é GND e 18 é VCC; os outros 16 são as tecnologias.

type Pino = { n: number; nome: string; papel: string; tec?: Tecnologia; usos: number }

function usos(t: Tecnologia) {
  return projetos.filter((p) => p.stack.some((s) => s.toLowerCase().includes(t.chave))).length
}

const pinos: Pino[] = []
stack.slice(0, 8).forEach((t, i) => pinos.push({ n: i + 1, nome: t.nome, papel: t.papel, tec: t, usos: usos(t) }))
pinos.push({ n: 9, nome: 'GND', papel: 'referência · café', usos: 0 })
stack.slice(8, 16).forEach((t, i) => pinos.push({ n: 10 + i, nome: t.nome, papel: t.papel, tec: t, usos: usos(t) }))
pinos.push({ n: 18, nome: 'VCC', papel: 'alimentação · curiosidade', usos: 0 })

// Geometria (unidades do viewBox)
const W = 640
const H = 420
const CX0 = 250
const CX1 = 390
const CY0 = 30
const PASSO = 40
const CY1 = CY0 + PASSO * 9 + 10
const PINO = 26

function posicao(p: Pino) {
  const esquerda = p.n <= 9
  const i = esquerda ? p.n - 1 : 18 - p.n
  return { esquerda, y: CY0 + 25 + i * PASSO }
}

function descricao(p: Pino) {
  if (!p.tec) return p.papel
  const u = p.usos ? ` · usado em ${p.usos} projeto${p.usos > 1 ? 's' : ''} daqui` : ' · uso diário'
  return `${p.papel}${u}`
}

export function Pinagem() {
  const [ativo, setAtivo] = useState<number | null>(null)
  const atual = pinos.find((p) => p.n === ativo)

  return (
    <div>
      {/* Figura: só a partir de sm, no celular vira tabela */}
      <figure className="hidden sm:block">
        <div className="rounded-lg border border-linha bg-superficie p-4" onPointerLeave={() => setAtivo(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pinagem: a stack de tecnologias desenhada como os pinos de um chip">
            {/* corpo do chip */}
            <rect x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0} rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.2" />
            <path d={`M${(CX0 + CX1) / 2 - 12} ${CY0} a12 12 0 0 0 24 0`} fill="var(--superficie)" stroke="var(--apagado)" strokeWidth="1.2" />
            <circle cx={CX0 + 34} cy={CY0 + 14} r="3.5" fill="var(--apagado)" />
            <text
              x={(CX0 + CX1) / 2}
              y={(CY0 + CY1) / 2}
              transform={`rotate(-90 ${(CX0 + CX1) / 2} ${(CY0 + CY1) / 2})`}
              textAnchor="middle"
              className="fill-texto font-mono text-[15px] font-semibold tracking-[0.2em]"
            >
              VMR-2026
            </text>
            <text
              x={(CX0 + CX1) / 2 + 20}
              y={(CY0 + CY1) / 2}
              transform={`rotate(-90 ${(CX0 + CX1) / 2 + 20} ${(CY0 + CY1) / 2})`}
              textAnchor="middle"
              className="fill-apagado font-mono text-[10px] tracking-widest"
            >
              FULL STACK · FLORIPA
            </text>

            {pinos.map((p) => {
              const { esquerda, y } = posicao(p)
              const on = ativo === p.n
              const alim = !p.tec
              const cor = on ? 'var(--destaque)' : alim ? 'var(--apagado)' : 'var(--suave)'
              const px = esquerda ? CX0 - PINO : CX1
              const rotuloX = esquerda ? CX0 - PINO - 14 : CX1 + PINO + 14
              return (
                <g
                  key={p.n}
                  tabIndex={0}
                  role="button"
                  aria-label={`Pino ${p.n}: ${p.nome}, ${descricao(p)}`}
                  onPointerEnter={() => setAtivo(p.n)}
                  onFocus={() => setAtivo(p.n)}
                  onBlur={() => setAtivo(null)}
                  className="outline-none"
                >
                  {/* área de toque maior que o pino */}
                  <rect x={esquerda ? 0 : CX1} y={y - PASSO / 2} width={CX0} height={PASSO} fill="transparent" />
                  <rect x={px} y={y - 5} width={PINO} height={10} rx="1.5" fill={on ? 'var(--destaque)' : 'var(--linha)'} stroke={cor} strokeWidth="1" />
                  <text
                    x={esquerda ? CX0 + 12 : CX1 - 12}
                    y={y + 4}
                    textAnchor={esquerda ? 'start' : 'end'}
                    className="font-mono text-[11px]"
                    fill={on ? 'var(--destaque)' : 'var(--apagado)'}
                  >
                    {p.n}
                  </text>
                  {p.tec && (
                    <svg
                      x={esquerda ? rotuloX - 16 : rotuloX}
                      y={y - 8}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={on ? 'var(--destaque)' : 'var(--apagado)'}
                    >
                      <path d={p.tec.icone.path} />
                    </svg>
                  )}
                  <text
                    x={p.tec ? (esquerda ? rotuloX - 24 : rotuloX + 24) : rotuloX}
                    y={y + 5}
                    textAnchor={esquerda ? 'end' : 'start'}
                    className={`text-[15px] ${alim ? 'font-mono' : 'font-sans font-medium'}`}
                    fill={on ? 'var(--destaque)' : alim ? 'var(--apagado)' : 'var(--texto)'}
                  >
                    {p.nome}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="text-suave">
            <span className="font-mono text-xs text-apagado">Figura 2 —</span> Pinagem do VMR-2026, vista superior.
          </span>
          <span className="min-h-5 font-mono text-xs">
            {atual ? (
              <>
                <span className="text-destaque">pino {atual.n} · {atual.nome}</span> <span className="text-suave">— {descricao(atual)}</span>
              </>
            ) : (
              <span className="text-apagado">passe o mouse num pino</span>
            )}
          </span>
        </figcaption>
      </figure>

      {/* Celular: tabela de pinos, como a seção "Pin description" de um datasheet */}
      <table className="w-full text-sm sm:hidden">
        <thead>
          <tr className="border-b border-linha font-mono text-[10px] tracking-widest text-apagado uppercase">
            <th className="py-2 pr-3 text-left font-normal">Pino</th>
            <th className="py-2 pr-3 text-left font-normal">Nome</th>
            <th className="py-2 text-left font-normal">Função</th>
          </tr>
        </thead>
        <tbody>
          {[...pinos].sort((a, b) => a.n - b.n).map((p) => (
            <tr key={p.n} className="border-b border-linha">
              <td className="py-2 pr-3 font-mono text-xs text-apagado">{String(p.n).padStart(2, '0')}</td>
              <td className="py-2 pr-3">
                <span className="flex items-center gap-2">
                  {p.tec && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-suave" fill="currentColor" aria-hidden="true">
                      <path d={p.tec.icone.path} />
                    </svg>
                  )}
                  <span className={p.tec ? '' : 'font-mono text-apagado'}>{p.nome}</span>
                </span>
              </td>
              <td className="py-2 text-xs text-suave">{p.papel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
