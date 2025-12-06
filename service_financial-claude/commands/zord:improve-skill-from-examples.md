# improve-skill-from-examples

Command genérico para rodar o processo de melhoria de uma skill existente usando um prompt de referência e diretórios de exemplos, seguindo o fluxo "Sequential Thinking MCP" descrito no prompt fornecido.

## Entrada
- `prompt_path` (obrigatório): caminho do prompt que descreve o processo de melhoria (ex.: `planos/nextjs-skills-creator/melhorar-skill-nestjs/prompt-melhorar-skill-nestjs.md`).
- `skill_path` (obrigatório): caminho do arquivo de skill a ser refinado (ex.: `.claude/skills/nestjs-architect`).
- `example_dirs` (obrigatório): lista separada por vírgula de diretórios que contêm regras/exemplos a serem unificados (ex.: `planos/nextjs-skills-creator/exemplo-rules-next/clean-code,planos/nextjs-skills-creator/exemplo-rules-next/nestjs,planos/nextjs-skills-creator/exemplo-rules-next/typescript`).
- `output_mode` (opcional, padrão `guide`): `guide` para gerar apenas o guia de modificações; `apply` para também propor patches.

## Passos (determinísticos)
1. Verificar se `prompt_path`, `skill_path` e todos os `example_dirs` existem; abortar com erro objetivo se algum não existir.
2. Ler integralmente o `prompt_path` para relembrar regras e etapas do processo.
3. Ler o conteúdo atual de `skill_path` e mantê-lo em memória para preservar precedência em caso de conflito.
4. Ler todos os arquivos de texto dentro de cada diretório em `example_dirs`, agregando instruções e comandos; eliminar duplicatas exatas.
5. Identificar ambiguidades internas entre exemplos e listá-las; NÃO resolver—registrar perguntas ao usuário.
6. Descartar automaticamente instruções que conflitem com o conteúdo existente em `skill_path`, conforme regra de precedência.
7. Alocar instruções únicas nas seções já existentes do skill; se não houver seção apropriada, propor nova seção com justificativa.
8. Sugerir melhorias estruturais (fusões, remoções, renomeações) sem alterar o conteúdo funcional vigente.
9. Gerar saída conforme `output_mode`:
   - `guide`: produzir guia estruturado com listas por seção, novas seções propostas, instruções descartadas (duplicata/ambígua/conflito) e perguntas pendentes.
   - `apply`: além do guia, sugerir patches concretos para `skill_path` mantendo comportamento atual.
10. Restringir logs a resumos; evitar diffs extensos—usar descrições concisas e citações de linhas quando necessário.

## Restrições e Segurança
- Operar somente dentro do repositório atual; não criar/alterar arquivos fora de `skill_path` sem confirmação explícita.
- Não executar comandos destrutivos (`rm -rf`, `sudo`, `chmod 777`, etc.).
- Evitar saídas volumosas; quando precisar mostrar conteúdo longo, preferir resumos ou apontar caminhos/linhas.
- Se `output_mode=apply`, apenas sugerir patches — não aplicar automaticamente.

## Saída Esperada
- Resumo curto do que foi processado (prompt, skill, diretórios).
- Guia estruturado conforme o prompt (listas por seção, novas seções, descartes, perguntas).
- Quando `output_mode=apply`, incluir blocos de patch propostos para o `skill_path`.

## Observações
- Reutilize para qualquer skill: basta apontar para outro `prompt_path`, `skill_path` e `example_dirs`.
- Use sempre o fluxo de perguntas do command-creator para confirmar parâmetros antes de rodar.
- Não usar quando o processo exigir julgamento aberto que não esteja descrito no prompt fornecido.
