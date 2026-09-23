import { perfil } from '../data/perfil'

export function Rodape() {
  return (
    <footer className="border-t border-linha py-8 font-mono text-[11px] text-apagado">
      <p>
        © {new Date().getFullYear()} {perfil.nome}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
