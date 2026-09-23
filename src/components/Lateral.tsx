import { useEffect, useState, type ReactNode } from 'react'
import { Mail, Moon, Sun } from 'lucide-react'
import { linkWhatsapp, perfil } from '../data/perfil'
import { GithubIcon, LinkedinIcon, WhatsappIcon } from './Icones'
import { Logo } from './Logo'

export const SECOES = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'atividade', rotulo: 'Atividade' },
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'stack', rotulo: 'Pinagem' },
  { id: 'trajetoria', rotulo: 'Trajetória' },
  { id: 'contato', rotulo: 'Contato' },
]

// Há mais de um botão de tema na página; todos observam a classe do <html>
function useTema() {
  const raiz = document.documentElement
  const [claro, setClaro] = useState(() => raiz.classList.contains('claro'))
  useEffect(() => {
    const obs = new MutationObserver(() => setClaro(raiz.classList.contains('claro')))
    obs.observe(raiz, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [raiz])
  const alternar = () => {
    const novo = !raiz.classList.contains('claro')
    raiz.classList.toggle('claro', novo)
    try {
      localStorage.setItem('tema', novo ? 'claro' : 'escuro')
    } catch {
      // modo privado: só não lembra a escolha
    }
  }
  return [claro, alternar] as const
}

export function BotaoTema() {
  const [claro, alternar] = useTema()
  return (
    <button
      onClick={alternar}
      aria-label={claro ? 'Usar tema escuro' : 'Usar tema claro'}
      title={claro ? 'Tema escuro' : 'Tema claro'}
      className="flex h-8 items-center gap-1.5 rounded-md border border-linha px-2.5 font-mono text-[11px] text-suave transition hover:border-destaque hover:text-destaque"
    >
      {claro ? <Moon size={14} /> : <Sun size={14} />}
      {claro ? 'escuro' : 'claro'}
    </button>
  )
}

function useHora() {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: perfil.fuso }).format(agora)
  // Brasília é UTC−3 o ano todo; compara com o fuso de quem está vendo
  const dif = (-180 + agora.getTimezoneOffset()) / 60
  return { hora, relativo: dif === 0 ? 'mesmo fuso que você' : `${Math.abs(dif)}h ${dif > 0 ? 'à frente' : 'atrás'} de você` }
}

function Linha({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-linha py-2 last:border-0">
      <dt className="font-mono text-[11px] tracking-wider text-apagado uppercase">{k}</dt>
      <dd className="min-w-0 truncate text-sm">{children}</dd>
    </div>
  )
}

function Social({ href, rotulo, children }: { href: string; rotulo: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={rotulo}
      title={rotulo}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-linha text-suave transition hover:border-destaque hover:text-destaque"
    >
      {children}
    </a>
  )
}

export function Lateral({ ativo }: { ativo: string | null }) {
  const { hora, relativo } = useHora()

  return (
    <aside className="flex flex-col gap-7 pt-6 pb-4 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:py-10">
      <div className="flex items-center justify-between">
        <a href="#/" aria-label="Início" onClick={() => window.scrollTo({ top: 0 })} className="text-texto transition hover:text-destaque">
          <Logo className="h-5" />
        </a>
        <BotaoTema />
      </div>

      <div className="flex items-center gap-4">
        <img src={perfil.avatar} alt={perfil.nome} width={72} height={72} className="h-18 w-18 shrink-0 rounded-lg border border-linha object-cover" />
        <div className="min-w-0">
          <p className="text-xl leading-tight font-semibold tracking-tight">{perfil.nome}</p>
          <p className="mt-1 text-sm text-suave">{perfil.titulo}</p>
        </div>
      </div>

      <dl className="rounded-lg border border-linha bg-superficie px-3">
        <p className="-mx-3 border-b border-linha px-3 py-1.5 font-mono text-[10px] tracking-widest text-apagado uppercase">Características</p>
        <Linha k="status">
          <span className="inline-flex items-center gap-2">
            <span className="pisca h-1.5 w-1.5 rounded-full bg-vivo" /> disponível para projetos
          </span>
        </Linha>
        <Linha k="local">{perfil.local}</Linha>
        <Linha k="hora">
          {hora} <span className="text-apagado">· {relativo}</span>
        </Linha>
        <Linha k="formação">Eng. da Computação · Unisul</Linha>
        <Linha k="e-mail">
          <a href={`mailto:${perfil.contato.email}`} className="hover:text-destaque">
            {perfil.contato.email}
          </a>
        </Linha>
      </dl>

      <nav aria-label="Seções" className="hidden lg:block">
        <p className="mb-2 font-mono text-[10px] tracking-widest text-apagado uppercase">Índice</p>
        <ol className="space-y-0.5">
          {SECOES.map((s, i) => {
            const on = ativo === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#/${s.id}`}
                  onClick={() => window.location.hash === `#/${s.id}` && document.getElementById(s.id)?.scrollIntoView()}
                  className={`group flex items-center gap-3 rounded-md py-1.5 text-sm transition ${on ? 'text-texto' : 'text-suave hover:text-texto'}`}
                >
                  <span className={`font-mono text-[11px] ${on ? 'text-destaque' : 'text-apagado'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`h-px transition-all ${on ? 'w-8 bg-destaque' : 'w-4 bg-linha group-hover:w-6 group-hover:bg-suave'}`} />
                  {s.rotulo}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="flex gap-2 lg:mt-auto">
        <Social href={linkWhatsapp()} rotulo="WhatsApp">
          <WhatsappIcon size={16} />
        </Social>
        <Social href={perfil.contato.github} rotulo="GitHub">
          <GithubIcon size={16} />
        </Social>
        <Social href={perfil.contato.linkedin} rotulo="LinkedIn">
          <LinkedinIcon size={16} />
        </Social>
        <Social href={`mailto:${perfil.contato.email}`} rotulo="E-mail">
          <Mail size={16} />
        </Social>
      </div>
    </aside>
  )
}
