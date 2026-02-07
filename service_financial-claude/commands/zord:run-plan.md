---
name: zord:run-plan
description: Executa plano de tasks gerado pelo generate-action-plan respeitando stages, paralelismo e matriz de conflitos
tools: Task, AskUserQuestion, Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

# Run Plan

Executa `tasks.xml` + tasks individuais respeitando execution_plan.

## Passo 0: Health Check

Validar que `tasks.xml` existe no diretorio informado. Ler `<execution_plan>` e todas `<task_ref>`. Se `<validation_status>` ausente, avisar e perguntar: continuar (execucao serial-only) ou abortar para `/enrich-tasks`.

## Passo 1: Perguntas

Q1: Diretorio do plano (string com tasks.xml)
Q2: Modo de execucao
- "Automatico" - Executa stages sequencialmente sem pausa
- "Stage-by-stage" - Pausa entre stages para aprovacao
- "Dry-run" - Simula sem executar, exibe ordem e conflitos

Q3: Escopo
- "Plano completo" - Todos os stages
- "A partir do stage N" - Retomar execucao (informar N)
- "Tasks especificas" - Selecionar por ID ("1,3,5")

## Passo 2: Carregar Plano

Ler tasks.xml. Para cada stage do `<execution_plan>`:

1. Coletar task_refs do stage
2. Ler XML individual de cada task
3. Extrair `<resources>` (path, group, mode) e `<properties>` (serial_only)
4. **Validar conflitos em runtime**: aplicar matriz no mesmo path/group:
   - read + read = PARALELO
   - qualquer write = SERIAL
5. Se serial_only=true, isolar task (nao paralelizar)
6. Agrupar tasks em **batches** respeitando max_parallel e conflitos

Defaults: fail_fast=true, max_parallel=sem limite (salvo override no XML).

Exibir plano resumido (stages, tasks por stage, conflitos detectados, defaults aplicados). **Pedir confirmacao Y/N** antes de executar. Se N, abortar.

## Passo 3: Executar Stages

Para cada stage (level crescente):

### 3.1 Gate Check

**Task 00 e gate absoluto**: se Task 00 (health check baseline) falhar → plano inteiro BLOCKED, nao prosseguir independente de fail_fast. Para demais stages: se anterior falhou e fail_fast=true (default) → ABORT com relatorio parcial.

### 3.2 Dispatch Paralelo

Enviar N chamadas `Task()` em UMA UNICA mensagem (1 por task do batch):

```
Task(subagent_type="general-purpose", prompt="Executar task 01: {{TITLE}}. Steps: {{STEPS}}. Files: {{FILES_TO_MODIFY}}. Criteria: {{CRITERIA}}.")
Task(subagent_type="general-purpose", prompt="Executar task 02: {{TITLE}}. Steps: {{STEPS}}. Files: {{FILES_TO_MODIFY}}. Criteria: {{CRITERIA}}.")
```

Se task XML contiver `<agent_hint>`, usar como subagent_type em vez de "general-purpose". Batches com conflito de resource executam sequencialmente dentro do stage.

### 3.3 Coletar Resultados

Para cada task concluida, coletar do subagente: arquivos tocados, comandos executados, erro (se falhou).
- Atualizar `<status>` no XML individual: pending → done | failed
- Se failed: registrar erro, avaliar fail_fast

### 3.4 Checkpoint

Atualizar tasks.xml com `<execution_status>`:

```xml
<execution_status>
  <last_stage_completed>{{N}}</last_stage_completed>
  <task_results>
    <result id="{{ID}}" status="done|failed" duration_s="{{S}}">
      <files_touched>{{FILE_LIST}}</files_touched>
      <commands_run>{{CMD_LIST}}</commands_run>
      <error_excerpt>{{IF_FAILED}}</error_excerpt>
    </result>
  </task_results>
</execution_status>
```

Se mode=stage-by-stage: pausar e perguntar "Continuar para stage {{N+1}}?".

## Passo 4: Relatorio Final

```
+==============================================================+
|                    EXECUTION REPORT                           |
+==============================================================+
| Stage | Tasks | Passed | Failed | Skipped | Duration         |
|-------|-------|--------|--------|---------|------------------|
|   0   |   1   |   1    |   0    |    0    | 12s              |
|   1   |   3   |   2    |   1    |    0    | 45s              |
+-------|-------|--------|--------|---------|------------------+
| TOTAL |   4   |   3    |   1    |    0    | 57s              |
+==============================================================+

Failed Tasks:
  [FAIL] Task 02: {{TITLE}} - {{ERROR_SUMMARY}}

Files Touched: {{TOTAL}} | Commands Run: {{TOTAL}}

Next Steps:
  - Fix task 02 and re-run: /run-plan --from-stage 1 --tasks 02
```

## Restricoes de Seguranca

- Nao executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`)
- Limitar escopo ao workspace do projeto
- Nao prosseguir sem confirmacao na etapa de pre-voo
- Violacao de seguranca → task BLOCKED, registrar no relatorio
