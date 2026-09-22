import {
  siArduino,
  siCplusplus,
  siDjango,
  siDocker,
  siDotnet,
  siLaravel,
  siLinux,
  siMysql,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'

// Ícone = caminho SVG do simple-icons (desenhado em currentColor, fica
// monocromático e acompanha o tema). Para trocar/adicionar, importe outro `si*`.
export type Tecnologia = { nome: string; papel: string; icone: { path: string } }

export const stack: Tecnologia[] = [
  { nome: 'PHP', papel: 'backend', icone: siPhp },
  { nome: 'Laravel', papel: 'backend', icone: siLaravel },
  { nome: 'C# / .NET', papel: 'backend', icone: siDotnet },
  { nome: 'Python', papel: 'backend · dados', icone: siPython },
  { nome: 'Django', papel: 'backend', icone: siDjango },
  { nome: 'Node.js', papel: 'backend · CLI', icone: siNodedotjs },
  { nome: 'React', papel: 'frontend', icone: siReact },
  { nome: 'TypeScript', papel: 'frontend', icone: siTypescript },
  { nome: 'Tailwind CSS', papel: 'frontend', icone: siTailwindcss },
  { nome: 'MySQL', papel: 'banco', icone: siMysql },
  { nome: 'PostgreSQL', papel: 'banco', icone: siPostgresql },
  { nome: 'Docker', papel: 'infra', icone: siDocker },
  { nome: 'Linux', papel: 'infra', icone: siLinux },
  { nome: 'Arduino', papel: 'hardware', icone: siArduino },
  { nome: 'C++', papel: 'hardware', icone: siCplusplus },
]
