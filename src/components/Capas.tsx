import type { CSSProperties, ReactNode } from 'react'
import { Capa } from './Capa'
import { STABILMONEY_D } from './marcas'

// Capas ilustradas e animadas de cada projeto, desenhadas a partir do que o
// repositório faz. Todas em 400×250 (16:10); as animações estão no index.css
// (prefixos rw-, sm-, fx-, bd-) e param com prefers-reduced-motion.
// Projeto sem capa aqui cai na capa gerada (trecho de placa com as iniciais).

const W = 400
const H = 250

const atraso = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

function Moldura({ children, rotulo }: { children: ReactNode; rotulo: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={rotulo}>
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

// ─── Remote Wake: toque no app → magic packet → o PC liga e o Linux sobe ───
function RemoteWake() {
  const boot = ['[  OK  ] Started Network Manager.', '[  OK  ] Reached target Network.', '[  OK  ] Started OpenSSH Server.', '[  OK  ] Reached target Graphical.']
  return (
    <Moldura rotulo="Capa do Remote Wake: toque no celular envia o sinal e o computador liga o Linux">
      {/* celular com o app */}
      <rect x="46" y="62" width="70" height="128" rx="11" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="54" y="76" width="54" height="96" rx="4" fill="#0b1411" />
      <MarcaRemoteWake x={67} y={84} escala={0.44} />
      <text x="81" y="128" textAnchor="middle" className="fill-[#8fd9bd] font-mono text-[6px]">
        PC do escritório
      </text>
      <g className="rw-botao">
        <rect x="62" y="138" width="38" height="16" rx="8" fill="#42F5AD" />
        <text x="81" y="149" textAnchor="middle" className="fill-[#0b1411] font-mono text-[7px] font-semibold">
          LIGAR
        </text>
      </g>
      <circle cx="81" cy="146" r="10" fill="none" stroke="#42F5AD" strokeWidth="1.5" className="rw-toque" />
      <rect x="72" y="178" width="18" height="3" rx="1.5" fill="var(--apagado)" />

      {/* magic packet indo até o PC */}
      <g fill="none" stroke="#27C7F5" strokeWidth="2.2" strokeLinecap="round">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${132 + i * 20} ${104 - i * 5} q 11 ${22 + i * 5} 0 ${44 + i * 10}`} className="rw-onda" style={atraso(i * 0.22)} />
        ))}
      </g>
      <text x="170" y="200" textAnchor="middle" className="rw-pacote fill-apagado font-mono text-[8.5px]">
        magic packet → :9
      </text>

      {/* monitor */}
      <rect x="212" y="54" width="152" height="106" rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="221" y="63" width="134" height="86" rx="2" fill="#020304" />
      <g className="rw-tela">
        {/* pinguim do boot */}
        <g transform="translate(229 69)" className="rw-tux">
          <ellipse cx="7" cy="10" rx="6" ry="8" fill="#111" stroke="#666" strokeWidth="0.4" />
          <ellipse cx="7" cy="12" rx="3.6" ry="5.4" fill="#f2f2f2" />
          <circle cx="5.4" cy="5.6" r="1" fill="#fff" />
          <circle cx="8.6" cy="5.6" r="1" fill="#fff" />
          <path d="M5.6 7.6 h2.8 l-1.4 1.6 z" fill="#f5b83d" />
          <ellipse cx="4.4" cy="18.2" rx="2.2" ry="0.9" fill="#f5b83d" />
          <ellipse cx="9.6" cy="18.2" rx="2.2" ry="0.9" fill="#f5b83d" />
        </g>
        {boot.map((l, i) => (
          <text key={l} x="228" y={98 + i * 9} className="rw-linha font-mono text-[6.4px]" style={atraso(i * 0.45)}>
            <tspan className="fill-[#4ade80]">{l.slice(0, 8)}</tspan>
            <tspan className="fill-[#c9d1d9]">{l.slice(8)}</tspan>
          </text>
        ))}
        <text x="244" y="80" className="rw-linha fill-[#8b949e] font-mono text-[6.4px]" style={atraso(0)}>
          Linux 6.8 · booting…
        </text>
        <text x="228" y="142" className="rw-prompt font-mono text-[6.8px]">
          <tspan className="fill-[#4ade80]">victor@pc</tspan>
          <tspan className="fill-[#c9d1d9]">:~$ </tspan>
          <tspan className="rw-cursor fill-[#c9d1d9]">▌</tspan>
        </text>
      </g>
      <circle cx="349" cy="154" r="1.8" className="rw-led" />
      <path d="M268 172 h40 l6 16 h-52 z" fill="var(--linha)" />
      <text x="288" y="212" textAnchor="middle" className="fill-suave font-mono text-[9.5px]">
        Wake-on-LAN · PWA
      </text>
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
          ['bruto', 'var(--apagado)', ''],
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

const CAPAS: Record<string, () => ReactNode> = {
  'remote-wake': RemoteWake,
  stabilmoney: StabilMoney,
  'fluxo-agentes': FluxoAgentes,
  bigdata: BigData,
  'emprestimo-a3': Emprestimos,
}

export function CapaProjeto({ id, nome, className = '' }: { id: string; nome: string; className?: string }) {
  const Desenho = CAPAS[id]
  if (!Desenho) return <Capa id={id} nome={nome} className={className} />
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Desenho />
    </div>
  )
}
