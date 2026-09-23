// Arquivos que aparecem no editor da bancada. O firmware é o que "roda" na placa:
// o monitor serial e o display imprimem exatamente o que este código faria.

export type Arquivo = { nome: string; linguagem: 'cpp' | 'ts' | 'php'; codigo: string }

export const arquivos: Arquivo[] = [
  {
    nome: 'firmware.ino',
    linguagem: 'cpp',
    codigo: `#include <WiFi.h>
#include <Ultrasonic.h>
#include <ESP32Servo.h>

// VMR-2026 · estacionamento inteligente, versão ESP32
Ultrasonic sonar(TRIG, ECHO);
Servo cancela;
const float LIMITE_CM = 30.0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(SSID, SENHA);
  cancela.attach(PINO_SERVO);
  pinMode(LED_VAGA, OUTPUT);
}

void loop() {
  float cm = sonar.read(CM);
  bool ocupada = cm < LIMITE_CM;
  digitalWrite(LED_VAGA, ocupada);
  cancela.write(ocupada ? 90 : 0);
  Serial.printf("dist=%.1fcm vaga=%s\\n", cm,
                ocupada ? "OCUPADA" : "LIVRE");
  delay(600);
}`,
  },
  {
    nome: 'atividade.ts',
    linguagem: 'ts',
    codigo: `// O gráfico de commits deste site, sem backend
export async function buscarCalendario(usuario: string) {
  const url = \`https://github-contributions-api.jogruber.de/v4/\${usuario}\`
  const r = await fetch(url + '?y=last')
  if (!r.ok) throw new Error(\`calendário: \${r.status}\`)

  const { total, contributions } = await r.json()
  return {
    total: total.lastYear,
    dias: contributions.map((c) => ({ data: c.date, qtd: c.count })),
  }
}

// Atualiza a cada 5 minutos enquanto a aba estiver visível
setInterval(() => !document.hidden && atualizar(), 5 * 60_000)`,
  },
  {
    nome: 'Saldo.php',
    linguagem: 'php',
    codigo: `<?php
// StabilMoney: não deixa gastar o dinheiro que já está comprometido

final class Saldo
{
    public function disponivel(Conta $conta): Dinheiro
    {
        $bruto = $conta->saldoInicial
            ->mais($conta->receitas())
            ->menos($conta->despesas());

        $reservado = $conta->metas()->soma()
            ->mais($conta->investimentos()->soma());

        return $bruto->menos($reservado);
    }

    public function podePagar(Conta $conta, Dinheiro $valor): bool
    {
        $piso = $conta->chequeEspecial->negativo();
        return $this->disponivel($conta)->menos($valor)->maiorOuIgual($piso);
    }
}`,
  },
]

// ─── Realce de sintaxe mínimo ───────────────────────────────
// Um tokenizador por linha, suficiente para C++, TypeScript e PHP deste editor.

export type Token = { t: string; c?: 'kw' | 'str' | 'num' | 'com' | 'fn' | 'pre' | 'tipo' | 'var' }

const KW = new Set([
  'const', 'let', 'var', 'void', 'float', 'bool', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'new', 'throw',
  'export', 'async', 'await', 'function', 'import', 'from', 'true', 'false', 'final', 'class', 'public', 'private',
  'static', 'this', 'null',
])
const TIPOS = new Set(['Ultrasonic', 'Servo', 'Serial', 'WiFi', 'Error', 'Conta', 'Dinheiro', 'Saldo', 'OUTPUT', 'CM', 'document'])

const RE = /(\/\/.*$)|(#include.*$|<\?php)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\$[A-Za-z_]\w*)|(\b\d[\d_.]*\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|(\s+)|(.)/g

export function tokenizar(linha: string): Token[] {
  const out: Token[] = []
  for (const m of linha.matchAll(RE)) {
    const [t, com, pre, str, variavel, num, fn, id] = m
    if (com) out.push({ t, c: 'com' })
    else if (pre) out.push({ t, c: 'pre' })
    else if (str) out.push({ t, c: 'str' })
    else if (variavel) out.push({ t, c: 'var' })
    else if (num) out.push({ t, c: 'num' })
    else if (fn) out.push({ t, c: KW.has(fn) ? 'kw' : 'fn' })
    else if (id) out.push({ t, c: KW.has(id) ? 'kw' : TIPOS.has(id) || /^[A-Z][A-Z_]+$/.test(id) ? 'tipo' : undefined })
    else out.push({ t })
  }
  return out
}
