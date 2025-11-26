# Guia prático: como criar uma nova Skill para o Claude Code

Este guia explica, passo a passo e no imperativo, como criar uma Skill personalizada voltada para fluxos de trabalho de código (Claude Code). O fluxo abaixo é baseado na documentação oficial de Skills da Claude e em materiais de referência públicos.

> Observação: a UI e os nomes de menus podem mudar com o tempo. Se algo estiver diferente, use a busca por “Skills” nas configurações do Claude ou consulte a documentação mais recente.

---

## 1. Planeje a Skill antes de mexer em arquivos

- Defina um único objetivo claro para a Skill (por exemplo: “refatorar serviços NestJS seguindo padrões deste repositório”).
- Descreva em 2–3 frases quando Claude deve usar essa Skill (por exemplo: “quando o usuário pedir para refatorar código NestJS com estas convenções”).
- Liste quais entradas a Skill precisa (ex.: caminho de arquivos, nome de módulo, linguagem, padrão de formatação etc.).
- Defina o formato de saída esperado (ex.: novo arquivo de código, patch, checklist de TODOs).
- Decida se a Skill vai apenas orientar o Claude em linguagem natural ou também rodar scripts de código (Python, Node etc.) para automatizar partes do fluxo.

Tenha esse escopo bem definido antes de criar qualquer arquivo.

---

## 2. Crie a estrutura de pastas da Skill

- No seu sistema de arquivos, crie uma pasta para a Skill.
  - Exemplo: `~/claude-skills/nestjs-refactor-skill/`.
- Dentro desta pasta, planeje que tudo o que a Skill precisar esteja contido ali:
  - Arquivo obrigatório: `SKILL.md`.
  - Arquivos opcionais: scripts (`.py`, `.js` etc.), exemplos de código, modelos de arquivos, documentação adicional.
- Use um nome de pasta descritivo, em inglês ou português, mas de forma clara e estável (evite espaços em branco no nome do diretório).

Exemplo de estrutura inicial:

```text
nestjs-refactor-skill/
  SKILL.md
  scripts/
  examples/
```

---

## 3. Crie o arquivo obrigatório `SKILL.md`

- Dentro da pasta da Skill, crie o arquivo `SKILL.md` (em maiúsculas).
- Garanta que este arquivo esteja na raiz da pasta da Skill (não o coloque dentro de subpastas).

O `SKILL.md` é o “cérebro declarativo” da Skill: ele descreve o que ela faz, quando deve ser usada e quais entradas/saídas existem.

---

## 4. Preencha o frontmatter YAML do `SKILL.md`

- No topo do `SKILL.md`, adicione um bloco de frontmatter em YAML.
- Use a estrutura básica abaixo e adapte os valores:

```markdown
---
name: "NestJS Refactor Skill"
description: "Refatora código NestJS seguindo padrões específicos deste projeto, com foco em serviços, módulos e testes automatizados."
---
```

- Siga estas regras:
  - Mantenha o `name` curto e legível (até ~64 caracteres).
  - Escreva um `description` específico e objetivo (até ~200 caracteres).
  - Descreva o que a Skill faz e **quando** ela deve ser usada.

Claude usa principalmente o `name` e o `description` para decidir quando invocar a Skill.

---

## 5. Escreva instruções claras e imperativas no corpo do `SKILL.md`

Logo após o frontmatter YAML, escreva o conteúdo principal da Skill em Markdown.

- Comece com um título:

```markdown
# NestJS Refactor Skill
```

- Em seguida, escreva instruções detalhadas em linguagem natural, sempre no imperativo, dizendo a Claude exatamente **como** agir quando a Skill for ativada. Por exemplo:
  - “Analise os arquivos NestJS fornecidos.”
  - “Aplique padrões de boas práticas definidos neste projeto.”
  - “Sugira refatorações que melhorem a legibilidade sem alterar o comportamento.”

- Inclua seções claras, por exemplo:
  - `## Objetivo`
  - `## Quando usar`
  - `## Entradas esperadas`
  - `## Saídas esperadas`
  - `## Passo a passo do fluxo`
  - `## Restrições e limites`

---

## 6. Deixe explícitos os inputs, outputs e parâmetros

No corpo do `SKILL.md`, documente de forma explícita como Claude deve tratar entradas e saídas da Skill.

- Crie uma seção `## Entradas esperadas` e:
  - Liste cada parâmetro necessário.
  - Descreva tipo, formato e exemplos.

Exemplo:

```markdown
## Entradas esperadas

- `codigo_fonte`: um ou mais arquivos NestJS (serviços, controladores, módulos).
- `padroes_projeto`: resumo textual das convenções específicas deste repositório.
- `escopo_refatoracao`: uma descrição curta do que deve ser refatorado (ex.: “serviços de usuário e testes relacionados”).
```

- Crie uma seção `## Saídas esperadas` e:
  - Descreva qual formato de resposta Claude deve produzir usando a Skill:

```markdown
## Saídas esperadas

- Uma explicação textual das refatorações propostas.
- Blocos de código com as versões refatoradas dos arquivos.
- Lista de TODOs adicionais quando a refatoração completa não for possível de uma vez.
```

- Se a Skill depender de scripts, adicione instruções de como passar parâmetros para esses scripts (ex.: nomes de arquivos, flags, opções).

---

## 7. (Opcional) Adicione scripts de código para automatizar partes do fluxo

Se a Skill for voltada para código, aproveite scripts para automatizar tarefas específicas (lint, formatação, geração de arquivos, validações etc.).

- Crie uma subpasta, por exemplo `scripts/`, dentro da pasta da Skill.
- Adicione arquivos de script, por exemplo:
  - `scripts/apply_refactor.py`
  - `scripts/generate_module_structure.js`
- Escreva esses scripts assumindo que rodarão em um ambiente controlado de execução de código da Claude (Code Execution Tool).
- Gere instruções no `SKILL.md` explicando:
  - Quando utilizar cada script.
  - Quais argumentos devem ser passados.
  - Qual saída o script deve produzir (texto, JSON, arquivos).

Exemplo de instruções no `SKILL.md`:

```markdown
## Uso dos scripts

- Quando precisar aplicar refatorações sugeridas de forma automatizada:
  - Use o script `scripts/apply_refactor.py`.
  - Forneça o caminho do arquivo original e o conteúdo refatorado.
  - Gere um diff ou um novo arquivo atualizado.
```

---

## 8. Declare dependências e limites de execução

Se os scripts dependerem de bibliotecas externas:

- Liste as dependências explicitamente em uma seção do `SKILL.md`, por exemplo:

```markdown
## Dependências

- Python 3.10+
- Pacotes PyPI:
  - `black` (formatação de código Python)
  - `isort` (organização de imports)
```

- Evite depender de ferramentas que não possam ser instaladas via repositórios padrão (PyPI, npm).
- Estruture os scripts esperando que as dependências sejam instaladas quando a Skill for configurada, não em tempo de execução.
- Não faça download ou instalação arbitrária de binários externos dentro dos scripts.

---

## 9. Adicione exemplos de uso e cenários de teste

Ajude Claude a entender melhor quando e como usar a Skill adicionando exemplos concretos.

- Crie uma seção `## Exemplos de uso` no `SKILL.md`.
- Inclua:
  - Exemplos de prompts do usuário.
  - Resumos das ações que a Skill deve executar.
  - Pequenos trechos de código antes/depois (quando fizer sentido).

Exemplo:

```markdown
## Exemplos de uso

Exemplo 1:
- Entrada do usuário: "Refatore os serviços NestJS deste módulo para seguir as melhores práticas de injeção de dependência e testes unitários."
- Ações esperadas:
  - Analisar os serviços fornecidos.
  - Sugerir refatorações seguindo os padrões documentados.
  - Gerar trechos de código atualizados e uma lista de TODOs.
```

- Use esses exemplos para testar a Skill com Claude Code, garantindo que as respostas fiquem consistentes com o que o `SKILL.md` descreve.

---

## 10. Compacte a Skill em um `.zip`

Para instalar a Skill via UI do Claude:

- Selecione a pasta inteira da Skill (por exemplo, `nestjs-refactor-skill/`).
- Compacte a pasta em um arquivo `.zip`, garantindo que a estrutura interna mantenha:
  - `SKILL.md` na raiz do diretório da Skill.
  - Subpastas e scripts preservados.

Exemplo:

```text
nestjs-refactor-skill.zip
  nestjs-refactor-skill/
    SKILL.md
    scripts/
    examples/
```

---

## 11. Instale e habilite a Skill na interface da Claude

Na UI da Claude (web):

- Abra o Claude (versão web) com a conta que você usará no Claude Code.
- Acesse o menu de configurações (Settings / Configurações).
- Procure a seção de Skills (pode aparecer em Capabilities ou seção semelhante).
- Habilite a funcionalidade de Skills se ainda não estiver ativa.
- Faça o upload do `.zip` da Skill:
  - Clique em “Add Skill”, “Upload Skill” ou opção equivalente.
  - Selecione o arquivo `.zip` criado no passo anterior.
- Confirme que a Skill aparece na lista com o `name` e `description` definidos no `SKILL.md`.
- Certifique-se de que a Skill esteja marcada como ativa/enabled.

---

## 12. Disponibilize a Skill para o Claude Code

Com a Skill ativada:

- Garanta que você está usando a mesma conta no Claude Code (VS Code, JetBrains ou IDE compatível) que está usando na UI web.
- Nas configurações do plugin/extensão Claude Code:
  - Confirme que o suporte a Skills está habilitado, se houver essa opção.
  - Verifique se a extensão está atualizada para a versão mais recente.
- Se for necessário instalar Skills localmente:
  - Adicione a pasta da Skill em `~/.claude/skills` ou diretório equivalente indicado pela documentação do Claude Code.
  - Mantenha a mesma estrutura: cada Skill em uma pasta própria com `SKILL.md`.

> Dica: algumas distribuições permitem instalar Skills diretamente a partir de um marketplace (`anthropics/skills` ou similar); nesse caso, use o fluxo de instalação via plugin.

---

## 13. Use a Skill em fluxos de código

Uma vez instalada e habilitada:

- Abra seu projeto na IDE com Claude Code ativo.
- Inicie uma conversa com Claude Code (janela lateral / painel de chat).
- Descreva uma tarefa que corresponda exatamente ao que a Skill faz, usando palavras-chave que apareçam no `description` do `SKILL.md`.
- Observe se Claude menciona a Skill em sua cadeia de raciocínio (quando exposta) ou se o comportamento reflete as instruções da Skill.
- Peça explicitamente algo como:
  - “Use a Skill de refatoração NestJS que criamos para aplicar as melhores práticas a este serviço.”

Se a Skill estiver bem definida, Claude tende a invocá-la automaticamente quando o contexto for relevante.

---

## 14. Teste, depure e itere na Skill

- Teste a Skill com diferentes cenários de código, incluindo:
  - Casos simples (um arquivo pequeno).
  - Casos maiores (módulos / serviços complexos).
  - Casos de erro (código incompleto, código mal formatado).
- Ajuste o `SKILL.md` sempre que:
  - Claude acionar a Skill em situações inadequadas.
  - A Skill não for acionada quando deveria.
  - As respostas forem vagas ou inconsistentes.
- Refine principalmente:
  - O `description` (para melhorar a detecção de relevância).
  - A seção de `Quando usar`.
  - Os exemplos de uso.
- Se necessário, ajuste scripts para:
  - Melhorar logs ou mensagens de erro.
  - Corrigir comportamentos não desejados.

Repita o ciclo: editar Skill → compactar → reenviar/atualizar → testar.

---

## 15. Aplique boas práticas de organização e segurança

- Mantenha cada Skill focada em um único fluxo de trabalho.
- Não coloque credenciais, segredos ou dados sensíveis dentro da pasta da Skill.
- Prefira compartilhar Skills via controle de versão (Git) quando for colaborar com a equipe:
  - Armazene a pasta da Skill em um repositório (por exemplo, `skills/` dentro do monorepo).
  - Documente como instalar/importar a Skill no README do repositório.
- Use versionamento lógico:
  - Inclua no `SKILL.md` uma seção com `Versão` e um changelog simples.
  - Quando fizer mudanças compatíveis com versões anteriores, incremente a versão de forma previsível (ex.: 1.0.0 → 1.1.0).
- Não tente que uma única Skill faça tudo:
  - Crie Skills diferentes para fluxos distintos (ex.: “Criar módulos NestJS”, “Refatorar serviços”, “Ajustar testes unitários”).

---

## 16. Conheça limitações típicas das Skills para código

- Espere que:
  - A Skill funcione melhor como “fluxo guiado” para o Claude do que como uma automação 100% determinística.
  - A execução de scripts ocorra em um ambiente controlado, com restrições de rede e de sistema.
  - A instalação de dependências seja limitada ao que pode ser obtido em repositórios padrão (PyPI, npm etc.).
- Evite:
  - Depender de ferramentas que exigem acesso irrestrito ao sistema.
  - Escrever scripts que façam download arbitrário de recursos de internet em tempo de execução.
  - Criar Skills gigantescas, que tentam cobrir todos os fluxos de desenvolvimento ao mesmo tempo.

Aceite que Skills são um mecanismo complementar: elas direcionam e potencializam o Claude Code, mas ainda contam com o raciocínio do modelo e com a interação humana.

---

## 17. Resumo rápido do fluxo

1. Defina um fluxo de trabalho específico de código que você quer automatizar ou padronizar.
2. Crie uma pasta para a Skill e o arquivo obrigatório `SKILL.md`.
3. Preencha o frontmatter YAML com `name` e `description` claros e específicos.
4. Escreva instruções detalhadas, em tom imperativo, descrevendo objetivo, entradas, saídas e passo a passo.
5. (Opcional) Adicione scripts e arquivos auxiliares, documentando como usá-los.
6. Liste dependências e limitações relevantes.
7. Adicione exemplos de uso e cenários de teste.
8. Compacte a pasta em `.zip` e faça o upload da Skill pela UI do Claude.
9. Habilite a Skill e verifique se ela aparece na lista.
10. Use a Skill no Claude Code e itere até o comportamento ficar consistente com o desejado.

Seguindo estes passos, você conseguirá criar Skills reutilizáveis e alinhadas ao seu fluxo de desenvolvimento, estendendo o Claude Code com o conhecimento e os padrões específicos da sua equipe.
