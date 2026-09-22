// Tudo que é texto pessoal do site mora aqui e nos outros arquivos de src/data.
// Para atualizar o portfólio, edite estes arquivos: os componentes só leem.

export const perfil = {
  nome: 'Victor de Melo da Rosa',
  nomeCurto: 'Victor',
  titulo: 'Desenvolvedor Full Stack',
  subtitulo: 'Estudante de Engenharia da Computação',
  local: 'Florianópolis / SC',
  avatar: 'https://avatars.githubusercontent.com/u/147112756?v=4',
  chamada:
    'Construo sistemas web, APIs, automações e integrações que resolvem problema de verdade: de licenciamento de ERP e cobrança automática a finanças pessoais e hardware com Arduino.',
  sobre: [
    'Sou estudante de Engenharia da Computação na Unisul, em Florianópolis, e trabalho com desenvolvimento full stack. Meu dia a dia é colocar sistema no ar: modelar o banco, escrever a API, montar a interface, containerizar e cuidar do deploy.',
    'Gosto de projetos em que regra de negócio e código precisam andar juntos, como licenças assinadas criptograficamente para um ERP, régua de cobrança integrada a vários bancos ou um app financeiro que não deixa gastar o dinheiro que já está comprometido.',
    'Também uso IA no fluxo de desenvolvimento: montei um orquestrador que coloca vários agentes para planejar, executar e revisar código, cada etapa com o modelo mais adequado.',
  ],
  disponivel: true,
  contato: {
    email: 'victor.rosa.system@gmail.com',
    github: 'https://github.com/Victordemelo',
    linkedin: 'https://www.linkedin.com/in/victor-de-melo-da-rosa/',
  },
}

// Os dois primeiros números (projetos e sistemas no ar) são contados
// automaticamente a partir de projetos.ts; estes vêm depois deles.
export const numerosExtras = [
  { valor: '700+', rotulo: 'testes no StabilMoney' },
  { valor: '10+', rotulo: 'gateways de pagamento integrados' },
]
