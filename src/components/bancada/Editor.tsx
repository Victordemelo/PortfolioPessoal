import { useEffect, useRef, useState } from 'react'
import { arquivos, tokenizar } from './codigo'

const reduzido = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Editor que "digita" o firmware sozinho. Quando termina, a linha em execução
 * (vinda da bancada) fica destacada, como um depurador passo a passo.
 */
export function Editor({ linhaExec, aoTerminar }: { linhaExec: number | null; aoTerminar?: () => void }) {
  const [aba, setAba] = useState(0)
  const firmware = arquivos[0].codigo
  const [digitados, setDigitados] = useState(reduzido ? firmware.length : 0)
  const rolagem = useRef<HTMLDivElement>(null)
  const terminou = digitados >= firmware.length

  useEffect(() => {
    if (terminou) {
      aoTerminar?.()
      return
    }
    const t = setTimeout(() => setDigitados((n) => Math.min(firmware.length, n + (firmware[n] === ' ' ? 4 : 2))), 22)
    return () => clearTimeout(t)
  }, [digitados, terminou, firmware, aoTerminar])

  // Enquanto digita, acompanha o cursor; depois, acompanha a linha em execução
  useEffect(() => {
    const el = rolagem.current
    if (!el || aba !== 0) return
    if (!terminou) el.scrollTop = el.scrollHeight
    else if (linhaExec !== null) {
      const linha = el.querySelector<HTMLElement>(`[data-linha="${linhaExec}"]`)
      if (linha && (linha.offsetTop < el.scrollTop || linha.offsetTop > el.scrollTop + el.clientHeight - 40)) {
        el.scrollTo({ top: linha.offsetTop - 60, behavior: 'smooth' })
      }
    }
  }, [digitados, terminou, linhaExec, aba])

  const arquivo = arquivos[aba]
  const texto = aba === 0 ? firmware.slice(0, digitados) : arquivo.codigo
  const linhas = texto.split('\n')

  return (
    <div className="flex h-[320px] flex-col overflow-hidden rounded-lg border border-linha bg-superficie shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)]">
      <div className="flex shrink-0 items-center border-b border-linha">
        <div className="flex gap-1.5 px-3">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div role="tablist" className="sem-barra flex overflow-x-auto">
          {arquivos.map((a, i) => (
            <button
              key={a.nome}
              role="tab"
              aria-selected={aba === i}
              onClick={() => setAba(i)}
              className={`border-r border-linha px-3 py-2 font-mono text-xs whitespace-nowrap transition ${
                aba === i ? 'bg-fundo text-texto' : 'text-apagado hover:text-suave'
              }`}
            >
              {a.nome}
            </button>
          ))}
        </div>
      </div>

      <div ref={rolagem} className="relative flex-1 overflow-auto py-2 font-mono text-[12.5px] leading-[1.6]">
        {linhas.map((l, i) => {
          const exec = aba === 0 && terminou && linhaExec === i
          return (
            <div
              key={i}
              data-linha={i}
              className={`grid grid-cols-[2.75rem_1fr] pr-4 transition-colors duration-150 ${exec ? 'bg-destaque/12' : ''}`}
            >
              <span className={`pr-3 text-right select-none ${exec ? 'text-destaque' : 'text-apagado/60'}`}>{exec ? '▶' : i + 1}</span>
              <span className="whitespace-pre">
                {tokenizar(l).map((tk, j) => (
                  <span key={j} className={tk.c ? `sx-${tk.c}` : undefined}>
                    {tk.t}
                  </span>
                ))}
                {aba === 0 && !terminou && i === linhas.length - 1 && <span className="cursor-editor ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-destaque" />}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex shrink-0 justify-between border-t border-linha px-3 py-1.5 font-mono text-[11px] text-apagado">
        <span>{arquivo.linguagem === 'cpp' ? 'C++ · Arduino' : arquivo.linguagem === 'ts' ? 'TypeScript' : 'PHP · Laravel'}</span>
        <span>{aba === 0 ? (terminou ? (linhaExec !== null ? `executando · linha ${linhaExec + 1}` : 'compilado') : 'escrevendo…') : 'somente leitura'}</span>
      </div>
    </div>
  )
}
