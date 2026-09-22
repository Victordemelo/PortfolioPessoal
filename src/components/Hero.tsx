import { motion } from 'motion/react'
import { ArrowDown, Mail, MapPin } from 'lucide-react'
import { perfil } from '../data/perfil'
import { GithubIcon, LinkedinIcon } from './Icones'

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="grade-fundo pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-destaque/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pt-24 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between"
        >
          <div className="max-w-2xl">
            {perfil.disponivel && (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-borda bg-superficie px-3 py-1 text-sm text-suave">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destaque opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destaque" />
                </span>
                Aberto a novos projetos
              </p>
            )}

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Olá, eu sou o <span className="texto-gradiente">{perfil.nomeCurto}</span>.
            </h1>
            <p className="mt-3 text-xl font-semibold text-texto/90 sm:text-2xl">
              {perfil.titulo} · {perfil.subtitulo}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-suave">{perfil.chamada}</p>

            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-suave">
              <MapPin size={16} /> {perfil.local}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 rounded-xl bg-destaque px-5 py-3 font-semibold text-fundo transition hover:brightness-110"
              >
                Ver projetos <ArrowDown size={18} />
              </a>
              <a
                href={perfil.contato.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-borda bg-superficie px-5 py-3 font-medium transition hover:border-destaque/60"
              >
                <GithubIcon /> GitHub
              </a>
              <a
                href={perfil.contato.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-borda bg-superficie px-5 py-3 font-medium transition hover:border-destaque/60"
              >
                <LinkedinIcon /> LinkedIn
              </a>
              <a
                href={`mailto:${perfil.contato.email}`}
                aria-label="Enviar e-mail"
                className="inline-flex items-center gap-2 rounded-xl border border-borda bg-superficie px-4 py-3 transition hover:border-destaque/60"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-destaque to-destaque-2 opacity-70 blur-md" />
            <img
              src={perfil.avatar}
              alt={perfil.nome}
              width={224}
              height={224}
              className="relative h-36 w-36 rounded-full border-4 border-fundo object-cover sm:h-56 sm:w-56"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
