---
name: zord:enrich-tasks
description: Enriquece tasks existentes identificando e preenchendo gaps via PAL MCP consensus com modelo de completude de 8 dimensoes
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep
model: sonnet
---

# Enrich Tasks

Avalia e enriquece tasks XML contra 8 dimensoes de completude. Referencia: `planos/015-arrumando-agentes/TASK_COMPLETENESS_MODEL.md`.

## Passo 0: Health Check e Deteccao de Modo

Invocar `mcp__pal__version()`. Se falhar: erro claro e abortar.

**Modo Automatico**: args contem `--context-file <path>` → ler JSON, pular Passos 1-2.
**Modo Interativo**: args vazio → perguntas ao usuario.

## Passo 1: Localizar Tasks (Interativo)

Perguntar diretorio das tasks. Validar existencia de tasks.xml e `<num>_task.xml`. Listar tasks encontradas.

## Passo 2: Perguntas (Interativo)

Q1: Quais tasks analisar? (todas | especificas: "1,3,5" | range: "1-5")
Q2: Fonte para gaps? (terminal | codebase | analysis.xml | techspec.md | multiplos - apontar caminhos)
Q3: Modelo para consensus? (default: gpt-5.2)

## Passo 3: Task Completeness Report (8 Dimensoes)

Para cada task (exceto Task 00), avaliar via `mcp__pal__consensus`:

| ID | Dimensao | Gate | Criterio PASS |
|---:|---|---|---|
| D1 | Objetivo & Mudanca Observavel | P0 | Antes/depois claro |
| D2 | Referencias & Rastreabilidade | P0 | Techspec com secao/ancora |
| D3 | Localizacao no Repo | P0 | files_to_modify OU discovery |
| D4 | Decisoes & Contratos | P0/P1 | Escolhas bloqueantes resolvidas |
| D5 | Escopo Controlado | P1 | in/out explicito |
| D6 | Passos Executaveis | P0 | Steps ordenados verificaveis |
| D7 | Validacao & Testes | P0 | Comandos + GWT |
| D8 | Riscos Nao-Funcionais | P2 | Security/PII/perf (se aplicavel) |

**Validacao do execution_plan (tasks.xml)**: Verificar que `<execution_plan>` existe e contem stages validos. Validar que dependencies batem com o plano (topological sort). Tasks no stage N devem depender apenas de tasks nos stages < N.

Resultado por dimensao: PASS(2) | WARN(1) | FAIL(0).
`completeness_score = soma / (2 * N_dimensoes)`

**Status derivado:**

- **READY**: Zero FAIL em P0, sem open_questions
- **NEEDS_INPUT**: FAIL em P0 por info ausente → gerar `<open_questions>`
- **BLOCKED**: Impossibilidade pratica (D6 FAIL)

Agrupar gaps: independentes (paralelos) vs dependentes (sequenciais).

## Passo 4: Preencher Gaps (Discovery sem budget)

**Estrategia por fonte**: codebase (D3 primario, D6, D7 tests, D8 hotspots), techspec.md (D1, D2, D4, D5, D6, D7, D8), analysis.xml (D4 contratos/arquitetura, D8 restricoes NFR, apoio D3), terminal (D6/D7 comandos reais, validacoes, logs). Se apos todas as fontes qualquer gap P0 persistir: marcar NEEDS_INPUT e gerar open_questions com opcoes concretas + recomendacao.

**Gaps independentes**: invocar multiplos `Task(subagent_type="Explore")` em PARALELO por modulo.
**Gaps dependentes**: analise sequencial.
**Consolidar findings**: apos retorno dos agentes paralelos, merge obrigatorio — dedup evidencias, resolver conflitos entre fontes, alinhar recomendacoes e atualizar open_questions se houver divergencia.

## Passo 5: Enriquecer Artefatos

Para cada task com gaps:

- Atualizar secoes existentes no XML
- Adicionar tags conforme vocabulario: `<discovery>`, `<decisions>`, `<validation>`, `<assumptions>`, `<open_questions>` (so NEEDS_INPUT), `<non_functional_requirements>`, `<rollout>`, `<rollback>`
- **Formato open_questions**: incluir `<options>` (N opcoes + sempre ultima "Outro: descreva"), `<recommendation>` (option_id + reasoning), `<tradeoffs>` (riscos/custos por opcao), `<impact>` (o que muda no plano se escolher cada opcao), `<sources_consulted>` (paths + trechos relevantes)
- Adicionar `<enriched_by_consensus>` com gap, source, timestamp, model, dimensao
- **METADADOS DE PARALELIZACAO**: Extrair `<properties>` (idempotent, estimated_cost) e `<resources>` (path, mode, group). Aplicar matriz: read+read=PARALELO; qualquer write no mesmo path/group=SERIAL. Task sem `<resources>` → marcar `serial_only`. Normalizar paths antes de comparar
- Validar XML apos modificacao

Atualizar tasks.xml com `<validation_status>` incluindo `<task_statuses>` (id, status, score por task).

## Passo 6: Relatorio Final

Apresentar: resumo (tasks, status, scores), gaps por dimensao. **SE houver NEEDS_INPUT**, exibir:

```
### ⚠️ Task XX: [titulo] precisa de sua decisao

**Pergunta Q1:** [texto]

Opcoes:
- [A] [desc A]
- [B] [desc B]
- [C] [desc C]
- [Outro] Descreva sua alternativa

Trade-offs:
- A: [risco/custo]  - B: [risco/custo]  - C: [risco/custo]

Impacto: se escolher [X], os passos [Y] mudam para [Z]

🤖 Recomendacao: **Opcao X** - [justificativa]
Fontes consultadas: [somente fontes realmente usadas, com paths]
```

Gerar `enrichment-report.md`.
