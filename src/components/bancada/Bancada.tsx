import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, Cpu, MousePointer2, Power } from 'lucide-react'
import { perfil } from '../../data/perfil'
import { sequenciaAtual, useAtividade, type Atividade } from '../../lib/atividade'
import { arquivos } from './codigo'
import { Editor } from './Editor'
import { Placa } from './Placa'
import { Serial, type LinhaSerial } from './Serial'

// A bancada da abertura: um ESP32 "rodando" o firmware do editor.
// O ponteiro de execução anda pelas linhas do loop() e cada linha tem efeito:
// sonar.read mede a distância (até o cursor do mouse), digitalWrite acende o LED,
// cancela.write move o servo e Serial.printf escreve no monitor serial.

const LIMITE_CM = 30
const TICK_MS = 110
const MAX_LINHAS = 160

// Linhas do loop() no firmware e quantos ticks o ponteiro fica em cada uma
const FONTE = arquivos[0].codigo.split('\n')
const INICIO_LOOP = FONTE.findIndex((l) => l.startsWith('void loop'))
const achar = (trecho: string) => FONTE.findIndex((l, i) => i > INICIO_LOOP && l.includes(trecho))
const L = {
  ler: achar('sonar.read'),
  decidir: achar('bool ocupada'),
  led: achar('digitalWrite'),
  servo: achar('cancela.write'),
  imprimir: achar('Serial.printf'),
  esperar: achar('delay('),
}
const PROGRAMA: [number, number][] = [
  [L.ler, 1],
  [L.decidir, 1],
  [L.led, 1],
  [L.servo, 1],
  [L.imprimir, 1],
  [L.esperar, 5],
]
const PASSOS = PROGRAMA.flatMap(([linha, n]) => Array(n).fill(linha) as number[])

function agoraSerial() {
  const d = new Date()
  const p = (n: number, t = 2) => String(n).padStart(t, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`
}

function linhasDeBoot(a: Atividade | null): [number, string][] {
  const gh = a
    ? `[github] 200 · ${a.total.toLocaleString('pt-BR')} contribuições em 12 meses · sequência ${sequenciaAtual(a.dias)} d`
    : '[github] sem resposta · seguindo offline'
  return [
    [0, 'ets Jun  8 2016 00:22:57'],
    [70, 'rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)'],
    [60, 'load:0x3fff0030,len:1344'],
    [60, 'entry 0x400805f0'],
    [350, `[boot] VMR-2026 · firmware 2026.09 · ${perfil.nome}`],
    [260, '[wifi] conectando a "floripa-5g"...'],
    [650, '[wifi] ok · ip 192.168.0.42 · -58 dBm'],
    [260, `[github] GET /v4/${perfil.github}?y=last`],
    [520, gh],
    [300, '[sensor] HC-SR04 ok · SSD1306 ok · SG90 em 0°'],
    [260, '[loop] rodando · aproxime o cursor do sensor ultrassônico'],
  ]
}

export function Bancada() {
  const { dados } = useAtividade()
  const dadosRef = useRef(dados)
  dadosRef.current = dados

  const refSensor = useRef<SVGGElement>(null)
  const ponteiro = useRef({ x: 0, y: 0, dentro: false })
  const idLinha = useRef(0)

  const [linhas, setLinhas] = useState<LinhaSerial[]>([])
  const [ligada, setLigada] = useState(true)
  const [rodando, setRodando] = useState(false)
  const [boot, setBoot] = useState(0) // muda a cada reset
  const [passo, setPasso] = useState(0)
  const passoRef = useRef(0)
  const [cm, setCm] = useState(120)
  const [ocupada, setOcupada] = useState(false)
  const [servo, setServo] = useState(0)
  const [ledPlaca, setLedPlaca] = useState(false)
  const [hora, setHora] = useState('')
  const estado = useRef({ cm: 120, ocupada: false })

  const escrever = useCallback((texto: string) => {
    setLinhas((ls) => [...ls.slice(-MAX_LINHAS), { id: idLinha.current++, hora: agoraSerial(), texto }])
  }, [])

  // Posição do cursor (só mouse; no toque, ou com o mouse fora da página,
  // a distância é simulada por um objeto indo e voltando)
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

  // Boot: escreve a sequência do ESP32 com os atrasos de uma placa de verdade.
  // Na linha do GitHub, espera a resposta (até 5 s) como o firmware esperaria.
  useEffect(() => {
    let cancelado = false
    const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms))
    ;(async () => {
      setLinhas([])
      setRodando(false)
      setLigada(false)
      await dormir(450)
      if (cancelado) return
      setLigada(true)
      const roteiro = linhasDeBoot(null)
      for (let i = 0; i < roteiro.length; i++) {
        await dormir(roteiro[i][0])
        // (a linha da resposta; no roteiro sem dados ela é a de "sem resposta")
        if (roteiro[i][1].startsWith('[github] sem')) {
          for (let esperado = 0; !dadosRef.current && esperado < 5000; esperado += 250) await dormir(250)
        }
        if (cancelado) return
        escrever(linhasDeBoot(dadosRef.current)[i][1])
      }
      await dormir(200)
      if (!cancelado) setRodando(true)
    })()
    return () => {
      cancelado = true
    }
  }, [boot, escrever])

  // Loop: o ponteiro de execução anda pelas linhas e cada uma age na placa
  useEffect(() => {
    if (!rodando) return
    const id = setInterval(() => {
      const prox = (passoRef.current + 1) % PASSOS.length
      passoRef.current = prox
      setPasso(prox)
      const linha = PASSOS[prox]
      const s = estado.current
      if (linha === L.ler) {
        const el = refSensor.current
        const pt = ponteiro.current
        let medida: number
        if (el && pt.dentro) {
          const r = el.getBoundingClientRect()
          const px = Math.hypot(pt.x - (r.left + r.width / 2), pt.y - (r.top + r.height / 2))
          medida = 2 + px * 0.32
        } else {
          medida = 62 + 54 * Math.sin(performance.now() / 2300)
        }
        s.cm = Math.min(400, Math.max(2, medida + (Math.random() - 0.5) * 0.8))
        setCm(s.cm)
        setLedPlaca((v) => !v)
      } else if (linha === L.decidir) {
        const nova = s.cm < LIMITE_CM
        if (nova !== s.ocupada) escrever(`[evento] vaga ${nova ? 'OCUPADA' : 'LIVRE'} · cancela ${nova ? 'abrindo (90°)' : 'fechando (0°)'}`)
        s.ocupada = nova
      } else if (linha === L.led) {
        setOcupada(s.ocupada)
      } else if (linha === L.servo) {
        setServo(s.ocupada ? 80 : 0)
      } else if (linha === L.imprimir) {
        escrever(`dist=${s.cm.toFixed(1)}cm vaga=${s.ocupada ? 'OCUPADA' : 'LIVRE'}`)
      }
    }, TICK_MS)
    return () => clearInterval(id)
  }, [rodando, escrever])

  // Relógio do display
  useEffect(() => {
    const f = () => setHora(new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: perfil.fuso }).format(new Date()))
    f()
    const t = setInterval(f, 1000)
    return () => clearInterval(t)
  }, [])

  const reiniciar = useCallback(() => {
    setOcupada(false)
    setServo(0)
    estado.current.ocupada = false
    setBoot((b) => b + 1)
  }, [])

  const semana = dados?.dias.slice(-7) ?? []
  const oled = {
    linhas: [`VMR-2026   ${hora.slice(0, 5)}`, `dist ${cm.toFixed(1).padStart(6)} cm`, `vaga ${ocupada ? 'OCUPADA' : 'LIVRE'}`],
    barras: semana.length ? semana.map((d) => d.nivel / 4) : Array(7).fill(0),
  }

  return (
    <div>
      <div className="grid items-center gap-8 py-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-12">
        <div>
          <p className="font-mono text-xs text-destaque">
            <span className="text-apagado">~/bancada $</span> ./apresentar --modo=vivo
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl xl:text-6xl">{perfil.nome}</h1>
          <p className="mt-4 text-lg text-suave">
            Engenharia da Computação e desenvolvimento full stack.{' '}
            <span className="text-texto">Do firmware ao deploy:</span> microcontroladores, sensores, APIs e sistemas web.
          </p>
          <ul className="mt-6 space-y-2 font-mono text-xs text-suave">
            <li className="flex items-center gap-2.5 [@media(hover:none)]:hidden">
              <MousePointer2 size={14} className="text-destaque" /> aproxime o cursor do sensor ultrassônico
            </li>
            <li className="hidden items-center gap-2.5 [@media(hover:none)]:flex">
              <MousePointer2 size={14} className="text-destaque" /> um objeto simulado passa na frente do sensor
            </li>
            <li className="flex items-center gap-2.5">
              <Power size={14} className="text-destaque" /> clique em EN no ESP32 para reiniciar
            </li>
            <li className="flex items-center gap-2.5">
              <Cpu size={14} className="text-destaque" /> o firmware abaixo é o que está rodando na placa
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#/projetos" className="inline-flex items-center gap-2 rounded-md bg-destaque px-4 py-2.5 text-sm font-medium text-fundo transition hover:opacity-90">
              Ver projetos <ArrowDown size={15} />
            </a>
            <a href="#/contato" className="inline-flex items-center gap-2 rounded-md border border-linha bg-superficie px-4 py-2.5 text-sm transition hover:border-destaque hover:text-destaque">
              Falar comigo
            </a>
          </div>
        </div>

        <figure>
          <Placa
            refSensor={refSensor}
            distancia={cm}
            ocupada={ocupada}
            anguloServo={servo}
            ledPlaca={ledPlaca}
            oled={oled}
            aoReiniciar={reiniciar}
            ligada={ligada}
          />
          <figcaption className="mt-2 text-center font-mono text-[11px] text-apagado">
            ESP32 · HC-SR04 · SSD1306 · SG90 — vaga {ocupada ? <span className="text-destaque">ocupada</span> : 'livre'} abaixo de {LIMITE_CM} cm
          </figcaption>
        </figure>
      </div>

      <div className="grid gap-4 pb-12 lg:grid-cols-2">
        <div className="hidden sm:block">
          <Editor linhaExec={rodando ? PASSOS[passo] : null} />
        </div>
        <Serial linhas={linhas} aoReiniciar={reiniciar} ligada={ligada} />
      </div>
    </div>
  )
}
