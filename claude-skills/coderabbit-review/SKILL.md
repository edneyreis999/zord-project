---
name: coderabbit-review
description: Executa CodeRabbit CLI em modo prompt-only para revisar alterações locais, identificar issues, planejar correções e validar com testes antes do commit
tags: [code-review, quality, testing, coderabbit]
---

# CodeRabbit CLI Review Skill

Skill para integrar o CodeRabbit CLI ao Claude Code, permitindo revisões automatizadas de código com análise de findings, aplicação de correções e validação por testes.

## Objetivo

Executar o CodeRabbit CLI em modo otimizado para agentes (`--prompt-only`) para:

- Identificar issues em alterações locais (staged/unstaged)
- Gerar checklist priorizado de correções
- Aplicar fixes seguindo padrões do projeto
- Validar mudanças com testes automatizados
- Garantir qualidade antes de commits/PRs

## Quando Usar Esta Skill

Use esta skill quando precisar:

- ✅ Revisar código antes de abrir um PR
- ✅ Validar alterações locais antes de commit
- ✅ Obter checklist priorizado de correções do CodeRabbit
- ✅ Verificar se ajustes aplicados resolveram findings anteriores
- ✅ Garantir conformidade com padrões do projeto
- ✅ Automatizar revisões de código com validação por testes

❌ **NÃO use quando**:

- Não houver alterações locais para revisar
- CodeRabbit CLI não estiver instalado ou autenticado
- Precisar apenas de análise manual sem automação

## Pré-requisitos

Antes de usar esta skill, verifique:

1. **CodeRabbit CLI instalado**:

   ```bash
   command -v coderabbit
   ```

   Se não instalado, instrua o usuário a instalar via: <https://docs.coderabbit.ai/cli/installation>

2. **Autenticação configurada**:

   ```bash
   coderabbit auth status
   ```

   Se não autenticado, instrua o usuário a executar:
   - `coderabbit auth login` (login interativo), ou
   - Configurar `CODERABBIT_API_KEY` no ambiente

3. **Git repository**: Projeto deve ser um repositório git com alterações locais

## Parâmetros de Entrada

### Obrigatórios

Nenhum parâmetro é estritamente obrigatório (todos têm defaults).

### Opcionais

- `base_branch` (string): Branch base para comparação. Padrão: detectar automaticamente (`main`, `master`, `develop`)
- `review_type` (string): Tipo de revisão. Valores: `all` | `committed` | `uncommitted`. Padrão: `all`
- `context_files` (array): Arquivos de contexto adicionais (ex.: `CLAUDE.md`, specs, PRD)
- `tests_command` (string): Comando de testes do projeto. Padrão: detectar automaticamente (`npm test`, `pnpm test`, etc.)
- `output_file` (string): Arquivo de saída do CodeRabbit. Padrão: `coderabbit_prompt.txt`
- `auto_fix` (boolean): Aplicar correções automaticamente. Padrão: `true`
- `severity_threshold` (string): Severidade mínima para corrigir. Valores: `critical` | `high` | `medium` | `low`. Padrão: `medium`

## Fluxo de Trabalho

### 1. Preparação de Contexto

```bash
# Verificar diretório de trabalho
pwd

# Listar arquivos de contexto disponíveis
ls -la | grep -E 'CLAUDE.md|README.md|CONTRIBUTING.md'
```

Ações:

- Ler `CLAUDE.md` se existir
- Ler arquivos em `context_files` se fornecidos
- Identificar padrões e guias do projeto
- Confirmar diretório de trabalho correto

### 2. Pré-checagem Obrigatória

```bash
# Verificar instalação do CodeRabbit CLI
if ! command -v coderabbit &> /dev/null; then
    echo "❌ CodeRabbit CLI não encontrado"
    echo "Instale via: https://docs.coderabbit.ai/cli/installation"
    exit 1
fi

# Verificar autenticação
coderabbit auth status
if [ $? -ne 0 ]; then
    echo "❌ CodeRabbit CLI não autenticado"
    echo "Execute: coderabbit auth login"
    echo "Ou configure: export CODERABBIT_API_KEY=your_key"
    exit 1
fi
```

**IMPORTANTE**:

- ❌ NUNCA peça ou exponha credenciais no chat
- ❌ NUNCA execute `coderabbit auth login` automaticamente
- ✅ Apenas oriente o usuário a autenticar manualmente

### 3. Detectar Configuração do Projeto

```bash
# Detectar branch principal
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
# Ou verificar branches comuns
git branch -r | grep -E 'origin/(main|master|develop)' | head -1

# Detectar comando de testes
if [ -f "package.json" ]; then
    # Verificar scripts npm/pnpm/yarn
    cat package.json | grep -E '"test"|"test:unit"|"lint"'
fi
```

### 4. Executar CodeRabbit em Modo Agente

```bash
# Comando padrão
coderabbit review \
  --prompt-only \
  --type ${review_type:-all} \
  --base ${base_branch:-main} \
  --output ${output_file:-coderabbit_prompt.txt}

# Verificar código de saída
if [ $? -ne 0 ]; then
    echo "❌ Falha ao executar CodeRabbit"
    cat ${output_file} 2>/dev/null
    exit 1
fi
```

### 5. Estruturar Findings

Após executar o CodeRabbit:

1. Ler arquivo `output_file`
2. Parsear findings por severidade/arquivo/linha
3. Cruzar com instruções locais (`CLAUDE.md`, docs)
4. Gerar checklist priorizado:
   - 🔴 Crítico (critical)
   - 🟠 Alto (high)
   - 🟡 Médio (medium)
   - 🟢 Baixo (low)

Exemplo de saída estruturada:

```
📊 CodeRabbit Review Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base: main → Current: feature/xyz
Type: all changes

🔴 Critical Issues (2)
  - src/auth/auth.service.ts:45 - SQL Injection vulnerability
  - src/utils/crypto.ts:12 - Hardcoded credentials

🟠 High Issues (5)
  - src/api/users.controller.ts:89 - Missing input validation
  ...

🟡 Medium Issues (8)
  ...

🟢 Low Issues (12)
  ...
```

### 6. Planejar Correção Segura

Para cada finding:

1. Analisar contexto do código
2. Verificar padrões do projeto (CLAUDE.md, código existente)
3. Propor correção mínima e compatível
4. Evitar mudanças destrutivas

**Restrições de segurança**:

- ❌ NUNCA execute `git reset --hard`
- ❌ NUNCA remova arquivos fora do escopo
- ❌ NUNCA altere arquivos sensíveis (`.env`, credenciais)
- ✅ Use apenas edições incrementais e testáveis

### 7. Aplicar Mudanças (se auto_fix=true)

```markdown
Para cada finding acima do threshold de severidade:
1. Ler o arquivo afetado
2. Identificar o bloco de código problemático
3. Aplicar correção usando Edit tool
4. Registrar mudança aplicada
5. Se não puder corrigir automaticamente, registrar TODO
```

Estratégia de correção:

- Corrigir um finding por vez
- Validar sintaxe após cada mudança
- Manter histórico de mudanças aplicadas

### 8. Validar com Testes

```bash
# Detectar comando de testes
if [ -f "package.json" ]; then
    test_cmd=$(cat package.json | jq -r '.scripts.test // empty')
    if [ -n "$test_cmd" ]; then
        npm test
    fi
elif [ -f "Makefile" ]; then
    make test
fi

# Verificar resultado
if [ $? -ne 0 ]; then
    echo "❌ Testes falharam após correções"
    echo "Analisando logs para rollback/correção..."
fi
```

Se testes falharem:

1. Analisar logs de erro
2. Identificar se foi introduzido pela correção
3. Reverter ou corrigir a mudança
4. Re-executar testes

### 9. Re-validar com CodeRabbit (Opcional)

```bash
# Executar novamente para confirmar que findings foram resolvidos
coderabbit review \
  --prompt-only \
  --type uncommitted \
  --base ${base_branch} \
  --output coderabbit_recheck.txt

# Comparar findings antes/depois
diff coderabbit_prompt.txt coderabbit_recheck.txt
```

### 10. Relatar Resultados

Gerar resumo final com:

```markdown
## 📋 CodeRabbit Review Report

### ⚙️ Comandos Executados
- `coderabbit review --prompt-only --type all --base main`
- `npm test`
- `coderabbit review --prompt-only --type uncommitted` (re-check)

### ✅ Findings Resolvidos (12/20)
🔴 Critical (2/2):
  - [x] src/auth/auth.service.ts:45 - SQL Injection → Parametrized query
  - [x] src/utils/crypto.ts:12 - Hardcoded credentials → Environment variable

🟠 High (4/5):
  - [x] src/api/users.controller.ts:89 - Input validation → Added DTO validation
  - [x] src/api/posts.controller.ts:34 - XSS vulnerability → Sanitization
  - [x] src/middleware/auth.ts:23 - Missing error handling → Try-catch block
  - [x] src/services/email.service.ts:67 - Rate limiting → Added throttle decorator
  - [ ] src/api/admin.controller.ts:12 - Authorization bypass → **PENDING MANUAL REVIEW**

🟡 Medium (6/8):
  ...

### ⏳ Pendências (8)
1. src/api/admin.controller.ts:12 - Requer análise de regras de negócio
2. src/legacy/old-auth.ts:* - Sistema legado, refatoração complexa
3. ...

### 🧪 Validação
- Testes executados: ✅ 234 passed, 0 failed
- Linting: ✅ No issues
- Re-check CodeRabbit: ✅ 12 findings resolved

### ⚠️ Riscos Residuais
- Authorization bypass em admin.controller.ts requer validação manual
- Sistema legado (old-auth.ts) não foi alterado por segurança

### 📝 Próximos Passos
1. Revisar pendências manualmente
2. Executar testes E2E se disponíveis
3. Commit das alterações aprovadas
4. Abrir PR com este relatório

---
**Não commit automático** - Revisão final do usuário necessária
```

## Saídas Esperadas

A skill deve produzir:

1. **Sumário de execução**: Comandos executados e status
2. **Findings estruturados**: Lista priorizada por severidade
3. **Mudanças aplicadas**: Diffs ou patches propostos
4. **Resultados de testes**: Logs e status
5. **Pendências**: Issues que precisam de revisão manual
6. **Riscos residuais**: O que não foi corrigido e por quê

## Restrições e Limites

### Segurança

- ❌ NUNCA exija ou exponha credenciais
- ❌ NUNCA execute comandos destrutivos (`git reset --hard`, `rm -rf`)
- ❌ NUNCA altere arquivos sensíveis (`.env`, `.git/config`, credenciais)
- ❌ NUNCA execute `coderabbit auth login` automaticamente
- ✅ Apenas oriente o usuário a autenticar manualmente

### Escopo

- ✅ Use apenas recursos locais do repositório
- ✅ Preserve formato e estilo existentes
- ✅ Siga guias locais (`CLAUDE.md`, CONTRIBUTING.md)
- ❌ Evite downloads externos durante execução
- ❌ Não crie commits automaticamente

### Qualidade

- ✅ Aplique correções incrementais e testáveis
- ✅ Valide cada mudança quando possível
- ✅ Registre TODOs claros para itens não automatizáveis
- ❌ Não faça over-engineering ou refatorações desnecessárias

## Exemplos de Uso

### Exemplo 1: Revisão Completa com Correções Automáticas

```
User: Use a skill coderabbit-review para revisar minhas alterações locais e aplicar correções

Claude: Vou executar a CodeRabbit CLI Review Skill para revisar suas alterações.

1. Verificando pré-requisitos...
   ✅ CodeRabbit CLI instalado
   ✅ Autenticação configurada
   ✅ Git repository detectado

2. Detectando configuração do projeto...
   - Base branch: main
   - Review type: all
   - Tests command: npm test

3. Executando CodeRabbit...
   $ coderabbit review --prompt-only --type all --base main --output coderabbit_prompt.txt
   ✅ Review completo

4. Estruturando findings...
   📊 Encontrados: 20 issues (2 critical, 5 high, 8 medium, 5 low)

5. Aplicando correções (severity >= medium)...
   [15 correções aplicadas automaticamente]

6. Validando com testes...
   $ npm test
   ✅ 234 passed, 0 failed

7. Re-validando com CodeRabbit...
   ✅ 15 findings resolvidos, 5 pendentes

[Relatório completo gerado]
```

### Exemplo 2: Revisão Somente de Uncommitted Changes

```
User: Execute coderabbit-review apenas para mudanças não commitadas, sem aplicar correções automaticamente

Claude: Executando revisão em modo somente-leitura...

Parâmetros:
- review_type: uncommitted
- auto_fix: false
- base_branch: main

[Executa passos 1-5 do fluxo]

Relatório de findings gerado em coderabbit_prompt.txt
Nenhuma correção aplicada (modo somente-leitura)

Próximos passos sugeridos:
1. Revisar findings em coderabbit_prompt.txt
2. Decidir quais correções aplicar
3. Re-executar skill com auto_fix=true se desejar
```

### Exemplo 3: Revisão com Contexto Customizado

```
User: Use coderabbit-review com contexto dos arquivos ARCHITECTURE.md e docs/security-guidelines.md, base branch develop, apenas critical e high

Claude: Executando revisão com contexto customizado...

Parâmetros:
- base_branch: develop
- context_files: [ARCHITECTURE.md, docs/security-guidelines.md]
- severity_threshold: high
- review_type: all

1. Lendo contexto adicional...
   ✅ ARCHITECTURE.md (padrões de arquitetura)
   ✅ docs/security-guidelines.md (guidelines de segurança)

2. Executando CodeRabbit...
   [análise considerando contexto dos guidelines]

3. Aplicando correções (critical + high apenas)...
   [6 correções aplicadas seguindo guidelines]

[Relatório gerado]
```

### Exemplo 4: Revisão Pré-Commit

```
User: Quero revisar com coderabbit antes de fazer commit

Claude: Executando revisão pré-commit...

1. Detectando alterações staged...
   ✅ 5 arquivos modificados detectados

2. Executando CodeRabbit...
   $ coderabbit review --prompt-only --type uncommitted --base main

3. Findings encontrados: 3 medium, 1 high

4. Aplicando correções...
   ✅ Todas as 4 issues resolvidas

5. Validando...
   ✅ Testes passando
   ✅ Linting OK

6. Re-validando...
   ✅ Nenhum finding remanescente

Suas alterações estão prontas para commit!

Recomendação:
$ git add .
$ git commit -m "seu commit message aqui"
```

## Dependências

- **CodeRabbit CLI** (>= 1.0.0): <https://docs.coderabbit.ai/cli/installation>
- **Git**: Repositório git inicializado
- **Autenticação CodeRabbit**: Via `coderabbit auth login` ou `CODERABBIT_API_KEY`
- **Comando de testes** (opcional): npm/pnpm/yarn test, pytest, make test, etc.

## Troubleshooting

### CodeRabbit CLI não encontrado

```bash
# Verificar instalação
command -v coderabbit

# Se não instalado, instalar via:
# macOS/Linux:
curl -fsSL https://get.coderabbit.ai | sh

# Ou via npm:
npm install -g @coderabbit/cli
```

### Erro de autenticação

```bash
# Verificar status
coderabbit auth status

# Autenticar via browser
coderabbit auth login

# Ou via API key
export CODERABBIT_API_KEY=your_api_key_here
```

### Nenhum finding detectado

- Verifique se há alterações locais: `git status`
- Confirme que `base_branch` está correto
- Tente mudar `review_type` para `all`

### Testes falhando após correções

- Revise os logs de erro detalhadamente
- Identifique qual correção introduziu o problema
- Use git diff para ver exatamente o que mudou
- Reverta correções problemáticas manualmente se necessário

## Notas de Versão

### v1.0.0 (2025-01-28)

- ✨ Criação inicial da skill
- ✅ Suporte a modo prompt-only do CodeRabbit CLI
- ✅ Auto-fix com threshold de severidade
- ✅ Validação automática com testes
- ✅ Re-validação opcional pós-correção
- ✅ Relatórios estruturados e detalhados
- ✅ Detecção automática de configuração do projeto
- ✅ Suporte a context files customizados
- ✅ Modo somente-leitura (auto_fix=false)

## Manutenção e Suporte

Esta skill é genérica e pode ser usada em qualquer projeto com:

- Git repository
- CodeRabbit CLI instalado e autenticado
- Opcionalmente, comando de testes configurado

Para reportar issues ou sugerir melhorias:

- Abra uma issue no repositório do projeto
- Documente o comportamento esperado vs atual
- Inclua logs de execução se relevante

## Licença

Esta skill segue a mesma licença do projeto em que está inserida.
