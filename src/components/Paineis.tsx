import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Briefcase, Cpu, ExternalLink, GraduationCap } from 'lucide-react'
import { perfil } from '../data/perfil'
import { grupos, projetos, projetosDoGrupo, projetosOrdenados, type Projeto } from '../data/projetos'
import { stack } from '../data/stack'
import { trajetoria } from '../data/trajetoria'
import { porMes, sequenciaAtual, useAtividade } from '../lib/atividade'
import { haQuanto, periodo } from '../lib/datas'
import { ir } from '../lib/rota'
import { Capa } from './Capa'
import { BarrasMensais, Heatmap, LegendaNiveis } from './graficos'
import { GithubIcon } from './Icones'

const miolo = 'px-5 py-8 sm:px-10 sm:py-10'

function Titulo({ sobre, children }: { sobre?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      {sobre && <p className="mb-2 font-mono text-xs tracking-wider text-cobre uppercase">{sobre}</p>}
      <h2 className="font-display text-4xl leading-none font-bold tracking-tight sm:text-6xl">{children}</h2>
    </div>
  )
}

// ─── Eu ──────────────────────────────────────────────────────

export function PainelEu() {
  const { dados } = useAtividade()
  const numeros = [
    { v: String(projetos.length), r: 'projetos neste portfólio' },
    { v: dados ? String(dados.total) : '—', r: 'contribuições no GitHub (12 meses)' },
    { v: '700+', r: 'testes automatizados no StabilMoney' },
    { v: String(projetos.filter((p) => p.fim === 'atual').length), r: 'projetos em andamento agora' },
  ]
  return (
    <div className={`${miolo} grid gap-10 lg:grid-cols-[1fr_280px]`}>
      <div>
        <Titulo sobre="quem escreve">{perfil.nome}</Titulo>
        <div className="space-y-5 text-lg leading-relaxed text-texto/85">
          {perfil.sobre.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </div>
      <aside className="space-y-3">
        <div className="duotom overflow-hidden rounded-xl">
          <img src={perfil.avatar} alt="" className="aspect-square w-full object-cover" />
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {numeros.map((n) => (
            <div key={n.r} className="flex flex-col-reverse rounded-xl border border-linha p-3">
              <dt className="mt-1 text-xs leading-tight text-suave">{n.r}</dt>
              <dd className="font-display text-3xl font-bold tabular-nums">{n.v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  )
}

// ─── Projetos: lista por categoria → detalhe ───────────────────

export function PainelProjetos({ item }: { item: string | null }) {
  const projeto = item ? projetos.find((p) => p.id === item) : undefined
  return (
    <AnimatePresence mode="wait" initial={false}>
      {projeto ? (
        <motion.div key={projeto.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <DetalheProjeto p={projeto} />
        </motion.div>
      ) : (
        <motion.div key="lista" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.25 }}>
          <ListaProjetos />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ListaProjetos() {
  return (
    <div className={miolo}>
      <Titulo sobre={`${projetos.length} projetos · do mais recente ao mais antigo`}>O que eu construí</Titulo>
      <nav className="mb-10 flex flex-wrap gap-2 font-mono text-xs">
        {grupos.map((g) => (
          <a
            key={g.id}
            href={`#grupo-${g.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(`grupo-${g.id}`)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="rounded-full border border-linha px-3 py-1.5 transition hover:border-cobre hover:text-cobre"
          >
            {g.titulo} <span className="text-suave">{projetosDoGrupo(g.id).length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        {grupos.map((g, gi) => (
          <section key={g.id} id={`grupo-${g.id}`} className="scroll-mt-4">
            <header className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-linha pb-3">
              <h3 className="font-display text-3xl font-bold tracking-tight">
                <span className="mr-3 font-mono text-sm font-normal text-cobre">{String(gi + 1).padStart(2, '0')}</span>
                {g.titulo}
              </h3>
              <p className="max-w-md text-sm text-suave">{g.descricao}</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projetosDoGrupo(g.id).map((p) => (
                <SubCartao key={p.id} p={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function SubCartao({ p }: { p: Projeto }) {
  return (
    <button
      onClick={() => ir(`projetos/${p.id}`)}
      className="group flex flex-col overflow-hidden rounded-xl border border-linha bg-placa text-left transition hover:-translate-y-0.5 hover:border-cobre/60"
    >
      {p.imagem ? (
        <div className="duotom h-28 overflow-hidden">
          <img src={p.imagem} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      ) : (
        <Capa id={p.id} nome={p.nome} className="h-28" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center justify-between gap-2 font-mono text-[11px] text-suave">
          <span className="tabular-nums">{periodo(p)}</span>
          {p.fim === 'atual' && (
            <span className="flex items-center gap-1.5 text-led">
              <span className="led-pisca h-1.5 w-1.5 rounded-full bg-led" /> em andamento
            </span>
          )}
          {p.hardware && (
            <span className="flex items-center gap-1 text-cobre">
              <Cpu size={12} /> hardware
            </span>
          )}
        </p>
        <h4 className="mt-2 font-display text-xl leading-tight font-bold">{p.nome}</h4>
        {p.contexto && <p className="text-sm text-suave">{p.contexto}</p>}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-texto/75">{p.resumo}</p>
        <p className="mt-auto flex items-center gap-1 pt-4 font-mono text-xs text-cobre">
          ver detalhes <ArrowRight size={13} className="transition group-hover:translate-x-1" />
        </p>
      </div>
    </button>
  )
}

function DetalheProjeto({ p }: { p: Projeto }) {
  const i = projetosOrdenados.findIndex((x) => x.id === p.id)
  const proximo = projetosOrdenados[(i + 1) % projetosOrdenados.length]
  const grupo = grupos.find((g) => g.id === p.categoria)!

  return (
    <div>
      {p.imagem ? (
        <div className="duotom h-56 overflow-hidden sm:h-80">
          <img src={p.imagem} alt={`Foto do projeto ${p.nome}`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <Capa id={p.id} nome={p.nome} className="h-40 sm:h-56" />
      )}
      <div className={miolo}>
        <button onClick={() => ir('projetos')} className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-suave transition hover:text-cobre">
          <ArrowLeft size={14} /> todos os projetos
        </button>

        <p className="mb-2 font-mono text-xs tracking-wider text-cobre uppercase">
          {grupo.titulo} {p.contexto && `· ${p.contexto}`}
        </p>
        <h2 className="font-display text-4xl leading-none font-bold tracking-tight sm:text-6xl">{p.nome}</h2>

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-y border-linha py-4 font-mono text-xs">
          <div>
            <dt className="text-suave/70">execução</dt>
            <dd className="mt-0.5">{periodo(p)}</dd>
          </div>
          <div>
            <dt className="text-suave/70">status</dt>
            <dd className="mt-0.5">{p.fim === 'atual' ? 'em andamento' : 'concluído'}</dd>
          </div>
          <div>
            <dt className="text-suave/70">código</dt>
            <dd className="mt-0.5">{p.repo ? 'público' : 'privado'}</dd>
          </div>
        </dl>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-texto/85">{p.resumo}</p>
            <h3 className="mt-8 mb-3 font-mono text-xs tracking-wider text-suave uppercase">destaques</h3>
            <ul className="space-y-2.5">
              {p.destaques.map((d) => (
                <li key={d} className="grid grid-cols-[1rem_1fr] gap-2 leading-relaxed">
                  <span className="mt-2.5 h-px w-3 bg-cobre" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-mono text-xs tracking-wider text-suave uppercase">stack</h3>
            <ul className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-linha px-3 py-1 text-sm">
                  {s}
                </li>
              ))}
            </ul>
            {(p.repo || p.noAr || p.extra) && (
              <div className="mt-8 flex flex-col gap-2">
                {p.noAr && <LinkGrande href={p.noAr}>Acessar o site</LinkGrande>}
                {p.repo && (
                  <LinkGrande href={p.repo} icone={<GithubIcon size={16} />}>
                    Ver o código
                  </LinkGrande>
                )}
                {p.extra && <LinkGrande href={p.extra.url}>{p.extra.rotulo}</LinkGrande>}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => ir(`projetos/${proximo.id}`)}
          className="group mt-14 flex w-full items-center justify-between rounded-xl border border-linha p-5 text-left transition hover:border-cobre"
        >
          <span>
            <span className="block font-mono text-xs text-suave">próximo</span>
            <span className="font-display text-2xl font-bold">{proximo.nome}</span>
          </span>
          <ArrowRight className="transition group-hover:translate-x-1 group-hover:text-cobre" />
        </button>
      </div>
    </div>
  )
}

function LinkGrande({ href, icone, children }: { href: string; icone?: React.ReactNode; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-linha px-4 py-3 transition hover:border-cobre hover:text-cobre">
      <span className="flex items-center gap-2">
        {icone}
        {children}
      </span>
      <ExternalLink size={15} />
    </a>
  )
}

// ─── Atividade ──────────────────────────────────────────────

export function PainelAtividade() {
  const { dados, erro } = useAtividade()
  if (!dados) {
    return <div className={`${miolo} font-mono text-sm text-suave`}>{erro ? 'Não consegui falar com o GitHub agora. Tente de novo em instantes.' : 'Lendo o GitHub…'}</div>
  }
  const meses = porMes(dados.dias).slice(-12)
  const diasAtivos = dados.dias.filter((d) => d.qtd > 0).length
  const recorde = dados.dias.reduce((a, d) => (d.qtd > a.qtd ? d : a), dados.dias[0])

  return (
    <div className={miolo}>
      <Titulo sobre="atividade no github · atualiza sozinho a cada 5 min">Em que eu ando mexendo</Titulo>

      <dl className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [String(dados.total), 'contribuições em 12 meses'],
          [String(diasAtivos), 'dias com commit'],
          [`${sequenciaAtual(dados.dias)} d`, 'sequência atual'],
          [String(recorde.qtd), `recorde num dia (${new Date(recorde.data + 'T12:00:00Z').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })})`],
        ].map(([v, r]) => (
          <div key={r} className="flex flex-col-reverse rounded-xl border border-linha p-4">
            <dt className="mt-1 text-xs text-suave">{r}</dt>
            <dd className="font-display text-4xl font-bold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mb-12">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-semibold">Contribuições por dia</h3>
          <LegendaNiveis />
        </div>
        <div className="overflow-x-auto pt-8 -mt-8 pb-2 md:overflow-visible">
          <div className="min-w-[640px]">
            <Heatmap dias={dados.dias} rotulosMes />
          </div>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <h3 className="mb-5 font-display text-xl font-semibold">Contribuições por mês</h3>
          <BarrasMensais dados={meses} />
        </section>
        <section>
          <h3 className="mb-4 font-display text-xl font-semibold">Pushes recentes</h3>
          {dados.pushes.length ? (
            <ol className="divide-y divide-linha border-y border-linha">
              {dados.pushes.map((p) => (
                <li key={p.repo + p.quando} className="flex items-baseline justify-between gap-3 py-2.5">
                  <a href={`${perfil.contato.github}/${p.repo}`} target="_blank" rel="noreferrer" className="truncate font-medium hover:text-cobre">
                    {p.repo}
                  </a>
                  <span className="shrink-0 font-mono text-xs text-suave">
                    {p.vezes > 1 && `${p.vezes} pushes · `}
                    {haQuanto(p.quando)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-suave">Nenhum push público recente.</p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-suave">
            Dados do calendário público do GitHub. Boa parte do meu trabalho fica em repositórios privados; eles entram na contagem, mas os nomes não aparecem aqui.
          </p>
        </section>
      </div>
      <p className="mt-10 font-mono text-[11px] text-suave/70">atualizado {haQuanto(dados.atualizadoEm)}</p>
    </div>
  )
}

// ─── Stack ──────────────────────────────────────────────────

export function PainelStack() {
  return (
    <div className={miolo}>
      <Titulo sobre="ferramentas">O que eu uso no dia a dia</Titulo>
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {stack.map((g) => {
          const usados = projetos.filter((p) => p.stack.some((s) => g.itens.some((i) => s.toLowerCase().includes(i.split(' ')[0].toLowerCase()))))
          return (
            <section key={g.grupo} className="border-t border-linha pt-4">
              <h3 className="flex items-baseline justify-between font-mono text-xs tracking-wider text-cobre uppercase">
                {g.grupo}
                {usados.length > 0 && <span className="text-suave normal-case">em {usados.length} projeto{usados.length > 1 ? 's' : ''}</span>}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.itens.map((i) => (
                  <li key={i} className="rounded-full bg-placa-2 px-3 py-1.5 font-display text-base">
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}

// ─── Trajetória ─────────────────────────────────────────────

export function PainelTrajetoria() {
  return (
    <div className={miolo}>
      <Titulo sobre="experiência e formação">Trajetória</Titulo>
      <ol className="relative ml-3 border-l border-linha">
        {trajetoria.map((e) => {
          const Icone = e.tipo === 'trabalho' ? Briefcase : GraduationCap
          return (
            <li key={e.titulo} className="mb-10 ml-8 last:mb-0">
              <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border border-cobre bg-placa text-cobre">
                <Icone size={12} />
              </span>
              <p className="font-mono text-xs text-suave">{e.periodo || (e.tipo === 'trabalho' ? 'atual' : 'em andamento')}</p>
              <h3 className="mt-1 font-display text-2xl font-bold">{e.titulo}</h3>
              <p className="text-cobre">{e.lugar}</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-texto/80">{e.descricao}</p>
              {e.tags && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <li key={t} className="rounded-md border border-linha px-2 py-0.5 font-mono text-xs text-suave">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
