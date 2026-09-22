import { perfil } from '../data/perfil'

export function Rodape() {
  return (
    <footer className="flex flex-col gap-1 border-t border-linha py-8 font-mono text-[11px] text-apagado sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {perfil.nome} · VMR-2026 rev. {String(new Date().getMonth() + 1).padStart(2, '0')}
      </p>
      <a href={`${perfil.contato.github}/PortfolioPessoal`} target="_blank" rel="noreferrer" className="transition hover:text-destaque">
        código-fonte deste site ↗
      </a>
    </footer>
  )
}
