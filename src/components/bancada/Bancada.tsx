import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { linkWhatsapp, perfil } from '../../data/perfil'
import { useAtividade } from '../../lib/atividade'
import { WhatsappIcon } from '../Icones'
import { Placa } from './Placa'

// Abertura: apresentação em primeiro plano e, no fundo, uma bancada com ESP32
// "funcionando". O sensor ultrassônico mede a distância até o cursor; o LED
// acende quando algo chega perto e o servo acompanha a distância.
// Embaixo, uma faixa de telemetria com automações e integrações rolando.

const PERTO_CM = 40
const CICLO_MS = 450

const AREAS = ['Sistemas web', 'Automações', 'Integrações e APIs', 'ESP32 e Arduino', 'Sensores e IoT']

function useHora() {
  const [hora, setHora] = useState('')
  useEffect(() => {
    const f = () => setHora(new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: perfil.fuso }).format(new Date()))
    f()
    const t = setInterval(f, 15_000)
    return () => clearInterval(t)
  }, [])
  return hora
}

export function Abertura() {
  const { dados } = useAtividade()
  const hora = useHora()
  const refSensor = useRef<SVGGElement>(null)
  const ponteiro = useRef({ x: 0, y: 0, dentro: false })
  const [cm, setCm] = useState(90)
  const [ledPlaca, setLedPlaca] = useState(false)

  // Cursor (só mouse). No toque, ou com o mouse fora da página, um objeto
  // simulado vai e volta na frente do sensor.
  useEffect(() => {
    const mover = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') ponteiro.current = { x: e.clientX, y: e.clientY, dentro: true }
    }
    const sair = () => (ponteiro.current.dentro = false)
    window.addEventListener('pointermove', mover, { passive: true })
    document.documentElement.addEventListener('pointerleave', sair)
    return () => {
      window.removeEventListener('pointermove', mover)
      document.documentElement.removeEventListener('pointerleave', sair)
    }
  }, [])

  // Um ciclo do "firmware": mede, pisca o LED da placa e atualiza a leitura
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      const el = refSensor.current
      const pt = ponteiro.current
      let medida: number
      if (el && pt.dentro) {
        const r = el.getBoundingClientRect()
        medida = 2 + Math.hypot(pt.x - (r.left + r.width / 2), pt.y - (r.top + r.height / 2)) * 0.32
      } else {
        medida = 70 + 58 * Math.sin(performance.now() / 2600)
      }
      setCm(Math.min(400, Math.max(2, medida + (Math.random() - 0.5) * 0.8)))
      setLedPlaca((v) => !v)
    }, CICLO_MS)
    return () => clearInterval(id)
  }, [])

  const perto = cm < PERTO_CM
  const semana = dados?.dias.slice(-7) ?? []
  const oled = {
    linhas: [`VICTOR DE MELO  ${hora}`, `dist ${cm.toFixed(1).padStart(6)} cm`, dados ? `commits/ano ${dados.total}` : 'wifi: conectando'],
    barras: semana.length ? semana.map((d) => d.nivel / 4) : Array(7).fill(0),
  }
  // Servo: 0° longe, até 150° quando algo encosta no sensor
  const angulo = Math.round(150 * (1 - Math.min(cm, 150) / 150))

  return (
    <div className="relative isolate">
      {/* ─── Fundo: a bancada ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 opacity-30 max-lg:inset-x-[-30%] max-lg:bottom-6 max-lg:[mask-image:linear-gradient(to_bottom,transparent,black_45%)] sm:opacity-40 lg:top-1/2 lg:-right-[6%] lg:w-[64%] lg:-translate-y-[46%] lg:opacity-60 lg:[mask-image:linear-gradient(to_right,transparent,black_28%)]"
      >
        <Placa refSensor={refSensor} distancia={cm} ledAceso={perto} anguloServo={angulo} ledPlaca={ledPlaca} oled={oled} ligada />
      </div>

      {/* ─── Primeiro plano ───────────────────────────── */}
      <div className="flex min-h-[calc(88svh-3.5rem)] flex-col justify-center py-14 lg:py-20">
        <p className="font-mono text-xs text-suave">
          <span className="text-destaque">//</span> desenvolvedor de software · {perfil.local}
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl xl:text-7xl">
          Olá, eu sou o <span className="text-destaque">Victor</span>
          <span className="block text-texto/90">de Melo da Rosa.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-suave sm:text-xl">
          Desenvolvo software de ponta a ponta: <span className="text-texto">sistemas web, automações e integrações</span>, e levo isso até o
          hardware, com <span className="text-texto">microcontroladores, sensores e IoT</span>.
        </p>

        <ul className="mt-7 flex max-w-xl flex-wrap gap-2">
          {AREAS.map((a) => (
            <li key={a} className="rounded-md border border-linha bg-fundo/70 px-2.5 py-1 font-mono text-xs text-suave backdrop-blur-sm">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={linkWhatsapp()}
            onClick={(e) => (e.currentTarget.href = linkWhatsapp())}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-destaque px-4 py-2.5 text-sm font-medium text-fundo transition hover:opacity-90"
          >
            <WhatsappIcon size={16} /> Falar no WhatsApp
          </a>
          <a
            href="#/projetos"
            className="inline-flex items-center gap-2 rounded-md border border-linha bg-fundo/70 px-4 py-2.5 text-sm backdrop-blur-sm transition hover:border-destaque hover:text-destaque"
          >
            Ver projetos <ArrowDown size={15} />
          </a>
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-apagado">
          <span className="flex items-center gap-2">
            <span className="pisca h-1.5 w-1.5 rounded-full bg-vivo" /> disponível para projetos
          </span>
          {dados && (
            <>
              <span>·</span>
              <span>{dados.total.toLocaleString('pt-BR')} contribuições no GitHub em 12 meses</span>
            </>
          )}
        </p>
      </div>

      <Telemetria cm={cm} commits={dados?.total} />
    </div>
  )
}

/** Faixa rolando com o tipo de coisa que eu automatizo e integro */
function Telemetria({ cm, commits }: { cm: number; commits?: number }) {
  const itens = [
    ['esp32', `hc-sr04 ${cm.toFixed(1)} cm`],
    ['mqtt', 'casa/sala/temperatura 24.3 °C'],
    ['api', 'POST /webhooks/pedido 201'],
    ['whatsapp', 'mensagem automática enviada'],
    ['n8n', 'fluxo "novo-lead" executado'],
    ['github', commits ? `${commits.toLocaleString('pt-BR')} contribuições/ano` : 'sincronizando'],
    ['cron', 'backup do banco concluído'],
    ['i2c', 'ssd1306 em 0x3C ok'],
    ['pix', 'cobrança confirmada via webhook'],
  ]
  const faixa = itens.map(([tag, txt]) => (
    <span key={tag} className="flex shrink-0 items-center gap-2 px-5">
      <span className="text-destaque">[{tag}]</span> {txt}
    </span>
  ))
  return (
    <div
      aria-hidden="true"
      className="border-t border-linha/70 py-3 font-mono text-[11px] whitespace-nowrap text-apagado [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="faixa-telemetria flex w-max">
        <div className="flex">{faixa}</div>
        <div className="flex">{faixa}</div>
      </div>
    </div>
  )
}
