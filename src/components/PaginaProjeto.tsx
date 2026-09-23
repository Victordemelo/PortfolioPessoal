import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { grupos, projetosOrdenados, type Projeto } from '../data/projetos'
import { dataCurta, mesAno, periodo } from '../lib/datas'
import { ultimaAtividade, useUltimosPushes } from '../lib/repos'
import { CapaProjeto } from './Capas'
import { GithubIcon } from './Icones'

function Bloco({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-6">
      <h2 className="mb-4 border-b border-linha pb-2 font-mono text-xs tracking-widest text-apagado uppercase">{titulo}</h2>
      {children}
    </section>
  )
}

export function PaginaProjeto({ p }: { p: Projeto }) {
  const i = projetosOrdenados.findIndex((x) => x.id === p.id)
  const anterior = projetosOrdenados[(i - 1 + projetosOrdenados.length) % projetosOrdenados.length]
  const proximo = projetosOrdenados[(i + 1) % projetosOrdenados.length]
  const grupo = grupos.find((g) => g.id === p.categoria)
  const ultima = ultimaAtividade(p, useUltimosPushes())

  const links = [
    p.noAr && { href: p.noAr, rotulo: 'Acessar o site', icone: <ArrowUpRight size={16} /> },
    p.repo && { href: p.repo, rotulo: 'Código no GitHub', icone: <GithubIcon size={16} /> },
    p.extra && { href: p.extra.url, rotulo: p.extra.rotulo, icone: <ArrowUpRight size={16} /> },
  ].filter(Boolean) as { href: string; rotulo: string; icone: ReactNode }[]

  // Em andamento: início + última atividade (o "status" já está implícito)
  const ficha =
    p.fim === 'atual'
      ? [
          ['categoria', grupo?.titulo ?? ''],
          ['início', mesAno(p.inicio)],
          ['última atividade', ultima ? dataCurta(ultima) : 'em andamento'],
          ['código', p.repo ? 'público' : 'privado'],
        ]
      : [
          ['categoria', grupo?.titulo ?? ''],
          ['execução', periodo(p)],
          ['status', 'concluído'],
          ['código', p.repo ? 'público' : 'privado'],
        ]

  return (
    <article className="py-8 lg:py-10">
      <a href="/#projetos" className="inline-flex items-center gap-1.5 font-mono text-xs text-suave transition hover:text-destaque">
        <ArrowLeft size={14} /> todos os projetos
      </a>

      <header id="visao" className="mt-6 scroll-mt-6">
        {p.contexto && <p className="font-mono text-xs tracking-widest text-destaque uppercase">{p.contexto}</p>}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] min-[400px]:text-4xl sm:text-5xl">{p.nome}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-suave">{p.resumo}</p>
      </header>

      <div className="mt-8 overflow-hidden rounded-lg border border-linha">
        {p.imagem ? (
          <img src={p.imagem} alt={`Foto do projeto ${p.nome}`} className="aspect-[16/8] w-full object-cover" />
        ) : (
          <CapaProjeto id={p.id} nome={p.nome} className="aspect-[16/8]" interativo />
        )}
      </div>

      <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-lg border border-linha sm:grid-cols-4">
        {ficha.map(([k, v], j) => (
          <div key={k} className={`border-linha p-3 ${j % 2 === 0 ? 'border-r' : ''} ${j < 2 ? 'border-b sm:border-b-0' : ''} sm:border-r sm:last:border-r-0`}>
            <dt className="font-mono text-[10px] tracking-widest text-apagado uppercase">{k}</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm">
              {k === 'última atividade' && <span className="h-1.5 w-1.5 rounded-full bg-novo" />}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <Bloco id="destaques" titulo={`Destaques · ${p.destaques.length}`}>
        <ul className="space-y-3 leading-relaxed">
          {p.destaques.map((d) => (
            <li key={d} className="grid grid-cols-[1.25rem_1fr]">
              <span className="mt-2.5 h-px w-3 bg-destaque" />
              {d}
            </li>
          ))}
        </ul>
      </Bloco>
      <Bloco id="stack-projeto" titulo="Stack">
        <ul className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="rounded border border-linha px-2 py-1 font-mono text-xs">
              {s}
            </li>
          ))}
        </ul>
      </Bloco>
      {links.length > 0 && (
        <Bloco id="links" titulo="Links">
          <ul className="grid gap-2 sm:grid-cols-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-md border border-linha px-3 py-2 text-sm transition hover:border-destaque hover:text-destaque"
                >
                  {l.rotulo}
                  {l.icone}
                </a>
              </li>
            ))}
          </ul>
        </Bloco>
      )}

      <nav className="mt-14 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <a href={`/projetos/${anterior.id}`} className="group rounded-lg border border-linha p-4 transition hover:border-destaque">
          <span className="flex items-center gap-1 font-mono text-xs text-apagado">
            <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" /> anterior
          </span>
          <span className="mt-1 block font-medium">{anterior.nome}</span>
        </a>
        <a href={`/projetos/${proximo.id}`} className="group rounded-lg border border-linha p-4 text-right transition hover:border-destaque">
          <span className="flex items-center justify-end gap-1 font-mono text-xs text-apagado">
            próximo <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 block font-medium">{proximo.nome}</span>
        </a>
      </nav>
    </article>
  )
}
