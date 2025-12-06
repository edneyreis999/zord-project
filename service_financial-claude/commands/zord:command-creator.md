# Criador de Commands (Command)

Gera novos Slash Commands padronizados para o Claude Code, garantindo determinismo, escopo seguro e documentação clara. Use este comando para converter instruções soltas em commands reutilizáveis ou para revisar/atualizar commands existentes com validação de segurança e clareza.

## Quando usar

- Sempre que precisar adicionar um novo `/command` ao projeto.
- Para converter instruções soltas em um command reutilizável e documentado.
- Para revisar/atualizar commands existentes com validação de segurança e clareza.
- Quando houver necessidade de padronizar fluxos de trabalho repetitivos.

## Fluxo de trabalho (pergunte um item por vez)

### 1) Coleta progressiva de requisitos

Colete as informações na ordem abaixo, perguntando um item por vez:

1. **Nome do command** (sem `/`, usar kebab-case para arquivo; trigger sugerido: `/nome`).
2. **Descrição curta** (1–2 frases objetivas do que o command faz).
3. **Objetivo e resultado esperado** (determinístico, sem raciocínio aberto).
4. **Parâmetros de entrada** (se houver) e valores padrão esperados.
5. **Ações que o command executa** (shell, prompts, geração de arquivos) — devem ser atômicas e determinísticas.
6. **Restrições de segurança** (ex.: não rodar `rm -rf`, evitar saídas longas, limitar escopo de arquivos).
7. **Observações de uso** (pré-requisitos, contexto necessário, dependências).

### 2) Validações obrigatórias

- Verificar se já existe arquivo em `.claude/commands/<slug>.md`; se existir, abortar e pedir novo nome.
- Confirmar que nome, descrição e objetivo estão preenchidos.
- Garantir que as ações sejam determinísticas e seguras; recusar comandos que dependam de raciocínio aberto ou julgamento do modelo.
- Evitar poluição de contexto: limitar logs e diffs longos; sugerir `tail`/resumo quando necessário.
- Validar que comandos shell não sejam destrutivos sem confirmação explícita.

### 3) Montagem do command (template canônico)

- Caminho obrigatório: `.claude/commands/<slug>.md`.
- Estrutura do arquivo (substitua os marcadores pelos valores coletados):

```markdown
# <Nome do Command>

<Resumo em 1 parágrafo do que o command faz e quando usar.>

## Entrada
- <listar parâmetros e formatos esperados>
- <se não houver parâmetros, indicar "Nenhum parâmetro necessário">

## Passos (determinísticos)
1. <passo 1 - ação atômica e verificável>
2. <passo 2 - ação atômica e verificável>
3. <passo 3 - ação atômica e verificável>
...

## Restrições e Segurança
- <limites de uso, proibições, logs resumidos>
- <comandos perigosos que não devem ser executados>
- <escopo restrito de arquivos/diretórios>

## Saída Esperada
- <forma e local da saída, arquivos gerados, mensagens>
- <formato da resposta ao usuário>

## Observações
- <pré-requisitos, dependências, contexto necessário>
- <quando NOT usar este command>
```

- Escrever em tom imperativo/infinitivo, claro e conciso.
- Seguir o estilo do prompt-engineer: estrutura explícita, seções claras, sem omitir texto essencial.
- Garantir que cada passo seja determinístico e não dependa de interpretação do modelo.

### 4) Criação de arquivos

- Criar o diretório `.claude/commands/` se não existir.
- Gerar o arquivo preenchido com o template acima.
- Nunca criar arquivos fora de `.claude/commands/`.
- Confirmar que o arquivo foi criado com sucesso e exibir o caminho completo.

### 5) Pós-criação

- Exibir resumo com:
  - Nome do command
  - Trigger sugerido (ex.: `/nome-do-command`)
  - Caminho do arquivo criado
  - Breve descrição do que faz
- Recomendar teste manual do command: `/nome-do-command`
- Sugerir iteração se houver ajustes necessários após o primeiro teste.

## Observações de governança

### Princípios fundamentais

1. **Determinismo**: Commands não devem depender de julgamento do modelo para serem disparados ou executados.
2. **Mínima poluição de contexto**: Evitar saídas extensas; preferir resumos, `tail`, ou logs filtrados.
3. **Segurança**: Negar ações destrutivas sem confirmação explícita e registrar restrições no próprio command.
4. **Atomicidade**: Cada passo deve ser uma ação verificável e independente.
5. **Reutilização**: Commands devem ser genéricos o suficiente para serem reutilizados em contextos similares.

### Restrições de segurança padrão

- Nunca executar: `rm -rf`, `sudo`, `chmod 777`, comandos de rede externos sem validação.
- Sempre limitar escopo: trabalhar apenas dentro do diretório do projeto.
- Logs grandes: usar `tail -n 20` ou resumos, nunca output completo.
- Confirmação: comandos destrutivos devem pedir confirmação explícita do usuário.

### Skills-First

- Quando o command envolver lógica complexa, considere delegar para uma Skill existente.
- Commands devem orquestrar, não reimplementar SOPs extensos.
- Se precisar de persona ou modelo específico, considere criar um Agent em vez de um Command.

## Resultado esperado

Um arquivo Markdown de command, validado, com estrutura clara, passos determinísticos, restrições de segurança documentadas e pronto para uso via `/nome-do-command`.

## Exemplo de uso

```
User: Crie um command para rodar testes E2E
Assistant: Vou criar um command para isso. Primeiro, preciso de algumas informações:

1. Qual o nome do command? (sugestão: test-e2e)
...
[segue fluxo de perguntas]
...
Assistant: Command criado com sucesso!
- Nome: test-e2e
- Trigger: /test-e2e
- Arquivo: .claude/commands/test-e2e.md
- Descrição: Executa testes E2E com validação de ambiente

Teste agora com: /test-e2e
```
