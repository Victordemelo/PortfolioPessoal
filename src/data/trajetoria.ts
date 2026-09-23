// Experiência, formação e certificados, conforme o LinkedIn
// (linkedin.com/in/victor-de-melo-da-rosa). Mais recente primeiro.

export type Etapa = {
  tipo: 'trabalho' | 'formacao'
  titulo: string
  lugar: string
  periodo: string
  detalhe?: string
  descricao: string
  tags?: string[]
}

export const trajetoria: Etapa[] = [
  {
    tipo: 'trabalho',
    titulo: 'Desenvolvedor de Software Júnior',
    lugar: 'JW Soluções Digitais',
    periodo: 'jan 2026 → atual',
    detalhe: 'Tempo integral · Palhoça, SC · híbrido',
    descricao:
      'Desenvolvimento web e suporte técnico, participando de todo o ciclo de vida das aplicações da empresa: da modelagem do banco e das APIs ao deploy, com integrações e correção de bugs críticos.',
    tags: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Integrações e APIs', 'Docker'],
  },
  {
    tipo: 'trabalho',
    titulo: 'Analista de Suporte Técnico',
    lugar: 'Parkseg Academy',
    periodo: 'out 2025 → jan 2026',
    detalhe: 'Meio período · Palhoça, SC',
    descricao:
      'Suporte técnico especializado em sistemas de segurança eletrônica: CFTV (NCFTV), controle de acesso, catracas e centrais de alarme.',
    tags: ['CFTV', 'Controle de acesso', 'Redes', 'Suporte'],
  },
  {
    tipo: 'formacao',
    titulo: 'Engenharia da Computação',
    lugar: 'Unisul · Universidade do Sul de Santa Catarina',
    periodo: 'jan 2022 → dez 2026',
    detalhe: 'Bacharelado',
    descricao:
      'Projetos em sistemas digitais, programação orientada a objetos e análise de dados, incluindo o estacionamento inteligente com Arduino.',
    tags: ['Arduino', 'Java', 'Python', 'Sistemas Digitais'],
  },
]

/** Experiências anteriores, fora da área de tecnologia */
export const anteriores = [
  { titulo: 'Apoio administrativo I', lugar: 'Grupo Orbenk', periodo: 'dez 2023 → out 2025' },
  { titulo: 'Recepcionista', lugar: 'Elmo · Empresa Litorânea de Mão de Obra', periodo: 'jan 2022 → dez 2023' },
  { titulo: 'Auxiliar administrativo (estágio)', lugar: 'Unimed Grande Florianópolis', periodo: '' },
]

export const certificados = [
  { nome: 'Versionamento de Código com Git e GitHub', emissor: 'DIO', data: 'jun 2025' },
  { nome: 'Network Defense', emissor: 'Cisco Networking Academy' },
  { nome: 'Oficina Arduino', emissor: 'Unisul' },
  { nome: 'Scratch: programação visual e IoT', emissor: 'Unisul' },
  { nome: 'Análise de Dados e Programação em Python', emissor: 'Unisul' },
  { nome: 'Linguagem de Programação Python', emissor: 'Fundação Bradesco' },
  { nome: 'Java Foundations (JFo)', emissor: 'Oracle Academy' },
  { nome: 'Java Fundamentals (JF)', emissor: 'Oracle Academy' },
]

export const idiomas = [
  { nome: 'Português', nivel: 'nativo' },
  { nome: 'Inglês', nivel: 'básico' },
]
