// Tudo que é texto pessoal do site mora aqui e nos outros arquivos de src/data.
// Para atualizar o portfólio, edite estes arquivos: os componentes só leem.

export const perfil = {
  nome: 'Victor de Melo da Rosa',
  nomeCurto: 'Victor',
  github: 'Victordemelo',
  titulo: 'Desenvolvedor de software',
  subtitulo: 'Engenharia da Computação · Unisul',
  local: 'São José, SC',
  cargo: 'Desenvolvedor de Software Júnior',
  empresa: 'JW Soluções Digitais',
  fuso: 'America/Sao_Paulo',
  avatar: 'https://avatars.githubusercontent.com/u/147112756?v=4',
  frase: 'Escrevo o sistema, subo o servidor e, quando precisa, pego o ferro de solda.',
  sobre: [
    'Trabalho como desenvolvedor de software na JW Soluções Digitais e estudo Engenharia da Computação na Unisul, com conclusão prevista para dezembro de 2026. Meu dia a dia é colocar sistema no ar: modelar o banco, escrever a API, montar a interface, containerizar e cuidar do deploy.',
    'Gosto de projetos em que regra de negócio e código precisam andar juntos, como um app financeiro que não deixa gastar o dinheiro que já está comprometido, ou um ERP em que cada cliente roda isolado na própria instância.',
    'Também faço automações e integrações entre sistemas, e levo isso até o hardware: microcontroladores como ESP32 e Arduino, sensores e atuadores. E uso IA no fluxo de trabalho com critério: montei um orquestrador que coloca modelos diferentes para planejar, executar e revisar código.',
  ],
  disponivel: true,
  contato: {
    email: 'victor.rosa.system@gmail.com',
    github: 'https://github.com/Victordemelo',
    linkedin: 'https://www.linkedin.com/in/victor-de-melo-da-rosa/',
    whatsapp: '5548988078029',
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
