// Tudo que é texto pessoal do site mora aqui e nos outros arquivos de src/data.
// Para atualizar o portfólio, edite estes arquivos: os componentes só leem.

export const perfil = {
  nome: 'Victor de Melo da Rosa',
  site: 'https://victordemelo.com.br',
  nomeCurto: 'Victor',
  github: 'Victordemelo',
  titulo: 'Desenvolvedor de software',
  subtitulo: 'Engenharia da Computação · Unisul',
  local: 'São José, SC',
  cargo: 'Desenvolvedor de Software Júnior',
  empresa: 'JW Soluções Digitais',
  fuso: 'America/Sao_Paulo',
  // foto hospedada no próprio site (WebP): 160 px para a barra lateral, 320 px para telas retina
  avatar: '/img/victor-160.webp',
  avatarGrande: '/img/victor-320.webp',
  frase: 'Escrevo o sistema, subo o servidor e, quando precisa, pego o ferro de solda.',
  sobre: [
    'Trabalho como desenvolvedor de software na JW Soluções Digitais e estudo Engenharia da Computação na Unisul, com conclusão prevista para dezembro de 2026. Meu dia a dia é colocar sistema no ar: modelar o banco, escrever a API, montar a interface, containerizar e cuidar do deploy.',
    'Gosto de projetos em que regra de negócio e código precisam andar juntos, como um app financeiro que não deixa gastar o dinheiro que já está comprometido, ou um ERP em que cada cliente roda isolado na própria instância.',
    'Também faço automações e integrações entre sistemas, e levo isso até o hardware: microcontroladores como ESP32 e Arduino, sensores e atuadores. E uso IA no fluxo de trabalho com critério: montei um orquestrador que coloca modelos diferentes para planejar, executar e revisar código.',
  ],
  // O que eu ofereço, em linguagem de quem procura (vai para o JSON-LD e o llms.txt)
  servicos: [
    { nome: 'Sites e sistemas web', descricao: 'Sites para empresas e profissionais, painéis administrativos e sistemas sob medida (agendamento, vendas, estoque, financeiro).' },
    { nome: 'Automações', descricao: 'Respostas automáticas no WhatsApp, envio de cobranças e lembretes, planilhas e rotinas que rodam sozinhas.' },
    { nome: 'Integrações e APIs', descricao: 'Conexão entre sistemas, lojas virtuais, meios de pagamento e Pix, webhooks e APIs.' },
    { nome: 'IoT e automação com microcontroladores', descricao: 'Projetos com ESP32 e Arduino, sensores, atuadores e controle à distância.' },
  ],
  areaAtendida: ['São José', 'Florianópolis', 'Palhoça', 'Grande Florianópolis', 'Santa Catarina', 'Brasil (remoto)'],
  idiomas: ['Português', 'Inglês (básico)'],
  disponivel: true,
  contato: {
    email: 'victor.rosa.system@gmail.com',
    github: 'https://github.com/Victordemelo',
    linkedin: 'https://www.linkedin.com/in/victor-de-melo-da-rosa/',
    whatsapp: '5548988078029',
    instagram: 'https://www.instagram.com/victor.di.melo/',
  },
}

function saudacao() {
  const h = new Date().getHours()
  return h >= 5 && h < 12 ? 'bom dia' : h >= 12 && h < 18 ? 'boa tarde' : 'boa noite'
}

/** Link do WhatsApp com a mensagem já escrita; a saudação segue o horário de quem clica */
export function linkWhatsapp() {
  const msg = `Olá, ${saudacao()}! Vim pelo seu site e gostaria de saber mais sobre os seus serviços.`
  return `https://wa.me/${perfil.contato.whatsapp}?text=${encodeURIComponent(msg)}`
}
