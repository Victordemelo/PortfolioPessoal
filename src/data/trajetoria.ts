// TODO(Victor): conferir com o LinkedIn. Cargos e períodos abaixo foram
// deduzidos dos projetos; preencha `periodo` e ajuste o texto. Item com
// `periodo` vazio aparece sem data.

export type Etapa = {
  tipo: 'trabalho' | 'formacao'
  titulo: string
  lugar: string
  periodo?: string
  descricao: string
  tags?: string[]
}

export const trajetoria: Etapa[] = [
  {
    tipo: 'trabalho',
    titulo: 'Desenvolvedor Full Stack',
    lugar: 'JW Soluções Digitais',
    periodo: '',
    descricao:
      'Desenvolvimento de sistemas web para clientes e para a operação da empresa, como ERP de frota e gestão de documentos fiscais. Da modelagem do banco ao deploy.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Docker', 'Integrações'],
  },
  {
    tipo: 'formacao',
    titulo: 'Engenharia da Computação',
    lugar: 'Unisul · Florianópolis',
    periodo: '',
    descricao:
      'Graduação em andamento. Projetos em sistemas digitais, programação orientada a objetos e análise de dados.',
    tags: ['Arduino', 'Java', 'Python', 'Sistemas Digitais'],
  },
]
