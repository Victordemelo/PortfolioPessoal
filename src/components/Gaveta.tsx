import { useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { ir } from '../lib/rota'

// Painel que "sai" do cartão clicado: nasce no retângulo do cartão e cresce
// até ocupar o centro da tela; ao fechar, volta para o mesmo lugar.
// Anima top/left/width/height (e não scale) para o conteúdo não deformar;
// o conteúdo interno já tem o tamanho final e só aparece no fim.

let origem: string | null = null
export function marcarOrigem(id: string) {
  origem = id
}

type Retangulo = { top: number; left: number; width: number; height: number }

function retanguloFinal(): Retangulo {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margem = vw < 640 ? 8 : 24
  const width = Math.min(1080, vw - margem * 2)
  const height = vw < 640 ? vh - margem * 2 : Math.min(vh - margem * 2, 860)
  return { top: (vh - height) / 2, left: (vw - width) / 2, width, height }
}

type Props = {
  cartao: string
  designador: string
  titulo: string
  children: ReactNode
  /** Muda quando o conteúdo interno troca (ex.: lista → detalhe) para voltar ao topo */
  chaveConteudo?: string
}

export function Gaveta({ cartao, designador, titulo, children, chaveConteudo }: Props) {
  const fim = useMemo(retanguloFinal, [])
  const inicio = useMemo<Retangulo>(() => {
    const el = document.getElementById(`cartao-${origem ?? cartao}`)
    const r = el?.getBoundingClientRect()
    return r
      ? { top: r.top, left: r.left, width: r.width, height: r.height }
      : { ...fim, top: fim.top + 40 }
  }, [cartao, fim])
  const fechar = useRef<HTMLButtonElement>(null)
  const rolagem = useRef<HTMLDivElement>(null)

  // Trava a rolagem da página por baixo e devolve o foco ao sair
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    const barra = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${barra}px`
    fechar.current?.focus({ preventScroll: true })
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && ir('')
    window.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      window.removeEventListener('keydown', aoTeclar)
      anterior?.focus({ preventScroll: true })
      origem = null
    }
  }, [])

  useLayoutEffect(() => {
    rolagem.current?.scrollTo({ top: 0 })
  }, [chaveConteudo])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-fundo/75 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => ir('')}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="fixed z-50 overflow-hidden rounded-[18px] border border-cobre/40 bg-placa shadow-[0_40px_120px_-20px_rgba(0,0,0,.6)]"
        initial={{ ...inicio }}
        animate={{ ...fim }}
        exit={{ ...inicio, opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1], opacity: { delay: 0.25, duration: 0.1 } } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute top-0 left-0 flex flex-col"
          style={{ width: fim.width, height: fim.height }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-linha px-5 py-3 font-mono text-xs tracking-wider text-suave uppercase sm:px-7">
            <span>
              <span className="text-cobre">{designador}</span>
              <span className="mx-1.5 opacity-40">/</span>
              {titulo}
            </span>
            <button
              ref={fechar}
              onClick={() => ir('')}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-placa-2 hover:text-texto"
            >
              <span className="hidden sm:inline">esc</span>
              <X size={18} />
              <span className="sr-only">Fechar</span>
            </button>
          </header>
          <div ref={rolagem} className="rolagem-fina flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
