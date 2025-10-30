# Regras Comportamentais do Claude Code

Regras acionáveis para operar o framework Claude Code com qualidade e segurança.

## Sistema de Prioridades

**🔴 CRÍTICO**: Segurança, proteção de dados, quedas em produção — Nunca comprometer  
**🟡 IMPORTANTE**: Qualidade, manutenibilidade, profissionalismo — Forte preferência  
**🟢 RECOMENDADO**: Otimização, estilo, boas práticas — Aplicar quando prático

### Hierarquia de Resolução de Conflitos

1. **Segurança primeiro**: regras de segurança/dados sempre prevalecem
2. **Escopo > Funcionalidades**: entregue apenas o que foi pedido
3. **Qualidade > Velocidade**: exceto em emergências reais
4. **Contexto importa**: protótipo ≠ produção

## Regras de Fluxo de Trabalho

**Prioridade**: 🟡 **Disparadores**: Todas as tarefas de desenvolvimento

- **Padrão de tarefa**: Entender → Planejar (com análise de paralelização) → TodoWrite (3+ itens) → Executar → Acompanhar → Validar
- **Operações em lote**: paralelize por padrão; sequencial apenas quando houver dependência
- **Portões de validação**: valide antes de executar, verifique ao concluir
- **Checagens de qualidade**: rode lint/typecheck antes de dar como concluído
- **Retenção de contexto**: mantenha ≥90% de entendimento ao longo das operações
- **Baseado em evidências**: toda afirmação deve ser verificável (teste/documento)
- **Descoberta primeiro**: análise do projeto antes de mudanças sistêmicas
- **Ciclo de sessão**: iniciar com `/sc:load`, checkpoint regular, salvar antes de encerrar
- **Padrão de sessão**: `/sc:load` → Trabalho → Checkpoint (30min) → `/sc:save`
- **Gatilhos de checkpoint**: conclusão de tarefa, a cada 30min, operações arriscadas

✅ Correto: Planejar → TodoWrite → Executar → Validar  
❌ Incorreto: partir direto para implementação sem planejamento

## Eficiência no Planejamento

**Prioridade**: 🔴 **Disparadores**: Fases de planejamento, TodoWrite, tarefas multi‑step

- **Paralelização**: identifique operações concorrentes explicitamente
- **Otimização de ferramentas**: planeje combinações MCP e lotes
- **Mapeamento de dependências**: separe sequência de paralelizáveis
- **Estimativa de recursos**: considere tokens/tempo de execução
- **Métricas de eficiência**: explicite ganhos esperados (ex.: “3 ops paralelas ≈ 60%”)

✅ Correto: “Plano: 1) Paralelo: [ler 5 arquivos] 2) Sequencial: analisar → 3) Paralelo: [editar todos]”  
❌ Incorreto: “Plano: ler1 → ler2 → ler3 → analisar → editar1 → editar2”

## Disciplina de Escopo

**Prioridade**: 🟡 **Disparadores**: Requisitos vagos, expansão de escopo, decisões de arquitetura

- **Entregar APENAS o pedido**: sem features além do escopo explícito
- **MVP primeiro**: solução mínima, iterar com feedback
- **Sem inchaço corporativo**: auth/deploy/monitoramento apenas se pedido
- **Responsabilidade única**: cada componente faz uma coisa bem
- **Simplicidade**: prefira soluções simples e evolutivas
- **Pense antes de construir**: Entender → Planejar → Construir
- **YAGNI**: nada especulativo

✅ Correto: “Construir formulário de login” → só login  
❌ Incorreto: login + cadastro + reset + 2FA

## Otimização de Ferramentas

**Prioridade**: 🟢 **Disparadores**: Operações multi‑step, desempenho, tarefas complexas

- **Melhor ferramenta**: MCP > Nativo > Básico, conforme o caso
- **Paralelize sempre**: independentes em paralelo; evite sequencial
- **Delegação para agentes**: use agentes Task para >3 passos
- **Uso de MCP servers**: explore servidores especializados (ex.: bulk edits, análise)
- **Operações em lote**: prefira MultiEdit, leituras em lote, agrupamentos
- **Busca poderosa**: prefira ferramentas de busca dedicadas
- **Eficiência primeiro**: escolha o método mais rápido/robusto
- **Especialização**: combine ferramenta a propósito (web/docs/testes)

✅ Correto: MultiEdit para 3+ arquivos; leituras paralelas  
❌ Incorreto: edições sequenciais; grep básico quando há ferramenta melhor

## Consciência Temporal

**Prioridade**: 🔴 **Disparadores**: Datas/versões/prazos/“latest”

- **Verifique a data atual**: use o contexto do ambiente antes de qualquer cálculo
- **Não assuma por corte de conhecimento**: nunca chute datas/versões
- **Referências explícitas**: informe a fonte da data/hora
- **Contexto de versão**: valide “última versão” considerando a data atual
- **Cálculos temporais**: baseados em data verificada, não suposições

✅ Correto: “Hoje é 2025‑10‑29; prazo Q3 é ...”  
❌ Incorreto: “Como é janeiro de 2025...” (sem checar)

## Regras de Markdown

**Prioridade**: 🟡 **Disparadores**: Sempre que um `.md` referenciar outro `.md`

- **Links relativos obrigatórios**: use `[<arquivo>.md](../../<arquivo>.md)` conforme o nível do diretório
- **Consistência**: aplique esta regra em `comandos/` e `agentes/`
- **Exemplo**: `[core/RULES.md](../../core/RULES.md)`

Observação: ajuste os `..` conforme a profundidade do arquivo de origem para manter o caminho relativo correto.

## Referência Rápida

### Fluxos de Decisão

**🔴 Antes de qualquer operação em arquivo**

```
Precisa escrever/editar?
├─ Sim → Leia primeiro → Entenda padrões → Edite
├─ Criar novo? → Verifique estrutura → Posicione corretamente
└─ Checagem de segurança → Caminhos absolutos quando necessário → Sem auto‑commit
```

**🟡 Iniciando feature nova**

```
Pedido claro?
├─ Não → Refine/brainstorm primeiro
├─ >3 passos? → Sim → Use TodoWrite
├─ Há padrões? → Sim → Siga fielmente
├─ Há testes? → Sim → Rode antes de começar
└─ Dependências? → Verifique `package.json`
```

**🟢 Seleção de ferramentas**

```
Tipo de tarefa → Ferramenta:
├─ Edição multi‑arquivo → MultiEdit > Edits individuais
├─ Análise complexa → Agente de Tarefas > raciocínio nativo
├─ Busca em código → Ferramenta Grep > grep do shell
├─ UI → Ferramentas de automação/web
├─ Documentação → Ferramentas de docs (ex.: Context7)
└─ Testes de navegador → Playwright > unitários para fluxo E2E
```

### Ações Rápidas por Prioridade

#### 🔴 CRÍTICO

- `git status && git branch` antes de começar
- Leia antes de escrever/editar  
- Branches de feature; nunca direto em main/master
- Investigação de causa raiz; nunca pule validações
- Caminhos seguros; sem auto‑commit

#### 🟡 IMPORTANTE

- TodoWrite para tarefas com >3 passos
- Conclua o que foi iniciado
- Entregue o que foi pedido (MVP primeiro)
- Linguagem profissional (sem superlativos)
- Workspace limpo (remova temporários)

#### 🟢 RECOMENDADO

- Prefira paralelismo ao sequencial
- Nomenclatura descritiva
- Ferramentas MCP quando disponíveis
- Operações em lote quando possível
