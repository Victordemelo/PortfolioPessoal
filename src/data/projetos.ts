export type Categoria = 'profissional' | 'pessoal' | 'academico' | 'hardware'

export type Projeto = {
  id: string
  nome: string
  resumo: string
  destaques: string[]
  stack: string[]
  categoria: Categoria
  /** Aparece no topo, com card maior */
  destaque?: boolean
  /** Site em produção */
  noAr?: string
  /** Repositório público */
  repo?: string
  /** Link extra (simulação, demo, vídeo) */
  extra?: { rotulo: string; url: string }
  imagem?: string
  /** Contexto curto: empresa, disciplina, equipe */
  contexto?: string
}

export const categorias: { id: Categoria | 'todos'; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'profissional', rotulo: 'Profissional' },
  { id: 'pessoal', rotulo: 'Pessoal' },
  { id: 'academico', rotulo: 'Acadêmico' },
  { id: 'hardware', rotulo: 'Hardware' },
]

const GH = 'https://github.com/Victordemelo'

export const projetos: Projeto[] = [
  {
    id: 'painel-shield',
    nome: 'Painel Shield',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    destaque: true,
    resumo:
      'Painel de licenciamento e cobrança para um ERP desktop. O ERP instalado na loja pede uma licença assinada ao painel, que decide quem trabalha, quantas máquinas cabem no contrato e quanto o cliente deve.',
    destaques: [
      'Licenças assinadas com RSA-SHA256, com cota de terminais, módulos e bloqueio',
      'Régua de cobrança com multa, juros e suspensão automática',
      'Integração com Asaas, Mercado Pago, PagBank, Pagar.me, Efí, Inter, C6, Cora e outros',
      'Monitoramento dos terminais e leitura remota de logs do ERP',
      'Área do cliente com faturas e PIX, e atualização do sistema pela própria tela',
    ],
    stack: ['PHP', 'MariaDB', 'Apache', 'RSA', 'APIs de pagamento'],
  },
  {
    id: 'lojadev-central',
    nome: 'LojaDev Central',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    destaque: true,
    noAr: 'https://painel.lojadev.com.br',
    extra: { rotulo: 'Painel da revenda', url: 'https://revenda.lojadev.com.br' },
    resumo:
      'Sistema unificado da empresa: painel da equipe, painel das revendas e API de licenças, servidos pelo mesmo app Laravel em vários subdomínios.',
    destaques: [
      'Roteamento por domínio: cada área em seu subdomínio, uma só base de código',
      'Modelo de revenda pré-paga com carteira, débito diário e carência automática',
      'Licença por terminal, identificado por fingerprint SHA-256',
      'Suíte com centenas de testes automatizados',
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Docker', 'Pix'],
  },
  {
    id: 'stabilmoney',
    nome: 'StabilMoney',
    categoria: 'pessoal',
    destaque: true,
    repo: `${GH}/StabilMoney`,
    resumo:
      'App de finanças pessoais para a família toda: receitas, despesas, cartões, contas fixas, metas e investimentos. Separa o dinheiro que está na conta do que já está comprometido, e não deixa gastar o que não existe.',
    destaques: [
      'Modelo de saldo em "bolsos": bruto, reservado, disponível e cheque especial',
      'Conta-família com dependentes que têm login próprio',
      'PWA instalável com lançamento offline (fila + Background Sync)',
      '700 testes e 2.744 asserções, rodando no CI a cada push',
      'Senhas em argon2id, backup e restore com rotação',
    ],
    stack: ['Laravel 12', 'PHP 8.4', 'MySQL', 'Tailwind 4', 'PWA', 'Docker'],
  },
  {
    id: 'remote-wake',
    nome: 'Remote Wake',
    categoria: 'pessoal',
    destaque: true,
    repo: `${GH}/wake-on-lan`,
    resumo:
      'Plataforma open source e self-hosted para ligar computadores remotamente por Wake-on-LAN, dentro e fora de casa, com PWA instalável e API autenticada.',
    destaques: [
      'Multiusuário: cada conta cadastra as próprias máquinas',
      'Wake-on-LAN na rede local e Wake-on-WAN por IP público ou DDNS',
      'Roadmap com gateway Tailscale (para CGNAT) e agente para desligar e reiniciar',
      'Sobe inteiro com Docker Compose',
    ],
    stack: ['ASP.NET Core 10', 'C#', 'React', 'TypeScript', 'PostgreSQL', 'JWT', 'Docker'],
  },
  {
    id: 'lojadev-site',
    nome: 'Site LojaDev',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    noAr: 'https://lojadev.com.br',
    resumo:
      'Site institucional da LojaDev, com SEO básico (sitemap, robots) e widget de suporte.',
    destaques: ['Página estática e rápida', 'Sitemap e robots para indexação', 'Widget de suporte integrado'],
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'membros-jw',
    nome: 'Área de Membros',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    noAr: 'https://membros.lojadev.com.br',
    resumo:
      'Sistema de membros e assinaturas da JW Soluções Digitais: cadastro, assinatura recorrente e controle de acesso ao conteúdo.',
    destaques: ['Assinaturas com vencimento e renovação', 'Validação de dados do cliente', 'Deploy versionado por git'],
    stack: ['PHP', 'MySQL', 'JavaScript'],
  },
  {
    id: 'portal-contador',
    nome: 'Portal do Contador',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    resumo:
      'Gestão de documentos fiscais (NF-e, NFC-e, NFS-e, CT-e, MDF-e). Um agente desktop lê os XMLs na máquina do cliente e envia para o portal, onde o contador consulta tudo num lugar só.',
    destaques: [
      'Agente Windows que sincroniza os XMLs a cada 30 segundos',
      'API autenticada por token para recebimento dos documentos',
      'Portal web para o escritório de contabilidade',
    ],
    stack: ['Laravel 11', 'PHP', 'Agente Windows', 'XML fiscal'],
  },
  {
    id: 'megatruck',
    nome: 'MegaTruck',
    contexto: 'JW Soluções Digitais',
    categoria: 'profissional',
    resumo:
      'ERP de gestão de frota. Cada cliente roda numa instância própria (um subdomínio, uma pasta e um banco), com instalação e atualização padronizadas em VPS.',
    destaques: [
      'Arquitetura multi-instância, isolando os dados de cada cliente',
      'Geração de PDF e relatórios',
      'Passo a passo de deploy em VPS com cPanel, sem Docker no servidor',
    ],
    stack: ['Laravel 12', 'PHP 8.3', 'MySQL', 'Node'],
  },
  {
    id: 'fluxo-agentes',
    nome: 'Fluxo de Agentes',
    categoria: 'pessoal',
    resumo:
      'Uma pasta que se coloca em qualquer projeto para rodar um time de IAs pelo terminal: arquiteto planeja, você aprova, executor implementa, checks sem IA validam e um revisor diferente dá o veredito.',
    destaques: [
      'Fallback automático entre Claude, Codex, Copilot e outros quando um bate limite',
      'Modelo forte planeja e modelo barato executa, para economizar cota',
      'Revisor usa IA diferente da que escreveu o código',
      'Funciona no Windows e no macOS',
    ],
    stack: ['Node.js', 'CLI', 'Claude', 'Codex', 'Automação'],
  },
  {
    id: 'arduino',
    nome: 'Estacionamento Inteligente',
    contexto: 'Sistemas Digitais · Unisul',
    categoria: 'hardware',
    destaque: true,
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
      'Projeto em equipe com Davi Jordani Ramos, Isaque Fabro e Pedro Brunhara',
    ],
    stack: ['Arduino UNO', 'C++', 'HC-SR04', 'Servomotor', 'PWM', 'Eletrônica'],
  },
  {
    id: 'bigdata',
    nome: 'BigData Analytics Dashboard',
    contexto: 'Unisul',
    categoria: 'academico',
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
    id: 'emprestimo-a3',
    nome: 'Gerenciador de Empréstimos',
    contexto: 'Avaliação A3 · Unisul',
    categoria: 'academico',
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
