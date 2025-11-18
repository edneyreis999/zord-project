# Docker + NestJS Development Environment Skill

## Descrição

Skill especializada em configurar e otimizar ambientes Docker para desenvolvimento de aplicações NestJS, com foco em:

- ⚡ **Hot-reload** automático e rápido (< 3s)
- 🔧 **Debugging** remoto integrado com VSCode
- 🗄️ **Serviços externos** pré-configurados (PostgreSQL, MySQL, Redis, RabbitMQ)
- 🚀 **Performance** otimizada para desenvolvimento local
- 📦 **Persistência** adequada de dados de desenvolvimento
- 🛡️ **Segurança** básica mesmo em ambiente dev

## Instalação

### Método 1: Via Interface Claude (Recomendado)

1. **Compacte esta pasta** em um arquivo `.zip`:
   ```bash
   cd .claude/skills
   zip -r docker-nestjs-dev.zip docker-nestjs-dev/
   ```

2. **Acesse Claude** (web):
   - Vá em **Settings** → **Skills**
   - Clique em **Add Skill** ou **Upload Skill**
   - Selecione o arquivo `docker-nestjs-dev.zip`
   - Confirme que a skill aparece ativa

3. **Use no Claude Code**:
   - A skill será automaticamente ativada quando você mencionar:
     - "Configure Docker para NestJS"
     - "Otimizar ambiente de desenvolvimento Docker"
     - "Hot-reload não funciona no Docker"

### Método 2: Instalação Local (Claude Code)

1. **Copie para diretório de skills global**:
   ```bash
   # macOS/Linux
   mkdir -p ~/.claude/skills
   cp -r .claude/skills/docker-nestjs-dev ~/.claude/skills/

   # Windows
   mkdir %USERPROFILE%\.claude\skills
   xcopy .claude\skills\docker-nestjs-dev %USERPROFILE%\.claude\skills\docker-nestjs-dev /E /I
   ```

2. **Reinicie Claude Code** no VS Code/JetBrains

## Como Usar

### Ativação Automática

A skill é ativada automaticamente quando você menciona:

- ✅ "Configure Docker para desenvolvimento NestJS"
- ✅ "Preciso de hot-reload no meu container"
- ✅ "Como fazer debug remoto do NestJS no Docker?"
- ✅ "Meu docker-compose está lento, como otimizar?"
- ✅ "Adicione PostgreSQL/MySQL/Redis ao ambiente Docker"

### Ativação Manual

Para forçar o uso da skill:

```
@docker-nestjs-dev Configure um ambiente Docker completo para desenvolvimento
```

## Cenários de Uso

### 1. Setup Inicial de Projeto

**Você diz**:
> "Configure Docker para meu projeto NestJS com PostgreSQL e Redis para desenvolvimento local"

**Claude fará**:
1. Analisa seu package.json
2. Cria Dockerfile otimizado
3. Configura docker-compose.yaml com PostgreSQL e Redis
4. Adiciona health checks
5. Cria script de inicialização (.docker/start.sh)
6. Configura .dockerignore
7. Fornece comandos de uso

### 2. Troubleshooting de Performance

**Você diz**:
> "Hot-reload demora 10 segundos para refletir mudanças de código"

**Claude fará**:
1. Diagnostica configuração de volumes
2. Verifica estratégia de node_modules
3. Sugere otimizações específicas (delegated mount, volume nomeado)
4. Aplica patches em docker-compose.yaml
5. Valida melhorias

### 3. Adicionar Debugging

**Você diz**:
> "Quero fazer debug remoto do NestJS rodando no Docker"

**Claude fará**:
1. Configura .vscode/launch.json
2. Adiciona porta de debug (9229) ao docker-compose
3. Cria script start:debug
4. Explica como usar breakpoints
5. Testa conexão do debugger

### 4. Adicionar Novo Serviço

**Você diz**:
> "Preciso adicionar RabbitMQ ao meu ambiente Docker"

**Claude fará**:
1. Adiciona serviço rabbitmq ao docker-compose.yaml
2. Configura health check
3. Adiciona variáveis de ambiente necessárias
4. Expõe portas (5672, 15672)
5. Atualiza depends_on do app
6. Fornece comandos para testar

## Estrutura de Arquivos Gerados

Após usar a skill, você terá:

```
seu-projeto/
├── Dockerfile                    # Dev (sem build)
├── docker-compose.yaml           # Base com health checks
├── docker-compose.dev.yaml       # Override para persistência
├── .dockerignore                 # Exclusões otimizadas
├── .docker/
│   └── start.sh                  # Script de inicialização
├── .vscode/
│   └── launch.json               # Debug remoto (se solicitado)
└── envs/
    └── .env.example              # Template de variáveis
```

## Comandos Úteis

Após configurar, use estes comandos:

### Desenvolvimento Básico

```bash
# Iniciar ambiente (primeira vez)
docker-compose up --build

# Starts subsequentes
docker-compose up

# Background
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### Executar Comandos

```bash
# Shell interativo
docker-compose exec app bash

# Testes
docker-compose exec app npm test

# Gerar módulo
docker-compose exec app npx nest g module users

# Migrations
docker-compose exec app npm run migrate
```

### Debugging

```bash
# Iniciar com debug
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up

# Conectar debugger no VSCode: F5
```

### Limpeza

```bash
# Parar
docker-compose down

# Remover volumes (⚠️ perde dados)
docker-compose down -v

# Reset completo
docker-compose down -v && docker-compose up --build
```

## FAQ

### P: A skill serve para produção?

**R**: NÃO. Esta skill é otimizada para **desenvolvimento local**. Para produção, use:
- Multi-stage builds
- Imagens otimizadas (alpine)
- Sem ferramentas de desenvolvimento
- Secrets management adequado

### P: Hot-reload não funciona, o que fazer?

**R**: Verifique:
1. Volume mount está correto: `.:/home/node/app`
2. node_modules está em volume anônimo: `/home/node/app/node_modules`
3. Script start:dev usa flag `--watch`
4. No macOS, adicione `:delegated` ao volume

### P: Posso usar com outros frameworks além de NestJS?

**R**: A skill é otimizada para NestJS, mas os princípios se aplicam a:
- Express.js
- Fastify
- Koa
- Qualquer aplicação Node.js com hot-reload

Ajuste scripts de inicialização conforme necessário.

### P: Qual a diferença entre volumes anônimos e nomeados?

**R**:
```yaml
# Volume anônimo (gerado automaticamente)
volumes:
  - /home/node/app/node_modules

# Volume nomeado (gerenciado explicitamente)
volumes:
  - node_modules:/home/node/app/node_modules

volumes:
  node_modules:
```

**Recomendação**: Volume nomeado para melhor performance e controle.

### P: Como resetar o banco de dados?

**R**:
```bash
# Método 1: Remover apenas volumes de dados
docker-compose down
docker volume rm $(docker volume ls -q | grep dbdata)
docker-compose up

# Método 2: Remover todos os volumes
docker-compose down -v
docker-compose up
```

## Troubleshooting

### Container sai imediatamente

**Diagnóstico**:
```bash
docker-compose logs app
docker-compose ps
```

**Soluções**:
1. Verificar se start.sh é executável: `chmod +x .docker/start.sh`
2. Verificar shebang: `#!/bin/bash` na primeira linha
3. Testar script manualmente: `bash .docker/start.sh`

### Permissões negadas

**Diagnóstico**:
```bash
docker-compose exec app whoami  # Deve ser 'node'
docker-compose exec app ls -la
```

**Soluções**:
1. Garantir `USER node` no Dockerfile
2. Ajustar ownership no host: `sudo chown -R $USER:$USER .`
3. Verificar UID/GID: node user (1000:1000) deve corresponder ao host

### Database connection refused

**Soluções**:
1. Verificar health check: `docker-compose ps`
2. Aguardar 30-60s no primeiro start
3. Verificar `DB_HOST=db` (nome do serviço, não 'localhost')
4. Testar conexão: `docker-compose exec app nc -zv db 5432`

## Recursos Adicionais

- **Guia de Boas Práticas**: Ver `docker/GUIA_BOAS_PRATICAS_DOCKER.md`
- **Documentação Docker**: https://docs.docker.com
- **Documentação NestJS**: https://docs.nestjs.com
- **Docker Compose Spec**: https://docs.docker.com/compose/compose-file/

## Contribuindo

Para melhorar esta skill:

1. Teste em diferentes projetos NestJS
2. Reporte problemas ou limitações
3. Sugira otimizações de performance
4. Adicione exemplos de uso

## Versão

**v1.0.0** (2025-11-18)

## Licença

Esta skill faz parte do SuperClaude Framework e segue as mesmas políticas de uso do Claude Code.

## Suporte

Para problemas:
1. Verifique FAQ e Troubleshooting acima
2. Consulte `docker/GUIA_BOAS_PRATICAS_DOCKER.md`
3. Peça ao Claude Code para diagnosticar usando esta skill
