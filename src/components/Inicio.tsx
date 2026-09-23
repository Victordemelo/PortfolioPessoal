import { useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react'
import { linkWhatsapp, perfil } from '../data/perfil'
import { grupos, projetos, projetosDoGrupo, type Projeto } from '../data/projetos'
import { anteriores, certificados, idiomas, trajetoria } from '../data/trajetoria'
import { useAtividade } from '../lib/atividade'
import { dataCurta, periodo } from '../lib/datas'
import { ultimaAtividade, useUltimosPushes } from '../lib/repos'
import { CapaProjeto } from './Capas'
import { Contribuicoes } from './Contribuicoes'
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from './Icones'
import { SECOES } from './Lateral'
import { Onda } from './Onda'
import { Pinagem } from './Pinagem'

/** Cabeçalho de seção numerado, como os capítulos de um datasheet */
export function Secao({ id, titulo, children, extra }: { id: string; titulo: string; children: ReactNode; extra?: ReactNode }) {
  const n = SECOES.findIndex((s) => s.id === id) + 1
  return (
    <section id={id} className="scroll-mt-6 py-7 first:pt-8 lg:py-8 lg:first:pt-10">
      <header className="mb-6 flex items-center gap-4 border-b border-linha pb-3">
        <span className="font-mono text-sm text-destaque">{String(n).padStart(2, '0')}</span>
        <h2 className="text-2xl font-semibold tracking-tight">{titulo}</h2>
        <Onda canal={n - 1} className="ml-auto hidden md:flex" />
        {extra && <div className="hidden sm:block">{extra}</div>}
      </header>
      {children}
    </section>
  )
}

export function Inicio() {
  return (
    <>
      <Sobre />
      <Atividade />
      <Projetos />
      <Secao id="stack" titulo="Pinagem" extra={<span className="font-mono text-xs text-apagado">16 tecnologias + VCC/GND</span>}>
        <Pinagem />
      </Secao>
      <Trajetoria />
      <Contato />
    </>
  )
}

// ─── 01 Sobre ──────────────────────────────────────────────

function Sobre() {
  const { dados } = useAtividade()
  const numeros = [
    { v: String(projetos.length), r: 'projetos no portfólio' },
    { v: String(projetos.filter((p) => p.fim === 'atual').length), r: 'em andamento agora' },
    { v: dados ? dados.total.toLocaleString('pt-BR') : '—', r: 'contribuições em 12 meses' },
    { v: '700+', r: 'testes no StabilMoney' },
  ]
  return (
    <Secao id="sobre" titulo="Sobre">
      <p className="max-w-2xl text-3xl leading-[1.2] font-light tracking-tight sm:text-4xl">
        Escrevo o sistema, subo o servidor e, <span className="text-destaque">quando precisa,</span> pego o ferro de solda.
      </p>
      <div className="mt-8 max-w-2xl space-y-4 leading-relaxed text-suave">
        {perfil.sobre.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-lg border border-linha sm:grid-cols-4">
        {numeros.map((n, i) => (
          <div
            key={n.r}
            className={`flex flex-col-reverse gap-1 p-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''} border-linha sm:border-r sm:last:border-r-0`}
          >
            <dt className="text-xs text-apagado">{n.r}</dt>
            <dd className="font-mono text-2xl font-medium tabular-nums">{n.v}</dd>
          </div>
        ))}
      </dl>
    </Secao>
  )
}

// ─── 02 Atividade ──────────────────────────────────────────

function Atividade() {
  return (
    <Secao
      id="atividade"
      titulo="Atividade"
      extra={
        <span className="flex items-center gap-2 font-mono text-xs text-apagado">
          <span className="pisca h-1.5 w-1.5 rounded-full bg-vivo" /> ao vivo
        </span>
      }
    >
      <Contribuicoes />
    </Secao>
  )
}

// ─── 03 Projetos ───────────────────────────────────────────

/** "última atividade em 22/09/2026" para projeto em andamento; período para os demais */
export function QuandoProjeto({ p, pushes }: { p: Projeto; pushes: Record<string, string> }) {
  const ultima = ultimaAtividade(p, pushes)
  if (p.fim === 'atual' && ultima) {
    return (
      <span className="flex items-center gap-2" title={`em andamento, ${periodo(p)}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-novo" />
        última atividade em {dataCurta(ultima)}
      </span>
    )
  }
  return <span>{periodo(p)}</span>
}

function LinhaProjeto({ p, pushes }: { p: Projeto; pushes: Record<string, string> }) {
  return (
    <li>
      <a href={`/projetos/${p.id}`} className="group grid items-start gap-4 border-b border-linha py-5 sm:grid-cols-[184px_1fr] sm:gap-6">
        <div className="h-fit self-start overflow-hidden rounded-md border border-linha transition group-hover:border-destaque/60">
          {p.imagem ? (
            <img src={p.imagem} alt="" loading="lazy" className="foto-pb aspect-[16/10] w-full object-cover" />
          ) : (
            <CapaProjeto id={p.id} nome={p.nome} className="aspect-[16/10]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h4 className="flex items-center gap-2 text-lg font-medium transition group-hover:text-destaque">
              {p.nome}
              <ArrowRight size={16} className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </h4>
            <span className="font-mono text-xs text-apagado">
              <QuandoProjeto p={p} pushes={pushes} />
            </span>
          </div>
          {p.contexto && <p className="text-sm text-apagado">{p.contexto}</p>}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-suave">{p.resumo}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.stack.slice(0, 5).map((s) => (
              <li key={s} className="rounded border border-linha px-1.5 py-0.5 font-mono text-[11px] text-suave">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </li>
  )
}

function Projetos() {
  const pushes = useUltimosPushes()
  return (
    <Secao id="projetos" titulo="Projetos" extra={<span className="font-mono text-xs text-apagado">{projetos.length} no total · mais recentes primeiro</span>}>
      <div className="space-y-9">
        {grupos.map((g) => {
          const lista = projetosDoGrupo(g.id)
          return (
            <div key={g.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-linha pb-2">
                <h3 className="font-mono text-xs tracking-widest text-texto uppercase">
                  {g.titulo} <span className="text-apagado">· {lista.length}</span>
                </h3>
                <p className="text-xs text-apagado">{g.descricao}</p>
              </div>
              <ul>
                {lista.map((p) => (
                  <LinhaProjeto key={p.id} p={p} pushes={pushes} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Secao>
  )
}

// ─── 05 Trajetória ─────────────────────────────────────────

function Trajetoria() {
  return (
    <Secao id="trajetoria" titulo="Trajetória" extra={<span className="font-mono text-xs text-apagado">experiência · formação · certificados</span>}>
      <ol className="relative space-y-7 border-l border-linha pl-6">
        {trajetoria.map((e) => (
          <li key={e.titulo} className="relative">
            <span
              className={`absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full border-2 border-fundo ${e.tipo === 'formacao' ? 'bg-novo' : 'bg-destaque'}`}
            />
            <p className="flex flex-wrap gap-x-2 font-mono text-xs text-apagado">
              <span className="text-suave">{e.periodo}</span>
              {e.detalhe && <span>· {e.detalhe}</span>}
            </p>
            <h3 className="mt-1 text-lg font-medium">{e.titulo}</h3>
            <p className="text-sm text-suave">{e.lugar}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-suave">{e.descricao}</p>
            {e.tags && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <li key={t} className="rounded border border-linha px-1.5 py-0.5 font-mono text-[11px] text-suave">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="mb-3 border-b border-linha pb-2 font-mono text-xs tracking-widest text-texto uppercase">
            Certificados <span className="text-apagado">· {certificados.length}</span>
          </h3>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {certificados.map((c) => (
              <li key={c.nome} className="border-b border-linha/70 py-2.5">
                <p className="text-sm">{c.nome}</p>
                <p className="font-mono text-[11px] text-apagado">
                  {c.emissor}
                  {c.data && ` · ${c.data}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="mb-3 border-b border-linha pb-2 font-mono text-xs tracking-widest text-texto uppercase">Antes da tecnologia</h3>
            <ul>
              {anteriores.map((a) => (
                <li key={a.titulo} className="border-b border-linha/70 py-2.5">
                  <p className="text-sm">{a.titulo}</p>
                  <p className="font-mono text-[11px] text-apagado">
                    {a.lugar}
                    {a.periodo && ` · ${a.periodo}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 border-b border-linha pb-2 font-mono text-xs tracking-widest text-texto uppercase">Idiomas</h3>
            <ul className="flex gap-6">
              {idiomas.map((i) => (
                <li key={i.nome} className="text-sm">
                  {i.nome} <span className="font-mono text-[11px] text-apagado">· {i.nivel}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Secao>
  )
}

// ─── 06 Contato ────────────────────────────────────────────

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
    <Secao id="contato" titulo="Contato">
      <p className="max-w-xl text-2xl leading-snug font-light tracking-tight sm:text-3xl">
        Tem um sistema pra tirar do papel, uma integração ou uma automação? <span className="text-suave">Me chama no WhatsApp.</span>
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={linkWhatsapp()}
          // a saudação (bom dia/boa tarde/boa noite) é montada na hora do clique
          onClick={(e) => (e.currentTarget.href = linkWhatsapp())}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-destaque px-4 py-2.5 text-sm font-medium text-fundo transition hover:opacity-90"
        >
          <WhatsappIcon size={16} /> Chamar no WhatsApp <ArrowUpRight size={16} />
        </a>
        <a
          href={`mailto:${perfil.contato.email}`}
          className="inline-flex items-center gap-2 rounded-md border border-linha px-3.5 py-2.5 text-sm transition hover:border-destaque hover:text-destaque"
        >
          {perfil.contato.email}
        </a>
        <button
          onClick={copiar}
          className="inline-flex items-center gap-2 rounded-md border border-linha px-3.5 py-2.5 text-sm transition hover:border-destaque hover:text-destaque"
        >
          {copiado ? <Check size={15} className="text-vivo" /> : <Copy size={15} />}
          {copiado ? 'Copiado' : 'Copiar e-mail'}
        </button>
        <a
          href={perfil.contato.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-linha px-3.5 py-2.5 text-sm transition hover:border-destaque hover:text-destaque"
        >
          <LinkedinIcon size={15} /> LinkedIn
        </a>
        <a
          href={perfil.contato.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-linha px-3.5 py-2.5 text-sm transition hover:border-destaque hover:text-destaque"
        >
          <GithubIcon size={15} /> GitHub
        </a>
        <a
          href={perfil.contato.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-linha px-3.5 py-2.5 text-sm transition hover:border-destaque hover:text-destaque"
        >
          <InstagramIcon size={15} /> Instagram
        </a>
      </div>
    </Secao>
  )
}
