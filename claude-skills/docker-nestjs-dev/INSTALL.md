# Guia Rápido de Instalação

## Instalação da Skill

### Passo 1: Compactar a Skill

```bash
cd /Users/edneyfilho/projects/twl-americas-book-store/.claude/skills
zip -r docker-nestjs-dev.zip docker-nestjs-dev/
```

### Passo 2: Upload no Claude

1. Acesse **Claude Web** (https://claude.ai)
2. Vá em **Settings** → **Skills**
3. Clique em **Add Skill** ou **Upload Skill**
4. Selecione `docker-nestjs-dev.zip`
5. Confirme que aparece como ativa

### Passo 3: Teste no Claude Code

Abra o Claude Code e teste:

```
Configure Docker para desenvolvimento NestJS com PostgreSQL
```

A skill deve ser ativada automaticamente.

## Uso da Skill

### Cenário 1: Setup Completo

**Comando:**
```
Configure um ambiente Docker completo para meu projeto NestJS com PostgreSQL, Redis e RabbitMQ para desenvolvimento local
```

**Resultado:**
- Dockerfile criado
- docker-compose.yaml configurado
- Health checks em todos os serviços
- Script de inicialização
- .dockerignore otimizado
- Template de .env

### Cenário 2: Troubleshooting

**Comando:**
```
Meu hot-reload está demorando 10 segundos para refletir mudanças. Como otimizar?
```

**Resultado:**
- Diagnóstico da configuração atual
- Sugestões de otimização priorizadas
- Patches para docker-compose.yaml

### Cenário 3: Adicionar Debugging

**Comando:**
```
Como configurar debug remoto para NestJS no Docker com VSCode?
```

**Resultado:**
- Configuração .vscode/launch.json
- Modificações em docker-compose
- Script start:debug
- Instruções de uso

## Verificação

Para verificar se a skill está instalada:

```bash
# Na web do Claude
Settings → Skills → Procure "Docker + NestJS Dev Environment"

# No Claude Code
Digite: "lista minhas skills" ou "what skills do I have?"
```

## Desinstalação

Se precisar remover:

1. **Claude Web**: Settings → Skills → Remover skill
2. **Local**: `rm -rf ~/.claude/skills/docker-nestjs-dev`

## Suporte

Problemas com instalação?

1. Verifique que o arquivo SKILL.md existe na raiz do zip
2. Confirme que está usando Claude Code atualizado
3. Teste com comando explícito: `@docker-nestjs-dev configure Docker`

## Próximos Passos

Após instalar:

1. Leia o **README.md** para exemplos de uso
2. Explore os templates em **examples/**
3. Teste com um projeto NestJS real
