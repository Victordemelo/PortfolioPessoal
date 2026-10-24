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
  /** Último commit (AAAA-MM-DD). Para repositório público a data vem ao vivo do GitHub; esta é a reserva */
  ultimaAtividade?: string
  /** Site em produção */
  noAr?: string
  /** Repositório público */
  repo?: string
  /** Link extra (simulação, demo, vídeo) */
  extra?: { rotulo: string; url: string }
  imagem?: string
  /** Versão menor da imagem, para a miniatura da lista */
  imagemPequena?: string
  /** Contexto curto: empresa, disciplina, equipe */
  contexto?: string
  /** Aparece com selo de hardware */
  hardware?: boolean
  /** Título e descrição da página para buscadores (únicos por projeto) */
  seo: { titulo: string; descricao: string }
  /** Texto da página do projeto, em seções (cada uma vira um item do índice) */
  texto: Secao[]
}

export type Secao = { id: string; titulo: string; paragrafos: string[] }

const todosGrupos: { id: Categoria; titulo: string; descricao: string }[] = [
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
  // ─── Pessoal ────────────────────────────────────────────────
  {
    id: 'remote-wake',
    nome: 'Remote Wake',
    contexto: 'Open source',
    categoria: 'pessoal',
    inicio: '2026-09',
    fim: 'atual',
    ultimaAtividade: '2026-09-22',
    repo: `${GH}/wake-on-lan`,
    resumo:
      'Plataforma self-hosted para ligar computadores remotamente por Wake-on-LAN, dentro e fora de casa, com PWA instalável e API autenticada.',
    destaques: [
      'Multiusuário: cada conta cadastra as próprias máquinas',
      'Wake-on-LAN na rede local, Wake-on-WAN por IP público ou DDNS e gateway residencial (LAN ou Tailscale, para CGNAT)',
      'Agente Windows/Linux para desligar, reiniciar, suspender e hibernar',
      'Sessões no servidor, verificação em duas etapas e histórico de auditoria',
      'Sobe inteiro com Docker Compose; testes de API, navegador e integração no CI',
    ],
    stack: ['ASP.NET Core 10', 'C#', 'EF Core', 'PostgreSQL', 'React', 'TypeScript', 'Docker', 'Playwright'],
    seo: {
      titulo: 'Remote Wake: ligar o PC a distância com Wake-on-LAN',
      descricao:
        'Remote Wake: plataforma open source e self-hosted para ligar, desligar e reiniciar computadores de qualquer lugar, com Wake-on-LAN, gateway, agente e PWA em ASP.NET Core e React.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O Remote Wake é uma plataforma open source e self-hosted para ligar, desligar, reiniciar, suspender e hibernar computadores remotamente. Junta Wake-on-LAN, um painel web instalável como PWA, uma API autenticada e dois componentes que rodam perto das máquinas (um gateway e um agente), para funcionar tanto dentro de casa quanto fora dela.',
          'Cada pessoa tem a própria conta e cadastra as próprias máquinas. A instalação é feita por quem vai usar, com Docker, num PC, NAS, Raspberry Pi ou servidor, sem depender de serviço de terceiros.',
        ],
      },
      {
        id: 'problema',
        titulo: 'O problema',
        paragrafos: [
          'Os aplicativos tradicionais de Wake-on-LAN costumam fazer uma coisa só: mandar o Magic Packet na rede local. Isso não ajuda quando você está fora de casa, quando a operadora coloca a conexão atrás de CGNAT, nem quando o que você quer é desligar ou reiniciar o computador, e não ligá-lo. Também não dizem se a máquina realmente ligou.',
          'O Remote Wake tenta cobrir o caminho inteiro: acordar a máquina por vários meios, confirmar que ela subiu, executar as ações de energia quando ela está ligada e registrar tudo num histórico.',
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Como funciona',
        paragrafos: [
          'O painel conversa por HTTPS com a API. Para ligar uma máquina, a API tem três caminhos: mandar o pacote para o broadcast da rede local (ou por uma VPN que o encaminhe); mandar UDP para um IP público ou DDNS, o Wake-on-WAN, que exige redirecionamento de porta no roteador; ou entregar o pedido a um gateway residencial, um processo sempre ligado dentro da casa que busca os pedidos na API e envia o pacote na LAN ou pela rede Tailscale.',
          'Uma máquina desligada não executa programas, então desligar, reiniciar, suspender e hibernar dependem de um agente instalado no Windows ou no Linux. O agente abre uma conexão de saída com a API e aceita só essas quatro ações: nada de shell arbitrário. Quando ele se conecta logo depois de um pedido de Ligar, o histórico registra que a máquina de fato ligou.',
          'Um detalhe que o projeto deixa explícito: Tailscale instalado só no computador desligado não consegue acordá-lo. A API e o gateway precisam ficar em outro equipamento sempre ligado.',
        ],
      },
      {
        id: 'decisoes',
        titulo: 'Tecnologias e decisões',
        paragrafos: [
          'A API é em ASP.NET Core 10 com C#, Entity Framework Core e PostgreSQL; as migrações rodam sozinhas na inicialização. Escolhi .NET pela boa integração com serviços do Windows, pelo suporte a Linux, pela biblioteca de rede e por permitir compartilhar o código do Magic Packet e do contrato entre API, gateway e agente. O painel é React com TypeScript e Vite.',
          'Como o sistema controla máquinas, a segurança vem primeiro: sessões guardadas no servidor com cookie HttpOnly e SameSite=Strict, verificação em duas etapas (TOTP) com códigos de recuperação, cabeçalho obrigatório contra CSRF, limite de tentativas por IP e por conta, cadastro fechado depois da primeira conta (que exige um código de configuração exibido no log) e eventos de segurança visíveis no painel.',
          'Para produção há imagens amd64 e arm64 publicadas no GitHub Container Registry e um modelo com Caddy fazendo o HTTPS.',
        ],
      },
      {
        id: 'testes',
        titulo: 'Testes e estado atual',
        paragrafos: [
          'Os testes de unidade e de API usam xUnit v3 contra um PostgreSQL real e descartável. Os testes de navegador, com Playwright em desktop e celular, cobrem cadastro, máquinas, gateway, troca de senha, duas etapas e sessões, e reprovam qualquer erro no console, inclusive violação da CSP. Um script de integração sobe banco, API, gateway e agente e testa isolamento entre usuários, revogação e reinício. Tudo roda no GitHub Actions a cada push.',
          'O projeto está em desenvolvimento: API, interface, gateway e agente foram validados ponta a ponta em simulação (há um modo de demonstração que não liga nem desliga nenhum PC), e o teste com computadores e redes reais ainda está pendente. Na fila estão o pareamento de gateways por código, vários gateways por conta e a interface em inglês.',
        ],
      },
    ],
  },
  {
    id: 'fluxo-agentes',
    nome: 'Fluxo de Agentes',
    contexto: 'Ferramenta de IA',
    categoria: 'pessoal',
    inicio: '2026-09',
    ultimaAtividade: '2026-09-17',
    resumo:
      'Uma pasta que se coloca em qualquer projeto para rodar um time de IAs pelo terminal: o arquiteto planeja, você aprova, o executor implementa, checks sem IA validam e um revisor diferente dá o veredito.',
    destaques: [
      'Fallback automático entre Claude, Codex, Copilot e outros quando um bate limite',
      'Modelo forte planeja e modelo barato executa, para economizar cota',
      'O revisor usa uma IA diferente da que escreveu o código',
      'Funciona no Windows e no macOS',
    ],
    stack: ['Node.js', 'CLI', 'Codex', 'Automação', 'IA'],
    seo: {
      titulo: 'Fluxo de Agentes: um time de IAs no terminal',
      descricao:
        'Fluxo de Agentes: ferramenta em Node.js que roda um time de IAs pelo terminal em qualquer projeto. Um modelo planeja, você aprova, outro executa, checks sem IA validam e uma IA diferente revisa.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O Fluxo de Agentes é uma ferramenta de linha de comando, em Node.js, para programar com vários assistentes de IA trabalhando em etapas. Ela vive numa pasta que se coloca dentro de qualquer projeto e roda pelo terminal.',
          'Em vez de pedir tudo a um assistente só, o trabalho é dividido em papéis: um arquiteto que planeja, um executor que implementa e um revisor que dá o veredito, com uma etapa de aprovação humana no meio e verificações automáticas que não dependem de IA.',
        ],
      },
      {
        id: 'problema',
        titulo: 'O problema',
        paragrafos: [
          'Quem usa assistentes de código no dia a dia esbarra em três limites. A cota acaba no meio da tarefa e o trabalho para. Usar o modelo mais caro para tudo gasta a cota em tarefas que um modelo mais simples resolveria. E quando a mesma IA escreve e revisa o próprio código, ela tende a repetir os mesmos pontos cegos.',
          'O Fluxo de Agentes foi feito para atacar esses três pontos de uma vez, organizando quem faz o quê.',
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Como funciona',
        paragrafos: [
          'O fluxo tem cinco passos. Primeiro, o arquiteto lê o pedido e monta um plano. Depois, você lê o plano e aprova (ou não): nada é implementado sem esse aval. Com o plano aprovado, o executor faz as mudanças. Em seguida rodam checks sem IA, que conferem o resultado de forma determinística. Por último, um revisor dá o veredito sobre o que foi feito.',
          'Cada etapa pode usar um assistente diferente: Claude, Codex, Copilot e outros. Se um deles bate o limite de uso, o fluxo passa automaticamente para o próximo da lista e o trabalho continua.',
        ],
      },
      {
        id: 'decisoes',
        titulo: 'Decisões de projeto',
        paragrafos: [
          'Modelo forte planeja, modelo barato executa. O plano é a parte que mais exige raciocínio; com ele pronto e aprovado, a implementação pode ficar com um modelo mais barato, o que economiza cota.',
          'O revisor é sempre uma IA diferente da que escreveu o código. É o mesmo princípio de uma revisão entre pessoas: quem não escreveu enxerga o que o autor deixou passar.',
          'A aprovação humana fica antes da implementação, e não só no fim: é mais barato corrigir um plano do que desfazer código. E os checks sem IA existem porque o veredito de um modelo não substitui uma verificação que dá sempre o mesmo resultado.',
          'A ferramenta funciona no Windows e no macOS. O código não é público.',
        ],
      },
    ],
  },
  {
    id: 'stabilmoney',
    nome: 'Stabil Money',
    contexto: 'Finanças pessoais',
    categoria: 'pessoal',
    inicio: '2026-03',
    fim: 'atual',
    ultimaAtividade: '2026-09-17',
    repo: `${GH}/StabilMoney`,
    noAr: 'https://stabilmoney.victordemelo.com.br',
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
    seo: {
      titulo: 'Stabil Money: app de finanças pessoais e da família',
      descricao:
        'Stabil Money: app gratuito de controle financeiro pessoal e da família, com cartões e fatura, contas fixas, metas e investimentos. Feito em Laravel, instalável como PWA e com lançamento offline.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O Stabil Money é um app web de controle financeiro pessoal e da família, gratuito e em português, que eu desenhei e desenvolvo sozinho. Reúne num lugar só receitas, despesas, cartões com fatura, contas fixas, metas e investimentos, e funciona no navegador do computador e do celular. Está no ar em stabilmoney.victordemelo.com.br, em fase de testes.',
          'Não é banco nem instituição financeira: não se conecta a conta bancária, não movimenta dinheiro e nunca pede senha de banco nem os dados do cartão. Os valores são os que a própria pessoa lança; para controlar a fatura, basta um apelido para o cartão, o limite e os dias de fechamento e vencimento.',
        ],
      },
      {
        id: 'problema',
        titulo: 'Por que eu fiz',
        paragrafos: [
          'Por muito tempo procurei um aplicativo para organizar a minha vida financeira. Os mais completos eram pagos; os gratuitos faziam só um pedaço: anotavam gastos, mas não entendiam a fatura do cartão, as parcelas, as contas fixas do mês, nem a família dividindo o mesmo dinheiro.',
          'Então resolvi construir o meu, com as regras que fazem sentido no Brasil: cartão com fatura e parcelas, cheque especial, Pix, TED e contas que vencem todo mês. O projeto nasceu como MoneyLife, mas o domínio já tinha dono; o nome novo diz melhor a ideia: dinheiro estável, sem susto no fim do mês.',
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Como funciona',
        paragrafos: [
          'O centro do app é separar o dinheiro que está na conta do dinheiro que já tem destino. O saldo fica dividido em "bolsos": bruto, reservado, disponível e cheque especial. O que está guardado para uma meta, como uma viagem ou a reserva de emergência, sai do disponível, para não ser gasto sem querer. E o app não deixa gastar o que não existe.',
          'No cartão, compras à vista, parceladas e recorrentes caem no ciclo certo da fatura, e o limite volta quando a fatura é paga. Aluguel, condomínio e energia aparecem todo mês como contas a pagar, com aviso do que vence e do que já venceu. Os investimentos aceitam CDI, Selic, IPCA+ e prefixado, com projeção de rendimento e estimativa de IR e IOF. A visão geral mostra saldo, receitas, despesas e o que sobrou, com gráficos por categoria e por período.',
        ],
      },
      {
        id: 'familia',
        titulo: 'Conta-família',
        paragrafos: [
          'O titular cadastra quem divide as contas com ele. Cada dependente entra com o próprio login, lança as próprias compras e enxerga o mesmo dinheiro da casa. Cada lançamento guarda quem fez a compra, o app mostra a fatia de cada um no gasto do mês e um histórico de atividade registra quem mexeu em quê e quando.',
        ],
      },
      {
        id: 'decisoes',
        titulo: 'Tecnologias e decisões',
        paragrafos: [
          'O backend é Laravel 12 com PHP 8.4 e MySQL; a interface usa Tailwind 4 e tudo roda em Docker. O app é uma PWA instalável na tela inicial e aceita lançamentos sem internet: eles entram numa fila local e são enviados com Background Sync quando a conexão volta.',
          'Segurança e dados recebem o mesmo cuidado das regras de negócio: senhas guardadas só como hash argon2id, senhas que já vazaram na internet recusadas no cadastro, verificação em duas etapas com app autenticador, backup e restore com rotação e uma Política de Privacidade alinhada à LGPD.',
          'Como o app lida com dinheiro, as regras são cobertas por testes automatizados: são 700 testes e 2.744 asserções, rodando no CI a cada push. O app segue em evolução, e cada melhoria nasce do uso de verdade.',
        ],
      },
    ],
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
    seo: {
      titulo: 'BigData Analytics: dashboard de alunos em Django e Plotly',
      descricao:
        'BigData Analytics: dashboard acadêmico em Python e Django para acompanhar engajamento e desempenho de alunos, com dados tratados em Pandas, gráficos interativos em Plotly e relatórios em modal.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O BigData Analytics é um sistema de gestão do conhecimento e análise de dados feito na graduação em Engenharia da Computação na Unisul. É um painel web que centraliza os dados de alunos de vários cursos e mostra, numa tela só, o engajamento (tempo de uso, acessos e dispositivos) e o desempenho de cada grupo.',
          'O objetivo é centralizar a análise: em vez de percorrer a base linha a linha, o painel já mostra as métricas consolidadas, os gráficos e os relatórios detalhados.',
        ],
      },
      {
        id: 'dados',
        titulo: 'Os dados',
        paragrafos: [
          'O sistema lê uma base tratada em CSV com três tipos de informação: o perfil do aluno (idade, região e curso), as métricas acadêmicas (nota média, classificação de desempenho e de engajamento) e o comportamento de acesso (dispositivo, tempo de uso em minutos, acessos por semana e data).',
          'O tratamento e as agregações são feitos com Pandas e NumPy, no backend em Python. É ali que saem os números dos cards e as séries que alimentam cada gráfico.',
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Como funciona',
        paragrafos: [
          'A visão geral abre com quatro cards: total de alunos, nota média geral, tempo médio de uso e total de acessos. Abaixo vêm quatro gráficos interativos gerados pelo Plotly Express: distribuição por curso (rosca), uso de dispositivos (barras), tempo médio de uso por curso (área) e níveis de engajamento (pizza).',
          'Os relatórios detalhados de alunos, cursos e tempo de uso não recarregam a página. O Django expõe uma API interna em JSON; o navegador busca os dados com a Fetch API, em JavaScript puro, e mostra o resultado numa janela modal sobre o painel. O efeito é o de uma SPA, sem framework de frontend.',
        ],
      },
      {
        id: 'decisoes',
        titulo: 'Tecnologias e decisões',
        paragrafos: [
          'Backend em Python com Django; análise com Pandas e NumPy; gráficos com Plotly Express, que gera o HTML interativo direto do Python; frontend em HTML, CSS e JavaScript sem bibliotecas.',
          'O ambiente de desenvolvimento roda em Docker, com o código montado como volume: quem clona o repositório sobe o painel com dois comandos, e as alterações aparecem na hora, sem novo build.',
        ],
      },
      {
        id: 'aprendizados',
        titulo: 'O que o projeto exercitou',
        paragrafos: [
          'O trabalho passou por todas as etapas de um projeto de dados pequeno: tratar a base, resumir os números que importam, escolher o gráfico certo para cada pergunta e servir tudo numa interface rápida. Também mostrou que dá para ter navegação fluida com uma API JSON simples e um pouco de JavaScript, sem trazer um framework inteiro para o frontend.',
        ],
      },
    ],
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
    imagem: '/img/estacionamento-1200.webp',
    imagemPequena: '/img/estacionamento-480.webp',
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
    seo: {
      titulo: 'Estacionamento Inteligente com Arduino e sensores',
      descricao:
        'Estacionamento Inteligente: maquete com dois Arduino UNO, sensores ultrassônicos HC-SR04, LEDs RGB para as vagas e cancela com servomotor por PWM. Projeto de Sistemas Digitais na Unisul.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O Estacionamento Inteligente é uma maquete de estacionamento automatizado feita na disciplina de Sistemas Digitais, na graduação em Engenharia da Computação da Unisul, em equipe com Davi Jordani Ramos, Isaque Fabro e Pedro Brunhara.',
          'O objetivo foi gerenciar o fluxo de veículos aplicando eletrônica digital, programação e automação: o sistema percebe quando um carro chega, abre a cancela e mostra em tempo real quais vagas estão livres e quais estão ocupadas. O circuito completo também está numa simulação no Tinkercad.',
        ],
      },
      {
        id: 'como-funciona',
        titulo: 'Como funciona',
        paragrafos: [
          'Dois Arduino UNO controlam a maquete. Sensores ultrassônicos HC-SR04 e sensores de obstáculo detectam a presença dos veículos. Cada vaga tem um LED RGB que indica se está livre ou ocupada, e um servomotor movimenta a cancela, abrindo e fechando conforme o carro entra ou sai.',
          'A maquete tem alimentação própria: uma fonte que converte 220 V AC da tomada em 13,2 V DC estáveis. A fonte dedicada garante a estabilidade do sistema, com motores e vários sensores ligados ao mesmo circuito.',
        ],
      },
      {
        id: 'programacao',
        titulo: 'Programação',
        paragrafos: [
          'A lógica foi escrita em C++ na Arduino IDE. O programa lê sinais digitais e analógicos dos sensores, decide em tempo real com estruturas condicionais encadeadas se há um veículo em cada ponto, atualiza os LEDs indicadores e controla a posição dos servomotores por PWM.',
        ],
      },
      {
        id: 'desafios',
        titulo: 'Desafios',
        paragrafos: [
          'Os maiores desafios foram de integração: montar e organizar um circuito com muitos componentes, ajustar a posição dos sensores para que as leituras fossem confiáveis, sincronizar os componentes (principalmente o controle das cancelas) e manter a lógica de leitura e controle clara o bastante para responder em tempo real.',
        ],
      },
      {
        id: 'aprendizados',
        titulo: 'Aprendizados e próximos passos',
        paragrafos: [
          'O projeto consolidou automação com microcontroladores, a integração entre hardware e software, a prototipagem de uma solução do dia a dia e o trabalho em equipe com divisão de tarefas.',
          'Como evolução, a equipe listou um aplicativo ou painel web para monitorar o estacionamento a distância, reserva de vagas, pagamento automatizado e integração com IoT e dashboards de monitoramento.',
        ],
      },
    ],
  },
  {
    id: 'emprestimo-a3',
    nome: 'Gerenciador de Empréstimos',
    contexto: 'Avaliação A3 · Unisul',
    categoria: 'academico',
    inicio: '2024-11',
    repo: `${GH}/gerenciador_emprestimo_A3`,
    extra: { rotulo: 'Apresentação em vídeo', url: 'https://youtu.be/waL3DVzU5rQ' },
    resumo:
      'Aplicação desktop para controlar empréstimos de ferramentas entre amigos: cadastros, empréstimos, devoluções e relatórios.',
    destaques: [
      'CRUD de amigos e ferramentas',
      'Relatórios de quem não devolveu, de quem mais pegou emprestado e do valor total',
      'Levantamento de requisitos funcionais e não funcionais',
    ],
    stack: ['Java', 'MySQL', 'JDBC', 'POO'],
    seo: {
      titulo: 'Gerenciador de Empréstimos de Ferramentas em Java e MySQL',
      descricao:
        'Gerenciador de Empréstimos: aplicação desktop em Java e MySQL para controlar empréstimos de ferramentas entre amigos, com cadastros, devoluções e relatórios. Avaliação A3 na Unisul.',
    },
    texto: [
      {
        id: 'o-que-e',
        titulo: 'O que é',
        paragrafos: [
          'O Gerenciador de Empréstimos é uma aplicação desktop feita para a avaliação A3 da graduação em Engenharia da Computação na Unisul, em equipe com Davi Jordani Ramos e Isaque Fabro. Ela atende a uma necessidade fictícia: uma pessoa que empresta ferramentas aos amigos e precisa saber o que está com quem.',
          'O sistema cadastra amigos e ferramentas, registra empréstimos e devoluções e gera relatórios. O objetivo da avaliação era exercitar a análise de um problema, a interpretação de requisitos e a construção de uma solução com CRUDs e relatórios.',
        ],
      },
      {
        id: 'requisitos',
        titulo: 'Requisitos',
        paragrafos: [
          'O trabalho começou pelo levantamento de requisitos. Os doze requisitos funcionais cobrem o cadastro e a alteração de amigos e ferramentas, novos empréstimos, a consulta de empréstimos ativos e de todos os já realizados, o recebimento da ferramenta devolvida e os relatórios.',
          'Os requisitos não funcionais definem o comportamento esperado: cadastros e consultas em até 2 segundos mesmo com muitos registros, interface simples para quem não é técnico, funcionamento em Windows e Linux, data registrada em cada empréstimo, código claro e documentado e baixo consumo de memória e CPU.',
        ],
      },
      {
        id: 'relatorios',
        titulo: 'Relatórios',
        paragrafos: [
          'Os relatórios respondem às perguntas de quem empresta: quais ferramentas estão emprestadas e com quem, o histórico de empréstimos de cada amigo, quem ainda não devolveu, quem mais pegou emprestado, quantos empréstimos foram feitos desde o início e o valor total das ferramentas cadastradas.',
        ],
      },
      {
        id: 'como-foi-feito',
        titulo: 'Como foi construído',
        paragrafos: [
          'A aplicação é em Java (JDK 8), desenvolvida no NetBeans, com banco MySQL acessado por JDBC. O código segue a orientação a objetos e é dividido em camadas: model com as classes de domínio, como amigos e ferramentas; dao com o acesso ao banco; view com as telas; e principal com o ponto de entrada.',
          'O banco tem três tabelas: amigos (nome e telefone), ferramentas (nome, marca e custo) e empréstimos, que liga o amigo às ferramentas e guarda as datas de empréstimo e de devolução. O repositório traz o script SQL para criar tudo, e a equipe gravou um vídeo de apresentação do sistema.',
        ],
      },
      {
        id: 'aprendizados',
        titulo: 'O que aprendi',
        paragrafos: [
          'O projeto passou por todas as etapas, da concepção à implementação: requisitos, modelagem do banco, separação em camadas e relatórios que precisam cruzar tabelas. Consolidou a base de Java, SQL e orientação a objetos e deixou ideias de expansão para versões futuras.',
        ],
      },
    ],
  },
]

/** Só as categorias que têm projeto aparecem (título, filtro e contagem) */
export const grupos = todosGrupos.filter((g) => projetos.some((p) => p.categoria === g.id))

/** Mais recente primeiro: em andamento, depois pela data de fim e de início */
function chave(p: Projeto) {
  const fim = p.fim === 'atual' ? '9999-99' : (p.fim ?? p.inicio)
  return `${fim}|${p.inicio}`
}

export function projetosDoGrupo(g: Categoria) {
  return projetos.filter((p) => p.categoria === g).sort((a, b) => chave(b).localeCompare(chave(a)))
}

export const projetosOrdenados = grupos.flatMap((g) => projetosDoGrupo(g.id))
