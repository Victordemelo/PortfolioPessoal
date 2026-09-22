import { Navegacao } from './components/Navegacao'
import { Hero } from './components/Hero'
import { Sobre } from './components/Sobre'
import { Projetos } from './components/Projetos'
import { Trajetoria } from './components/Trajetoria'
import { Stack } from './components/Stack'
import { Contato } from './components/Contato'
import { Rodape } from './components/Rodape'

export default function App() {
  return (
    <>
      <Navegacao />
      <main>
        <Hero />
        <Sobre />
        <Projetos />
        <Trajetoria />
        <Stack />
        <Contato />
      </main>
      <Rodape />
    </>
  )
}
