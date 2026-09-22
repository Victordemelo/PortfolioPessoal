import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Cpu, ExternalLink, Globe } from 'lucide-react'
import { categorias, projetos, type Categoria, type Projeto } from '../data/projetos'
import { GithubIcon } from './Icones'
import { Secao } from './Secao'

const rotuloCategoria: Record<Categoria, string> = {
  profissional: 'Profissional',
  pessoal: 'Pessoal',
  academico: 'Acadêmico',
  hardware: 'Hardware',
}

// Destaques primeiro, depois os que estão no ar, mantendo a ordem do arquivo
const ordenados = [...projetos].sort(
  (a, b) => Number(!!b.destaque) - Number(!!a.destaque) || Number(!!b.noAr) - Number(!!a.noAr),
)

export function Projetos() {
  const [filtro, setFiltro] = useState<Categoria | 'todos'>('todos')
  const visiveis = filtro === 'todos' ? ordenados : ordenados.filter((p) => p.categoria === filtro)

  return (
    <Secao
      id="projetos"
      rotulo="02. projetos"
      titulo="O que eu já construí"
      descricao="Sistemas em produção, projetos pessoais, trabalhos da faculdade e hardware. Os projetos da empresa têm código privado, então o card descreve o que o sistema faz."
    >
      <div role="tablist" aria-label="Filtrar projetos" className="mb-8 flex flex-wrap gap-2">
        {categorias.map((c) => {
          const qtd = c.id === 'todos' ? projetos.length : projetos.filter((p) => p.categoria === c.id).length
          const ativo = filtro === c.id
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={ativo}
              onClick={() => setFiltro(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                ativo
                  ? 'border-destaque bg-destaque/10 text-destaque'
                  : 'border-borda text-suave hover:border-suave hover:text-texto'
              }`}
            >
              {c.rotulo} <span className="ml-1 font-mono text-xs opacity-70">{qtd}</span>
            </button>
          )
        })}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visiveis.map((p) => (
            <CardProjeto key={p.id} projeto={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Secao>
  )
}

function CardProjeto({ projeto: p }: { projeto: Projeto }) {
  const [aberto, setAberto] = useState(false)
  const largo = p.destaque && p.imagem

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-borda bg-superficie transition-colors hover:border-destaque/50 ${
        largo ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {p.imagem && (
        <div className={`relative overflow-hidden bg-superficie-2 ${largo ? 'md:w-1/2' : 'aspect-video'}`}>
          <img
            src={p.imagem}
            alt={`Foto do projeto ${p.nome}`}
            loading="lazy"
            className="h-full max-h-80 w-full object-cover transition duration-500 group-hover:scale-105 md:max-h-none"
          />
        </div>
      )}

      <div className={`flex flex-1 flex-col p-6 ${largo ? 'md:w-1/2' : ''}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md bg-superficie-2 px-2 py-1 font-mono text-suave">
            {p.categoria === 'hardware' && <Cpu size={12} className="mr-1 inline" />}
            {rotuloCategoria[p.categoria]}
          </span>
          {p.noAr && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-destaque/10 px-2 py-1 font-medium text-destaque">
              <span className="h-1.5 w-1.5 rounded-full bg-destaque" /> No ar
            </span>
          )}
          {p.contexto && <span className="text-suave">{p.contexto}</span>}
        </div>

        <h3 className="text-xl font-bold">{p.nome}</h3>
        <p className="mt-2 leading-relaxed text-suave">{p.resumo}</p>

        <AnimatePresence initial={false}>
          {aberto && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {p.destaques.map((d) => (
                <li key={d} className="mt-2 flex gap-2 text-sm text-suave first:mt-4">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-destaque" />
                  {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <button
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-destaque hover:underline"
        >
          {aberto ? 'Menos detalhes' : 'Mais detalhes'}
          <ChevronDown size={16} className={`transition ${aberto ? 'rotate-180' : ''}`} />
        </button>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="rounded-md border border-borda px-2 py-0.5 font-mono text-xs text-suave">
              {s}
            </li>
          ))}
        </ul>

        {(p.noAr || p.repo || p.extra) && (
          <div className="mt-auto flex flex-wrap gap-4 pt-6 text-sm font-medium">
            {p.noAr && (
              <a href={p.noAr} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-destaque">
                <Globe size={16} /> Acessar site
              </a>
            )}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-destaque">
                <GithubIcon size={16} /> Código
              </a>
            )}
            {p.extra && (
              <a href={p.extra.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-destaque">
                <ExternalLink size={16} /> {p.extra.rotulo}
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
