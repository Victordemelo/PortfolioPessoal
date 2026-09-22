import { useEffect, useState } from 'react'
import { ArrowUp, Contrast } from 'lucide-react'
import { perfil } from './data/perfil'
import { projetos } from './data/projetos'
import { useRota } from './lib/rota'
import { Home } from './components/Home'
import { GithubIcon } from './components/Icones'
import { Logo } from './components/Logo'
import { PaginaProjeto } from './components/PaginaProjeto'
import { Rodape } from './components/Rodape'

const NAV = [
  { href: '#/projetos', rotulo: 'Projetos' },
  { href: '#/stack', rotulo: 'Stack' },
  { href: '#/trajetoria', rotulo: 'Trajetória' },
  { href: '#/contato', rotulo: 'Contato' },
]

function alternarTema() {
  const claro = document.documentElement.classList.toggle('claro')
  try {
    localStorage.setItem('tema', claro ? 'claro' : 'escuro')
  } catch {
    // modo privado: só não lembra a escolha
  }
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
  // Rotas: #/ (início), #/projetos, #/stack... (início rolado até a seção)
  // e #/projetos/<id> (página do projeto)
  const rota = useRota()
  const projeto = rota.painel === 'projetos' && rota.item ? projetos.find((p) => p.id === rota.item) : undefined
  const mostrarTopo = useRolou(600)

  useEffect(() => {
    document.title = projeto ? `${projeto.nome} · ${perfil.nome}` : `${perfil.nome} · ${perfil.titulo}`
    if (projeto) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (rota.painel) {
      requestAnimationFrame(() => document.getElementById(rota.painel!)?.scrollIntoView())
    }
  }, [projeto, rota.painel])

  return (
    <>
      <header className="sticky top-0 z-30 bg-fundo/85 backdrop-blur-md">
        <div className="linha-baixo mx-auto flex h-14 max-w-3xl items-center justify-between border-linha px-4 md:border-x">
          <a href="#/" aria-label="Início" className="text-texto" onClick={() => window.scrollTo({ top: 0 })}>
            <Logo className="h-5" />
          </a>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                // mesmo hash não dispara hashchange: rola na mão
                onClick={() => window.location.hash === n.href && document.getElementById(n.href.slice(2))?.scrollIntoView()}
                className="hidden rounded-md px-2 py-1 text-suave transition hover:text-texto sm:block">
                {n.rotulo}
              </a>
            ))}
            <span className="mx-2 hidden h-4 w-px bg-linha sm:block" />
            <a href={perfil.contato.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-md p-1.5 text-suave transition hover:text-texto">
              <GithubIcon size={17} />
            </a>
            <span className="mx-1 h-4 w-px bg-linha" />
            <button onClick={alternarTema} aria-label="Alternar tema claro/escuro" className="rounded-md p-1.5 text-suave transition hover:text-texto">
              <Contrast size={17} />
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto min-h-screen max-w-3xl border-linha md:border-x">
        <main>{projeto ? <PaginaProjeto p={projeto} /> : <Home />}</main>
        <Rodape />
        <div className="h-16" />
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Voltar ao topo"
        className={`fixed right-5 bottom-5 z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-linha bg-superficie text-suave transition hover:text-texto ${
          mostrarTopo ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </>
  )
}
