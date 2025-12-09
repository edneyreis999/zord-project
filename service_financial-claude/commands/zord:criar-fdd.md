# Criar FDD (Feature Design Doc)

Inicia uma sessão de criação de FDD invocando o agente fdd-interviewer, com coleta opcional de documentos de contexto (HLD, PRD, código) antes de iniciar a entrevista estruturada.

## Entrada

**Obrigatório:**
- Caminho de destino onde o FDD será salvo (ex: `docs/fdd/feature-x.md`)

**Opcional:**
- Caminho para HLD (High-Level Design)
- Caminho para PRD (Product Requirements Doc)
- Caminhos para arquivos de código/contexto relevantes

## Passos (determinísticos)

1. Perguntar ao usuário o caminho de destino do FDD (obrigatório)
2. Perguntar se deseja fornecer documentos de contexto opcionais
3. Se sim, coletar caminhos para HLD, PRD e/ou arquivos de código relevantes
4. Se fornecidos, ler os documentos usando a ferramenta Read para carregar contexto
5. Invocar o agente `fdd-interviewer` usando Task tool com `subagent_type="fdd-interviewer"`
6. Passar o contexto coletado na descrição da tarefa
7. O agente conduz a entrevista estruturada e gera o FDD no caminho especificado

## Restrições e Segurança

- Apenas leitura de arquivos de contexto; não executa comandos shell destrutivos
- Arquivos devem estar dentro do diretório do projeto
- Caminho de destino do FDD é obrigatório e deve ser fornecido antes de iniciar
- Não sobrescrever arquivos existentes sem confirmar com o usuário

## Saída Esperada

- FDD completo em Markdown salvo no caminho especificado
- Opcionalmente, exportação em JSON se solicitado pelo usuário durante a entrevista
- Mensagem de confirmação com o caminho do arquivo gerado

## Observações

**Pré-requisitos:**
- Agente `fdd-interviewer` deve existir em `.claude/agents/fdd-interviewer.md`

**Quando usar:**
- No início do ciclo de design técnico de uma feature
- Quando precisar documentar requisitos técnicos, fluxos, contratos e riscos de forma estruturada

**Quando NÃO usar:**
- Para documentação de features já implementadas (usar retrospectiva/documentação técnica)
- Para design de alto nível (usar HLD separado)

**Documentos de contexto opcionais:**
- HLD, PRD, código relevante ajudam a enriquecer o FDD com informações técnicas precisas
- Se não fornecidos, o agente conduzirá a entrevista baseado apenas nas respostas do usuário
