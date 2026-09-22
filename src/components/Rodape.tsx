import { perfil } from '../data/perfil'
import { Logo } from './Logo'

export function Rodape() {
  return (
    <footer className="linha-baixo px-4 py-8">
      <Logo className="mx-auto h-4 text-apagado" />
      <p className="mt-4 text-center text-sm text-apagado">
        Feito à mão em Florianópolis por {perfil.nomeCurto}. O{' '}
        <a
          href={`${perfil.contato.github}/PortfolioPessoal`}
          target="_blank"
          rel="noreferrer"
          className="text-suave underline decoration-linha underline-offset-4 hover:decoration-suave"
        >
          código-fonte
        </a>{' '}
        está no GitHub.
      </p>
    </footer>
  )
}
