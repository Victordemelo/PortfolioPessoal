import type { ReactNode } from 'react'

/** Faixa hachurada de ponta a ponta, separando blocos */
export function Listra() {
  return <div className="listra" aria-hidden="true" />
}

/** Título de seção: "Projetos ⁽⁶⁾", numa faixa com linha em cima e embaixo */
export function TituloSecao({ id, children, contagem, extra }: { id?: string; children: ReactNode; contagem?: number; extra?: ReactNode }) {
  return (
    <div id={id} className="linha-baixo flex items-end justify-between gap-4 px-4 pt-6 pb-2">
      <h2 className="text-3xl font-semibold tracking-tight">
        {children}
        {contagem !== undefined && <sup className="ml-1 align-super font-mono text-sm font-normal text-apagado">({contagem})</sup>}
      </h2>
      {extra}
    </div>
  )
}

/** Subtítulo dentro de uma seção (Pessoal, Acadêmico...) */
export function Subtitulo({ children, contagem, descricao }: { children: ReactNode; contagem?: number; descricao?: string }) {
  return (
    <div className="linha-baixo flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-2.5">
      <h3 className="font-mono text-sm text-suave">
        <span className="text-apagado">//</span> {children}
        {contagem !== undefined && <span className="text-apagado"> ({contagem})</span>}
      </h3>
      {descricao && <p className="text-xs text-apagado">{descricao}</p>}
    </div>
  )
}

/** Anotação manuscrita com seta, pendurada na margem esquerda (só em tela larga) */
export function Anotacao({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pointer-events-none absolute top-3 -left-32 hidden w-28 text-right text-suave lg:block ${className}`} aria-hidden="true">
      <span className="-rotate-6 inline-block font-mao text-xl">{children}</span>
      <svg viewBox="0 0 40 30" className="ml-auto h-7 w-9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M6 2 C 4 14, 14 24, 34 24" />
        <path d="M28 19 L 35 24 L 28 28" />
      </svg>
    </div>
  )
}

/** Caixinha de ícone com borda, usada nas listas */
export function CaixaIcone({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-linha bg-superficie text-suave">{children}</span>
  )
}
