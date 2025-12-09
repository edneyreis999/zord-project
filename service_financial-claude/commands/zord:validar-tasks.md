# Validador de Tasks

Valida tasks de um plano de projeto, verificando se cada task possui detalhamento suficiente para execução autônoma por um agente LLM. Gera relatório técnico com status, problemas e sugestões de melhoria para o líder técnico da equipe.

## Entrada

- `$ARGUMENTS` (obrigatório): Caminho relativo do diretório contendo as tasks a serem validadas.
  - Exemplo: `planos/debitos-tecnicos-listar-contas-receber`

## Passos (determinísticos)

1. **Validar entrada**: Verificar se `$ARGUMENTS` foi fornecido. Se não, abortar com mensagem de erro solicitando o caminho.

2. **Verificar diretório**: Confirmar que o diretório `$ARGUMENTS` existe no projeto. Se não existir, abortar com erro.

3. **Listar tasks**: Usar `mcp__serena__list_dir` para listar todos os arquivos `.md` no diretório de tasks (incluindo subdiretórios como `tasks/`).

4. **Para cada task encontrada**, executar:

   a. **Ler conteúdo da task**: Usar `Read` para obter o conteúdo completo.

   b. **Identificar arquivos referenciados**: Extrair caminhos de arquivos mencionados na task.

   c. **Navegar pelo projeto**: Usar Serena MCP (`get_symbols_overview`, `find_symbol`) para analisar os arquivos do projeto relacionados à task.

   d. **Selecionar skill adequada**:
      - Se task envolve backend/NestJS: usar `nestjs-architect`
      - Se task envolve frontend/Next.js: usar `nextjs-architect`
      - Invocar a skill para validação arquitetural

   e. **Avaliar critérios de completude**:
      - A task descreve claramente o objetivo?
      - Todas as dependências estão documentadas?
      - Requisitos e regras de negócio estão explícitos?
      - Comportamentos esperados estão descritos?
      - Existem instruções específicas sobre o que modificar/criar/remover?
      - Há ambiguidades, lacunas ou termos não definidos?
      - Um agente conseguiria executar sem conhecimento externo?

   f. **Classificar a task**:
      - `COMPLETA`: Detalhamento suficiente para execução autônoma
      - `INCOMPLETA`: Faltam informações essenciais
      - `AMBÍGUA`: Informações confusas ou contraditórias

5. **Gerar relatório**: Criar arquivo Markdown com o seguinte formato para cada task:

   ```markdown
   ## Task: [nome-da-task]

   **Status:** COMPLETA | INCOMPLETA | AMBÍGUA

   **Problemas Encontrados:**
   - [lista detalhada de problemas]

   **Precisa Input Humano:** Sim/Não
   - [motivo, se sim]

   **O que Precisa ser Adicionado:**
   - [instruções objetivas sobre o que falta]

   **Sugestão de Versão Revisada:**
   [versão melhorada da task, se necessário]
   ```

6. **Salvar relatório**: Gravar em `$ARGUMENTS/temp/relatorio-validacao-tasks.md`

7. **Exibir resumo**: Mostrar estatísticas consolidadas:
   - Total de tasks analisadas
   - Quantidade por status (COMPLETA/INCOMPLETA/AMBÍGUA)
   - Tasks que precisam input humano
   - Caminho do relatório gerado

## Restrições e Segurança

- **Somente leitura**: O command NÃO modifica arquivos de task, apenas analisa e reporta.
- **Sem execução de código**: Não executar scripts, testes ou comandos shell destrutivos.
- **Output controlado**: Relatório limitado a resumos; não incluir conteúdo completo de arquivos grandes.
- **Sem acesso externo**: Não fazer requisições HTTP, apenas análise local de arquivos.

## Saída Esperada

- **Arquivo gerado**: `$ARGUMENTS/temp/relatorio-validacao-tasks.md`
- **Formato**: Markdown estruturado com análise individual de cada task
- **Resumo no console**: Estatísticas e caminho do relatório

## Observações

### Pré-requisitos
- Serena MCP deve estar ativo e configurado no projeto
- Skills `.claude/skills/nestjs-architect` e `.claude/skills/nextjs-architect` devem existir
- PAL MCP disponível para validação complementar

### Contexto necessário
- O diretório de tasks deve conter arquivos Markdown com estrutura de tasks
- Tasks devem referenciar arquivos do projeto para análise contextual

### Quando NÃO usar
- Para criar ou modificar tasks (use outro command)
- Se o diretório de tasks não existir
- Para validar arquivos que não sejam tasks de desenvolvimento

## Exemplo de Uso

```
/zord:validar-tasks planos/debitos-tecnicos-listar-contas-receber
```

**Saída esperada:**
```
Validação de Tasks - Relatório

Diretório: planos/debitos-tecnicos-listar-contas-receber
Tasks analisadas: 8

Resumo:
- COMPLETAS: 3
- INCOMPLETAS: 4
- AMBÍGUAS: 1
- Precisam input humano: 2

Relatório completo salvo em:
planos/debitos-tecnicos-listar-contas-receber/temp/relatorio-validacao-tasks.md
```
