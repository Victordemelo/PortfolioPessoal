import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'
import { linkWhatsapp, perfil } from './src/data/perfil'
import { projetos, projetosOrdenados, grupos, type Projeto } from './src/data/projetos'
import { certificados, trajetoria } from './src/data/trajetoria'

// SEO do site estático, gerado no build a partir dos mesmos dados das páginas:
// - <head> de cada página: título, descrição, canônico, Open Graph, Twitter e JSON-LD
// - conteúdo em HTML puro dentro do #root (quem não roda JS, ou roda tarde, já lê
//   tudo; o React substitui esse conteúdo ao iniciar)
// - uma página pronta por projeto em /projetos/<id>/index.html
// - robots.txt e sitemap.xml

const SITE = perfil.site
const OG_IMAGEM = `${SITE}/og.png`
const DESCRICAO =
  'Victor de Melo da Rosa, desenvolvedor de software júnior em São José (Grande Florianópolis, SC) e estudante de Engenharia da Computação na Unisul. Sistemas web, automações e integrações, até o hardware: ESP32, Arduino, sensores e IoT.'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const json = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c')

const pessoa = {
  '@type': 'Person',
  '@id': `${SITE}/#pessoa`,
  name: perfil.nome,
  url: SITE,
  image: perfil.avatar,
  email: `mailto:${perfil.contato.email}`,
  jobTitle: perfil.cargo,
  worksFor: { '@type': 'Organization', name: perfil.empresa },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Unisul · Universidade do Sul de Santa Catarina' },
  address: { '@type': 'PostalAddress', addressLocality: 'São José', addressRegion: 'SC', addressCountry: 'BR' },
  knowsAbout: ['Desenvolvimento de software', 'Sistemas web', 'Automações', 'Integrações e APIs', 'PHP', 'Laravel', 'React', 'TypeScript', 'C#', 'Python', 'Docker', 'ESP32', 'Arduino', 'IoT'],
  sameAs: [perfil.contato.github, perfil.contato.linkedin, perfil.contato.instagram, `https://wa.me/${perfil.contato.whatsapp}`],
}

type Pagina = { caminho: string; titulo: string; descricao: string; jsonld: object; corpo: string; tipo: 'website' | 'article' }

function cabecalho(p: Pagina) {
  const url = `${SITE}${p.caminho}`
  return `
    <title>${esc(p.titulo)}</title>
    <meta name="description" content="${esc(p.descricao)}" />
    <meta name="author" content="${esc(perfil.nome)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${p.tipo}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="${esc(perfil.nome)}" />
    <meta property="og:title" content="${esc(p.titulo)}" />
    <meta property="og:description" content="${esc(p.descricao)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMAGEM}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(perfil.nome)}: desenvolvedor de software" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.titulo)}" />
    <meta name="twitter:description" content="${esc(p.descricao)}" />
    <meta name="twitter:image" content="${OG_IMAGEM}" />
    <script type="application/ld+json">${json({ '@context': 'https://schema.org', ...p.jsonld })}</script>
  `
}

const estilo = 'max-width:760px;margin:0 auto;padding:48px 20px;font-family:system-ui,sans-serif;line-height:1.6'

function contatos() {
  return `<ul>
    <li><a href="${esc(linkWhatsapp())}">WhatsApp</a></li>
    <li><a href="mailto:${perfil.contato.email}">${perfil.contato.email}</a></li>
    <li><a href="${perfil.contato.linkedin}">LinkedIn</a></li>
    <li><a href="${perfil.contato.github}">GitHub</a></li>
    <li><a href="${perfil.contato.instagram}">Instagram</a></li>
  </ul>`
}

function paginaInicial(): Pagina {
  const corpo = `<div style="${estilo}">
    <h1>${esc(perfil.nome)}</h1>
    <p>${esc(DESCRICAO)}</p>
    ${perfil.sobre.map((s) => `<p>${esc(s)}</p>`).join('')}
    <h2>Projetos</h2>
    ${grupos
      .map(
        (g) => `<h3>${esc(g.titulo)}</h3><ul>${projetosOrdenados
          .filter((p) => p.categoria === g.id)
          .map((p) => `<li><a href="/projetos/${p.id}">${esc(p.nome)}</a>: ${esc(p.resumo)}</li>`)
          .join('')}</ul>`,
      )
      .join('')}
    <h2>Trajetória</h2>
    <ul>${trajetoria.map((e) => `<li><strong>${esc(e.titulo)}</strong>, ${esc(e.lugar)} (${esc(e.periodo)}). ${esc(e.descricao)}</li>`).join('')}</ul>
    <h2>Certificados</h2>
    <ul>${certificados.map((c) => `<li>${esc(c.nome)}, ${esc(c.emissor)}</li>`).join('')}</ul>
    <h2>Contato</h2>
    ${contatos()}
  </div>`
  return {
    caminho: '/',
    titulo: `${perfil.nome} · Desenvolvedor de Software em São José, SC`,
    descricao: DESCRICAO,
    tipo: 'website',
    corpo,
    jsonld: {
      '@graph': [
        pessoa,
        { '@type': 'WebSite', '@id': `${SITE}/#site`, url: SITE, name: perfil.nome, inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#pessoa` } },
        { '@type': 'ProfilePage', url: SITE, mainEntity: { '@id': `${SITE}/#pessoa` }, inLanguage: 'pt-BR' },
      ],
    },
  }
}

function paginaProjeto(p: Projeto): Pagina {
  const corpo = `<div style="${estilo}">
    <p><a href="/#projetos">← todos os projetos</a></p>
    <h1>${esc(p.nome)}</h1>
    ${p.contexto ? `<p>${esc(p.contexto)}</p>` : ''}
    <p>${esc(p.resumo)}</p>
    <h2>Destaques</h2>
    <ul>${p.destaques.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    <h2>Stack</h2>
    <p>${p.stack.map(esc).join(', ')}</p>
    ${p.repo ? `<p><a href="${p.repo}">Código no GitHub</a></p>` : ''}
    ${p.extra ? `<p><a href="${esc(p.extra.url)}">${esc(p.extra.rotulo)}</a></p>` : ''}
    <p>Projeto de <a href="/">${esc(perfil.nome)}</a>.</p>
  </div>`
  return {
    caminho: `/projetos/${p.id}`,
    titulo: `${p.nome} · ${perfil.nome}`,
    descricao: p.resumo,
    tipo: 'article',
    corpo,
    jsonld: {
      '@type': p.repo ? 'SoftwareSourceCode' : 'CreativeWork',
      name: p.nome,
      description: p.resumo,
      url: `${SITE}/projetos/${p.id}`,
      inLanguage: 'pt-BR',
      author: pessoa,
      ...(p.repo ? { codeRepository: p.repo, programmingLanguage: p.stack } : { keywords: p.stack.join(', ') }),
      ...(p.imagem ? { image: p.imagem } : {}),
    },
  }
}

const INI_HEAD = '<!--seo:head-->'
const FIM_HEAD = '<!--/seo:head-->'
const INI_CORPO = '<!--seo:corpo-->'
const FIM_CORPO = '<!--/seo:corpo-->'

function aplicar(html: string, p: Pagina) {
  const trocar = (h: string, ini: string, fim: string, conteudo: string) => h.replace(new RegExp(`${ini}[\\s\\S]*?${fim}`), `${ini}${conteudo}${fim}`)
  return trocar(trocar(html, INI_HEAD, FIM_HEAD, cabecalho(p)), INI_CORPO, FIM_CORPO, p.corpo)
}

function sitemap() {
  const hoje = new Date().toISOString().slice(0, 10)
  const data = (p: Projeto) => p.ultimaAtividade ?? (p.fim && p.fim !== 'atual' ? `${p.fim}-01` : hoje)
  const urls = [
    `<url><loc>${SITE}/</loc><lastmod>${hoje}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...projetos.map((p) => `<url><loc>${SITE}/projetos/${p.id}</loc><lastmod>${data(p)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls.join('\n  ')}\n</urlset>\n`
}

const ROBOTS = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`

export function seo(): Plugin {
  let saida = 'dist'
  return {
    name: 'portfolio-seo',
    configResolved(c) {
      saida = c.build.outDir
    },
    transformIndexHtml: {
      order: 'post',
      handler: (html) => aplicar(html, paginaInicial()),
    },
    // Depois de gravar o dist/: páginas dos projetos, robots.txt e sitemap.xml
    writeBundle() {
      const base = readFileSync(join(saida, 'index.html'), 'utf8')
      for (const p of projetos) {
        const dir = join(saida, 'projetos', p.id)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), aplicar(base, paginaProjeto(p)))
      }
      writeFileSync(join(saida, 'sitemap.xml'), sitemap())
      writeFileSync(join(saida, 'robots.txt'), ROBOTS)
    },
  }
}
