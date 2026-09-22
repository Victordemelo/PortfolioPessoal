import {
  siArduino,
  siCplusplus,
  siDjango,
  siDocker,
  siDotnet,
  siGit,
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

// A stack aparece como a pinagem de um CI de 18 pinos: 16 tecnologias + VCC e GND.
// A ordem aqui é a ordem dos pinos (1 → 8 descendo à esquerda, 10 → 17 subindo à direita).
// Ícone = caminho SVG do simple-icons, desenhado em currentColor.
// `chave` é o trecho procurado na stack dos projetos para contar onde foi usada.
export type Tecnologia = { nome: string; papel: string; chave: string; icone: { path: string } }

export const stack: Tecnologia[] = [
  { nome: 'PHP', papel: 'backend', chave: 'php', icone: siPhp },
  { nome: 'Laravel', papel: 'backend', chave: 'laravel', icone: siLaravel },
  { nome: 'C# / .NET', papel: 'backend', chave: 'c#', icone: siDotnet },
  { nome: 'Python', papel: 'backend · dados', chave: 'python', icone: siPython },
  { nome: 'Django', papel: 'backend', chave: 'django', icone: siDjango },
  { nome: 'Node.js', papel: 'backend · CLI', chave: 'node', icone: siNodedotjs },
  { nome: 'React', papel: 'frontend', chave: 'react', icone: siReact },
  { nome: 'TypeScript', papel: 'frontend', chave: 'typescript', icone: siTypescript },
  { nome: 'Tailwind', papel: 'frontend', chave: 'tailwind', icone: siTailwindcss },
  { nome: 'MySQL', papel: 'banco de dados', chave: 'mysql', icone: siMysql },
  { nome: 'PostgreSQL', papel: 'banco de dados', chave: 'postgres', icone: siPostgresql },
  { nome: 'Docker', papel: 'infraestrutura', chave: 'docker', icone: siDocker },
  { nome: 'Linux', papel: 'infraestrutura', chave: 'linux', icone: siLinux },
  { nome: 'Git', papel: 'versionamento', chave: 'git', icone: siGit },
  { nome: 'Arduino', papel: 'hardware', chave: 'arduino', icone: siArduino },
  { nome: 'C++', papel: 'hardware · firmware', chave: 'c++', icone: siCplusplus },
]
