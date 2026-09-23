import type { Ref } from 'react'

// A bancada desenhada em SVG: protoboard, ESP32 DevKit, HC-SR04, display OLED
// SSD1306, LED com resistor e um servo SG90 fazendo papel de cancela.
// As cores das peças são as reais (não seguem o tema); só o fundo acompanha.

type Props = {
  refSensor: Ref<SVGGElement>
  distancia: number
  ocupada: boolean
  anguloServo: number
  ledPlaca: boolean
  oled: { linhas: string[]; barras: number[] }
  aoReiniciar: () => void
  ligada: boolean
}

// Pinos da barra superior do ESP32 (15 pinos, passo de 12)
const pinoEsp = (i: number) => 62 + i * 12
const Y_ESP = 252

// Jumpers: [x1, y1, x2, y2, cor, é sinal de dados?]
const FIOS: [number, number, number, number, string, boolean][] = [
  // OLED (I²C)
  [pinoEsp(14), Y_ESP, 322, 146, '#1f1f1f', false],
  [pinoEsp(13), Y_ESP, 334, 146, '#e5383b', false],
  [pinoEsp(10), Y_ESP, 346, 146, '#2bb673', true],
  [pinoEsp(9), Y_ESP, 358, 146, '#f5c518', true],
  // HC-SR04
  [pinoEsp(2), Y_ESP, 510, 128, '#e5383b', false],
  [pinoEsp(11), Y_ESP, 522, 128, '#ff8c1a', true],
  [pinoEsp(12), Y_ESP, 534, 128, '#3a86ff', true],
  [pinoEsp(1), Y_ESP, 546, 128, '#1f1f1f', false],
  // Servo
  [pinoEsp(7), Y_ESP, 466, 188, '#ff8c1a', true],
]

function curva(x1: number, y1: number, x2: number, y2: number) {
  const meio = Math.min(y1, y2) - 26
  return `M${x1} ${y1} C${x1} ${meio}, ${x2} ${meio + 10}, ${x2} ${y2}`
}

export function Placa({ refSensor, distancia, ocupada, anguloServo, ledPlaca, oled, aoReiniciar, ligada }: Props) {
  return (
    <svg viewBox="0 -40 640 432" className="h-auto w-full select-none" role="img" aria-label="Bancada com ESP32, sensor ultrassônico, display OLED, LED e servo">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef0f3" />
          <stop offset="0.5" stopColor="#b9bec6" />
          <stop offset="1" stopColor="#8d949e" />
        </linearGradient>
        <pattern id="furos" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect x="4.5" y="4.5" width="3" height="3" rx="0.6" fill="#b5ae9d" />
        </pattern>
        <pattern id="malha" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.9" fill="#4a5059" />
        </pattern>
        <filter id="brilho" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ─── Protoboard ─────────────────────────────────── */}
      <g>
        <rect x="16" y="200" width="608" height="186" rx="10" fill="#e9e6dd" stroke="#cbc5b5" />
        <line x1="30" y1="206" x2="610" y2="206" stroke="#e5383b" strokeWidth="1.5" />
        <line x1="30" y1="226" x2="610" y2="226" stroke="#3a86ff" strokeWidth="1.5" />
        <rect x="28" y="208" width="584" height="16" fill="url(#furos)" />
        <rect x="28" y="236" width="584" height="46" fill="url(#furos)" />
        <rect x="24" y="286" width="592" height="8" rx="2" fill="#d9d4c6" />
        <rect x="28" y="298" width="584" height="46" fill="url(#furos)" />
        <line x1="30" y1="352" x2="610" y2="352" stroke="#e5383b" strokeWidth="1.5" />
        <line x1="30" y1="376" x2="610" y2="376" stroke="#3a86ff" strokeWidth="1.5" />
        <rect x="28" y="356" width="584" height="16" fill="url(#furos)" />
      </g>

      {/* ─── LED + resistor na protoboard ───────────────── */}
      <g>
        {/* GPIO → resistor → LED → GND */}
        <path d={`M${pinoEsp(6)} 330 C ${pinoEsp(6)} 372, 404 372, 404 326`} fill="none" stroke="#2bb673" strokeWidth="3" strokeLinecap="round" />
        <path d="M332 334 L332 362" fill="none" stroke="#1f1f1f" strokeWidth="3" strokeLinecap="round" />
        <rect x="350" y="319" width="40" height="10" rx="4" fill="#d8b98a" />
        {['#8b4513', '#1f1f1f', '#e5383b', '#c9a24a'].map((c, i) => (
          <rect key={c} x={356 + i * 8} y="319" width="3" height="10" fill={c} />
        ))}
        <line x1="342" y1="324" x2="350" y2="324" stroke="#9aa0a6" strokeWidth="1.5" />
        <line x1="390" y1="324" x2="404" y2="324" stroke="#9aa0a6" strokeWidth="1.5" />
        <line x1="332" y1="312" x2="332" y2="334" stroke="#9aa0a6" strokeWidth="1.5" />
        <line x1="342" y1="312" x2="342" y2="324" stroke="#9aa0a6" strokeWidth="1.5" />
        {ocupada && <circle cx="337" cy="302" r="16" fill="#ff3b30" opacity="0.55" filter="url(#brilho)" />}
        <path d="M328 312 L328 300 A9 9 0 0 1 346 300 L346 312 Z" fill={ocupada ? '#ff4d3d' : '#7c2c27'} stroke="#5a1d19" strokeWidth="0.8" />
        <rect x="326" y="310" width="22" height="3" rx="1" fill={ocupada ? '#ff6b5e' : '#6a2622'} />
        <text x="337" y="358" textAnchor="middle" className="fill-[#6d6a60] font-mono text-[9px]">
          D1 · vaga
        </text>
      </g>

      {/* ─── ESP32 DevKit ──────────────────────────────── */}
      <g>
        <rect x="44" y="246" width="206" height="88" rx="4" fill="#1b2130" stroke="#2e3648" />
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i}>
            <rect x={pinoEsp(i) - 3} y={Y_ESP - 3} width="6" height="6" fill="#111" />
            <rect x={pinoEsp(i) - 1.5} y={Y_ESP - 1.5} width="3" height="3" fill="#d4af37" />
            <rect x={pinoEsp(i) - 3} y="325" width="6" height="6" fill="#111" />
            <rect x={pinoEsp(i) - 1.5} y="326.5" width="3" height="3" fill="#d4af37" />
          </g>
        ))}
        {/* antena em serpentina */}
        <path d="M50 266 h14 v6 h-14 v6 h14 v6 h-14 v6 h14 v6 h-14 v6 h14" fill="none" stroke="#c9a24a" strokeWidth="1.4" />
        {/* módulo WROOM com blindagem metálica */}
        <rect x="70" y="262" width="84" height="58" rx="2" fill="url(#metal)" stroke="#7d848e" />
        <text x="112" y="286" textAnchor="middle" className="fill-[#3b4250] font-mono text-[7.5px] font-semibold">
          ESP32-WROOM-32
        </text>
        <text x="112" y="297" textAnchor="middle" className="fill-[#555c69] font-mono text-[6px]">
          Wi-Fi · BT · 240 MHz
        </text>
        <text x="112" y="310" textAnchor="middle" className="fill-[#555c69] font-mono text-[6px]">
          VMR-2026
        </text>
        {/* chip USB-serial e regulador */}
        <rect x="168" y="284" width="16" height="16" rx="1" fill="#0d0f14" />
        <rect x="198" y="286" width="10" height="12" rx="1" fill="#0d0f14" />
        {/* USB */}
        <rect x="238" y="278" width="18" height="24" rx="2" fill="url(#metal)" stroke="#7d848e" />
        {/* botões EN e BOOT */}
        <g onClick={aoReiniciar} className="cursor-pointer" role="button" aria-label="Reiniciar a placa (EN)">
          <rect x="214" y="262" width="16" height="12" rx="1.5" fill="#d9dbde" stroke="#9aa0a6" />
          <circle cx="222" cy="268" r="3.4" fill="#2a2f38" className="transition hover:fill-[#f5b83d]" />
          <text x="222" y="258" textAnchor="middle" className="fill-[#cfd5df] font-mono text-[6.5px]">
            EN
          </text>
        </g>
        <rect x="214" y="306" width="16" height="12" rx="1.5" fill="#d9dbde" stroke="#9aa0a6" />
        <circle cx="222" cy="312" r="3.4" fill="#2a2f38" />
        <text x="222" y="303" textAnchor="middle" className="fill-[#cfd5df] font-mono text-[6.5px]">
          BOOT
        </text>
        {/* LEDs da placa: vermelho = energia, azul = GPIO2 piscando a cada ciclo */}
        <circle cx="196" cy="268" r="2.4" fill={ligada ? '#ff3b30' : '#5b1e1b'} />
        {ledPlaca && ligada && <circle cx="196" cy="314" r="7" fill="#3a86ff" opacity="0.7" filter="url(#brilho)" />}
        <circle cx="196" cy="314" r="2.4" fill={ledPlaca && ligada ? '#8ec5ff' : '#1c3357'} />
      </g>

      {/* ─── Display OLED SSD1306 ─────────────────────── */}
      <g>
        <rect x="270" y="30" width="150" height="120" rx="6" fill="#10284d" stroke="#1d3b6b" />
        {[276, 414].map((x) => [36, 144].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="#0a1a33" stroke="#355b93" />))}
        <rect x="282" y="46" width="126" height="78" rx="2" fill="#03060b" />
        {ligada ? (
          <g className="font-mono">
            {oled.linhas.map((l, i) => (
              <text key={i} x="290" y={62 + i * 13} className="fill-[#9fe0ff] text-[9.5px]">
                {l}
              </text>
            ))}
            {oled.barras.map((b, i) => (
              <rect key={i} x={290 + i * 16} y={118 - Math.max(1.5, b * 16)} width="11" height={Math.max(1.5, b * 16)} fill="#9fe0ff" opacity={0.35 + b * 0.65} />
            ))}
          </g>
        ) : (
          <text x="345" y="90" textAnchor="middle" className="fill-[#1f3b55] font-mono text-[9px]">
            ...
          </text>
        )}
        {['GND', 'VCC', 'SCL', 'SDA'].map((n, i) => (
          <g key={n}>
            <text x={322 + i * 12} y="140" textAnchor="middle" className="fill-[#8fb3e6] font-mono text-[5px]">
              {n}
            </text>
            <rect x={320 + i * 12} y="143" width="4" height="5" fill="#d4af37" />
          </g>
        ))}
        <text x="345" y="-6" textAnchor="middle" className="fill-apagado font-mono text-[8px]">
          SSD1306 · I²C
        </text>
      </g>

      {/* ─── Sensor ultrassônico HC-SR04 ──────────────── */}
      <g ref={refSensor}>
        {/* ondas saindo do sensor; mais rápidas quando algo está perto */}
        <g className="so-com-movimento" style={{ ['--dur' as string]: `${Math.min(2.2, 0.6 + distancia / 120)}s` }}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d="M470 36 A 58 58 0 0 1 586 36"
              fill="none"
              stroke="var(--destaque)"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
              className="onda-sonar"
              style={{ animationDelay: `calc(var(--dur) * ${i / 3})` }}
            />
          ))}
        </g>
        <rect x="440" y="42" width="176" height="80" rx="4" fill="#1d5fb0" stroke="#174c8e" />
        {[482, 574].map((cx, i) => (
          <g key={cx}>
            <circle cx={cx} cy="82" r="30" fill="url(#metal)" stroke="#6f7680" />
            <circle cx={cx} cy="82" r="24" fill="#2b3038" />
            <circle cx={cx} cy="82" r="24" fill="url(#malha)" />
            <text x={cx} y="122" dy="-4" textAnchor="middle" className="fill-[#cfe0ff] font-mono text-[7px]">
              {i ? 'R' : 'T'}
            </text>
          </g>
        ))}
        <rect x="518" y="74" width="20" height="10" rx="5" fill="url(#metal)" />
        <text x="528" y="60" textAnchor="middle" className="fill-white font-mono text-[8px] font-semibold">
          HC-SR04
        </text>
        {['VCC', 'TRIG', 'ECHO', 'GND'].map((n, i) => (
          <g key={n}>
            <text x={510 + i * 12} y="112" textAnchor="middle" className="fill-[#cfe0ff] font-mono text-[4.5px]">
              {n}
            </text>
            <rect x={508 + i * 12} y="122" width="4" height="7" fill="#d4af37" />
          </g>
        ))}
        {/* leitura atual ao lado do sensor */}
        <text x="626" y="138" textAnchor="end" className="fill-apagado font-mono text-[8px]">
          distância medida
        </text>
        <text x="626" y="154" textAnchor="end" className="fill-destaque font-mono text-[15px] font-semibold tabular-nums">
          {ligada ? `${distancia.toFixed(1)} cm` : '-- cm'}
        </text>
      </g>

      {/* ─── Servo SG90 como cancela ──────────────────── */}
      <g>
        <rect x="470" y="160" width="88" height="34" rx="3" fill="#2a64c8" stroke="#1f4d9c" />
        <rect x="462" y="168" width="104" height="8" rx="2" fill="#2a64c8" stroke="#1f4d9c" />
        <text x="530" y="187" textAnchor="middle" className="fill-[#d7e5ff] font-mono text-[7px]">
          SG90
        </text>
        <circle cx="488" cy="170" r="9" fill="#e9ecef" stroke="#adb5bd" />
        <g style={{ transform: `rotate(${anguloServo}deg)`, transformOrigin: '488px 170px', transition: 'transform 0.6s cubic-bezier(.3,1.4,.5,1)' }}>
          <rect x="368" y="165" width="124" height="10" rx="5" fill="#ffffff" stroke="#9aa0a6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={378 + i * 22} y="165" width="10" height="10" fill="#e5383b" />
          ))}
        </g>
        <circle cx="488" cy="170" r="3" fill="#6c757d" />
        <text x="600" y="176" className="fill-apagado font-mono text-[8px]" textAnchor="end">
          {anguloServo > 0 ? 'cancela aberta' : 'cancela fechada'}
        </text>
      </g>

      {/* ─── Jumpers ──────────────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        {FIOS.map(([x1, y1, x2, y2, cor, dados], i) => {
          const d = curva(x1, y1, x2, y2)
          return (
            <g key={i}>
              <path d={d} stroke="rgba(0,0,0,.35)" strokeWidth="4.5" transform="translate(1.5 2)" />
              <path d={d} stroke={cor} strokeWidth="3.2" />
              {dados && ligada && <path d={d} stroke="#ffffff" strokeWidth="1.6" className="fio-dados so-com-movimento" style={{ animationDelay: `${-i * 0.23}s` }} />}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
