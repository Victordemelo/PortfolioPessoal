import type { ReactNode } from 'react'
import { motion } from 'motion/react'

type Props = {
  id: string
  rotulo: string
  titulo: string
  descricao?: string
  children: ReactNode
}

export function Secao({ id, rotulo, titulo, descricao, children }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-12 max-w-2xl"
      >
        <p className="font-mono text-sm text-destaque">{rotulo}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{titulo}</h2>
        {descricao && <p className="mt-4 text-lg text-suave">{descricao}</p>}
      </motion.header>
      {children}
    </section>
  )
}

export function Aparecer({ children, atraso = 0, className }: { children: ReactNode; atraso?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: atraso }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
