import { Briefcase, GraduationCap } from 'lucide-react'
import { trajetoria } from '../data/trajetoria'
import { Aparecer, Secao } from './Secao'

export function Trajetoria() {
  return (
    <Secao id="trajetoria" rotulo="03. trajetória" titulo="Experiência e formação">
      <ol className="relative ml-4 border-l border-borda">
        {trajetoria.map((e, i) => {
          const Icone = e.tipo === 'trabalho' ? Briefcase : GraduationCap
          return (
            <li key={e.titulo + e.lugar} className="mb-10 ml-8 last:mb-0">
              <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border border-borda bg-superficie text-destaque">
                <Icone size={16} />
              </span>
              <Aparecer atraso={i * 0.08}>
                <div className="rounded-2xl border border-borda bg-superficie p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-bold">{e.titulo}</h3>
                    {e.periodo && <span className="font-mono text-sm text-suave">{e.periodo}</span>}
                  </div>
                  <p className="text-destaque">{e.lugar}</p>
                  <p className="mt-3 leading-relaxed text-suave">{e.descricao}</p>
                  {e.tags && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {e.tags.map((t) => (
                        <li key={t} className="rounded-md bg-superficie-2 px-2 py-0.5 font-mono text-xs text-suave">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Aparecer>
            </li>
          )
        })}
      </ol>
    </Secao>
  )
}
