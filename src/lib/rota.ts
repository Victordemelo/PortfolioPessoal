import { useEffect, useState } from 'react'

// Roteamento por caminho de verdade, para cada projeto ter uma URL indexável:
//   /                      início (seções por âncora: /#projetos, /#contato...)
//   /projetos/<id>         página do projeto
// O build gera um index.html pronto para cada /projetos/<id> (ver seo.ts), e o
// Caddy cai no index.html para qualquer outro caminho.
// Links internos são <a href="/..."> comuns; o clique é interceptado aqui para
// trocar de página sem recarregar.

export type Rota = { painel: string | null; item: string | null }

const EVENTO = 'rota'

function ler(): Rota {
  const m = window.location.pathname.match(/^\/projetos\/([\w-]+)\/?$/)
  return m ? { painel: 'projetos', item: m[1] } : { painel: null, item: null }
}

/** Links antigos com hash (#/projetos/x, #/contato) viram o formato novo */
function migrarHashAntigo() {
  const h = window.location.hash
  if (!h.startsWith('#/')) return
  const [painel, item] = h.slice(2).split('/')
  const novo = painel === 'projetos' && item ? `/projetos/${item}` : `/${painel ? `#${painel}` : ''}`
  history.replaceState(null, '', novo)
}

export function ir(caminho: string) {
  const url = new URL(caminho, window.location.href)
  const mesmaPagina = url.pathname === window.location.pathname
  history.pushState(null, '', url.pathname + url.hash)
  window.dispatchEvent(new Event(EVENTO))
  if (mesmaPagina && url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView()
}

export function useRota() {
  const [rota, setRota] = useState(() => {
    migrarHashAntigo()
    return ler()
  })

  useEffect(() => {
    const atualizar = () => setRota(ler())

    // Intercepta cliques em links internos (sem Ctrl/Cmd, sem target=_blank)
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest('a')
      const href = a?.getAttribute('href')
      if (!a || !href || !href.startsWith('/') || a.target === '_blank' || a.hasAttribute('download')) return
      e.preventDefault()
      ir(href)
    }

    window.addEventListener('popstate', atualizar)
    window.addEventListener(EVENTO, atualizar)
    document.addEventListener('click', aoClicar)
    return () => {
      window.removeEventListener('popstate', atualizar)
      window.removeEventListener(EVENTO, atualizar)
      document.removeEventListener('click', aoClicar)
    }
  }, [])

  return rota
}
