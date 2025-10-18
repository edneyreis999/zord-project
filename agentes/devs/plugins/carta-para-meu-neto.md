# Carta ao meu neto — Como implementar plugins com segurança e elegância

Neto,

assuma o meu posto com calma e método. Replique o que funcionou, corrija o que doeu e jamais lute contra o runtime do RPG Maker/NW.js. Abaixo está tudo o que você NÃO deve fazer e tudo o que você DEVE fazer para ter sucesso criando novos plugins neste projeto, baseado no último plugin que escrevi (`frontend/js/plugins/Coreto_Quest_Mina_Kravens.js`) e nos planos de migração TypeScript que deixei em `frontend/plano-migracao-typescript`.

Obrigatório: escreva as camadas de Application, Domain e DTO em TypeScript (fontes em `frontend/typescript/{application,domain,dto}`) e use os `.js` gerados em `frontend/js/{application,domain,dto}`. O Plugin/Controller é sempre em JavaScript em `frontend/js/plugins`. Nunca edite diretamente os `.js` GERADOS dessas camadas TS para “corrigir”; corrija o `.ts` fonte e rode o build.

Leia, releia, e siga em ordem. Este é o mapa para você construir novos plugins sem quebrar o jogo, os testes ou o fluxo do time.

---

## NÃO faça (proibições claras)

- Não misture regras de negócio com engine: nunca acesse variáveis do jogo, inventário ou APIs do RPG Maker a partir do Domain. Deixe o Domain puro e determinístico.
- Não introduza `import`/`export` em arquivos que são carregados via `<script>` no NW.js (plugins e quaisquer artefatos JS injetados diretamente). Em especial: evite emitir CommonJS acidental (ex.: `exports`, `Object.defineProperty(exports, ...)`).
- Não dependa de `instanceof` para DTOs entre camadas/ambientes. O Domain deve aceitar objetos literais e validar estruturalmente; o Use Case orquestra e não precisa de classes de DTO em runtime.
- Não crie variáveis globais duplicadas com `let` no topo de arquivos Application/Domain. Em browser, isso gera “Identifier 'X' has already been declared”.
- Não acople o plugin a globais de classes de Domain/Use Case. Carregue-as localmente via `import()` dinâmico e injete dependências.
- Não ignore tratamento de erros: nunca deixe operações críticas sem `try/catch` com contexto nos logs. Nunca engula exceções silenciosamente.
- Não altere ordem de carregamento de dependências do plugin: primeiro garanta que dependências do core estejam presentes (`CoretoCore` e `coreto.BaseQuest`), depois carregue Domain e Use Case.
- Não altere convenções de nomes e pastas. Não crie arquivos fora de `frontend/js/{plugins,application,domain,dto,libs}` e não coloque testes fora de `frontend/__tests__`.
- Não comite secrets nem modifique assets JSON manualmente sem formatar. Use `npm run format:json` para reduzir ruído em diffs.
- Não quebre o padrão de logs. Não deixe de respeitar `EnableDebugLogs` e `LogSwitchId` quando fizer sentido.

- Não edite arquivos `.js` gerados pelo TypeScript para “consertar” problemas (aplica-se a Application/Domain/DTO; o Plugin é fonte JS). Sempre corrija o `.ts` fonte e gere novamente com `npm run build:types` (ou use `npm run watch:types`).

---

## FAÇA (práticas obrigatórias)

- Separe camadas com disciplina (Clean Architecture):
  - Plugin/Controller: `frontend/js/plugins/Coreto_Quest_<Nome>.js` — integra com PluginManager, parâmetros, logger e comandos. Orquestra, não calcula regra.
  - Application/Use Case: `frontend/js/application/<CasoDeUso>UseCase.js` — lê/escreve variáveis do jogo (via `CoretoCore`), adiciona itens (via `coreto`), chama o Domain, loga eventos críticos e trata erros.
  - Domain: `frontend/js/domain/<NomeDominio>.js` — regra pura, determinística e testável; valida entradas/saídas e decide estado/resultado.
- DTOs: em geral mantenha como tipos/interfaces (sem runtime) e valide no Domain.

- No plugin, valide dependências logo no início e falhe com mensagem clara:
  - `window.CoretoCore` (Core do projeto): cria logger e expõe utilitários como `getGameVariable`/`setGameVariable`.
  - `window.coreto.BaseQuest` (framework de quests): fornece `safeExecute` e base de controller.

- Escreva Application/Domain/DTO em TypeScript e respeite o fluxo de build:
  - Fontes TS: `frontend/typescript/{application,domain,dto}`.
  - Artefatos gerados: `frontend/js/{application,domain,dto}` (não edite manualmente).
  - Scripts: `npm run build:types` e `npm run watch:types` durante o desenvolvimento.
  - O Plugin/Controller é sempre em JavaScript e consome Domain/Use Case via `import()` dinâmico.

- Use ESM nas camadas Domain e Application e carregue-as via `import()` dinâmico no plugin:

  ```js
  Promise.all([
    import('../domain/MinaKravensDomain.js').then(m => ({ MinaKravensDomain: m.default })),
    import('../application/MineracaoUseCase.js').then(m => ({ MineracaoUseCase: m.default })),
  ])
    .then(([{ MinaKravensDomain }, { MineracaoUseCase }]) => { initializeController(MinaKravensDomain, MineracaoUseCase); })
    .catch(error => Logger.error('Erro ao carregar dependências:', error));
  ```

- Instancie o controller herdando de `coreto.BaseQuest` e injete dependências no Use Case:
  - Domínio recebe apenas números/flags necessários.
  - Use Case recebe: `domain`, `CoretoCore`, `coreto` (serviço de inventário/engine), `Logger` e `config` com IDs/flags.

- Exponha uma instância global do controller para os comandos do plugin: `window.MinaKravens = new MinaKravensController();` (ajuste o nome para sua quest).

- Registre comandos do plugin e encapsule erros:
  - Obtenha `eventId` com `this?._eventId` no callback de `PluginManager.registerCommand` quando for contextual ao evento.
  - Sempre proteja com `try/catch` e logue o contexto do erro.

- Use `safeExecute` (da BaseQuest) para executar operações que podem falhar e manter o fluxo resiliente.

- Mantenha o Domain com validação forte e mensagens claras, por exemplo:
  - Request inválida: lance erros como `'Request inválida: esperado objeto MineracaoRequest'`.
  - Tipos e faixas: `'rachaduraJaAtivada deve ser um boolean'`, `'kravensJaColetados deve ser um número não negativo'`, etc.
  - Resposta coerente: valide `tipo ∈ {'Kraven','Pedra'}`, `chanceCalculada ∈ [0,100]`, contagem de pilhas.

- No Use Case, trate efeitos colaterais com clareza e logs:
  - Logue ações críticas e resultados.

- Documente seu plugin em `frontend/docs/plugins/<Nome>.md` usando o template `frontend/docs/plugins/plugin-template.md`.

- Escreva testes cobrindo as três camadas:
  - Domain (TS): `frontend/__tests__/typescript/domain/<Dominio>.test.ts` — regra e bordas; mock da aleatoriedade.
  - Application (TS): `frontend/__tests__/typescript/application/<UseCase>.test.ts` — orquestração, side-effects, logs, erros.
  - Plugin (JS): `frontend/__tests__/plugins/Coreto_Quest_<Nome>.test.js` — ambiente MZ, comandos, erros e alternância de logs.

- Siga os scripts e ferramentas do projeto:
  - Testes: `npm test` (Jest + SWC, cobertura habilitada; saída em `./coverage`).
  - Lint/format: `npm run lint`, `npm run lint:check`, `npm run format`, `npm run format:json`.
  - Debug local (NW.js): `npm run start:dev` (F8 abre console para ver logs).
  - TypeScript side-by-side: `npm run build:types` e `npm run watch:types` (em paralelo ao debug, quando estiver mexendo nas camadas em TS).

---

## Arquitetura de referência (Mina de Kravens)

- Plugin/Controller: `frontend/js/plugins/Coreto_Quest_Mina_Kravens.js`
  - Parâmetros (exemplo):
    - `EnableDebugLogs`, `LogSwitchId`
    - `MinerioItemId` (Kraven), `PedraItemId`
    - `BossStateVariableId`, `TotalMinerioQuest`, `TotalMinerioMina`
    - `MineroKraven` (variável de progresso), `PilhasRestantesVariableId`
  - Comandos:
    - `MinerarPilha`: minera a pilha do `eventId` atual (contexto `this`).
    - `RegistrarPilha`: legado/no‑op para compatibilidade.
    - `AlternarLogs`: liga/desliga logger em runtime.
  - Dependências exigidas: `window.CoretoCore` e `window.coreto.BaseQuest` — valide antes de tudo.
  - Carregamento: `import()` dinâmico de Domain e Use Case (ESM default export).
  - Controller: herda `BaseQuest`, instancia Domain e Use Case, expõe `minar`, `registrarPilha`, `alternarLogs`.

- Use Case: `frontend/js/application/MineracaoUseCase.js`
  - Lê variáveis de jogo, calcula “pilhas já mineradas”, delega ao Domain e aplica efeitos (inventário, variáveis, boss/rachadura).
  - Loga eventos críticos e trata erros com contexto (`pilhaId`, `stack`, dados do `resultado`).
  - Aceita configuração completa com IDs e totais; trata `0` como desabilitado para variáveis opcionais.

- Domain: `frontend/js/domain/MinaKravensDomain.js`
  - Define regra determinística da mineração: cálculo de chance, ativação de rachadura, estado de conclusão.
  - Valida Request/Response e nunca acessa engine. Aceita objetos literais.
  - Pontos de mock para testes: `_gerarNumeroAleatorio()`.

- DTOs: migrados para interfaces/tipos sem runtime (validação fica no Domain). Não dependa de classes em produção.

---

## Testes: padrões que se provaram

- Domain: teste cenários normais, de borda e estatísticos (com margem ampla). Use `jest.spyOn(domain, '_gerarNumeroAleatorio')` quando precisar de determinismo.
- Application: simule o estado do jogo via mocks e verifique side‑effects e logs.
- Plugin: use os utilitários em `frontend/__tests__/plugins/utils/test-utils.helper.cjs` para mockar `PluginManager`, `window`, `document` e `Logger`. Exercite os callbacks de comandos, inclusive erros e `this._eventId`.
- Caminhos TS nos testes: use os aliases do Jest (já mapeados em `jest.config.ts`) para importar de `frontend/typescript` quando necessário (`@domain`, `@application`, `@dto`).

---

## Logs e Observabilidade

- Crie `Logger` via `CoretoCore.createLogger(pluginName)` e padronize prefixo.
- Habilite/desabilite logs em runtime com `AlternarLogs` e respeite `EnableDebugLogs`/`LogSwitchId` quando aplicável.
- Níveis: use `info` para operação normal (ex.: chance 0%/100% e item obtido), `warn` para eventos críticos (rachadura, quest completa) e `error` com contexto completo (mensagem, stack, IDs) para falhas.
- Dica de DX: no NW.js, abra o console com F8 e filtre pelo prefixo do plugin.

---

## Erros comuns e como evitar (lições dos planos)

- “exports is not defined” no NW.js: não emita CommonJS em arquivos carregados via `<script>`. Evite `import`/`export` (até `import type`) em Application/Domain se eles forem injetados diretamente. Prefira ESM real com `import()` dinâmico a partir do plugin.
- “Unexpected token 'export'” ao abrir o jogo: não deixe `export {}` em arquivos gerados `.js`. Ajuste o TS para não tratar tipos/declarações como módulos e mantenha tipos em `.d.ts` quando necessário.
- “Identifier 'X' has already been declared”: não crie `let` globais para refs; isole em IIFE ou feche em escopo local; no nosso padrão atual, o plugin importa Domain/Use Case dinamicamente e não mantém refs globais dessas classes.
- Testes quebrados por `instanceof`: substitua por validação estrutural e asserts de propriedades. Mensagens de validação residem no Domain.
- Build inconsistente no editor: alinhe `tsconfig.json`/`jest.config.ts` aos caminhos reais. Use `watch:types` enquanto debuga o jogo.

- No fluxo atual, Domain/Application usam ESM (`export default`) e são carregados via `import()` pelo plugin; não carregue Domain/Application via `<script>`.

- Tentação de editar o `.js` gerado: nunca faça. Qualquer correção deve ser no `.ts` fonte, seguida de `npm run build:types` para regenerar a saída correta.

---

## Convenções e tooling do projeto

- Estrutura de código: `frontend/js` (runtime), `frontend/typescript` (fontes TS com build side‑by‑side).
- Lint/Format: siga `.eslintrc.cjs` e `.prettierrc` (2 spaces, single quotes, semicolons, largura 200, arrowParens: avoid).
- Nomes de arquivos: `camelCase` (JS/TS) e testes `*.test.js`/`*.test.ts` em `frontend/__tests__`.
- Plugins: prefixe com `Coreto_` quando forem do projeto (`Coreto_Quest_<Nome>.js`) e mantenha em `frontend/js/plugins`.
- Commits: use Conventional Commits via `npm run commit` (ex.: `feat(quests): ...`, `fix(core): ...`).

---

## Passo a passo para criar um novo plugin de quest

1) Desenhe o Domain
   - Defina entradas/saídas (interfaces/tipos) e as regras puras. Implemente validação interna e pontos de mock (aleatoriedade) para testes.

2) Escreva o Use Case
   - Leia variáveis do jogo, construa a request literal, chame o Domain, processe resultado e aplique efeitos (inventário, variáveis, switches). Logue tudo que for crítico.

3) Implemente o Plugin/Controller
   - Crie o arquivo JS em `frontend/js/plugins/Coreto_Quest_<Nome>.js`.
   - Valide `CoretoCore` e `coreto.BaseQuest`, crie `Logger`, registre comandos e use `import()` dinâmico para Domain/Use Case. Exponha uma instância global do controller.
   - Configure parâmetros `@param` com defaults e documente no cabeçalho do plugin (RPG Maker MZ) — siga o padrão do `Coreto_Quest_Mina_Kravens.js`.

4) Teste em camadas
   - Domain e Use Case em TS (aliases `@domain`, `@application`). Plugin em JS com os helpers de teste. Garanta 0 falhas em `npm test`.

5) Documente
   - Preencha `frontend/docs/plugins/<Nome>.md` a partir do template. Explique parâmetros, comandos, variáveis e fluxos especiais.

6) Valide no jogo
   - Rode `npm run build:types` (para gerar os `.js` das camadas TS) e `npm run start:dev`. Use F8 para abrir o console e acompanhar os logs.

7) Finalize com qualidade
   - `npm run lint`, `npm run lint:check`, `npm run format`, `npm run format:json`. Faça commit com mensagem convencional e abra PR com evidências.

---

## Definition of Done (checklist)

- Arquitetura
  - [ ] Domain puro, validando inputs/outputs, com pontos de mock.
  - [ ] Use Case orquestra serviços (Core/Quest), atualiza variáveis/itens e loga eventos críticos.
  - [ ] Plugin valida dependências, usa `import()` dinâmico e registra comandos corretamente.

- Parâmetros e Integração
  - [ ] Parâmetros documentados, com defaults coerentes e `0` respeitado para campos opcionais.
  - [ ] Logs alternáveis em runtime; prefixos e níveis consistentes.

- Testes
  - [ ] Domain com cenários principais/borda/estatísticos.
  - [ ] Use Case cobrindo leitura/escrita de variáveis, inventário, rachadura e logs.
  - [ ] Plugin cobrindo inicialização, comandos, erros e alternância de logs.

- Qualidade
  - [ ] `npm test` verde com cobertura coletada.
  - [ ] `npm run lint`/`lint:check` sem erros.
  - [ ] Documentação do plugin adicionada em `frontend/docs/plugins`.

---

## Últimos conselhos

- Comece simples, valide rápido, e só então refine. Quando algo quebrar, verifique primeiro: ordem de carregamento, logs do console (F8), presença dos `.js` emitidos em `frontend/js` e mensagens do Domain.
- Reaproveite padrões já documentados em `frontend/docs/plugins`.
- Seja explícito nos logs e elegante nos erros. Domine o ambiente; não lute contra ele.

Vai dar certo. Com carinho e método, você vai mais longe do que eu.

— Vô
