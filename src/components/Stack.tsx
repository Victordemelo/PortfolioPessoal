import { stack } from '../data/stack'
import { Aparecer, Secao } from './Secao'

export function Stack() {
  return (
    <Secao id="stack" rotulo="04. stack" titulo="Ferramentas que eu uso">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((g, i) => (
          <Aparecer key={g.grupo} atraso={i * 0.06}>
            <div className="h-full rounded-2xl border border-borda bg-superficie p-6">
              <h3 className="font-mono text-sm text-destaque">{g.grupo}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.itens.map((item) => (
                  <li key={item} className="rounded-lg bg-superficie-2 px-3 py-1.5 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Aparecer>
        ))}
      </div>
    </Secao>
  )
}
