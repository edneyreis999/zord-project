# Analyze Codebase (zord:analyze-codebase)

Coleta dados de entrada do usuário e delega ao agente Software Engineer para analisar o codebase e gerar um relatório enxuto com recomendações acionáveis focadas em velocidade de desenvolvimento e qualidade de vida do time.

## Entrada

**Parâmetros obrigatórios:**

- `<caminho-saida>`: Caminho relativo do arquivo .md onde será salvo o relatório (ex: `reports/analise-geral.md`)

**Parâmetros opcionais:**

- `[escopo]`: Diretório ou módulo específico para análise (padrão: codebase completo)
- `--foco=<tipo>`: Foco da análise - valores: arquitetura, testes, performance, débito técnico, segurança (padrão: análise geral)
- `--profundidade=<nivel>`: Profundidade da análise - valores: quick, medium, thorough (padrão: medium)
- `--pergunta="<texto>"`: Pergunta específica sobre o codebase (padrão: nenhuma)

**Exemplos de uso:**

```
/zord:analyze-codebase reports/analise-geral.md
/zord:analyze-codebase reports/gateway-api.md apps/gateway-financeiro-api
/zord:analyze-codebase reports/testes.md --foco=testes --profundidade=thorough
/zord:analyze-codebase reports/performance.md --pergunta="Quais são os principais gargalos de performance?"
/zord:analyze-codebase reports/sso-api.md apps/sso-api --foco=arquitetura --pergunta="Como melhorar a cobertura de testes?"
```

## Passos (determinísticos)

1. **Validar parâmetros de entrada**
   - Verificar se caminho de saída foi fornecido (obrigatório)
   - Validar que caminho de saída seja relativo ao projeto (não aceitar paths absolutos externos)
   - Verificar se escopo (diretório) existe, se fornecido
   - Validar valores de `--foco` e `--profundidade` contra lista de valores permitidos

2. **Verificar sobrescrita de arquivo**
   - Se arquivo de saída já existir, perguntar confirmação ao usuário antes de prosseguir
   - Se usuário negar, abortar execução

3. **Criar diretório de saída**
   - Extrair diretório pai do caminho de saída
   - Criar diretório automaticamente se não existir (ex: `reports/`)

4. **Preparar contexto estruturado para o agente**
   - Montar objeto JSON com:
     - `escopo`: diretório/módulo ou "codebase completo"
     - `foco`: tipo de análise ou "geral"
     - `profundidade`: quick/medium/thorough
     - `pergunta`: texto da pergunta ou null
     - `caminho_saida`: caminho completo do arquivo de relatório

5. **Invocar agente Software Engineer**
   - Usar `Task` tool com `subagent_type='Software Engineer'`
   - caminho do agente: .claude/agents/prompt-engineer.md
   - Passar prompt estruturado contendo:
     - Contexto completo dos parâmetros coletados
     - Instrução para gerar relatório no formato padrão do agente
     - Caminho onde o relatório deve ser salvo
   - Aguardar conclusão da análise

6. **Receber e validar relatório**
   - Verificar se agente gerou o arquivo no caminho especificado
   - Validar que arquivo contém conteúdo (não está vazio)

7. **Exibir confirmação ao usuário**
   - Mostrar mensagem de sucesso com caminho do relatório gerado
   - Exibir resumo executivo (primeiras linhas do relatório)
   - Sugerir próximos passos baseados nas recomendações

## Restrições e Segurança

**Validações obrigatórias:**

- Caminho de saída DEVE ser relativo ao diretório do projeto
- Não permitir caminhos absolutos ou que saiam do workspace (ex: `../../../etc/passwd`)
- Não sobrescrever arquivos sem confirmação explícita do usuário

**Limitações de escopo:**

- Análise limitada ao diretório do projeto atual
- Excluir automaticamente: `node_modules/`, `.git/`, `dist/`, `build/`, `.next/`
- Se escopo específico fornecido, validar que existe dentro do projeto

**Segurança de execução:**

- Não executar comandos shell destrutivos durante análise
- Não modificar arquivos do codebase (análise é read-only)
- Limitar tamanho do relatório a ~10.000 linhas (evitar poluição de contexto)

**Tratamento de erros:**

- Se agente falhar, não criar arquivo de saída vazio
- Exibir mensagem de erro clara ao usuário
- Sugerir reduzir escopo ou profundidade em caso de timeout

## Saída Esperada

**Arquivo gerado:**

- Relatório markdown estruturado no caminho especificado
- Formato definido pelo agente Software Engineer:
  - Executive Summary
  - Análise de arquitetura/padrões
  - Débitos técnicos priorizados (critical/high/medium/low)
  - Recomendações acionáveis para o CTO
  - Métricas de qualidade (se aplicável)

**Mensagem ao usuário:**

```
✅ Análise concluída com sucesso!

📄 Relatório salvo em: reports/analise-geral.md

📊 Resumo executivo:
- 12 débitos técnicos identificados (3 critical, 5 high, 4 medium)
- Cobertura de testes: 68% (meta: 80%)
- Principais recomendações: [lista top 3]

💡 Próximos passos sugeridos:
1. Revisar débitos críticos em apps/gateway-financeiro-api
2. Implementar testes faltantes em módulos de autenticação
3. Refatorar controllers com complexidade ciclomática > 15
```

## Observações

**Pré-requisitos:**

- Agente Software Engineer configurado em `.claude/agents/software-engineer.md`
- Projeto com dependências instaladas e em estado funcional
- Para análises de módulos específicos, o diretório deve existir no workspace

**Contexto necessário:**

- Command usa ferramentas Serena MCP para análise semântica do código
- Relatório gerado segue formato estruturado do agente (veja `.claude/agents/software-engineer.md`)
- Análise `thorough` pode levar mais tempo dependendo do tamanho do codebase
- Profundidade `quick` é recomendada para feedback rápido (5-10 min)
- Profundidade `thorough` é recomendada para auditorias completas (20-30 min)

**Quando NÃO usar este command:**

- Para análises que exigem execução de testes (use `/test-e2e`, `/test-unit`)
- Para análises de runtime/performance em produção (requer ferramentas APM)
- Para auditorias de segurança profundas (considere SAST/DAST especializados)
- Para análises de dependências vulneráveis (use `npm audit`, Snyk, etc.)
