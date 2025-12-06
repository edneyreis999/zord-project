# Criador de Agentes (Command)

Constrói novos subagentes padronizados no Claude Code, aplicando os princípios de isolamento de contexto, privilégio mínimo e divulgação progressiva. Execute este comando para gerar um agente completo dentro de `.claude/agents/`, incluindo frontmatter, persona e políticas de ferramentas.

## Quando usar

- Sempre que for necessário um novo subagente especializado com persona própria.
- Quando o usuário pedir ajustes em persona, ferramentas ou modelo de um agente existente.
- Para evitar poluição de contexto ao criar prompts longos diretamente na thread principal.

## Fluxo de trabalho (siga na ordem)

### 1) Coleta progressiva de requisitos (pergunte um item por vez)

- Nome do agente (curto, kebab-case sugerido para o arquivo).
- Descrição (1–2 frases objetivas).
- Objetivo principal (o que o agente entrega).
- Persona / system prompt (tom, responsabilidades, restrições).
- Modelo padrão (ex.: `sonnet`, `opus`, seguir pedido do usuário).
- Ferramentas permitidas (`allowedTools`) aplicando privilégio mínimo. Comece pelo conjunto seguro: `Read, Write, Edit`. Inclua `Bash` ou `WebFetch` só com justificativa explícita.
- Skills a serem usadas (listar nomes; estimular uso do padrão *Skills-First*).

### 2) Validações obrigatórias

- Checar duplicidade de nome/arquivo em `.claude/agents/`. Se existir, parar e pedir novo nome.
- Confirmar que todos os campos acima estão preenchidos.
- Recusar ferramentas inseguras ou não suportadas; explique o risco e peça alternativa.
- Garantir que o objetivo e a persona não conflitam com políticas de segurança ou privilégio mínimo.

### 3) Montagem do agente (modelo canônico)

- Caminho obrigatório: `.claude/agents/<slug>.md`.
- Estrutura do arquivo (substitua os marcadores pelos valores coletados):

```
---
name: <nome>
description: <descrição curta>
tools: <lista de ferramentas separadas por vírgula>
model: <modelo>
---

<persona / system prompt em estilo imperativo, focado em resultados e limites.>

## Objetivo
- <bullet list das entregas centrais>

## Limites e Segurança
- Operar apenas com as ferramentas permitidas.
- Evitar poluição de contexto; manter respostas concisas.
- Delegar para Skills declaradas antes de usar ferramentas brutas (padrão Skills-First).

## Procedimento Operacional
1. Reafirmar objetivo e escopo.
2. Identificar Skills relevantes e carregá-las.
3. Aplicar checklist de segurança e privilégios.
4. Executar tarefa mantendo logs sucintos; evitar expor raciocínio interno desnecessário.
5. Entregar saída final limpa e validada.
```

- Preserve frontmatter YAML com `---` no início/fim como nos agentes existentes.
- Persona deve ser objetiva, em modo imperativo/infinitivo (consistente com `skill-creator`).

### 4) Criação de arquivos

- Se o diretório `.claude/agents/` não existir, criar.
- Gerar o arquivo do agente usando o template acima preenchido.
- Nunca criar arquivos fora de `.claude/agents/`.

### 5) Pós-criação

- Exibir resumo dos campos gerados.
- Lembrar o usuário de validar o agente em tarefa real e iterar se necessário.

## Observações de governança

- Aplicar privilégio mínimo nas ferramentas.
- Usar persona clara para evitar deriva comportamental.
- Preferir delegar conhecimento procedural a Skills existentes; o agente deve orquestrar, não reescrever SOPs extensos.
- Evitar poluição de contexto: respostas curtas; carregar recursos apenas quando chamados.

## Resultado esperado

Um arquivo Markdown de agente, validado, com frontmatter correto, persona definida, ferramentas restritas e instruções alinhadas às melhores práticas do Claude Code.
