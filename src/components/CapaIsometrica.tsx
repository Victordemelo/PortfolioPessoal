// Capa do topo: uma placa de circuito em perspectiva isométrica, só em traço,
// com um chip, um conector e trilhas por onde passam pulsos de sinal.
// Tudo é gerado a partir de coordenadas da placa (x, y, z) projetadas em 2D.

const U = 21 // tamanho de uma unidade da placa em px
const COS = Math.cos(Math.PI / 6)

type P3 = [number, number, number]
const iso = ([x, y, z]: P3): [number, number] => [(x - y) * COS * U, (x + y) * 0.5 * U - z * U]
const pts = (lista: P3[]) => lista.map((p) => iso(p).map((n) => n.toFixed(1)).join(',')).join(' ')
const caminho = (lista: P3[]) => lista.map((p, i) => `${i ? 'L' : 'M'}${iso(p).map((n) => n.toFixed(1)).join(' ')}`).join(' ')

// Placa
const L = 15, P = 9, E = 0.6

// Caixa: tampa + as duas faces visíveis (frente em y máximo, lado em x máximo)
function caixa(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number) {
  return {
    tampa: pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
    frente: pts([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]]),
    lado: pts([[x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [x1, y0, z0]]),
  }
}

const placa = caixa(0, 0, L, P, 0, E)
const chip = caixa(5.2, 2.8, 9.2, 6.2, E, E + 0.75)
const conector = caixa(11.4, 6.6, 13.6, 8.2, E, E + 0.5)
const cristal = caixa(2.2, 6.4, 3.6, 7.2, E, E + 0.35)

// Pinos do chip, saindo das quatro bordas
const pinos: [P3, P3][] = []
for (let i = 0; i < 5; i++) {
  const y = 3.2 + i * 0.65
  pinos.push([[5.2, y, E], [4.8, y, E]], [[9.2, y, E], [9.6, y, E]])
  const x = 5.6 + i * 0.8
  pinos.push([[x, 2.8, E], [x, 2.4, E]], [[x, 6.2, E], [x, 6.6, E]])
}

// Trilhas (no plano da placa), com curvas de 45°
const trilhas: P3[][] = [
  [[4.8, 3.2, E], [3, 3.2, E], [2, 2.2, E], [2, 1, E]],
  [[4.8, 4.5, E], [2.6, 4.5, E], [1.4, 5.7, E], [1.4, 7.8, E]],
  [[4.8, 5.8, E], [4.2, 5.8, E], [3.6, 6.4, E]],
  [[9.6, 3.2, E], [11.4, 3.2, E], [12.6, 2, E], [12.6, 1, E]],
  [[9.6, 4.5, E], [13.2, 4.5, E], [14, 5.3, E]],
  [[9.6, 5.8, E], [10.8, 5.8, E], [11.4, 6.6, E]],
  [[6.4, 2.4, E], [6.4, 1.4, E], [7.2, 0.6, E], [9, 0.6, E]],
  [[7.2, 6.6, E], [7.2, 7.6, E], [6.4, 8.4, E], [4.6, 8.4, E]],
  [[8.8, 6.6, E], [8.8, 8.2, E], [10, 8.2, E]],
]
const pads: P3[] = [[2, 1, E], [1.4, 7.8, E], [12.6, 1, E], [14, 5.3, E], [9, 0.6, E], [4.6, 8.4, E], [10, 8.2, E]]
const furos: P3[] = [[0.7, 0.7, E], [14.3, 0.7, E], [0.7, 8.3, E], [14.3, 8.3, E]]

// Limites do desenho para o viewBox
const todos = [placa, chip, conector].flatMap((c) => [c.tampa, c.frente, c.lado]).join(' ').split(' ').map((p) => p.split(',').map(Number))
const xs = todos.map((p) => p[0])
const ys = todos.map((p) => p[1])
const M = 16
const vb = `${Math.min(...xs) - M} ${Math.min(...ys) - M} ${Math.max(...xs) - Math.min(...xs) + M * 2} ${Math.max(...ys) - Math.min(...ys) + M * 2}`

export function CapaIsometrica() {
  return (
    <div className="relative h-56 overflow-hidden sm:h-72">
      {/* diagonais tracejadas de fundo */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <g stroke="var(--linha)" strokeDasharray="4 4" vectorEffect="non-scaling-stroke">
          <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      <svg viewBox={vb} className="relative mx-auto h-full" role="img" aria-label="Desenho de uma placa de circuito em perspectiva">
        <defs>
          <pattern id="hachura" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--linha)" strokeWidth="1.2" />
          </pattern>
        </defs>

        <g fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1" strokeLinejoin="round">
          <polygon points={placa.tampa} />
          <polygon points={placa.frente} fill="url(#hachura)" />
          <polygon points={placa.lado} fill="url(#hachura)" />
        </g>

        <g fill="none" stroke="var(--apagado)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          {trilhas.map((t, i) => (
            <path key={i} id={`trilha-${i}`} d={caminho(t)} />
          ))}
          {pinos.map(([a, b], i) => (
            <path key={`p${i}`} d={caminho([a, b])} strokeWidth="1.6" />
          ))}
        </g>

        <g fill="var(--fundo)" stroke="var(--apagado)" strokeWidth="1">
          {[...pads, ...furos].map((p, i) => {
            const [x, y] = iso(p)
            const r = i >= pads.length ? 0.32 : 0.22
            return <ellipse key={i} cx={x} cy={y} rx={r * U * 1.22} ry={r * U * 0.7} />
          })}
        </g>

        {[cristal, conector, chip].map((c, i) => (
          <g key={i} stroke="var(--suave)" strokeWidth="1" strokeLinejoin="round">
            <polygon points={c.frente} fill="var(--fundo)" />
            <polygon points={c.lado} fill="var(--fundo)" />
            <polygon points={c.tampa} fill={c === chip ? 'url(#hachura)' : 'var(--fundo)'} />
          </g>
        ))}
        {/* marca do pino 1 */}
        <ellipse cx={iso([5.7, 3.3, E + 0.75])[0]} cy={iso([5.7, 3.3, E + 0.75])[1]} rx="3.2" ry="1.9" fill="var(--suave)" />

        {/* pulsos de sinal correndo pelas trilhas */}
        <g className="so-com-movimento" fill="var(--texto)">
          {trilhas.map((_, i) => (
            <circle key={i} r="2.2">
              <animateMotion dur={`${2.4 + (i % 4) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href={`#trilha-${i}`} />
              </animateMotion>
            </circle>
          ))}
        </g>
      </svg>

      <p className="absolute right-4 bottom-3 text-xs text-apagado">Fig. 1.</p>
    </div>
  )
}
