import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { perfil } from '../data/perfil'

const links = [
  { href: '#sobre', rotulo: 'Sobre' },
  { href: '#projetos', rotulo: 'Projetos' },
  { href: '#trajetoria', rotulo: 'Trajetória' },
  { href: '#stack', rotulo: 'Stack' },
  { href: '#contato', rotulo: 'Contato' },
]

function useTema() {
  const [claro, setClaro] = useState(() => document.documentElement.classList.contains('claro'))
  useEffect(() => {
    document.documentElement.classList.toggle('claro', claro)
    try {
      localStorage.setItem('tema', claro ? 'claro' : 'escuro')
    } catch {
      // modo privado: só não lembra a escolha
    }
  }, [claro])
  return [claro, () => setClaro((c) => !c)] as const
}

export function Navegacao() {
  const [claro, alternarTema] = useTema()
  const [aberto, setAberto] = useState(false)
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        rolou || aberto ? 'border-b border-borda bg-fundo/80 backdrop-blur-lg' : ''
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#inicio" className="font-mono text-sm font-medium">
          <span className="text-destaque">~/</span>
          {perfil.nomeCurto.toLowerCase()}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-suave transition hover:bg-superficie-2 hover:text-texto"
            >
              {l.rotulo}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={alternarTema}
            aria-label={claro ? 'Usar tema escuro' : 'Usar tema claro'}
            className="rounded-lg p-2 text-suave transition hover:bg-superficie-2 hover:text-texto"
          >
            {claro ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setAberto((a) => !a)}
            aria-label="Menu"
            aria-expanded={aberto}
            className="rounded-lg p-2 text-suave transition hover:bg-superficie-2 hover:text-texto md:hidden"
          >
            {aberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {aberto && (
        <div className="border-t border-borda px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="block rounded-lg px-3 py-3 text-suave hover:bg-superficie-2 hover:text-texto"
            >
              {l.rotulo}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
