---
name: "CodeRabbit CLI Review Skill"
description: "Executa o CodeRabbit CLI em modo prompt-only dentro do Claude Code para revisar alterações locais, planejar correções e validar com testes antes do commit."
---

# CodeRabbit CLI Review Skill

## Objetivo

- Rodar o CodeRabbit CLI em modo otimizado para agentes (`--prompt-only`) para identificar issues em alterações locais e guiar correções pelo Claude Code com segurança.

## Quando usar

- Antes de abrir um PR ou de commitar alterações locais.
- Quando precisar de um checklist de correções priorizado a partir do CodeRabbit.
- Para validar se ajustes aplicados resolveram findings anteriores.

## Entradas esperadas

- `base_branch` (string, opcional): branch base para comparação. Padrão: `main` se não houver configuração explícita no repo.
- `review_type` (string, opcional): `all | committed | uncommitted`. Padrão: `all`.
- `context_files` (lista, opcional): caminhos para arquivos de contexto (ex.: `CLAUDE.md`, specs, PRD). Use o que existir no repo atual.
- `tests_command` (string, opcional): comando de testes padrão do projeto (ex.: `npm test`, `npm run lint && npm run test`).
- `output_file` (string, opcional): caminho para salvar a saída do CodeRabbit em prompt-only. Padrão: `coderabbit_prompt.txt` na raiz do workspace.

## Saídas esperadas

- Sumário curto dos comandos executados (`coderabbit ...`, testes) e status.
- Lista priorizada de findings com arquivo/linha, severidade e plano de ação.
- Diferenças aplicadas ou patches propostos.
- Riscos/remanescentes e o que precisa de validação manual.

## Passo a passo do fluxo

1) **Preparação de contexto**
   - Ler instruções locais (ex.: `CLAUDE.md`, docs de revisão ou padrões do repo) e quaisquer arquivos informados em `context_files`.
   - Confirmar diretório de trabalho correto.

2) **Pré-checagem obrigatória**
   - Verificar CLI: `command -v coderabbit`; se ausente, parar e avisar que a dependência precisa ser instalada.
   - Verificar autenticação: `coderabbit auth status`; se não estiver logado, parar e instruir o usuário a autenticar (ex.: `coderabbit auth login` ou variável `CODERABBIT_API_KEY`). Nunca peça ou cole chaves no chat.

3) **Definir parâmetros**
   - Definir `base_branch` (use padrão `main` se nada for informado).
   - Definir `review_type` (`all | committed | uncommitted` conforme necessidade).
   - Escolher `output_file` (padrão `coderabbit_prompt.txt`).

4) **Executar CodeRabbit em modo agente**
   - Rodar: `coderabbit review --prompt-only --type <review_type> --base <base_branch> --output <output_file>`.
   - Se o comando falhar, coletar stderr e interromper com o erro.
   - Guardar o código de saída.

5) **Ler e estruturar findings**
   - Abrir `output_file` e listar findings por severidade/arquivo/linha.
   - Cruzar com instruções locais (ex.: `CLAUDE.md`, diretorio /docs ou guias de revisão) antes de propor fixes.
   - Gerar checklist acionável (crítico → médio → baixo).

6) **Planejar correção segura**
   - Para cada finding, propor abordagem de correção mínima e compatível com padrões do projeto.
   - Evitar mudanças destrutivas (sem `git reset --hard`, sem remover arquivos fora do escopo).

7) **Aplicar mudanças**
   - Editar arquivos de forma incremental, validando cada bloco se possível.
   - Se um finding não puder ser resolvido automaticamente, registrar TODO claro no resultado.

8) **Validar**
   - Rodar testes padrão (`tests_command` ou comando conhecido do repo, ex.: `npm test`). Se não houver comando conhecido, perguntar antes de executar.
   - Em caso de falha: analisar logs, corrigir o que foi introduzido e reexecutar testes.
   - Opcional: re-rodar `coderabbit review --prompt-only` para confirmar que os findings foram sanados.

9) **Relatar**
   - Produzir resumo final com: comandos executados, findings resolvidos, pendências e risco residual.
   - Não criar commits automaticamente; deixar a revisão final para o usuário.

## Restrições e limites

- Não exija ou exponha credenciais; apenas oriente o usuário a autenticar o CodeRabbit.
- Não execute comandos destrutivos (`git reset --hard`, remoção de arquivos sensíveis).
- Use apenas recursos locais do repo; evite downloads externos durante a execução.
- Preserve formato e estilo existentes; siga guias locais quando houver.

## Dependências

- CodeRabbit CLI instalado e autenticado (`coderabbit auth login` ou `CODERABBIT_API_KEY` configurada).
- Acesso ao git workspace com alterações locais.
- Comando de testes disponível no projeto (informado pelo usuário ou detectado).

## Exemplos de uso

- “Use a CodeRabbit CLI Review Skill para revisar mudanças locais, gerar checklist e aplicar correções. Base branch `main`, tipo `uncommitted`, testes com `npm test`.”
- “Execute o CodeRabbit em modo prompt-only, colete findings e aplique os fixes mínimos. Rode testes e compartilhe pendências que não puder automatizar.”

## Versão e changelog

- v1.0.0 — Criação inicial da skill genérica para integrar CodeRabbit CLI ao Claude Code.
