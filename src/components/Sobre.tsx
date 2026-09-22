import { numerosExtras, perfil } from '../data/perfil'
import { projetos } from '../data/projetos'
import { Aparecer, Secao } from './Secao'

const numeros = [
  { valor: String(projetos.length), rotulo: 'projetos neste portfólio' },
  { valor: String(projetos.filter((p) => p.noAr).length), rotulo: 'sistemas no ar' },
  ...numerosExtras,
]

export function Sobre() {
  return (
    <Secao id="sobre" rotulo="01. sobre" titulo="Quem sou eu">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Aparecer className="space-y-5 text-lg leading-relaxed text-suave">
          {perfil.sobre.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Aparecer>

        <div className="grid grid-cols-2 gap-4 self-start">
          {numeros.map((n, i) => (
            <Aparecer key={n.rotulo} atraso={i * 0.08}>
              <div className="h-full rounded-2xl border border-borda bg-superficie p-5">
                <p className="texto-gradiente text-3xl font-extrabold sm:text-4xl">{n.valor}</p>
                <p className="mt-1 text-sm text-suave">{n.rotulo}</p>
              </div>
            </Aparecer>
          ))}
        </div>
      </div>
    </Secao>
  )
}
