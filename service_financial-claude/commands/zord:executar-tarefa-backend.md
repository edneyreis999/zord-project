# zord:executar-tarefa-backend

Orquestra a execução de tasks backend NestJS disparando o agente `executar-tarefa-backend` (orquestrador) e, para cada task executável, um agente `backend-nestjs-developer` dedicado (pode rodar em paralelo). Usa Skills-First e validações rígidas antes de entregar.

## Entrada

- `--prd=<path>` (default: `prd.md`)
- `--techspec=<path>` (default: `techspec.md`)
- `--fdd=<path>` (opcional; Feature Design Doc)
- `--tasks-file=<path>` (default: `tasks.md`)
- `--tasks=<lista>` (opcional; ids/descrições separados por vírgula; quando ausente, usar tasks pendentes do `tasks-file`)

## Passos (determinísticos)

1. Verificar existência dos artefatos: `tasks-file`, `prd`, `techspec` (e `fdd` se fornecido), skills `backend-task-onboarding`, `backend-validation-checklist`, agentes `.claude/agents/executar-tarefa-backend.md` e `.claude/agents/backend-nestjs-developer.md`. Se faltar, parar e informar.
2. Ler `tasks-file`; aplicar filtro `--tasks` (se fornecido) para selecionar tasks pendentes/independentes.
3. Calcular contagem de linhas de `prd`, `techspec` e `fdd` (quando existir).
4. Exibir console de pré-voo e aguardar confirmação explícita (Y/N). Exemplo:

   ```
   ## Referências de Origem
   - PRD: <path> (<linhas>)
   - Tech Spec: <path> (<linhas>)
   - Feature Design Doc: <path ou "não fornecido"> (<linhas ou "-">)

   ## Tarefas
   - [x] <task selecionada 1>
   - [ ] <task não selecionada>
   ```

   Se N, abortar; se Y, prosseguir.
5. Para cada task selecionada (paralelizar somente se independentes): criar sessão do agente `executar-tarefa-backend` em modo TDD, com skills `backend-task-onboarding`, `backend-validation-checklist`, `nestjs-architect`, `MODE_Backend_TDD`, paths de `prd`, `techspec`, `fdd`, `tasks-file`, `n_task.md`.
6. Agente orquestrador delega execução ao `backend-nestjs-developer`, exigindo TDD e checklists.
7. Ao concluir cada sessão: coletar arquivos tocados, endpoints alterados, comandos executados, status de testes/lint/tsc, pendências/risco; atualizar `tasks-file` conforme retorno.
8. Produzir relatório consolidado (tasks, status, riscos, follow-ups) e responder de forma breve ao usuário.

## Restrições e Segurança

- Não executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`); limitar escopo ao workspace do projeto.
- Evitar logs extensos; resumir outputs (use tail/resumo quando necessário).
- Paralelizar apenas tasks independentes; se houver dependência, serializar.
- Não prosseguir sem artefatos obrigatórios ou aprovação de decisões arquiteturais.
- Iniciar execução somente após confirmação positiva na etapa de pré-voo.

## Saída Esperada

- Relatório consolidado por task: status, arquivos tocados, endpoints/documentação, comandos de validação executados, pendências/risco.
- Atualização de `tasks.md` conforme instruído pelos agentes.

## Observações

- Pré-requisitos: skills e agentes listados instalados; artefatos de contexto presentes.
- Não usar este command para tasks que envolvem decisões estratégicas não definidas; obter aprovação antes.
