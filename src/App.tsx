import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { perfil } from './data/perfil'
import { projetos } from './data/projetos'
import { useRota } from './lib/rota'
import { Inicio } from './components/Inicio'
import { Lateral, SECOES } from './components/Lateral'
import { PaginaProjeto } from './components/PaginaProjeto'
import { Rodape } from './components/Rodape'

/** Seção visível no momento, para acender o item certo do índice */
function useSecaoAtiva(ligado: boolean) {
  const [ativa, setAtiva] = useState<string | null>(null)
  useEffect(() => {
    if (!ligado) return
    const visiveis = new Map<string, number>()
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) visiveis.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        const melhor = SECOES.map((s) => s.id).find((id) => (visiveis.get(id) ?? 0) > 0)
        if (melhor) setAtiva(melhor)
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.01] },
    )
    for (const s of SECOES) {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    }
    return () => obs.disconnect()
  }, [ligado])
  return ativa
}

function useRolou(limite: number) {
  const [rolou, setRolou] = useState(false)
  useEffect(() => {
    const f = () => setRolou(window.scrollY > limite)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [limite])
  return rolou
}

export default function App() {
  // Rotas: #/ (início), #/<seção> (início rolado até ela) e #/projetos/<id>
  const rota = useRota()
  const projeto = rota.painel === 'projetos' && rota.item ? projetos.find((p) => p.id === rota.item) : undefined
  const ativa = useSecaoAtiva(!projeto)
  const mostrarTopo = useRolou(700)

  useEffect(() => {
    document.title = projeto ? `${projeto.nome} · ${perfil.nome}` : `${perfil.nome} · ${perfil.titulo}`
    if (projeto) window.scrollTo({ top: 0, behavior: 'instant' })
    else if (rota.painel) requestAnimationFrame(() => document.getElementById(rota.painel!)?.scrollIntoView())
  }, [projeto, rota.painel])

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 lg:px-10">
        <Lateral ativo={projeto ? 'projetos' : ativa} />
        <div className="min-w-0 border-t border-linha lg:border-t-0 lg:border-l lg:pl-14">
          <main>{projeto ? <PaginaProjeto p={projeto} /> : <Inicio />}</main>
          <Rodape />
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Voltar ao topo"
        className={`fixed right-5 bottom-5 z-30 flex h-9 w-9 items-center justify-center rounded-md border border-linha bg-superficie text-suave transition hover:border-destaque hover:text-destaque ${
          mostrarTopo ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </>
  )
}
