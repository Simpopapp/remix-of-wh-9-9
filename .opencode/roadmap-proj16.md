# Roadmap — Project 16 (Vocabulário: inteligência de fluxo de aprendizado)

Fonte: `project16.md` (diretriz) · `prd-project16.md` (como). Dependências: F0
é fundação; F1/F2/F3 dependem de F0; F4 depende de F1+F3; F5 depende de F1;
F6 fecha. Gates por fase conforme §19 do Plan.md; revisor: agente principal
(subagentes read-only). Monitor indisponível — aviso fica pendente (D16-E).

## Fase 0 · Contratos de recorte
- [x] D16-0a `snippet` em VocabWord (cap 400) + `SaveVocabWordInput.snippet*`
      (`snippet`, `snippetInContext`, `snippetWhy`) — captura em PlusWordText
      grava a frase real do gesto (a mesma enviada à IA) e o inContext/why da IA
- [x] D16-0b normalização defensiva (`normSnippet*`) na entrada do store; sem
      bump de versão (v8 mantida)
- [x] D16-0c `deriveVocabSnippet(item, questionText)` pura em vocab.ts
- [x] D16-0d merge de backup preserva `snippet*` de qualquer lado
      (backup.ts) — idempotência re-testada
- Gates: vitest 662/662 (17 novos em proj16-fase0 + fase0-ui) · tsgo limpo ·
  build OK (precache 122, sw b19cqeq8) · lint 0 erros 0 warnings

## Fase 1 · Versão simples vs completa
- [ ] D16-1a card da lista enxuto (sem contextual; palavra sem expandir; frase
      colapsada) + toque abre o sheet completo (D16-D: expansão inline some)
- [ ] D16-1b `VocabDetailSheet` em TranslationSheet com seções Recorte →
      Tradução → Sentidos → Fontes → Áudio → Ações; recorte com token
      destacado (VocabSnippet)
- [ ] D16-1c estados: sem recorte → seção omitida; derivação → skeleton;
      sentidos na navegação (A18 do projeto 14 fechado)
- Gates: vitest · tsgo · build · lint 0/0 · Playwright (sheet/a11y nas rotas tocadas)

## Fase 2 · Tradução do recorte
- [ ] D16-2a inContext da IA exibido de graça; dicionário mostra gesto
      "Traduzir este recorte"
- [ ] D16-2b demanda via `translateAiPhrase` (cache ANTES da disponibilidade
      D7/D8, caps/fallback honestos, chip honesto, sem gravação no store D16-C)
- [ ] D16-2c `filterVocab` cobre `snippet` + `senses[].literal`
- Gates: vitest · tsgo · build · lint 0/0 · Playwright (estados de falha)

## Fase 3 · Áudio de estudo
- [ ] D16-3a 🔊 palavra + 🔊 recorte no card e no sheet (PlusSpeakButton;
      plusAudio off desliga tudo; nunca áudio de PT)
- [ ] D16-3b sequência palavra→recorte cancelável (mesma Web Speech API,
      pausa constante nomeada)
- Gates: vitest · tsgo · build · lint 0/0

## Fase 4 · Sessão no contexto
- [ ] D16-4a recorte + inContext no lado de TRÁS do cartão (frente intocada);
      typedRecall/regra D15-3a/3c intactos (testes existentes sem mudança)
- [ ] D16-4b áudio pós-virada (recorte)
- Gates: vitest · tsgo · build · lint 0/0

## Fase 5 · Fluxo e AAA
- [ ] D16-5a chip de estado (vencido/em dia/consolidado) na lista — tokens,
      aria com caixa exata
- [ ] D16-5b filtros persistentes (leitura pós-hidratação; "Limpar filtros"
      limpa o persistido)
- [ ] D16-5c/d copys PT, aria-labels, ≥44px, contraste (D14-6b), varredura
      390×844 + axe 0 + console limpo nas rotas tocadas
- Gates: vitest · tsgo · build · lint 0/0 · axe 0 · overflow 0 · console limpo

## Fase 6 · Fechamento
- [ ] D16-F6a E2E versionado `scripts/e2e/proj16_f0.py` (captura com recorte →
      vocabulário → sheet completo → tradução do recorte → áudio → sessão com
      recorte; 11 rotas 390×844) — JSON no stdout, exit 1 em falha
- [ ] D16-F6b gates completos + varredura final + AGENTS.md atualizado
- [ ] D16-F6c aviso ao monitor registrado em `.opencode/monitor-notice-proj16.md`
      (envio pendente — monitor indisponível)
- Gates: todos os anteriores + E2E 100% verde

Próximo remix: (em branco enquanto o roadmap estiver em execução)
