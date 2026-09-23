import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { perfil } from './data/perfil'
import { projetos } from './data/projetos'
import { useRota } from './lib/rota'
import { Abertura } from './components/bancada/Bancada'
import { Inicio } from './components/Inicio'
import { BotaoTema, Lateral, SECOES } from './components/Lateral'
import { Logo } from './components/Logo'
import { PaginaProjeto } from './components/PaginaProjeto'
import { Rodape } from './components/Rodape'

/** Seção visível no momento, para acender o item certo do índice */
function useSecaoAtiva(ligado: boolean) {
  const [ativa, setAtiva] = useState<string | null>(null)
  useEffect(() => {
    if (!ligado) return
    // Ativa = a última seção cujo topo já passou de 35% da altura da tela.
    // No fim da página a última seção (Contato) é curta e nunca chega lá;
    // então, encostou no fim, acende a última.
    const atualizar = () => {
      const fim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
      if (fim) return setAtiva(SECOES[SECOES.length - 1].id)
      const linha = window.innerHeight * 0.35
      let atual: string | null = null
      for (const s of SECOES) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= linha) atual = s.id
      }
      setAtiva(atual)
    }
    atualizar()
    window.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      window.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)
    }
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
      {!projeto && (
        <header className="tapete overflow-hidden border-b border-linha">
          <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
            <nav className="flex h-14 items-center justify-between border-b border-linha/70">
              <a href="#/" aria-label="Início" className="text-texto transition hover:text-destaque">
                <Logo className="h-5" />
              </a>
              <div className="flex items-center gap-1 text-sm">
                {SECOES.filter((s) => s.id !== 'sobre').map((s) => (
                  <a key={s.id} href={`#/${s.id}`} className="hidden rounded-md px-2.5 py-1 text-suave transition hover:text-destaque md:block">
                    {s.rotulo}
                  </a>
                ))}
                <span className="mx-2 hidden h-4 w-px bg-linha md:block" />
                <BotaoTema />
              </div>
            </nav>
            <Abertura />
          </div>
        </header>
      )}

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12 lg:px-10">
        <Lateral ativo={projeto ? 'projetos' : ativa} />
        <div className="min-w-0 border-t border-linha lg:border-t-0 lg:border-l lg:pl-12">
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
