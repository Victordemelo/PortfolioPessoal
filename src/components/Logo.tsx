// "VM" desenhado em pixels (5×5 por letra)
const V = ['1...1', '1...1', '.1.1.', '.1.1.', '..1..']
const M = ['1...1', '11.11', '1.1.1', '1...1', '1...1']

export function Logo({ className = 'h-5' }: { className?: string }) {
  const quadrados: [number, number][] = []
  ;[V, M].forEach((letra, li) =>
    letra.forEach((linha, y) => [...linha].forEach((c, x) => c === '1' && quadrados.push([x + li * 6, y]))),
  )
  return (
    <svg viewBox="0 0 11 5" className={className} fill="currentColor" aria-label="VM" role="img" shapeRendering="crispEdges">
      {quadrados.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width={0.84} height={0.84} />
      ))}
    </svg>
  )
}
