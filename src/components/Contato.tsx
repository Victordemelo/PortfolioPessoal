import { useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { perfil } from '../data/perfil'
import { GithubIcon, LinkedinIcon } from './Icones'
import { Aparecer, Secao } from './Secao'

export function Contato() {
  const [copiado, setCopiado] = useState(false)

  const copiarEmail = async () => {
    try {
      await navigator.clipboard.writeText(perfil.contato.email)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      window.location.href = `mailto:${perfil.contato.email}`
    }
  }

  return (
    <Secao
      id="contato"
      rotulo="05. contato"
      titulo="Vamos conversar?"
      descricao="Tem um sistema para tirar do papel, uma automação ou uma integração para fazer? Me manda uma mensagem."
    >
      <Aparecer>
        <div className="relative overflow-hidden rounded-3xl border border-borda bg-superficie p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-destaque-2/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-suave">E-mail</p>
              <p className="mt-1 break-all text-xl font-semibold sm:text-2xl">{perfil.contato.email}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${perfil.contato.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-destaque px-5 py-3 font-semibold text-fundo transition hover:brightness-110"
              >
                <Mail size={18} /> Enviar e-mail
              </a>
              <button
                onClick={copiarEmail}
                className="inline-flex items-center gap-2 rounded-xl border border-borda px-4 py-3 transition hover:border-destaque/60"
              >
                {copiado ? <Check size={18} className="text-destaque" /> : <Copy size={18} />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
          <div className="relative mt-8 flex gap-6 border-t border-borda pt-6 text-suave">
            <a href={perfil.contato.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-destaque">
              <LinkedinIcon /> LinkedIn
            </a>
            <a href={perfil.contato.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-destaque">
              <GithubIcon /> GitHub
            </a>
          </div>
        </div>
      </Aparecer>
    </Secao>
  )
}
