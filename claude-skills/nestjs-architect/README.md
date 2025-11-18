# NestJS Architect Skill

Skill profissional para desenvolvimento NestJS com Domain-Driven Design (DDD) e Clean Architecture.

## 📋 O que esta skill faz

Esta skill orienta Claude Code a seguir padrões arquiteturais avançados ao trabalhar com projetos NestJS:

- ✅ Separação rigorosa entre domínio e infraestrutura
- ✅ Implementação de Aggregates, Entities e Value Objects
- ✅ Repository Pattern com múltiplas implementações
- ✅ Use Cases isolados e testáveis
- ✅ Integração idiomática com NestJS (módulos, providers, controllers)
- ✅ Specification Pattern para regras de negócio
- ✅ Padrões de teste com Fake Builders
- ✅ Anti-patterns e checklist de qualidade

## 🎯 Quando usar

Claude Code ativará automaticamente esta skill quando:

- Criar ou refatorar código NestJS
- Implementar agregados, entidades ou use cases
- Configurar módulos, providers ou repositórios
- Revisar arquitetura e identificar problemas
- Escrever testes para domínio ou aplicação

Você também pode invocar explicitamente:

```
"Use a skill NestJS Architect para refatorar este serviço"
```

## 📦 Instalação

### Opção 1: Uso Local (Recomendado para este projeto)

A skill já está configurada em `.claude/skills/nestjs-architect/` e Claude Code a detectará automaticamente.

### Opção 2: Instalação Global

Para usar esta skill em outros projetos:

1. Copie a pasta `nestjs-architect/` para `~/.claude/skills/`

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/nestjs-architect ~/.claude/skills/
```

2. Reinicie Claude Code

### Opção 3: Upload via Interface Web

1. Compacte a pasta da skill:

```bash
cd .claude/skills
zip -r nestjs-architect.zip nestjs-architect/
```

2. Acesse Claude Web (https://claude.ai)
3. Settings → Skills → Upload Skill
4. Selecione `nestjs-architect.zip`
5. Habilite a skill

## 📚 Documentação Base

Esta skill foi criada a partir da análise de dois projetos NestJS reais:

- **ARQUITETURA_NESTJS_BOAS_PRATICAS.md**: Padrões DDD e Clean Architecture
- **RELATORIO_ARQUITETURA_NESTJS.md**: Análise de projeto anti-fraud com Specification Pattern

## 🎓 Exemplos de Uso

### Criar Novo Agregado

```
"Crie um agregado Product seguindo os padrões DDD"
```

Claude Code irá:
- Criar estrutura de diretórios `core/product/`
- Implementar `ProductAggregate` com validation
- Criar `ProductRepository` interface e implementações
- Configurar `ProductModule` com providers
- Gerar testes e fake builders

### Refatorar Use Case

```
"Refatore este use case para seguir o padrão correto"
```

Claude Code aplicará:
- Pattern `IUseCase<Input, Output>`
- Notification Pattern para validação
- Output Mappers
- Testes de integração

### Implementar Specification Pattern

```
"Implemente regras de validação de pedido com Specification Pattern"
```

Claude Code criará:
- Interface `IOrderSpecification`
- Implementações concretas de regras
- Agregador `OrderAggregateSpecification`
- Providers configurados

## ✅ Checklist de Qualidade

A skill inclui checklist completo para verificar:

- Separação de camadas
- Imutabilidade de Value Objects
- Validação com Notification Pattern
- Controllers finos
- DTOs com class-validator
- Cobertura de testes (>80%)
- Ausência de anti-patterns

## 🚨 Anti-Patterns Detectados

A skill identifica e corrige:

- Framework no domínio (`@Injectable` em agregados)
- `any[]` em genéricos
- Validação comentada
- Value Objects mutáveis
- Acoplamento direto a ORM
- DTOs sem validação

## 🔧 Configuração Avançada

### Personalizar para Outros ORMs

Edite `SKILL.md` seção "Repository Pattern" para adaptar exemplos de:
- Sequelize → TypeORM
- Sequelize → Prisma
- Qualquer outro ORM

### Adicionar Novos Patterns

Para incluir novos padrões arquiteturais:

1. Edite `SKILL.md`
2. Adicione seção com exemplos práticos
3. Inclua anti-patterns relacionados
4. Atualize checklist de qualidade

### Habilitar para Microserviços

Para adaptar a skill para arquitetura de microserviços:

1. Adicione seção sobre bounded contexts
2. Inclua patterns de mensageria (Kafka, RabbitMQ)
3. Documente estratégias de comunicação entre serviços

## 📊 Métricas de Qualidade

Projetos usando esta skill devem alcançar:

- **Cobertura de Testes**: ≥ 80%
- **TypeScript Estrito**: Sem `any` desnecessários
- **Separação de Camadas**: 100% domínio isolado
- **Validação**: 100% DTOs com class-validator

## 🤝 Contribuindo

Para melhorar esta skill:

1. Identifique novos patterns no projeto
2. Documente em `arquitetura/`
3. Atualize `SKILL.md` com exemplos
4. Teste com Claude Code
5. Commit e compartilhe com a equipe

## 📝 Changelog

### v1.0 (2025-01-18)

- ✨ Versão inicial
- 📚 Padrões DDD e Clean Architecture
- 🧪 Templates de teste
- 🚨 Specification Pattern
- ⚠️ Anti-patterns e checklist

## 🔗 Links Úteis

- [Guia de Criação de Skills](../../CRIAR_SKILL_CLAUDE_CODE.md)
- [Documentação NestJS](https://docs.nestjs.com)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Mantido por**: Time de Arquitetura
**Status**: Ativo
**Próxima Revisão**: Trimestral ou quando novos patterns forem descobertos
