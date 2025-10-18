# Template — Plano Técnico (Devs/Plugins)

<!--
Derivado dos melhores tópicos e estratégias dos planos em
`frontend/plano-migracao-typescript/*` e das heurísticas de
`zord/agentes/game-designs/persona_throllim_cinza_memoria.md`.

Use este template para planejar migrações técnicas, refactors de plugins,
ou mudanças estruturais (TS/NW.js/Jest/ESLint). Campos com <> são para preencher.
Mantenha o foco em: objetivo claro, etapas verificáveis, critérios objetivos.
-->

## Cabeçalho

- Nome do plano: <nome-conciso-do-plano>
- Data: <AAAA-MM-DD>
- Owner: <responsável>
- Stakeholders: <lista>
- Status: <draft|em-progresso|concluido>

## Objetivo & Escopo

- Objetivo: <1–2 frases diretas e testáveis>
- Escopo: <arquivos/áreas afetadas>
- Fora de escopo: <explícito para reduzir ambiguidade>
- Resultado esperado: <como validar que terminou>

## Contexto e Restrições

- Runtime: <NW.js / Browser sem bundler / Node+Jest>
- Carregamento: <via <script> / dynamic import / bundler>
- Estrutura alvo (se aplicável): <Clean Architecture: domain, application, dto>
- Compatibilidade: <não quebrar jogo | manter Jest verde | manter plugins estáveis>

## Premissas e Assunções

- Premissas: <lista de verdades operacionais explicitas>
- Dependências: <p.ex., jest.config.ts, tsconfig.json, plugins.js>
- Riscos conhecidos: <lista>
- Se faltar informação:
  - Registrar perguntas bloqueadoras em “Decisões & Pendências”.
  - Adotar defaults seguros (não quebrar runtime/testes) e marcar como “provisório”.
  - Inserir checkpoints de validação (smoke test, `npm test`, `npm run debug`).

## Estratégia

- Incremental e reversível: migrar em camadas/etapas com smoke tests e rollback por etapa.
- DTOs como tipos (sem runtime): interfaces/aliases; validações no Domain.
- Evitar `import/export` em scripts carregados via `<script>` (NW.js): usar IIFE + `globalThis` e `module.exports` condicional.
- Plugins: reduzir acoplamento a globais; preferir `import()` dinâmico com shims temporários.
- Configuração mínima eficaz: tsconfig único quando possível; aliases + `moduleNameMapper` no Jest alinhados; lint/format cobrindo TS.
- Observabilidade: checklists por etapa, critérios de aceite objetivos, rollback documentado.

## Caminho do Raciocínio (passo a passo)

<!-- Descreva como o plano foi pensado. Use 5–10 passos curtos.  -->
1) Mapear ambiente (NW.js, Jest, ESLint, TS).
2) Levantar fonte de erro atual (ex.: `exports is not defined`, `Unexpected token 'export'`).
3) Escolher tática de compat: IIFE+globalThis vs. ESM com shims/dynamic import.
4) Delimitar escopo incremental (DTO → Domain → Application → Plugins).
5) Ajustar configuração (tsconfig/jest) minimamente para não quebrar runtime.
6) Definir smoke tests e critérios por etapa.
7) Planejar rollback sem efeitos colaterais.
8) Validar riscos e pontos de observabilidade.
9) Planejar documentação e comunicação das mudanças.
10) Fechar critérios globais de aceite.

## Alternativas de Mercado (com prós e contras)

### Alternativa A — Bundler (Rollup/Esbuild/Vite) emitindo UMD para NW.js

- Prós: empacota ESM/CJS; reduz globais; minificação; tree‑shaking.
- Contras: complexidade de build; ajustes em runtime do MZ; debug diferente.
- Quando usar: se plugins/código crescerem e dinamismo ESM for necessário.

### Alternativa B — `tsup`/`esbuild` só para camadas TS (Domain/App)

- Prós: configuração mínima; saída ESM/CJS; rápido; mapas de fonte.
- Contras: still bundling step; integrações Jest/NW.js a alinhar.
- Quando usar: quer padronizar ESM mantendo NW.js estável com UMD/CommonJS.

### Alternativa C — Tipagem via JSDoc (JS puro)

- Prós: zero build TS; adoção gradual; boa DX em IDE.
- Contras: sem checks TS completos; tipos menos robustos.
- Quando usar: escopo curto/pouco risco; sem tempo para pipeline TS.

### Alternativa D — Validação runtime com Zod/Valibot

- Prós: safety em produção; contratos claros; mensagens úteis.
- Contras: custo de bundle/runtime; precisa empacotar.
- Quando usar: inputs externos não confiáveis; domínios críticos.

### Alternativa E — Project References (TS) + mono‑workspace

- Prós: builds incrementais por pacote; escalabilidade.
- Contras: complexidade; overhead inicial.
- Quando usar: codebase vai ampliar módulos/camadas com release independente.

## Tasks (detalhadas)

<!-- Para cada task: Descrição, Objetivo, Resultado esperado, Critérios de aceite, Notas.  -->

### Task 1 — Inventário e Diagnóstico

- Descrição: mapear arquivos-alvo; escanear injeção de CommonJS/ESM; listar dependências de globais.
- Objetivo: ter visão do estado e pontos de risco.
- Resultado esperado: checklist inicial + trechos com `exports`/IIFE + ordem de carga.
- Critérios: comandos de busca retornam vazios/esperados após correções.

### Task 2 — Configuração mínima (TS/Jest/ESLint)

- Descrição: alinhar `tsconfig.json` (rootDir/outDir, `moduleDetection`, aliases), `jest.moduleNameMapper`, lint/format para TS.
- Objetivo: garantir build/typecheck e testes estáveis.
- Resultado esperado: `tsc --noEmit` e `npm test` verdes; lint ok.
- Critérios: caminhos e mappers resolvendo corretamente.

### Task 3 — DTOs como tipos sem runtime

- Descrição: mover DTOs para `.d.ts` ou `export type` consumidos via `import type` sem emitir; remover dependência de classes.
- Objetivo: eliminar `instanceof` e evitar artefatos em browser.
- Resultado esperado: Domain usa interfaces; plugin não carrega DTOs.
- Critérios: sem `export {}` em saída; testes atualizados.

### Task 4 — Domain: IIFE + validação interna

- Descrição: encapsular, expor via `globalThis`/`module.exports`, validar input/output.
- Objetivo: compatibilidade total com NW.js; segurança de dados.
- Resultado esperado: sem `exports is not defined`; mensagens coerentes.
- Critérios: smoke test no NW.js passa; jest verde.

### Task 5 — Application: IIFE e dependências locais

- Descrição: remover `let` globais; resolver DTOs/Domain via função local; expor classe no final.
- Objetivo: evitar colisões de identificadores globais.
- Resultado esperado: sem `Identifier has already been declared`.
- Critérios: debug roda; testes ok.

### Task 6 — Plugins: reduzir globais / `import()` dinâmico

- Descrição: trocar acessos a `window.*` por referências locais via `import()` e shims temporários.
- Objetivo: preparar transição a ESM sem alterar comportamento.
- Resultado esperado: fluxo do plugin intacto.
- Critérios: smoke test in‑game passa.

### Task 7 — Observabilidade, Rollback e Docs

- Descrição: adicionar checklists/prints; plano de rollback por etapa; atualizar README/PLANO_*.
- Objetivo: previsibilidade e comunicação.
- Resultado esperado: diffs focados; passos reproduzíveis.
- Critérios: seção de rollback presente; evidências anexadas.

## Critérios de Aceite (globais)

- `npm test` verde; cobertura estável.
- `tsc --noEmit` sem erros.
- `npm run debug` sem `exports`/colisões de identificadores.
- Plugins mantêm comportamento funcional.

## Riscos & Mitigações

- ESM em NW.js sem bundler: mitigar com IIFE/shim; considerar bundler no futuro.
- Dependência de globais em plugins: mitigar com `import()` e migração gradual.
- Testes acoplados a `instanceof`: refatorar para validação estrutural.

## Decisões & Pendências

- Decisões tomadas: <lista curta + data + motivo>
- Pendências/bloqueios: <perguntas; quem responde; prazo>

## Checklists & Progresso

- Itens concluídos: x/y (z%)
- Checklist por etapa: <marcar caixas>

---

<!-- FIM DO TEMPLATE -->
