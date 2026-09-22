import { useEffect, useRef } from 'react'

// Fundo de placa de circuito: trilhas geradas em grade com curvas de 45°,
// ilhas (pads) nas pontas e pulsos de sinal correndo pelas trilhas.
// O cursor funciona como ponta de prova: acende as trilhas por perto e
// injeta pulsos nelas.
//
// Desempenho: as trilhas são desenhadas uma vez em dois canvas fora da tela
// (apagado e aceso). A cada quadro só se copia o apagado, recorta-se o aceso
// em volta do cursor e desenham-se os pulsos.

type Ponto = { x: number; y: number }
type Trilha = { pts: Ponto[]; comp: number; acum: number[] }
type Pulso = { t: Trilha; d: number; vel: number; cauda: number }

const CELULA = 26
const RAIO_SONDA = 170

const DIRS: Ponto[] = [
  { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
  { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
]

function lerCores() {
  const s = getComputedStyle(document.documentElement)
  const v = (n: string) => s.getPropertyValue(n).trim()
  return { traco: v('--traco'), cobre: v('--cobre'), cobreClaro: v('--cobre-claro'), fundo: v('--fundo') }
}

function gerarTrilhas(w: number, h: number): Trilha[] {
  const cols = Math.ceil(w / CELULA) + 1
  const lins = Math.ceil(h / CELULA) + 1
  const ocupado = new Uint8Array(cols * lins)
  const livre = (c: number, l: number) => c >= 0 && l >= 0 && c < cols && l < lins && !ocupado[l * cols + c]
  const trilhas: Trilha[] = []
  const alvo = Math.floor((cols * lins) / 11)

  for (let tentativa = 0; tentativa < alvo * 3 && trilhas.length < alvo; tentativa++) {
    let c = Math.floor(Math.random() * cols)
    let l = Math.floor(Math.random() * lins)
    if (!livre(c, l)) continue
    // Preferência por direções ortogonais, como numa placa de verdade
    let dir = Math.floor(Math.random() * 4) * 2
    const passos = 3 + Math.floor(Math.random() * 16)
    const celulas: Ponto[] = [{ x: c, y: l }]
    ocupado[l * cols + c] = 1
    for (let i = 0; i < passos; i++) {
      if (Math.random() < 0.22) dir = (dir + (Math.random() < 0.5 ? 1 : 7)) % 8
      const nc = c + DIRS[dir].x
      const nl = l + DIRS[dir].y
      if (!livre(nc, nl)) break
      c = nc
      l = nl
      ocupado[l * cols + c] = 1
      celulas.push({ x: c, y: l })
    }
    if (celulas.length < 3) continue

    // Só guarda os vértices onde a direção muda
    const pts: Ponto[] = [celulas[0]]
    for (let i = 1; i < celulas.length - 1; i++) {
      const a = celulas[i - 1], b = celulas[i], d = celulas[i + 1]
      if (b.x - a.x !== d.x - b.x || b.y - a.y !== d.y - b.y) pts.push(b)
    }
    pts.push(celulas[celulas.length - 1])
    const px = pts.map((p) => ({ x: p.x * CELULA, y: p.y * CELULA }))
    const acum = [0]
    for (let i = 1; i < px.length; i++) acum.push(acum[i - 1] + Math.hypot(px[i].x - px[i - 1].x, px[i].y - px[i - 1].y))
    trilhas.push({ pts: px, comp: acum[acum.length - 1], acum })
  }
  return trilhas
}

function desenharTrilhas(ctx: CanvasRenderingContext2D, trilhas: Trilha[], cor: string, fundo: string, largura: number) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = cor
  ctx.lineWidth = largura
  for (const t of trilhas) {
    ctx.beginPath()
    ctx.moveTo(t.pts[0].x, t.pts[0].y)
    for (const p of t.pts.slice(1)) ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }
  // Pads nas pontas: anel com furo
  for (const t of trilhas) {
    for (const p of [t.pts[0], t.pts[t.pts.length - 1]]) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2)
      ctx.fillStyle = fundo
      ctx.fill()
      ctx.lineWidth = largura * 0.9
      ctx.stroke()
    }
  }
}

function pontoEm(t: Trilha, d: number): Ponto {
  let i = 1
  while (i < t.acum.length - 1 && t.acum[i] < d) i++
  const a = t.pts[i - 1], b = t.pts[i]
  const seg = t.acum[i] - t.acum[i - 1] || 1
  const k = Math.min(1, Math.max(0, (d - t.acum[i - 1]) / seg))
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
}

export function FundoCircuito() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const apagado = document.createElement('canvas')
    const aceso = document.createElement('canvas')
    const lente = document.createElement('canvas')
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = 0, h = 0
    let trilhas: Trilha[] = []
    let pulsos: Pulso[] = []
    let cores = lerCores()
    const sonda = { x: -9999, y: -9999, ativa: false }
    let raf = 0
    let ultimaInjecao = 0

    const montar = () => {
      w = window.innerWidth
      h = window.innerHeight
      for (const c of [canvas, apagado, aceso]) {
        c.width = w * dpr
        c.height = h * dpr
      }
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      lente.width = lente.height = RAIO_SONDA * 2 * dpr
      trilhas = gerarTrilhas(w, h)
      pulsos = []
      pintarBase()
    }

    const pintarBase = () => {
      cores = lerCores()
      const a = apagado.getContext('2d')!
      a.setTransform(dpr, 0, 0, dpr, 0, 0)
      a.clearRect(0, 0, w, h)
      desenharTrilhas(a, trilhas, cores.traco, cores.fundo, 1.5)
      const b = aceso.getContext('2d')!
      b.setTransform(dpr, 0, 0, dpr, 0, 0)
      b.clearRect(0, 0, w, h)
      desenharTrilhas(b, trilhas, cores.cobre, cores.fundo, 1.6)
      if (reduzido) desenharQuadro(0)
    }

    const novoPulso = (t?: Trilha) => {
      const tr = t ?? trilhas[Math.floor(Math.random() * trilhas.length)]
      if (!tr) return
      pulsos.push({ t: tr, d: 0, vel: 60 + Math.random() * 110, cauda: 26 + Math.random() * 30 })
    }

    const injetarPertoDaSonda = () => {
      const r2 = 60 * 60
      const perto = trilhas.filter((t) => t.pts.some((p) => (p.x - sonda.x) ** 2 + (p.y - sonda.y) ** 2 < r2))
      for (const t of perto.slice(0, 3)) novoPulso(t)
    }

    let anterior = performance.now()
    const desenharQuadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - anterior) / 1000)
      anterior = agora
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(apagado, 0, 0)

      // Trilhas acesas em volta do cursor, com borda suave
      if (sonda.ativa) {
        const lc = lente.getContext('2d')!
        const R = RAIO_SONDA * dpr
        lc.globalCompositeOperation = 'source-over'
        lc.clearRect(0, 0, lente.width, lente.height)
        lc.drawImage(aceso, sonda.x * dpr - R, sonda.y * dpr - R, R * 2, R * 2, 0, 0, R * 2, R * 2)
        lc.globalCompositeOperation = 'destination-in'
        const g = lc.createRadialGradient(R, R, 0, R, R, R)
        g.addColorStop(0, 'rgba(0,0,0,.9)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        lc.fillStyle = g
        lc.fillRect(0, 0, R * 2, R * 2)
        ctx.drawImage(lente, sonda.x * dpr - R, sonda.y * dpr - R)
      }

      if (!reduzido) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.lineCap = 'round'
        for (const p of pulsos) {
          p.d += p.vel * dt
          const cabeca = pontoEm(p.t, p.d)
          const rabo = pontoEm(p.t, Math.max(0, p.d - p.cauda))
          const g = ctx.createLinearGradient(rabo.x, rabo.y, cabeca.x, cabeca.y)
          g.addColorStop(0, 'transparent')
          g.addColorStop(1, cores.cobreClaro)
          ctx.strokeStyle = g
          ctx.lineWidth = 2
          ctx.beginPath()
          // cauda seguindo as curvas da trilha
          const passos = 6
          for (let i = 0; i <= passos; i++) {
            const q = pontoEm(p.t, Math.max(0, p.d - p.cauda + (p.cauda * i) / passos))
            if (i === 0) ctx.moveTo(q.x, q.y)
            else ctx.lineTo(q.x, q.y)
          }
          ctx.stroke()
          ctx.fillStyle = cores.cobreClaro
          ctx.beginPath()
          ctx.arc(cabeca.x, cabeca.y, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
        pulsos = pulsos.filter((p) => p.d - p.cauda < p.t.comp)
        const alvo = Math.max(6, Math.floor((w * h) / 90000))
        if (pulsos.length < alvo && Math.random() < 0.08) novoPulso()
        if (sonda.ativa && agora - ultimaInjecao > 220) {
          ultimaInjecao = agora
          injetarPertoDaSonda()
        }
      }
    }

    const laco = (agora: number) => {
      desenharQuadro(agora)
      raf = requestAnimationFrame(laco)
    }

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      sonda.x = e.clientX
      sonda.y = e.clientY
      sonda.ativa = true
      if (reduzido) desenharQuadro(performance.now())
    }
    const aoSair = () => {
      sonda.ativa = false
      if (reduzido) desenharQuadro(performance.now())
    }
    const aoVisibilidade = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduzido) {
        anterior = performance.now()
        raf = requestAnimationFrame(laco)
      }
    }

    let espera: number | undefined
    const aoRedimensionar = () => {
      // No celular a barra de endereço some e volta ao rolar; isso não deve
      // redesenhar a placa inteira
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 160) return
      clearTimeout(espera)
      espera = window.setTimeout(montar, 150)
    }

    // Tema mudou (classe .claro no <html>): repinta com as cores novas
    const observador = new MutationObserver(pintarBase)
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    montar()
    if (!reduzido) raf = requestAnimationFrame(laco)
    window.addEventListener('pointermove', aoMover, { passive: true })
    document.addEventListener('pointerleave', aoSair)
    document.addEventListener('visibilitychange', aoVisibilidade)
    window.addEventListener('resize', aoRedimensionar)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(espera)
      observador.disconnect()
      window.removeEventListener('pointermove', aoMover)
      document.removeEventListener('pointerleave', aoSair)
      document.removeEventListener('visibilitychange', aoVisibilidade)
      window.removeEventListener('resize', aoRedimensionar)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
}
