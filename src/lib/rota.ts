import { useEffect, useState } from 'react'

// Roteamento mínimo por hash: #/projetos, #/projetos/stabilmoney, #/eu ...
// Hash em vez de History API porque o site é estático e o link funciona
// em qualquer servidor, sem configuração de rewrite.

export type Rota = { painel: string | null; item: string | null }

function ler(): Rota {
  const [painel = null, item = null] = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  return { painel, item }
}

export function useRota() {
  const [rota, setRota] = useState(ler)
  useEffect(() => {
    const aoMudar = () => setRota(ler())
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return rota
}

export function ir(caminho: string) {
  window.location.hash = caminho ? `/${caminho}` : '/'
}
