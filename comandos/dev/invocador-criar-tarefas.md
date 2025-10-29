# Invocador do Criador de Tarefas — Orquestração e Configuração

Assuma a orquestração do agente definido em [criador-tarefas.md](../../agentes/devs/criador-tarefas.md).
Objetivo: a partir de um PRD e de uma Especificação Técnica existentes, gerar um resumo de tarefas e arquivos de tarefas individuais, organizados por dependências e oportunidades de paralelização, salvando o resultado no caminho padronizado do projeto chamador.

## Parâmetros da sessão (invocador)

- `inputs` (mínimos e obrigatórios):
  - `projectRoot`: caminho absoluto do projeto que invoca (ex.: `/Users/edney/projects/pocs/pingos`). NUNCA salvar dentro de `zord-project`.
  - `prdPath`: caminho do PRD da funcionalidade. Imprescindível fornecer ao invocar.
  - `techSpecPath`: caminho da Especificação Técnica da funcionalidade. Imprescindível fornecer ao invocar.
  - `nomeFuncionalidade`: nome curto/slug herdado do PRD aprovado (será usado no `<slug>`).
- `outputs`:
  - `resultDir`: `<projectRoot>/planos/tasks/<slug>/`.
  - `tasksIndexPath`: `<projectRoot>/planos/tasks/<slug>/tasks.md`.
  - `taskFilesPattern`: `<projectRoot>/planos/tasks/<slug>/<num>_task.md`.
- `knowledgeBase` (padrão):
  - [tasks-template.md](../../templates/tasks-template.md), [task-template.md](../../templates/task-template.md), além de `prdPath` e `techSpecPath` informados.
- `policies`:
  - Linguagem PT‑BR; seguir a estrutura dos templates.
  - Naming: `<slug>` em kebab-case derivado de `nomeFuncionalidade`.
  - Salvar sempre em `resultDir` do projeto chamador. Histórico via Git (sem versões `vN`).
  - Proibido salvar dentro de `zord-project`.
  - Exibir sumário e caminhos salvos ao final.
- `limits`:
  - `maxPerguntasPlanejamento`: 3–6 para remover ambiguidades remanescentes.

Regras de precedência: o que não for informado usa defaults da persona [criador-tarefas.md](../../agentes/devs/criador-tarefas.md).

### Resolução do diretório do projeto chamador

- Preferir `inputs.projectRoot` explícito.
- Caso não informado, inferir pela sessão/ambiente (ex.: arquivo `*.code-workspace` aberto que contenha `zord-project` e o projeto alvo).
- Em caso de ambiguidade, perguntar o caminho do projeto e não salvar até confirmar.

## Sequência mínima de alinhamento (uma por vez, só se faltar)

1) Confirmação de `prdPath` e `techSpecPath` válidos (ambos são IMPRESCINDÍVEIS).  
2) `nomeFuncionalidade`/`slug`.  
3) Restrições, prioridades e fases (se houver).  
4) Fontes/links/arquivos adicionais relevantes.  

Se persistirem dúvidas após isso, fazer perguntas objetivas até `maxPerguntasPlanejamento`.

## Passos de orquestração

1) Validar/descobrir `projectRoot` e verificar existência de `prdPath` e `techSpecPath`. Confirmar com o usuário em caso de dúvida.  
2) Preparar briefing de planejamento: sintetizar `inputs` + `knowledgeBase` em 6–12 bullets objetivos para a persona.  
3) Invocar [criador-tarefas.md](../../agentes/devs/criador-tarefas.md) com o briefing, informando claramente `resultDir`, `tasksIndexPath` e `taskFilesPattern`.  
4) Receber o resumo de tarefas (`tasks.md`) e os arquivos de tarefas individuais conforme templates.  
5) Salvamento: criar diretório `<projectRoot>/planos/tasks/<slug>/` e salvar `tasks.md` + arquivos `<num>_task.md`.  
6) Exibir caminhos salvos e um resumo do plano (sequência, dependências, trilhas paralelas).  
7) Iteração (opcional): aplicar ajustes solicitados e re‑salvar (sem versões `vN`).

## Saída padrão (contrato com a persona)

- O índice deve seguir [tasks-template.md](../../templates/tasks-template.md) e as tarefas individuais [task-template.md](../../templates/task-template.md).
- Evidenciar dependências sequenciais versus oportunidades de execução paralela.
- Incluir critérios de sucesso e subtarefas por tarefa principal.

## Comandos aceitos (atajos)

- `Aprovar` — aceita o conteúdo atual e mantém os arquivos salvos.  
- `Ajustar <tarefa|secao>` — reescreve somente a parte indicada e re‑salva.  
- `Fornecer arquivo:<path>` — adiciona arquivo como fonte; reinvocar com o novo contexto.  
- `Refazer` — reinicia a partir da sequência mínima de alinhamento.  

## Quickstart

Envie em uma única mensagem:  
`ProjectRoot:` caminho absoluto  |  `PRD:` `<projectRoot>/planos/prds/<slug>/prd.md`  |  `TechSpec:` `<projectRoot>/planos/techspecs/<slug>/techspec.md`  |  `Funcionalidade:` nome curto  |  `Prioridades/Restrições:` bullets  |  `Fontes:` paths/links.  

O invocador validará os caminhos, criará o briefing e invocará [criador-tarefas.md](../../agentes/devs/criador-tarefas.md). Em seguida, salvará `tasks.md` e arquivos `<num>_task.md` em `<projectRoot>/planos/tasks/<slug>/` e retornará os caminhos e o sumário.
