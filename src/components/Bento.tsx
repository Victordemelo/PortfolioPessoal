import { useEffect, useState } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { perfil } from '../data/perfil'
import { grupos, projetos, projetosOrdenados } from '../data/projetos'
import { stack } from '../data/stack'
import { trajetoria } from '../data/trajetoria'
import { haQuanto, periodo } from '../lib/datas'
import { ir } from '../lib/rota'
import { sequenciaAtual, useAtividade } from '../lib/atividade'
import { Cartao } from './Cartao'
import { marcarOrigem } from './Gaveta'
import { Heatmap } from './graficos'
import { GithubIcon, LinkedinIcon } from './Icones'

export function useRelogio() {
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 1000 * 20)
    return () => clearInterval(t)
  }, [])
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: perfil.fuso }).format(agora)
}

export function Bento() {
  return (
    <div className="bento">
      <CartaoEu />
      <CartaoFoto />
      <CartaoProjetos />
      <CartaoAtividade />
      <CartaoHardware />
      <CartaoStack />
      <CartaoTrajetoria />
      <CartaoContato />
    </div>
  )
}

function CartaoEu() {
  const hora = useRelogio()
  const [nome1, ...resto] = perfil.nome.split(' ')
  return (
    <Cartao id="eu" designador="U1" rotulo="identificação" abre="eu">
      <div className="flex flex-1 flex-col justify-between gap-8 px-5 pt-6 pb-5 sm:px-7">
        <div>
          {perfil.disponivel && (
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-xs text-suave">
              <span className="led-pisca h-2 w-2 rounded-full bg-led shadow-[0_0_8px_var(--led)]" />
              disponível para projetos
            </p>
          )}
          <h1 className="font-display leading-[0.88] font-extrabold tracking-[-0.035em]">
            <span className="block text-[clamp(3rem,8vw,6.4rem)]">{nome1} de Melo</span>
            <span className="block text-[clamp(3rem,8vw,6.4rem)] text-transparent [-webkit-text-stroke:1.5px_var(--suave)]">
              {resto.slice(2).join(' ')}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-snug text-suave sm:text-xl">{perfil.frase}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-linha pt-4 font-mono text-xs sm:grid-cols-4">
          {[
            ['função', perfil.titulo],
            ['formação', 'Eng. Computação'],
            ['base', perfil.local],
            ['hora local', `${hora} BRT`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-suave/70">{k}</dt>
              <dd className="mt-0.5 text-texto">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Cartao>
  )
}

function CartaoFoto() {
  return (
    <Cartao id="foto" designador="Q1" rotulo="fig. 1" semCabecalho className="min-h-72">
      <div className="duotom absolute inset-0">
        <img src={perfil.avatar} alt={perfil.nome} className="h-full w-full object-cover object-[50%_30%]" />
      </div>
      <p className="relative z-[2] mt-auto bg-gradient-to-t from-black/70 to-transparent px-5 pt-10 pb-4 font-mono text-[11px] tracking-wider text-white/85 uppercase">
        <span className="text-cobre-claro">Q1</span> / fig. 1 — o autor, em Florianópolis
      </p>
    </Cartao>
  )
}

function CartaoProjetos() {
  const recentes = projetosOrdenados
    .slice()
    .sort((a, b) => (b.fim === 'atual' ? '9999' : (b.fim ?? b.inicio)).localeCompare(a.fim === 'atual' ? '9999' : (a.fim ?? a.inicio)))
    .slice(0, 5)
  return (
    <Cartao id="projetos" designador="J1" rotulo="projetos" abre="projetos">
      <div className="flex flex-1 flex-col px-5 pt-5 pb-5 sm:px-7">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Projetos</h2>
          <p className="pb-1.5 text-right font-mono text-xs text-suave">
            {projetos.length} projetos · {grupos.map((g) => g.titulo.toLowerCase()).join(', ')}
          </p>
        </div>
        <ol className="mt-5 flex-1 divide-y divide-linha border-y border-linha">
          {recentes.map((p, i) => (
            <li key={p.id}>
              <button
                onClick={() => {
                  marcarOrigem('projetos')
                  ir(`projetos/${p.id}`)
                }}
                className="relative z-[2] grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-3 text-left transition hover:bg-placa-2/60 hover:pl-2 sm:grid-cols-[2rem_1fr_7rem_9rem]"
              >
                <span className="font-mono text-xs text-suave">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-lg font-semibold">
                  {p.nome}
                  {p.fim === 'atual' && <span className="ml-2 inline-block h-1.5 w-1.5 -translate-y-1 rounded-full bg-led" title="em andamento" />}
                </span>
                <span className="hidden font-mono text-xs text-suave sm:block">{grupos.find((g) => g.id === p.categoria)?.titulo}</span>
                <span className="text-right font-mono text-xs text-suave">{periodo(p)}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 font-mono text-xs text-cobre">abrir a lista completa, por categoria →</p>
      </div>
    </Cartao>
  )
}

function CartaoAtividade() {
  const { dados, erro } = useAtividade()
  const ultimoDia = dados?.dias.findLast((d) => d.qtd > 0)
  const hoje = dados?.dias.at(-1)
  const ativoAgora = !!ultimoDia && dados!.dias.slice(-2).some((d) => d.qtd > 0)

  return (
    <Cartao id="atividade" designador="D1" rotulo="atividade · ao vivo" abre="atividade">
      <div className="flex flex-1 flex-col gap-5 px-5 pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-5xl font-bold tracking-tight tabular-nums">{dados ? dados.total : '—'}</p>
            <p className="mt-1 text-sm text-suave">contribuições no último ano</p>
          </div>
          <p className="flex items-center gap-2 rounded-full border border-linha px-2.5 py-1 font-mono text-[11px] text-suave">
            <span className={`h-1.5 w-1.5 rounded-full ${ativoAgora ? 'led-pisca bg-led' : 'bg-suave/50'}`} />
            {ativoAgora ? 'ativo agora' : 'ao vivo'}
          </p>
        </div>

        {dados ? (
          <Heatmap dias={dados.dias} semanas={20} />
        ) : (
          <div className="grid aspect-[20/7] place-items-center rounded-md border border-dashed border-linha font-mono text-xs text-suave">
            {erro ? 'não consegui falar com o GitHub agora' : 'lendo o GitHub…'}
          </div>
        )}

        {dados && (
          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-linha pt-4 font-mono text-xs">
            <div>
              <dt className="text-suave/70">hoje</dt>
              <dd className="mt-0.5 tabular-nums">{hoje?.qtd ?? 0}</dd>
            </div>
            <div>
              <dt className="text-suave/70">sequência</dt>
              <dd className="mt-0.5 tabular-nums">{sequenciaAtual(dados.dias)} d</dd>
            </div>
            <div>
              <dt className="text-suave/70">último push</dt>
              <dd className="mt-0.5 truncate">{dados.pushes[0] ? haQuanto(dados.pushes[0].quando) : ultimoDia ? haQuanto(ultimoDia.data) : '—'}</dd>
            </div>
          </dl>
        )}
      </div>
    </Cartao>
  )
}

function CartaoHardware() {
  const p = projetos.find((x) => x.id === 'arduino')!
  return (
    <Cartao id="hardware" designador="Q2" rotulo="hardware" abre="projetos/arduino" className="min-h-80">
      <div className="duotom absolute inset-0">
        <img src={p.imagem} alt="Equipe com a maquete do estacionamento inteligente" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="relative z-[2] mt-auto bg-gradient-to-t from-black/85 via-black/55 to-transparent px-5 pt-16 pb-5 text-white">
        <p className="font-mono text-[11px] tracking-wider text-cobre-claro uppercase">2 × Arduino UNO · C++</p>
        <h3 className="mt-1 font-display text-2xl leading-tight font-bold">{p.nome}</h3>
        <p className="mt-1 text-sm text-white/75">{periodo(p)} · {p.contexto}</p>
      </div>
    </Cartao>
  )
}

function CartaoStack() {
  const todos = stack.flatMap((g) => g.itens)
  const metade = Math.ceil(todos.length / 2)
  const linhas = [todos.slice(0, metade), todos.slice(metade)]
  return (
    <Cartao id="stack" designador="U2" rotulo="stack" abre="stack">
      <div className="flex flex-1 flex-col justify-center gap-3 overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        {linhas.map((linha, i) => (
          <div key={i} className={`faixa flex w-max gap-3 ${i ? 'faixa-reversa' : ''}`} style={{ ['--dur' as string]: `${50 + i * 12}s` }}>
            {[...linha, ...linha].map((item, j) => (
              <span
                key={j}
                aria-hidden={j >= linha.length}
                className="rounded-full border border-linha bg-placa-2/70 px-4 py-2 font-display text-lg font-medium whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Cartao>
  )
}

function CartaoTrajetoria() {
  return (
    <Cartao id="trajetoria" designador="U3" rotulo="trajetória" abre="trajetoria">
      <ol className="flex flex-1 flex-col justify-center gap-4 px-5 py-5">
        {trajetoria.map((e) => (
          <li key={e.titulo} className="grid grid-cols-[auto_1fr] gap-x-3">
            <span className="mt-2 h-2 w-2 rounded-full border border-cobre" />
            <div>
              <p className="font-display text-lg leading-tight font-semibold">{e.titulo}</p>
              <p className="text-sm text-suave">{e.lugar}</p>
            </div>
          </li>
        ))}
      </ol>
    </Cartao>
  )
}

function CartaoContato() {
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
    <Cartao id="contato" designador="J2" rotulo="contato">
      <div className="flex flex-1 flex-col justify-between gap-4 px-5 pt-3 pb-5">
        <p className="font-display text-3xl leading-tight font-bold tracking-tight">
          Tem um sistema pra tirar do papel? <span className="text-cobre">Me chama.</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${perfil.contato.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-cobre px-3.5 py-2 text-sm font-semibold text-fundo transition hover:bg-cobre-claro"
          >
            <Mail size={16} /> E-mail
          </a>
          <button
            onClick={copiar}
            className="inline-flex items-center gap-1.5 rounded-lg border border-linha px-3 py-2 font-mono text-xs transition hover:border-cobre"
            title={perfil.contato.email}
          >
            {copiado ? <Check size={14} className="text-led" /> : <Copy size={14} />}
            {copiado ? 'copiado' : 'copiar endereço'}
          </button>
          <a href={perfil.contato.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-lg border border-linha p-2 transition hover:border-cobre hover:text-cobre">
            <LinkedinIcon size={16} />
          </a>
          <a href={perfil.contato.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-lg border border-linha p-2 transition hover:border-cobre hover:text-cobre">
            <GithubIcon size={16} />
          </a>
        </div>
      </div>
    </Cartao>
  )
}
