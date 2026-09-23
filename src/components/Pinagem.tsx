import { useEffect, useRef, useState } from 'react'
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

// Pares que trabalham juntos de verdade; a "corrente" passa entre eles por dentro do chip
const PARES: [string, string][] = [
  ['TypeScript', 'PostgreSQL'],
  ['Laravel', 'Git'],
  ['React', 'TypeScript'],
  ['PHP', 'MySQL'],
  ['Python', 'Django'],
  ['Node.js', 'Docker'],
  ['C# / .NET', 'PostgreSQL'],
  ['Arduino', 'C++'],
  ['Docker', 'Linux'],
  ['Laravel', 'MySQL'],
  ['Tailwind', 'React'],
  ['Git', 'Linux'],
  ['PHP', 'Laravel'],
  ['Node.js', 'TypeScript'],
  ['Python', 'PostgreSQL'],
]
const porNome = (nome: string) => pinos.find((p) => p.nome === nome)!.n

/** Pinos que trabalham com este (os pares em que ele aparece) */
function parceiros(n: number) {
  const nome = pinos.find((p) => p.n === n)?.nome
  return PARES.filter((par) => par.includes(nome!)).map(([a, b]) => porNome(a === nome ? b : a))
}

/** Caminho da corrente: sai da ponta do pino A, entra no chip, cruza e sai pela ponta do pino B */
function trajeto(a: number, b: number) {
  const pa = pinos.find((p) => p.n === a)!
  const pb = pinos.find((p) => p.n === b)!
  const A = posicao(pa)
  const B = posicao(pb)
  const ponta = (esq: boolean) => (esq ? CX0 - PINO : CX1 + PINO)
  const borda = (esq: boolean) => (esq ? CX0 : CX1)
  // mesmo lado: faz um "U" rente à borda; lados opostos: atravessa pelo meio
  const meio = A.esquerda === B.esquerda ? (A.esquerda ? CX0 + 26 : CX1 - 26) : (CX0 + CX1) / 2 + (A.y < B.y ? -14 : 14)
  return `M${ponta(A.esquerda)} ${A.y} H${borda(A.esquerda)} H${meio} V${B.y} H${borda(B.esquerda)} H${ponta(B.esquerda)}`
}

/** Sorteia um par a cada 3,2 s, só com a figura visível na tela e sem "reduzir movimento" */
function useCorrente(ref: React.RefObject<HTMLElement | null>) {
  const [par, setPar] = useState<{ a: number; b: number; volta: number } | null>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !ref.current) return
    let t: number | undefined
    let ultimo = -1
    const sortear = () => {
      let i = Math.floor(Math.random() * PARES.length)
      if (i === ultimo) i = (i + 1) % PARES.length
      ultimo = i
      const [x, y] = PARES[i]
      setPar((p) => ({ a: porNome(x), b: porNome(y), volta: (p?.volta ?? 0) + 1 }))
    }
    const obs = new IntersectionObserver(([e]) => {
      clearInterval(t)
      if (e.isIntersecting) {
        sortear()
        t = window.setInterval(sortear, 3200)
      }
    })
    obs.observe(ref.current)
    return () => {
      obs.disconnect()
      clearInterval(t)
    }
  }, [ref])
  return par
}

export function Pinagem() {
  const [hover, setAtivo] = useState<number | null>(null)
  const figura = useRef<HTMLElement>(null)
  const corrente = useCorrente(figura)
  // Mouse num pino: a corrente sai dele para todos os parceiros, em loop.
  // Sem mouse: um par sorteado de cada vez.
  const ligados = hover !== null ? parceiros(hover) : []
  const acesos = hover !== null ? [hover, ...ligados] : corrente ? [corrente.a, corrente.b] : []
  const ativo = hover
  const atual = pinos.find((p) => p.n === ativo)

  return (
    <div>
      {/* Figura: só a partir de sm, no celular vira tabela */}
      <figure ref={figura} className="hidden sm:block">
        <div className="rounded-lg border border-linha bg-superficie p-4" onPointerLeave={() => setAtivo(null)}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pinagem: a stack de tecnologias desenhada como os pinos de um chip">
            {/* corpo do chip */}
            <rect x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0} rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.2" />
            {/* corrente elétrica entre dois pinos sorteados */}
            {hover !== null &&
              ligados.map((b, i) => (
                <g key={`${hover}-${b}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d={trajeto(hover, b)} stroke="var(--destaque)" strokeWidth="1.2" className="trilha-fixa" />
                  <path d={trajeto(hover, b)} stroke="var(--destaque)" strokeWidth="2.6" pathLength={100} className="pulso-continuo" style={{ animationDelay: `${i * 0.45}s` }} />
                </g>
              ))}
            {corrente && hover === null && (
              <g key={corrente.volta} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d={trajeto(corrente.a, corrente.b)} stroke="var(--destaque)" strokeWidth="1.2" className="trilha-corrente" />
                <path d={trajeto(corrente.a, corrente.b)} stroke="var(--destaque)" strokeWidth="2.6" pathLength={100} className="pulso-corrente" />
              </g>
            )}
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
              SOFTWARE · IOT · SC
            </text>

            {pinos.map((p) => {
              const { esquerda, y } = posicao(p)
              const on = acesos.includes(p.n)
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
                {ligados.length > 0 && (
                  <span className="text-suave"> · conecta com {ligados.map((n) => pinos.find((p) => p.n === n)?.nome).join(', ')}</span>
                )}
              </>
            ) : (
              corrente ? (
                <span className="text-suave">
                  <span className="text-destaque">⚡ {pinos.find((p) => p.n === corrente.a)?.nome} ⇄ {pinos.find((p) => p.n === corrente.b)?.nome}</span> · passe o mouse num pino
                </span>
              ) : (
                <span className="text-apagado">passe o mouse num pino</span>
              )
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
