import type { ReactNode } from 'react'
import { Capa } from './Capa'

// Capas ilustradas de cada projeto, desenhadas a partir do que o repositório faz.
// Todas em 400×250 (16:10); as cores seguem o tema, exceto as marcas dos projetos.
// Projeto sem capa aqui cai na capa gerada (trecho de placa com as iniciais).

const W = 400
const H = 250

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

// ─── Remote Wake: celular manda o "magic packet" e o PC liga ─────────
function RemoteWake() {
  return (
    <Moldura rotulo="Capa do Remote Wake: celular enviando sinal para ligar um computador">
      {/* celular */}
      <rect x="52" y="78" width="62" height="112" rx="10" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="60" y="92" width="46" height="78" rx="3" fill="var(--superficie)" />
      <circle cx="83" cy="131" r="15" fill="none" stroke="#42F5AD" strokeWidth="3" strokeDasharray="70 25" strokeLinecap="round" transform="rotate(-50 83 131)" />
      <line x1="83" y1="118" x2="83" y2="131" stroke="#42F5AD" strokeWidth="3" strokeLinecap="round" />
      <rect x="74" y="178" width="18" height="3" rx="1.5" fill="var(--apagado)" />
      {/* pacote viajando */}
      <g fill="none" stroke="#27C7F5" strokeWidth="2" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${130 + i * 26} ${112 - i * 6} q 10 ${18 + i * 6} 0 ${36 + i * 12}`} opacity={1 - i * 0.25} />
        ))}
      </g>
      <text x="175" y="200" textAnchor="middle" className="fill-apagado font-mono text-[10px]">
        FF:FF:FF:FF:FF:FF ×16
      </text>
      {/* monitor */}
      <rect x="216" y="62" width="140" height="98" rx="6" fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1.5" />
      <rect x="226" y="72" width="120" height="78" rx="2" fill="var(--superficie)" />
      <path d="M270 172 h32 l6 16 h-44 z" fill="var(--linha)" />
      {/* marca do Remote Wake no centro da tela */}
      <g transform="translate(262 83) scale(0.75)">
        <path d="M17.5 27.5a21 21 0 1 0 29 0" stroke="#42F5AD" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M32 17.5v18" stroke="#42F5AD" strokeWidth="6" strokeLinecap="round" />
        <path d="M24 12.5a13 13 0 0 1 16 0" stroke="#27C7F5" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M18 6.5a22 22 0 0 1 28 0" stroke="#27C7F5" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <text x="286" y="214" textAnchor="middle" className="fill-suave font-mono text-[10px]">
        Wake-on-LAN · PWA
      </text>
    </Moldura>
  )
}

// ─── StabilMoney: marca + os "bolsos" do saldo ─────────────────
function StabilMoney() {
  const bolsos = [
    { rotulo: 'bruto', v: 1, cor: 'var(--apagado)' },
    { rotulo: 'reservado', v: 0.42, cor: '#8fbf9f' },
    { rotulo: 'disponível', v: 0.58, cor: '#1f8a4c' },
  ]
  return (
    <Moldura rotulo="Capa do StabilMoney: marca do app e o saldo dividido em bolsos">
      <image href="/capas/stabilmoney-mark.png" x="44" y="62" width="112" height="112" />
      <text x="100" y="200" textAnchor="middle" className="fill-texto text-[15px] font-semibold">
        Stabil Money
      </text>
      <g transform="translate(200 70)">
        {bolsos.map((b, i) => (
          <g key={b.rotulo} transform={`translate(0 ${i * 40})`}>
            <text x="0" y="0" className="fill-suave font-mono text-[10px]">
              {b.rotulo}
            </text>
            <rect x="0" y="7" width="160" height="12" rx="3" fill="var(--linha)" />
            <rect x="0" y="7" width={160 * b.v} height="12" rx="3" fill={b.cor} />
          </g>
        ))}
        <text x="0" y="128" className="fill-apagado font-mono text-[9px]">
          disponível = bruto − reservado
        </text>
      </g>
    </Moldura>
  )
}

// ─── Fluxo de Agentes: a esteira de IAs ────────────────────────
function FluxoAgentes() {
  const etapas = ['arquiteto', 'você', 'executor', 'checks', 'revisor']
  const x = (i: number) => 44 + i * 78
  return (
    <Moldura rotulo="Capa do Fluxo de Agentes: esteira arquiteto, você, executor, checks e revisor">
      <path id="esteira" d={`M${x(0)} 118 H${x(4)}`} stroke="var(--linha)" strokeWidth="2" />
      {etapas.map((e, i) => (
        <g key={e}>
          <circle cx={x(i)} cy="118" r="22" fill="var(--fundo)" stroke={i === 1 ? 'var(--destaque)' : 'var(--apagado)'} strokeWidth="1.5" />
          <text x={x(i)} y="123" textAnchor="middle" className={`font-mono text-[13px] ${i === 1 ? 'fill-destaque' : 'fill-suave'}`}>
            {['A', '✓', 'E', '▶', 'R'][i]}
          </text>
          <text x={x(i)} y="160" textAnchor="middle" className="fill-suave font-mono text-[9.5px]">
            {e}
          </text>
        </g>
      ))}
      <circle r="4" fill="var(--destaque)" className="so-com-movimento">
        <animateMotion dur="4s" repeatCount="indefinite">
          <mpath href="#esteira" />
        </animateMotion>
      </circle>
      <text x="200" y="62" textAnchor="middle" className="fill-apagado font-mono text-[10px]">
        $ ./agente "nova feature"
      </text>
      <text x="200" y="206" textAnchor="middle" className="fill-apagado font-mono text-[9px]">
        claude · codex · copilot · fallback automático
      </text>
    </Moldura>
  )
}

// ─── BigData Analytics: mini dashboard ─────────────────────────
function BigData() {
  const barras = [0.5, 0.8, 0.35, 0.65, 0.9, 0.55]
  const area = [30, 44, 38, 60, 52, 70, 64, 82]
  const px = (i: number) => 214 + i * 22
  const py = (v: number) => 208 - v
  return (
    <Moldura rotulo="Capa do BigData Analytics: painel com indicadores e gráficos">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 116} y="30" width="104" height="42" rx="5" fill="var(--fundo)" stroke="var(--linha)" />
          <rect x={40 + i * 116} y="40" width="40" height="5" rx="2" fill="var(--linha)" />
          <text x={40 + i * 116} y="64" className="fill-texto font-mono text-[13px]">
            {['1.284', '7,8', '42 min'][i]}
          </text>
        </g>
      ))}
      {/* rosca */}
      <g transform="translate(80 150)">
        <circle r="38" fill="none" stroke="var(--linha)" strokeWidth="14" />
        <circle r="38" fill="none" stroke="var(--destaque)" strokeWidth="14" strokeDasharray="130 239" transform="rotate(-90)" />
        <circle r="38" fill="none" stroke="var(--suave)" strokeWidth="14" strokeDasharray="60 239" strokeDashoffset="-132" transform="rotate(-90)" />
      </g>
      {/* barras */}
      {barras.map((b, i) => (
        <rect key={i} x={140 + i * 10} y={188 - b * 70} width="6" height={b * 70} rx="1.5" fill="var(--apagado)" />
      ))}
      {/* área */}
      <path d={`M${px(0)} 208 ${area.map((v, i) => `L${px(i)} ${py(v)}`).join(' ')} L${px(7)} 208 Z`} fill="var(--destaque)" opacity="0.18" />
      <path d={area.map((v, i) => `${i ? 'L' : 'M'}${px(i)} ${py(v)}`).join(' ')} fill="none" stroke="var(--destaque)" strokeWidth="2" />
      <line x1="210" y1="208" x2="376" y2="208" stroke="var(--linha)" />
    </Moldura>
  )
}

// ─── Gerenciador de Empréstimos: janela desktop com a tabela ───────
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
      {linhas.map((l, i) => (
        <g key={l[0]} transform={`translate(0 ${100 + i * 26})`}>
          <text x="56" y="0" className="fill-texto text-[11px]">
            {l[0]}
          </text>
          <text x="164" y="0" className="fill-suave text-[11px]">
            {l[1]}
          </text>
          <rect x="268" y="-10" width="64" height="15" rx="7.5" fill={l[2] === 'ativo' ? 'var(--destaque)' : 'var(--linha)'} opacity={l[2] === 'ativo' ? 0.9 : 1} />
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
