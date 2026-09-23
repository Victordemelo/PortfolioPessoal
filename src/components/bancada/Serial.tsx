import { useEffect, useRef } from 'react'
import { RotateCcw } from 'lucide-react'

export type LinhaSerial = { id: number; hora: string; texto: string }

// Cor da etiqueta no começo da linha: [boot], [wifi], [github]...
const ETIQUETAS: Record<string, string> = {
  boot: 'sx-kw',
  wifi: 'sx-fn',
  github: 'sx-str',
  sensor: 'sx-tipo',
  loop: 'sx-pre',
  evento: 'sx-num',
}

function Linha({ l }: { l: LinhaSerial }) {
  const m = l.texto.match(/^\[(\w+)\](.*)$/)
  return (
    <div className="flex gap-3 whitespace-pre">
      <span className="text-apagado/60 select-none">{l.hora} →</span>
      {m ? (
        <span>
          <span className={ETIQUETAS[m[1]] ?? ''}>[{m[1]}]</span>
          {m[2]}
        </span>
      ) : (
        <span className={/^(ets|rst|load|entry|config)/.test(l.texto) ? 'text-apagado' : ''}>{l.texto}</span>
      )}
    </div>
  )
}

export function Serial({ linhas, aoReiniciar, ligada }: { linhas: LinhaSerial[]; aoReiniciar: () => void; ligada: boolean }) {
  const rolagem = useRef<HTMLDivElement>(null)
  const colado = useRef(true)

  // Só desce sozinho se a pessoa não rolou para cima para ler
  useEffect(() => {
    const el = rolagem.current
    if (el && colado.current) el.scrollTop = el.scrollHeight
  }, [linhas])

  return (
    <div className="flex h-[320px] flex-col overflow-hidden rounded-lg border border-linha bg-[#07080a] text-[#d6dae1] shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-xs">
        <span className="flex items-center gap-2 text-[#9aa1ac]">
          <span className={`h-1.5 w-1.5 rounded-full ${ligada ? 'pisca bg-[#4ade80]' : 'bg-[#5b6270]'}`} />
          Monitor serial · /dev/ttyUSB0 · 115200 baud
        </span>
        <button
          onClick={aoReiniciar}
          className="flex items-center gap-1.5 rounded px-2 py-0.5 text-[#9aa1ac] transition hover:bg-white/10 hover:text-white"
          title="Reiniciar o ESP32"
        >
          <RotateCcw size={12} /> reset
        </button>
      </div>
      <div
        ref={rolagem}
        onScroll={(e) => {
          const el = e.currentTarget
          colado.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24
        }}
        className="sem-barra flex-1 overflow-auto px-3 py-2 font-mono text-[12px] leading-[1.65]"
        role="log"
        aria-live="off"
      >
        {linhas.map((l) => (
          <Linha key={l.id} l={l} />
        ))}
        {!ligada && <div className="text-[#5b6270]">-- reiniciando --</div>}
      </div>
    </div>
  )
}
