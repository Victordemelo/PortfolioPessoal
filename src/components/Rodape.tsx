import { perfil } from '../data/perfil'

export function Rodape() {
  return (
    <footer className="border-t border-borda">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-suave sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {perfil.nome}
        </p>
        <p className="font-mono">React · TypeScript · Tailwind · Caddy</p>
      </div>
    </footer>
  )
}
