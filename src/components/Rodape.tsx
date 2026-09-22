import { perfil } from '../data/perfil'

export function Rodape() {
  return (
    <footer className="flex flex-col gap-1 py-8 font-mono text-[11px] text-suave sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {perfil.nome} · feito à mão em Florianópolis
      </p>
      <a href={`${perfil.contato.github}/PortfolioPessoal`} target="_blank" rel="noreferrer" className="hover:text-cobre">
        código-fonte deste site →
      </a>
    </footer>
  )
}
