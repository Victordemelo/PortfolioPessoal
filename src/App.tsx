import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { perfil } from './data/perfil'
import { projetos } from './data/projetos'
import { useRota } from './lib/rota'
import { Bento } from './components/Bento'
import { FundoCircuito } from './components/FundoCircuito'
import { Gaveta } from './components/Gaveta'
import { PainelAtividade, PainelEu, PainelProjetos, PainelStack, PainelTrajetoria } from './components/Paineis'
import { Rodape } from './components/Rodape'

// Cada painel: de qual cartão ele "sai", o designador e o título
const PAINEIS: Record<string, { cartao: string; designador: string; titulo: string }> = {
  eu: { cartao: 'eu', designador: 'U1', titulo: 'identificação' },
  projetos: { cartao: 'projetos', designador: 'J1', titulo: 'projetos' },
  atividade: { cartao: 'atividade', designador: 'D1', titulo: 'atividade' },
  stack: { cartao: 'stack', designador: 'U2', titulo: 'stack' },
  trajetoria: { cartao: 'trajetoria', designador: 'U3', titulo: 'trajetória' },
}

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

export default function App() {
  const rota = useRota()
  const [claro, alternarTema] = useTema()
  const painel = rota.painel ? PAINEIS[rota.painel] : undefined

  useEffect(() => {
    const p = rota.item && projetos.find((x) => x.id === rota.item)
    document.title = p ? `${p.nome} · ${perfil.nome}` : painel ? `${painel.titulo} · ${perfil.nome}` : `${perfil.nome} · ${perfil.titulo}`
  }, [rota, painel])

  return (
    <>
      <FundoCircuito />
      <div className="granulado" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-3 sm:px-5">
        <header className="flex items-center justify-between py-4 font-mono text-xs text-suave">
          <a href="#/" className="flex items-center gap-2 text-texto">
            <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
              <path d="M14 16 L32 48 L50 16" fill="none" stroke="var(--cobre)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="32" cy="48" r="5" fill="var(--cobre)" />
            </svg>
            victordemelo
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">rev. {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}</span>
            <button
              onClick={alternarTema}
              aria-label={claro ? 'Usar tema escuro' : 'Usar tema claro'}
              className="flex items-center gap-1.5 rounded-full border border-linha bg-placa/80 px-3 py-1.5 transition hover:border-cobre hover:text-texto"
            >
              {claro ? <Moon size={14} /> : <Sun size={14} />}
              {claro ? 'escuro' : 'claro'}
            </button>
          </div>
        </header>

        <main>
          <Bento />
        </main>
        <Rodape />
      </div>

      <AnimatePresence>
        {painel && (
          <Gaveta key={rota.painel} cartao={painel.cartao} designador={painel.designador} titulo={painel.titulo} chaveConteudo={rota.item ?? ''}>
            {rota.painel === 'eu' && <PainelEu />}
            {rota.painel === 'projetos' && <PainelProjetos item={rota.item} />}
            {rota.painel === 'atividade' && <PainelAtividade />}
            {rota.painel === 'stack' && <PainelStack />}
            {rota.painel === 'trajetoria' && <PainelTrajetoria />}
          </Gaveta>
        )}
      </AnimatePresence>
    </>
  )
}
