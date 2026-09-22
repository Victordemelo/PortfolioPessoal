export type Categoria = 'profissional' | 'pessoal' | 'academico'

/** Mês no formato AAAA-MM */
type Mes = `${number}-${string}`

export type Projeto = {
  id: string
  nome: string
  resumo: string
  destaques: string[]
  stack: string[]
  categoria: Categoria
  /** Período de execução. `fim: 'atual'` = em andamento; sem `fim` = um mês só */
  inicio: Mes
  fim?: Mes | 'atual'
  /** Site em produção */
  noAr?: string
  /** Repositório público */
  repo?: string
  /** Link extra (simulação, demo, vídeo) */
  extra?: { rotulo: string; url: string }
  imagem?: string
  /** Contexto curto: empresa, disciplina, equipe */
  contexto?: string
  /** Aparece com selo de hardware */
  hardware?: boolean
}

export const grupos: { id: Categoria; titulo: string; descricao: string }[] = [
  {
    id: 'profissional',
    titulo: 'Profissional',
    descricao: 'Sistemas que desenvolvi no trabalho. O código é privado, então descrevo o que cada um faz.',
  },
  {
    id: 'pessoal',
    titulo: 'Pessoal',
    descricao: 'Projetos meus, feitos para resolver problemas que eu mesmo tinha.',
  },
  {
    id: 'academico',
    titulo: 'Acadêmico',
    descricao: 'Trabalhos da graduação em Engenharia da Computação na Unisul.',
  },
]

const GH = 'https://github.com/Victordemelo'

export const projetos: Projeto[] = [
  // ─── Profissional ───────────────────────────────────────────
  {
    id: 'megatruck',
    nome: 'MegaTruck',
    contexto: 'ERP de frota',
    categoria: 'profissional',
    inicio: '2026-03',
    fim: '2026-09',
    resumo:
      'ERP de gestão de frota. Cada cliente roda numa instância própria (um subdomínio, uma pasta e um banco), com instalação e atualização padronizadas em VPS.',
    destaques: [
      'Arquitetura multi-instância, isolando os dados de cada cliente',
      'Geração de PDF e relatórios',
      'Processo de deploy documentado passo a passo, em VPS com cPanel',
      'Mais de 600 commits ao longo do projeto',
    ],
    stack: ['Laravel 12', 'PHP 8.3', 'MySQL', 'Node'],
  },
  {
    id: 'portal-contador',
    nome: 'Portal do Contador',
    contexto: 'Documentos fiscais',
    categoria: 'profissional',
    inicio: '2026-06',
    fim: '2026-08',
    resumo:
      'Gestão de documentos fiscais (NF-e, NFC-e, NFS-e, CT-e, MDF-e). Um agente desktop lê os XMLs na máquina do cliente e envia para o portal, onde o contador consulta tudo num lugar só.',
    destaques: [
      'Agente Windows que sincroniza os XMLs a cada 30 segundos',
      'API autenticada por token para recebimento dos documentos',
      'Portal web para o escritório de contabilidade',
    ],
    stack: ['Laravel 11', 'PHP', 'Agente Windows', 'XML fiscal'],
  },

  // ─── Pessoal ────────────────────────────────────────────────
  {
    id: 'remote-wake',
    nome: 'Remote Wake',
    contexto: 'Open source',
    categoria: 'pessoal',
    inicio: '2026-09',
    fim: 'atual',
    repo: `${GH}/wake-on-lan`,
    resumo:
      'Plataforma self-hosted para ligar computadores remotamente por Wake-on-LAN, dentro e fora de casa, com PWA instalável e API autenticada.',
    destaques: [
      'Multiusuário: cada conta cadastra as próprias máquinas',
      'Wake-on-LAN na rede local e Wake-on-WAN por IP público ou DDNS',
      'Roadmap com gateway Tailscale (para CGNAT) e agente para desligar e reiniciar',
      'Sobe inteiro com Docker Compose',
    ],
    stack: ['ASP.NET Core 10', 'C#', 'React', 'TypeScript', 'PostgreSQL', 'JWT', 'Docker'],
  },
  {
    id: 'fluxo-agentes',
    nome: 'Fluxo de Agentes',
    contexto: 'Ferramenta de IA',
    categoria: 'pessoal',
    inicio: '2026-09',
    resumo:
      'Uma pasta que se coloca em qualquer projeto para rodar um time de IAs pelo terminal: o arquiteto planeja, você aprova, o executor implementa, checks sem IA validam e um revisor diferente dá o veredito.',
    destaques: [
      'Fallback automático entre Claude, Codex, Copilot e outros quando um bate limite',
      'Modelo forte planeja e modelo barato executa, para economizar cota',
      'O revisor usa uma IA diferente da que escreveu o código',
      'Funciona no Windows e no macOS',
    ],
    stack: ['Node.js', 'CLI', 'Claude', 'Codex', 'Automação'],
  },
  {
    id: 'stabilmoney',
    nome: 'StabilMoney',
    contexto: 'Finanças pessoais',
    categoria: 'pessoal',
    inicio: '2026-03',
    fim: 'atual',
    repo: `${GH}/StabilMoney`,
    resumo:
      'App de finanças para a família toda: receitas, despesas, cartões, contas fixas, metas e investimentos. Separa o dinheiro que está na conta do que já está comprometido, e não deixa gastar o que não existe.',
    destaques: [
      'Saldo em "bolsos": bruto, reservado, disponível e cheque especial',
      'Conta-família com dependentes que têm login próprio',
      'PWA instalável com lançamento offline (fila + Background Sync)',
      '700 testes e 2.744 asserções, rodando no CI a cada push',
      'Senhas em argon2id, backup e restore com rotação',
    ],
    stack: ['Laravel 12', 'PHP 8.4', 'MySQL', 'Tailwind 4', 'PWA', 'Docker'],
  },

  // ─── Acadêmico ──────────────────────────────────────────────
  {
    id: 'bigdata',
    nome: 'BigData Analytics',
    contexto: 'Unisul',
    categoria: 'academico',
    inicio: '2026-03',
    repo: `${GH}/dataAnalysisProjects`,
    resumo:
      'Dashboard para acompanhar engajamento e desempenho de alunos, com métricas consolidadas, gráficos interativos e relatórios que abrem sem recarregar a página.',
    destaques: [
      'Tratamento dos dados em CSV com Pandas e NumPy',
      'Quatro gráficos interativos com Plotly Express',
      'Relatórios via API JSON interna, exibidos em modal',
      'Ambiente em Docker',
    ],
    stack: ['Python', 'Django', 'Pandas', 'Plotly', 'Docker'],
  },
  {
    id: 'arduino',
    nome: 'Estacionamento Inteligente',
    contexto: 'Sistemas Digitais · Unisul',
    categoria: 'academico',
    hardware: true,
    inicio: '2025-05',
    fim: '2025-09',
    repo: `${GH}/Estacionamento_Inteligente_Arduino`,
    extra: {
      rotulo: 'Simulação no Tinkercad',
      url: 'https://www.tinkercad.com/things/69O015dd28H-surprising-amberis-blorr?sharecode=FMlOkKQXUy5yqs9k447a0y-v5OLxYr4jNJa3ugkWFQk',
    },
    imagem:
      'https://raw.githubusercontent.com/Victordemelo/Estacionamento_Inteligente_Arduino/main/scr/main/arduino/fotos/Apresentacao_Unisul/foto_gp.jpeg',
    resumo:
      'Maquete de estacionamento automatizado com dois Arduino UNO: sensores detectam os carros, LEDs mostram as vagas livres e servomotores abrem a cancela.',
    destaques: [
      'Sensores ultrassônicos HC-SR04 e de obstáculo para detectar veículos',
      'Cancela com servomotor controlado por PWM',
      'LEDs RGB indicando vagas livres e ocupadas em tempo real',
      'Fonte própria convertendo 220 V AC para 13,2 V DC',
      'Em equipe com Davi Jordani Ramos, Isaque Fabro e Pedro Brunhara',
    ],
    stack: ['Arduino UNO', 'C++', 'HC-SR04', 'Servomotor', 'PWM', 'Eletrônica'],
  },
  {
    id: 'emprestimo-a3',
    nome: 'Gerenciador de Empréstimos',
    contexto: 'Avaliação A3 · Unisul',
    categoria: 'academico',
    inicio: '2024-11',
    repo: `${GH}/gerenciador_emprestimo_A3`,
    resumo:
      'Aplicação desktop para controlar empréstimos de ferramentas entre amigos: cadastros, empréstimos, devoluções e relatórios.',
    destaques: [
      'CRUD de amigos e ferramentas',
      'Relatórios de quem não devolveu, de quem mais pegou emprestado e do valor total',
      'Levantamento de requisitos funcionais e não funcionais',
    ],
    stack: ['Java', 'MySQL', 'POO'],
  },
]

/** Mais recente primeiro: em andamento, depois pela data de fim e de início */
function chave(p: Projeto) {
  const fim = p.fim === 'atual' ? '9999-99' : (p.fim ?? p.inicio)
  return `${fim}|${p.inicio}`
}

export function projetosDoGrupo(g: Categoria) {
  return projetos.filter((p) => p.categoria === g).sort((a, b) => chave(b).localeCompare(chave(a)))
}

export const projetosOrdenados = grupos.flatMap((g) => projetosDoGrupo(g.id))
