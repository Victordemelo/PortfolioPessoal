import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { grupos, projetosOrdenados, type Projeto } from '../data/projetos'
import { periodo } from '../lib/datas'
import { Capa } from './Capa'
import { GithubIcon } from './Icones'
import { Listra, TituloSecao } from './ui'

export function PaginaProjeto({ p }: { p: Projeto }) {
  const i = projetosOrdenados.findIndex((x) => x.id === p.id)
  const anterior = projetosOrdenados[(i - 1 + projetosOrdenados.length) % projetosOrdenados.length]
  const proximo = projetosOrdenados[(i + 1) % projetosOrdenados.length]
  const grupo = grupos.find((g) => g.id === p.categoria)

  const links = [
    p.noAr && { href: p.noAr, rotulo: 'Acessar o site', icone: <ArrowUpRight size={16} /> },
    p.repo && { href: p.repo, rotulo: 'Ver o código no GitHub', icone: <GithubIcon size={16} /> },
    p.extra && { href: p.extra.url, rotulo: p.extra.rotulo, icone: <ArrowUpRight size={16} /> },
  ].filter(Boolean) as { href: string; rotulo: string; icone: React.ReactNode }[]

  return (
    <article>
      <nav className="linha-baixo flex items-center justify-between px-4 py-3 font-mono text-xs">
        <a href="#/projetos" className="inline-flex items-center gap-1.5 text-suave transition hover:text-texto">
          <ArrowLeft size={14} /> projetos
        </a>
        <span className="text-apagado">
          {grupo?.titulo.toLowerCase()} / {p.id}
        </span>
      </nav>

      <div className="linha-baixo p-2">
        <div className="overflow-hidden rounded-xl border border-linha">
          {p.imagem ? (
            <img src={p.imagem} alt={`Foto do projeto ${p.nome}`} className="aspect-[16/8] w-full object-cover" />
          ) : (
            <Capa id={p.id} nome={p.nome} className="aspect-[16/8]" />
          )}
        </div>
      </div>

      <header className="linha-baixo px-4 py-6">
        <h1 className="text-4xl font-semibold tracking-tight">{p.nome}</h1>
        <p className="mt-3 leading-relaxed text-suave">{p.resumo}</p>
      </header>

      <dl className="linha-baixo grid grid-cols-3 font-mono text-xs">
        {[
          ['execução', periodo(p)],
          ['status', p.fim === 'atual' ? 'em andamento' : 'concluído'],
          ['código', p.repo ? 'público' : 'privado'],
        ].map(([k, v], j) => (
          <div key={k} className={`px-4 py-3 ${j < 2 ? 'border-r border-linha' : ''}`}>
            <dt className="text-apagado">{k}</dt>
            <dd className="mt-1 flex items-center gap-1.5">
              {k === 'status' && p.fim === 'atual' && <span className="h-1.5 w-1.5 rounded-full bg-novo" />}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <Listra />

      <TituloSecao contagem={p.destaques.length}>Destaques</TituloSecao>
      <ul className="linha-baixo space-y-3 px-4 py-5 leading-relaxed">
        {p.destaques.map((d) => (
          <li key={d} className="flex gap-3">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-apagado" />
            {d}
          </li>
        ))}
      </ul>

      <TituloSecao contagem={p.stack.length}>Stack</TituloSecao>
      <ul className="linha-baixo flex flex-wrap gap-2 px-4 py-4">
        {p.stack.map((s) => (
          <li key={s} className="rounded-md border border-linha bg-superficie px-2.5 py-1 font-mono text-xs">
            {s}
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <>
          <TituloSecao>Links</TituloSecao>
          <ul>
            {links.map((l) => (
              <li key={l.href} className="linha-baixo">
                <a href={l.href} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 transition hover:bg-superficie">
                  {l.rotulo}
                  <span className="text-suave">{l.icone}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <Listra />

      <nav className="linha-baixo grid grid-cols-2">
        <a href={`#/projetos/${anterior.id}`} className="group border-r border-linha px-4 py-5 transition hover:bg-superficie">
          <span className="flex items-center gap-1 font-mono text-xs text-apagado">
            <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" /> anterior
          </span>
          <span className="mt-1 block font-medium">{anterior.nome}</span>
        </a>
        <a href={`#/projetos/${proximo.id}`} className="group px-4 py-5 text-right transition hover:bg-superficie">
          <span className="flex items-center justify-end gap-1 font-mono text-xs text-apagado">
            próximo <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 block font-medium">{proximo.nome}</span>
        </a>
      </nav>
    </article>
  )
}
