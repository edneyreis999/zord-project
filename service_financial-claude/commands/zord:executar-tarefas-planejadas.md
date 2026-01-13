# zord:executar-tarefas-planejadas

Orquestra a execução de tasks planejadas detectando automaticamente os arquivos `tasks.md` e `<num>_task.md`. Dispara o agente `executar-tarefa` (orquestrador) para validar e executar as tasks.

## fase 1 Detecção de Contexto

1. Identifique em qual projeto você está:
   - Execute uma análise do diretório atual (pwd).

2. detectar tasks

- detectar se no diretorio informado pelo usuario contem ao menos um arquivo `tasks.md` e um `<num>_task.md`

Se não encontrar, aborte e sinalize o usuario. peça para ele informar o caminho correto.

## fase 2 Passos (determinísticos)

### Pré-análise Automática (obrigatória)

Antes de avançar para proxima fase

1. **Ler e analisar tasks**:
   - Ler `tasks-file` e aplicar filtro `--tasks` (se fornecido)

2. **Verificar artefatos obrigatórios**:
   Para cada `tasks-file` invokar um agente `executar-tarefa` para validar

3. Verifique o estado dos MCPs:
   Se houver em alguma das `tasks-file` a detecção de tarefa de frontend, verifique os MCPs:
   - `chrome-devtools`
   - `playwright`
   - `figma_desktop`

   Independente se for backend e frontend, verifique os MCPs:
   - `serena`
   - `context7`
Informe explicitamente se cada MCP está **ativo ou inativo**.

4. Executar o comando `npm run test:e2e:pipeline` para garantir que nada está quebrando antes de você iniciar a execução

5. **Exibir console de pré-voo**:
   Exemplo:

   ```
   ## Referências de Origem

   ## MCPs

   ## Tarefas Detectadas
   ### Backend (delegação: backend-nestjs-developer)
   - [x] <task backend 1>
   - [x] <task backend 2>

   ### Frontend (delegação: frontend-nextjs-developer)
   - [x] <task frontend 1>

   ### Fullstack (delegação sequencial: backend → frontend)
   - [x] <task fullstack 1>

   Aguardando confirmação (Y/N):
   ```

   Se N, abortar; se Y, prosseguir.

   Se o usuario prosseguir, invoque o agente `executar-tarefa` seguindo seu plano de paralelização.

6. **Coleta de resultados**:
   - Arquivos tocados
   - Endpoints alterados (backend)
   - Componentes/páginas criados (frontend)
   - Comandos executados
   - Status de testes/lint/tsc/build
   - Pendências/riscos
   - Atualizar `tasks-file` conforme retorno dos agentes

7. **Relatório consolidado**:
   - Status por task
   - Riscos identificados
   - Follow-ups necessários
   - Checklist de validações executadas
   - Resposta breve ao usuário

## Restrições e Segurança

- Não executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`)
- Limitar escopo ao workspace do projeto
- Evitar logs extensos; resumir outputs (use tail/resumo quando necessário)
- Paralelizar apenas tasks independentes; se houver dependência, serializar
- Não prosseguir sem artefatos obrigatórios ou aprovação de decisões arquiteturais
- Iniciar execução somente após confirmação positiva na etapa de pré-voo

## Saída Esperada

- Relatório consolidado por task:
  - Status (✅ concluída, ⚠️ pendências, ❌ falhou)
  - Contexto detectado (backend/frontend/fullstack)
  - Agente utilizado
  - Arquivos tocados
  - Endpoints/componentes criados
  - Comandos de validação executados
  - Pendências/riscos
- Atualização de `tasks.md` conforme instruído pelos agentes

## Observações

- **Pré-requisitos**: skills e agentes listados instalados; artefatos de contexto presentes
- **Não usar** para tasks que envolvem decisões estratégicas não definidas; obter aprovação antes
- **Detecção automática**: o comando analisa o conteúdo das tasks para determinar o contexto correto

## Exemplos de Uso

```bash
# Executar todas as tasks pendentes (detecção automática)
/zord:executar-tarefas-planejadas

# Executar tasks específicas
/zord:executar-tarefas-planejadas --tasks="1,3,5"

# Com artefatos customizados
/zord:executar-tarefas-planejadas --prd=docs/prd-feature-x.md --techspec=docs/tech-spec-x.md --fdd=docs/fdd-x.md
```
