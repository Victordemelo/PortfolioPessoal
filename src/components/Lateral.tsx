import { useEffect, useState, type ReactNode } from 'react'
import { Mail, Moon, Sun } from 'lucide-react'
import { conquistas } from '../data/conquistas'
import { linkWhatsapp, perfil } from '../data/perfil'
import { projetosOrdenados, type Projeto } from '../data/projetos'
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from './Icones'
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

function Linha({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.25rem_1fr] items-center gap-3 border-b border-linha py-2 last:border-0">
      <dt className="font-mono text-[11px] tracking-wider text-apagado uppercase">{k}</dt>
      <dd className="min-w-0 text-sm [&>a]:break-all">{children}</dd>
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

/** Seções da página de um projeto (os ids estão em PaginaProjeto.tsx) */
export function secoesDoProjeto(p: Projeto) {
  return [
    { id: 'visao', rotulo: 'Visão geral' },
    { id: 'destaques', rotulo: 'Destaques' },
    { id: 'stack-projeto', rotulo: 'Stack' },
    ...(p.repo || p.noAr || p.extra ? [{ id: 'links', rotulo: 'Links' }] : []),
  ]
}

function Indice({ titulo, itens, ativo, prefixo }: { titulo: string; itens: { id: string; rotulo: string }[]; ativo: string | null; prefixo: string }) {
  return (
    <nav aria-label={titulo} className="hidden lg:block">
      <p className="mb-2 truncate font-mono text-[10px] tracking-widest text-apagado uppercase">{titulo}</p>
      <ol className="space-y-0.5">
        {itens.map((s, i) => {
          const on = ativo === s.id
          return (
            <li key={s.id}>
              <a
                href={`${prefixo}${s.id}`}
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
  )
}

function OutrosProjetos({ atual }: { atual: Projeto }) {
  return (
    <nav aria-label="Outros projetos" className="hidden lg:block">
      <p className="mb-2 font-mono text-[10px] tracking-widest text-apagado uppercase">Outros projetos</p>
      <ul className="space-y-0.5">
        {projetosOrdenados
          .filter((p) => p.id !== atual.id)
          .map((p) => (
            <li key={p.id}>
              <a href={`/projetos/${p.id}`} className="group flex items-center gap-2 py-1 text-sm text-suave transition hover:text-texto">
                <span className="h-1 w-1 rounded-full bg-linha transition group-hover:bg-destaque" />
                {p.nome}
              </a>
            </li>
          ))}
      </ul>
      <a href="/#projetos" className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-destaque hover:underline">
        ← todos os projetos
      </a>
    </nav>
  )
}

function Conquistas() {
  return (
    <section aria-label="Conquistas no GitHub" className="hidden lg:block">
      <p className="mb-2 font-mono text-[10px] tracking-widest text-apagado uppercase">Conquistas no GitHub</p>
      <ul className="flex gap-2">
        {conquistas.map((c) => (
          <li key={c.nome}>
            <a
              href={`${perfil.contato.github}?tab=achievements`}
              target="_blank"
              rel="noreferrer"
              title={`${c.nome}: ${c.descricao}`}
              className="group block rounded-lg border border-linha bg-superficie p-1.5 transition hover:-translate-y-0.5 hover:border-destaque"
            >
              <img src={c.imagem} alt={c.nome} width={48} height={48} loading="lazy" className="h-12 w-12 transition group-hover:scale-110" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Lateral({ ativo, projeto }: { ativo: string | null; projeto?: Projeto }) {
  return (
    <aside className="flex flex-col gap-7 pt-6 pb-4 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:py-10">
      <div className="flex items-center justify-between">
        <a href="/" aria-label="Início" onClick={() => window.scrollTo({ top: 0 })} className="text-texto transition hover:text-destaque">
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
        <Linha k="trabalho">
          <span className="block truncate">{perfil.cargo}</span>
          <span className="block truncate text-xs text-suave">{perfil.empresa}</span>
        </Linha>
        <Linha k="local">{perfil.local}</Linha>
        <Linha k="formação">Eng. da Computação · Unisul</Linha>
        <Linha k="e-mail">
          <a href={`mailto:${perfil.contato.email}`} className="hover:text-destaque">
            {perfil.contato.email}
          </a>
        </Linha>
      </dl>

      <Conquistas />

      {projeto ? (
        <>
          <Indice titulo={`Neste projeto · ${projeto.nome}`} itens={secoesDoProjeto(projeto)} ativo={ativo} prefixo="#" />
          <OutrosProjetos atual={projeto} />
        </>
      ) : (
        <Indice titulo="Índice" itens={SECOES} ativo={ativo} prefixo="/#" />
      )}

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
        <Social href={perfil.contato.instagram} rotulo="Instagram">
          <InstagramIcon size={16} />
        </Social>
        <Social href={`mailto:${perfil.contato.email}`} rotulo="E-mail">
          <Mail size={16} />
        </Social>
      </div>
    </aside>
  )
}
