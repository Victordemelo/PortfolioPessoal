import { useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, Check, CircleDot, Clock, Code, Copy, GraduationCap, Link2, Mail, MapPin } from 'lucide-react'
import { perfil } from '../data/perfil'
import { grupos, projetos, projetosDoGrupo, type Projeto } from '../data/projetos'
import { stack } from '../data/stack'
import { trajetoria } from '../data/trajetoria'
import { periodo } from '../lib/datas'
import { Capa } from './Capa'
import { CapaIsometrica } from './CapaIsometrica'
import { Contribuicoes } from './Contribuicoes'
import { GithubIcon, LinkedinIcon } from './Icones'
import { Anotacao, CaixaIcone, Listra, Subtitulo, TituloSecao } from './ui'

export function Home() {
  return (
    <>
      <div className="linha-baixo">
        <CapaIsometrica />
      </div>
      <Perfil />
      <Listra />
      <Informacoes />
      <Redes />
      <div className="linha-baixo px-4 py-5">
        <Contribuicoes />
      </div>
      <Listra />
      <Sobre />
      <Listra />
      <Projetos />
      <Listra />
      <Stack />
      <Listra />
      <Trajetoria />
      <Listra />
      <Contato />
    </>
  )
}

// ─── Perfil ────────────────────────────────────────────────

function Perfil() {
  return (
    <div className="linha-baixo flex">
      <div className="shrink-0 border-r border-linha p-1">
        <img
          src={perfil.avatar}
          alt={perfil.nome}
          width={128}
          height={128}
          className="h-24 w-24 rounded-full border border-linha object-cover sm:h-32 sm:w-32"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-end">
        <h1 className="linha-direita border-b border-linha px-4 py-2 text-2xl font-semibold tracking-tight sm:text-3xl">{perfil.nome}</h1>
        <p className="px-4 py-2 font-mono text-xs text-suave sm:text-sm">{perfil.frase}</p>
      </div>
    </div>
  )
}

// ─── Informações ───────────────────────────────────────────

function useHoraFloripa() {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: perfil.fuso }).format(agora)
  // Brasília é UTC−3 o ano todo; compara com o fuso de quem está vendo
  const diferenca = (-180 + agora.getTimezoneOffset()) / 60
  const relativo =
    diferenca === 0 ? 'mesmo fuso que você' : `${Math.abs(diferenca)}h ${diferenca > 0 ? 'à frente' : 'atrás'} de você`
  return { hora, relativo }
}

function Item({ icone, children }: { icone: ReactNode; children: ReactNode }) {
  return (
    <li className="flex min-w-0 items-center gap-3 font-mono text-sm">
      <CaixaIcone>{icone}</CaixaIcone>
      <span className="min-w-0 truncate">{children}</span>
    </li>
  )
}

function Informacoes() {
  const { hora, relativo } = useHoraFloripa()
  const trabalho = trajetoria.find((t) => t.tipo === 'trabalho')
  return (
    <div className="linha-baixo grid sm:grid-cols-2">
      <ul className="space-y-2.5 px-4 py-4 sm:border-r sm:border-dashed sm:border-linha">
        <Item icone={<Code size={14} />}>
          {perfil.titulo}
          {trabalho && <span className="text-suave"> @{trabalho.lugar.replace(' Digitais', '')}</span>}
        </Item>
        <Item icone={<GraduationCap size={14} />}>
          Eng. da Computação <span className="text-suave">@Unisul</span>
        </Item>
        <Item icone={<MapPin size={14} />}>{perfil.local}</Item>
        {perfil.disponivel && (
          <Item icone={<CircleDot size={14} className="text-vivo" />}>disponível para projetos</Item>
        )}
      </ul>
      <ul className="space-y-2.5 px-4 pb-4 sm:py-4">
        <Item icone={<Clock size={14} />}>
          {hora} <span className="text-apagado">// {relativo}</span>
        </Item>
        <Item icone={<Mail size={14} />}>
          <a href={`mailto:${perfil.contato.email}`} className="hover:underline">
            {perfil.contato.email}
          </a>
        </Item>
        <Item icone={<Link2 size={14} />}>
          <a href={perfil.contato.github} target="_blank" rel="noreferrer" className="hover:underline">
            github.com/{perfil.github}
          </a>
        </Item>
      </ul>
    </div>
  )
}

function BotaoIcone({ href, rotulo, children }: { href: string; rotulo: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={rotulo}
      title={rotulo}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-linha bg-superficie text-suave transition hover:border-apagado hover:text-texto"
    >
      {children}
    </a>
  )
}

function Redes() {
  return (
    <div className="linha-baixo relative flex gap-2 px-4 py-3">
      <Anotacao>me segue</Anotacao>
      <BotaoIcone href={perfil.contato.github} rotulo="GitHub">
        <GithubIcon size={17} />
      </BotaoIcone>
      <BotaoIcone href={perfil.contato.linkedin} rotulo="LinkedIn">
        <LinkedinIcon size={17} />
      </BotaoIcone>
      <BotaoIcone href={`mailto:${perfil.contato.email}`} rotulo="E-mail">
        <Mail size={17} />
      </BotaoIcone>
    </div>
  )
}

// ─── Sobre ─────────────────────────────────────────────────

function saudacao() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function Sobre() {
  return (
    <section>
      <div className="linha-baixo px-4 pt-4 pb-1">
        <h2 className="font-mao text-3xl font-semibold">{saudacao()}</h2>
      </div>
      <ul className="linha-baixo space-y-3 px-4 py-5 leading-relaxed">
        {perfil.sobre.map((p) => (
          <li key={p.slice(0, 20)} className="flex gap-3">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-apagado" />
            <span className="text-texto/90">{p}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Projetos ──────────────────────────────────────────────

export function CartaoProjeto({ p }: { p: Projeto }) {
  return (
    <a href={`#/projetos/${p.id}`} className="group block p-2 transition-colors hover:bg-superficie">
      <div className="overflow-hidden rounded-xl border border-linha">
        {p.imagem ? (
          <img src={p.imagem} alt="" loading="lazy" className="foto-pb aspect-[16/9] w-full object-cover" />
        ) : (
          <Capa id={p.id} nome={p.nome} className="aspect-[16/9]" />
        )}
      </div>
      <div className="px-2 pt-3 pb-2">
        <h4 className="flex items-center gap-2 text-lg font-medium">
          {p.nome}
          {p.fim === 'atual' && <span className="h-1.5 w-1.5 rounded-full bg-novo" title="em andamento" />}
        </h4>
        <p className="mt-0.5 line-clamp-2 text-sm text-suave">{p.resumo}</p>
        <p className="mt-2 font-mono text-xs text-apagado">
          {periodo(p)}
          {p.contexto && ` · ${p.contexto}`}
        </p>
      </div>
    </a>
  )
}

function Projetos() {
  return (
    <section>
      <TituloSecao id="projetos" contagem={projetos.length}>
        Projetos
      </TituloSecao>
      {grupos.map((g) => {
        const lista = projetosDoGrupo(g.id)
        return (
          <div key={g.id}>
            <Subtitulo contagem={lista.length} descricao={g.descricao}>
              {g.titulo}
            </Subtitulo>
            <div className="grade-linhas grade-2 grid sm:grid-cols-2">
              {lista.map((p) => (
                <CartaoProjeto key={p.id} p={p} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

// ─── Stack ─────────────────────────────────────────────────

function Stack() {
  return (
    <section>
      <TituloSecao id="stack" contagem={stack.length}>
        Stack
      </TituloSecao>
      <ul className="grade-linhas grade-3 grid grid-cols-2 sm:grid-cols-3">
        {stack.map((t) => (
          <li key={t.nome} className="flex items-center gap-3 px-4 py-3">
            <CaixaIcone>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d={t.icone.path} />
              </svg>
            </CaixaIcone>
            <span className="min-w-0">
              <span className="block truncate font-medium">{t.nome}</span>
              <span className="block font-mono text-[11px] text-apagado">{t.papel}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Trajetória ────────────────────────────────────────────

function Trajetoria() {
  return (
    <section>
      <TituloSecao id="trajetoria" contagem={trajetoria.length}>
        Trajetória
      </TituloSecao>
      <ol>
        {trajetoria.map((e) => (
          <li key={e.titulo} className="linha-baixo grid gap-x-6 gap-y-1 px-4 py-4 sm:grid-cols-[9rem_1fr]">
            <p className="font-mono text-xs text-apagado sm:pt-1">
              {e.periodo || (e.tipo === 'trabalho' ? 'atual' : 'em andamento')}
            </p>
            <div>
              <h3 className="font-medium">
                {e.titulo} <span className="text-suave">@ {e.lugar}</span>
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-suave">{e.descricao}</p>
              {e.tags && (
                <p className="mt-2 font-mono text-[11px] text-apagado">{e.tags.join(' · ')}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// ─── Contato ───────────────────────────────────────────────

function Contato() {
  const [copiado, setCopiado] = useState(false)
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(perfil.contato.email)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      window.location.href = `mailto:${perfil.contato.email}`
    }
  }
  return (
    <section id="contato">
      <div className="linha-baixo relative px-4 py-8 text-center">
        <Anotacao className="top-8">bora conversar?</Anotacao>
        <p className="text-sm text-suave">Tem um sistema pra tirar do papel?</p>
        <a href={`mailto:${perfil.contato.email}`} className="mt-2 inline-block text-2xl font-semibold tracking-tight hover:underline sm:text-3xl">
          {perfil.contato.email}
        </a>
        <div className="mt-5 flex justify-center gap-2">
          <a
            href={`mailto:${perfil.contato.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-texto px-3.5 py-2 text-sm font-medium text-fundo transition hover:opacity-85"
          >
            Enviar e-mail <ArrowRight size={15} />
          </a>
          <button
            onClick={copiar}
            className="inline-flex items-center gap-2 rounded-lg border border-linha bg-superficie px-3.5 py-2 text-sm transition hover:border-apagado"
          >
            {copiado ? <Check size={15} className="text-vivo" /> : <Copy size={15} />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </section>
  )
}
