import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ir } from '../lib/rota'
import { marcarOrigem } from './Gaveta'

type Props = {
  id: string
  /** Designador de componente, como numa placa: U1, J2, D1... */
  designador: string
  rotulo: string
  /** Caminho aberto ao clicar (ex.: "projetos"). Sem ele, o cartão não abre */
  abre?: string
  className?: string
  style?: CSSProperties
  semCabecalho?: boolean
  children: ReactNode
}

function seguirCursor(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Cartao({ id, designador, rotulo, abre, className = '', style, semCabecalho, children }: Props) {
  return (
    <article
      id={`cartao-${id}`}
      onPointerMove={seguirCursor}
      style={{ gridArea: id, ...style }}
      className={`cartao group relative flex flex-col overflow-hidden rounded-[18px] border border-linha bg-placa/92 transition-colors duration-300 hover:border-cobre/50 ${className}`}
    >
      <div className="cantos pointer-events-none absolute inset-0" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      {!semCabecalho && (
        <header className="relative z-[2] flex items-center justify-between px-5 pt-4 font-mono text-[11px] tracking-wider text-suave uppercase">
          <span>
            <span className="text-cobre">{designador}</span>
            <span className="mx-1.5 opacity-40">/</span>
            {rotulo}
          </span>
          {abre && (
            <ArrowUpRight
              size={16}
              className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobre"
            />
          )}
        </header>
      )}

      {children}

      {abre && (
        <button
          onClick={() => {
            marcarOrigem(id)
            ir(abre)
          }}
          aria-label={`Abrir ${rotulo}`}
          className="absolute inset-0 z-[1] cursor-pointer rounded-[18px]"
        />
      )}
    </article>
  )
}
