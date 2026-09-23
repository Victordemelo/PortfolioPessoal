// Traço de analisador lógico: um sinal digital rolando, usado nos títulos das seções.
// O padrão se repete a cada 40 px, então basta deslizar 40 px em loop.
export function Onda({ canal, className = '' }: { canal: number; className?: string }) {
  const bits = [
    [1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
  ][canal % 6]
  // Um período de 40 px com 5 bits de 8 px, repetido 5 vezes
  let d = ''
  let y = bits[0] ? 3 : 13
  d += `M0 ${y}`
  for (let r = 0; r < 5; r++) {
    bits.forEach((b, i) => {
      const x = r * 40 + i * 8
      const ny = b ? 3 : 13
      if (ny !== y) d += ` L${x} ${y} L${x} ${ny}`
      y = ny
      d += ` L${x + 8} ${y}`
    })
  }
  return (
    <span className={`flex items-center gap-2 font-mono text-[10px] text-apagado ${className}`} aria-hidden="true">
      CH{canal}
      <svg width="120" height="16" viewBox="0 0 120 16" className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]">
        <path d={d} fill="none" stroke="var(--destaque)" strokeWidth="1.3" className="onda-logica" />
      </svg>
    </span>
  )
}
