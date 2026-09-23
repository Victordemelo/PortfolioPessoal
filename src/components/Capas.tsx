import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Capa } from './Capa'
import { STABILMONEY_D } from './marcas'

// Capas ilustradas e animadas de cada projeto, desenhadas a partir do que o
// repositório faz. Todas em 400×250 (16:10); as animações estão no index.css
// (prefixos rw-, sm-, fx-, bd-) e param com prefers-reduced-motion.
// Projeto sem capa aqui cai na capa gerada (trecho de placa com as iniciais).

const W = 400
const H = 250

const atraso = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

function Moldura({ children, rotulo, interativo = false }: { children: ReactNode; rotulo: string; interativo?: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role={interativo ? 'group' : 'img'} aria-label={rotulo}>
      <defs>
        <pattern id="pontos-capa" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--linha)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="var(--superficie)" />
      <rect width={W} height={H} fill="url(#pontos-capa)" />
      {children}
    </svg>
  )
}

function MarcaRemoteWake({ x, y, escala }: { x: number; y: number; escala: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill="none" strokeLinecap="round">
      <path d="M17.5 27.5a21 21 0 1 0 29 0" stroke="#42F5AD" strokeWidth="6" />
      <path d="M32 17.5v18" stroke="#42F5AD" strokeWidth="6" />
      <path d="M24 12.5a13 13 0 0 1 16 0" stroke="#27C7F5" strokeWidth="4" />
      <path d="M18 6.5a22 22 0 0 1 28 0" stroke="#27C7F5" strokeWidth="4" />
    </g>
  )
}

// ─── Remote Wake: simulador de ligar e desligar o PC pelo celular ─────
// desligado → (LIGAR) enviando → boot → ligado → (DESLIGAR) comando → desligando → desligado
// Na página do projeto os botões são clicáveis; na miniatura da lista a demonstração
// roda sozinha (ali o clique abre o projeto).

type Fase = 'desligado' | 'enviando' | 'boot' | 'ligado' | 'comando' | 'desligando'

const BOOT = ['[  OK  ] Started Network Manager.', '[  OK  ] Reached target Network.', '[  OK  ] Started OpenSSH Server.', '[  OK  ] Reached target Graphical.']
const PARADA = ['[  OK  ] Stopped OpenSSH Server.', '[  OK  ] Stopped Network Manager.', '[  OK  ] Reached target Power-Off.', '         Powering off…']
const COMANDO = 'sudo shutdown -h now'

function LinhaOk({ x, y, texto }: { x: number; y: number; texto: string }) {
  return (
    <text x={x} y={y} className="font-mono text-[6.4px]">
      <tspan className="fill-[#4ade80]">{texto.slice(0, 8)}</tspan>
      <tspan className="fill-[#c9d1d9]">{texto.slice(8)}</tspan>
    </text>
  )
}

function Pinguim() {
  return (
    <g transform="translate(229 69)">
      <ellipse cx="7" cy="10" rx="6" ry="8" fill="#111" stroke="#666" strokeWidth="0.4" />
      <ellipse cx="7" cy="12" rx="3.6" ry="5.4" fill="#f2f2f2" />
      <circle cx="5.4" cy="5.6" r="1" fill="#fff" />
      <circle cx="8.6" cy="5.6" r="1" fill="#fff" />
      <path d="M5.6 7.6 h2.8 l-1.4 1.6 z" fill="#f5b83d" />
      <ellipse cx="4.4" cy="18.2" rx="2.2" ry="0.9" fill="#f5b83d" />
      <ellipse cx="9.6" cy="18.2" rx="2.2" ry="0.9" fill="#f5b83d" />
    </g>
  )
}

function BotaoCelular({ y, rotulo, cor, ativo, interativo, aoClicar }: { y: number; rotulo: string; cor: string; ativo: boolean; interativo: boolean; aoClicar: () => void }) {
  const clicavel = interativo && ativo
  return (
    <g
      role={interativo ? 'button' : undefined}
      tabIndex={clicavel ? 0 : undefined}
      aria-label={interativo ? rotulo : undefined}
      aria-disabled={interativo ? !ativo : undefined}
      onClick={clicavel ? aoClicar : undefined}
      onKeyDown={clicavel ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), aoClicar()) : undefined}
      className={`${clicavel ? 'cursor-pointer outline-none [&:hover>rect]:brightness-110 [&:focus-visible>rect]:stroke-white' : ''} transition-opacity duration-300`}
      style={{ opacity: ativo ? 1 : 0.28 }}
    >
      <rect x="52" y={y} width="58" height="17" rx="8.5" fill={cor} strokeWidth="1" />
      <text x="81" y={y + 11.4} textAnchor="middle" className="pointer-events-none fill-[#0b1411] font-mono text-[6.8px] font-semibold">
        {rotulo}
      </text>
    </g>
  )
}

function RemoteWake({ interativo }: { interativo: boolean }) {
  const reduzido = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [fase, setFase] = useState<Fase>(!interativo && reduzido ? 'ligado' : 'desligado')
  const [linhas, setLinhas] = useState(BOOT.length)
  const [digitado, setDigitado] = useState(0)
  const [toque, setToque] = useState<{ y: number; n: number } | null>(null)
  const timers = useRef<number[]>([])
  const agendar = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const ligar = () => {
    if (fase !== 'desligado') return
    setToque((t) => ({ y: 131, n: (t?.n ?? 0) + 1 }))
    setFase('enviando')
    agendar(1400, () => {
      setFase('boot')
      setLinhas(0)
    })
    BOOT.forEach((_, i) => agendar(1400 + (i + 1) * 420, () => setLinhas(i + 1)))
    agendar(1400 + BOOT.length * 420 + 350, () => setFase('ligado'))
  }

  const desligar = () => {
    if (fase !== 'ligado') return
    setToque((t) => ({ y: 153, n: (t?.n ?? 0) + 1 }))
    setFase('comando')
    setDigitado(0)
    ;[...COMANDO].forEach((_, i) => agendar(900 + i * 65, () => setDigitado(i + 1)))
    const fimDigitacao = 900 + COMANDO.length * 65 + 300
    agendar(fimDigitacao, () => {
      setFase('desligando')
      setLinhas(0)
    })
    PARADA.forEach((_, i) => agendar(fimDigitacao + (i + 1) * 380, () => setLinhas(i + 1)))
    agendar(fimDigitacao + PARADA.length * 380 + 700, () => setFase('desligado'))
  }

  // Miniatura: demonstração automática (liga, fica um tempo ligado, desliga)
  useEffect(() => {
    if (interativo || reduzido) return
    const t = window.setTimeout(() => (fase === 'desligado' ? ligar() : fase === 'ligado' ? desligar() : undefined), fase === 'desligado' ? 1400 : 3200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, interativo])

  const telaAcesa = fase === 'boot' || fase === 'ligado' || fase === 'comando' || fase === 'desligando'
  const enviando = fase === 'enviando' || (fase === 'comando' && digitado === 0)
  const status: Record<Fase, [string, string]> = {
    desligado: ['desligado', '#6c727d'],
    enviando: ['enviando magic packet…', '#27C7F5'],
    boot: ['ligando…', '#27C7F5'],
    ligado: ['ligado', '#4ade80'],
    comando: ['enviando comando…', '#ff8c6b'],
    desligando: ['desligando…', '#ff8c6b'],
  }

  return (
    <Moldura rotulo="Capa do Remote Wake: simulador de ligar e desligar o computador pelo celular" interativo={interativo}>
      {/* celular com o app */}
      <rect x="40" y="52" width="82" height="146" rx="12" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="47" y="64" width="68" height="122" rx="5" fill="#0b1411" />
      <MarcaRemoteWake x={67.5} y={71} escala={0.42} />
      <text x="81" y="112" textAnchor="middle" className="fill-[#8fd9bd] font-mono text-[6.2px]">
        PC do escritório
      </text>
      <circle cx="58" cy="121" r="1.8" fill={status[fase][1]} className="transition-colors duration-300" />
      <text x="62" y="123" className="fill-[#8b949e] font-mono text-[5.6px]">
        {status[fase][0]}
      </text>
      <BotaoCelular y={131} rotulo="LIGAR" cor="#42F5AD" ativo={fase === 'desligado'} interativo={interativo} aoClicar={ligar} />
      <BotaoCelular y={153} rotulo="DESLIGAR" cor="#ff8c6b" ativo={fase === 'ligado'} interativo={interativo} aoClicar={desligar} />
      {toque && <circle key={toque.n} cx="81" cy={toque.y + 8.5} r="9" fill="none" stroke="#ffffff" strokeWidth="1.2" className="rw-toque-1x" />}
      <rect x="72" y="190" width="18" height="3" rx="1.5" fill="var(--apagado)" />

      {/* sinal do celular até o PC (magic packet para ligar; comando para o agente desligar) */}
      {enviando && (
        <g fill="none" stroke={fase === 'enviando' ? '#27C7F5' : '#ff8c6b'} strokeWidth="2.2" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${134 + i * 16} ${106 - i * 5} q 10 ${20 + i * 5} 0 ${40 + i * 10}`} className="rw-onda-viva" style={atraso(i * 0.18)} />
          ))}
        </g>
      )}
      <text x="175" y="206" textAnchor="middle" className={`font-mono text-[8.5px] transition-opacity duration-300 ${enviando ? 'fill-suave' : 'fill-apagado opacity-40'}`}>
        {fase === 'comando' || fase === 'desligando' ? 'agente → shutdown' : 'magic packet → :9'}
      </text>

      {/* monitor */}
      <rect x="212" y="54" width="152" height="106" rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="221" y="63" width="134" height="86" rx="2" fill="#020304" />
      <g style={{ opacity: telaAcesa ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        {(fase === 'boot' || fase === 'ligado') && (
          <>
            <Pinguim />
            <text x="244" y="80" className="fill-[#8b949e] font-mono text-[6.4px]">
              Linux 6.8 · {fase === 'ligado' ? 'pronto' : 'booting…'}
            </text>
            {BOOT.slice(0, linhas).map((l, i) => (
              <LinhaOk key={l} x={228} y={98 + i * 9} texto={l} />
            ))}
            {fase === 'ligado' && (
              <text x="228" y="142" className="font-mono text-[6.8px]">
                <tspan className="fill-[#4ade80]">victor@pc</tspan>
                <tspan className="fill-[#c9d1d9]">:~$ </tspan>
                <tspan className="rw-cursor fill-[#c9d1d9]">▌</tspan>
              </text>
            )}
          </>
        )}
        {(fase === 'comando' || fase === 'desligando') && (
          <>
            <rect x="221" y="63" width="134" height="11" fill="#161b22" />
            <text x="227" y="71" className="fill-[#8b949e] font-mono text-[6px]">
              terminal · agente remote-wake
            </text>
            <text x="228" y="86" className="fill-[#8b949e] font-mono text-[6.2px]">
              [agente] comando recebido: desligar
            </text>
            <text x="228" y="97" className="font-mono text-[6.8px]">
              <tspan className="fill-[#4ade80]">victor@pc</tspan>
              <tspan className="fill-[#c9d1d9]">:~$ {COMANDO.slice(0, digitado)}</tspan>
              {fase === 'comando' && <tspan className="rw-cursor fill-[#c9d1d9]">▌</tspan>}
            </text>
            {fase === 'desligando' &&
              PARADA.slice(0, linhas).map((l, i) => <LinhaOk key={l} x={228} y={110 + i * 9} texto={l} />)}
          </>
        )}
      </g>
      <circle cx="349" cy="154" r="1.8" fill={telaAcesa ? '#4ade80' : '#3a3f47'} className="transition-colors duration-500" />
      <path d="M268 172 h40 l6 16 h-52 z" fill="var(--linha)" />
      <text x="288" y="212" textAnchor="middle" className="fill-suave font-mono text-[9.5px]">
        Wake-on-LAN · PWA
      </text>
      {interativo && (
        <text x="200" y="40" textAnchor="middle" className="fill-apagado font-mono text-[8.5px]">
          toque em LIGAR e DESLIGAR no celular ↓
        </text>
      )}
    </Moldura>
  )
}

// ─── StabilMoney: ícone do app + os "bolsos" variando ─────────────────
function StabilMoney() {
  return (
    <Moldura rotulo="Capa do StabilMoney: ícone do app e o saldo dividido em bruto, reservado e disponível">
      <g className="sm-icone">
        <rect x="46" y="58" width="108" height="108" rx="24" fill="#0f3d2c" />
        <svg x="58" y="70" width="84" height="84" viewBox="150 145 725 715">
          <path d={STABILMONEY_D} fill="#ffffff" />
        </svg>
      </g>
      <text x="100" y="196" textAnchor="middle" className="fill-texto text-[15px] font-semibold">
        Stabil Money
      </text>
      <g transform="translate(196 66)">
        {[
          ['bruto', 'var(--apagado)', 'sm-bruto'],
          ['reservado', '#8fbf9f', 'sm-reservado'],
          ['disponível', '#1f8a4c', 'sm-disponivel'],
        ].map(([rotulo, cor, anim], i) => (
          <g key={rotulo} transform={`translate(0 ${i * 40})`}>
            <text x="0" y="0" className="fill-suave font-mono text-[10px]">
              {rotulo}
            </text>
            <rect x="0" y="7" width="168" height="12" rx="3" fill="var(--linha)" />
            <rect x="0" y="7" width="168" height="12" rx="3" fill={cor} className={anim} />
          </g>
        ))}
        <text x="0" y="128" className="fill-apagado font-mono text-[9px]">
          disponível = bruto − reservado
        </text>
      </g>
    </Moldura>
  )
}

// ─── Fluxo de Agentes: cada etapa acende e passa a vez para a próxima ─────
function FluxoAgentes() {
  const etapas = ['arquiteto', 'você', 'executor', 'checks', 'revisor']
  const x = (i: number) => 44 + i * 78
  const PASSO = 1.6 // segundos em cada etapa; ciclo de 8 s
  return (
    <Moldura rotulo="Capa do Fluxo de Agentes: arquiteto, você, executor, checks e revisor acendendo em sequência">
      {etapas.slice(0, -1).map((e, i) => (
        <line key={e} x1={x(i) + 22} y1="118" x2={x(i + 1) - 22} y2="118" strokeWidth="2" className="fx-seg" style={atraso(i * PASSO)} />
      ))}
      {etapas.map((e, i) => (
        <g key={e}>
          <circle cx={x(i)} cy="118" r="22" strokeWidth="1.6" className="fx-no" style={atraso(i * PASSO)} />
          <text x={x(i)} y="123" textAnchor="middle" className="fx-txt font-mono text-[13px]" style={atraso(i * PASSO)}>
            {['A', '✓', 'E', '▶', 'R'][i]}
          </text>
          <text x={x(i)} y="160" textAnchor="middle" className="fx-txt font-mono text-[9.5px]" style={atraso(i * PASSO)}>
            {e}
          </text>
        </g>
      ))}
      <text x="200" y="62" textAnchor="middle" className="fill-apagado font-mono text-[10px]">
        $ ./agente "nova feature"
      </text>
      <text x="200" y="206" textAnchor="middle" className="fill-apagado font-mono text-[9px]">
        claude · codex · copilot · fallback automático
      </text>
    </Moldura>
  )
}

// ─── BigData Analytics: painel com os gráficos se mexendo ───────────────
function BigData() {
  const barras: [number, number][] = [
    [0.5, 0.8],
    [0.8, 0.45],
    [0.35, 0.7],
    [0.65, 0.9],
    [0.9, 0.55],
    [0.55, 0.3],
  ]
  const area = [30, 44, 38, 60, 52, 70, 64, 82]
  const px = (i: number) => 214 + i * 22
  const py = (v: number) => 208 - v
  const linha = area.map((v, i) => `${i ? 'L' : 'M'}${px(i)} ${py(v)}`).join(' ')
  return (
    <Moldura rotulo="Capa do BigData Analytics: painel com indicadores e gráficos animados">
      {[
        ['alunos', '1.284'],
        ['nota média', '7,8'],
        ['tempo médio', '42 min'],
      ].map(([rotulo, v], i) => (
        <g key={rotulo}>
          <rect x={30 + i * 116} y="30" width="104" height="42" rx="5" fill="var(--fundo)" stroke="var(--linha)" />
          <text x={40 + i * 116} y="46" className="fill-apagado font-mono text-[8px]">
            {rotulo}
          </text>
          <text x={40 + i * 116} y="64" className="bd-kpi fill-texto font-mono text-[13px]" style={atraso(i * 0.7)}>
            {v}
          </text>
        </g>
      ))}
      {/* rosca: a fatia principal cresce e encolhe */}
      <g transform="translate(80 150)">
        <circle r="38" fill="none" stroke="var(--linha)" strokeWidth="14" />
        <circle r="38" fill="none" stroke="var(--suave)" strokeWidth="14" strokeDasharray="239 239" transform="rotate(-90)" />
        <circle r="38" fill="none" stroke="var(--destaque)" strokeWidth="14" strokeDasharray="130 239" transform="rotate(-90)" className="bd-rosca" />
      </g>
      {/* barras subindo e descendo */}
      {barras.map(([a, b], i) => (
        <rect
          key={i}
          x={140 + i * 10}
          y={118}
          width="6"
          height="70"
          rx="1.5"
          fill="var(--apagado)"
          className="bd-barra"
          style={{ ['--a' as string]: a, ['--b' as string]: b, animationDelay: `${i * 0.25}s` } as CSSProperties}
        />
      ))}
      {/* área: a linha se desenha e a área aparece */}
      <path d={`M${px(0)} 208 ${area.map((v, i) => `L${px(i)} ${py(v)}`).join(' ')} L${px(7)} 208 Z`} fill="var(--destaque)" className="bd-area" />
      <path d={linha} fill="none" stroke="var(--destaque)" strokeWidth="2" pathLength={100} className="bd-linha" />
      <line x1="210" y1="208" x2="376" y2="208" stroke="var(--linha)" />
    </Moldura>
  )
}

// ─── Gerenciador de Empréstimos: janela desktop com a tabela ─────────────
function Emprestimos() {
  const linhas = [
    ['Furadeira', 'Ana', 'devolvida'],
    ['Serra tico-tico', 'Bruno', 'ativo'],
    ['Chave de torque', 'Carla', 'ativo'],
    ['Esmerilhadeira', 'Diego', 'devolvida'],
  ]
  return (
    <Moldura rotulo="Capa do Gerenciador de Empréstimos: janela com a tabela de empréstimos de ferramentas">
      <rect x="40" y="30" width="320" height="190" rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.2" />
      <rect x="40" y="30" width="320" height="24" rx="6" fill="var(--linha)" />
      <rect x="40" y="46" width="320" height="8" fill="var(--linha)" />
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
        <circle key={c} cx={54 + i * 12} cy="42" r="3.5" fill={c} />
      ))}
      <text x="200" y="46" textAnchor="middle" className="fill-suave font-mono text-[10px]">
        Empréstimos · Java
      </text>
      {['Ferramenta', 'Amigo', 'Situação'].map((c, i) => (
        <text key={c} x={56 + i * 108} y="76" className="fill-apagado font-mono text-[9.5px] uppercase">
          {c}
        </text>
      ))}
      <line x1="52" y1="84" x2="348" y2="84" stroke="var(--linha)" />
      {/* seleção percorrendo as linhas, como alguém navegando na tabela */}
      <rect x="48" y="88" width="304" height="22" rx="3" className="emp-selecao" />
      {linhas.map((l, i) => (
        <g key={l[0]} transform={`translate(0 ${103 + i * 26})`}>
          <text x="56" y="0" className="fill-texto text-[11px]">
            {l[0]}
          </text>
          <text x="164" y="0" className="fill-suave text-[11px]">
            {l[1]}
          </text>
          <rect x="268" y="-10" width="64" height="15" rx="7.5" fill={l[2] === 'ativo' ? 'var(--destaque)' : 'var(--linha)'} />
          <text x="300" y="1" textAnchor="middle" className={`font-mono text-[9px] ${l[2] === 'ativo' ? 'fill-fundo' : 'fill-suave'}`}>
            {l[2]}
          </text>
        </g>
      ))}
    </Moldura>
  )
}

const CAPAS: Record<string, (p: { interativo: boolean }) => ReactNode> = {
  'remote-wake': RemoteWake,
  stabilmoney: StabilMoney,
  'fluxo-agentes': FluxoAgentes,
  bigdata: BigData,
  'emprestimo-a3': Emprestimos,
}

export function CapaProjeto({ id, nome, className = '', interativo = false }: { id: string; nome: string; className?: string; interativo?: boolean }) {
  const Desenho = CAPAS[id]
  if (!Desenho) return <Capa id={id} nome={nome} className={className} />
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Desenho interativo={interativo} />
    </div>
  )
}
