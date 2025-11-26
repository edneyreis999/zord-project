# Guia para rodar o ecossistema só com Docker (sem Node no host)

Este passo a passo é para a Alfa, em um projeto qualquer (possivelmente com várias APIs). O objetivo é: analisar a configuração atual e corrigir para que tudo rode apenas com Docker/Compose/Dev Container, sem depender de Node instalado no host ou de `node_modules` locais.

## 1) Identificar se há dependência do Node no host

- Verifique os `Dockerfile`(s): a imagem base deve ser `node:<versão>` (ou similar) e conter `npm/yarn/pnpm`. Se o build usa `FROM scratch` ou outra imagem sem Node, já é um sinal de dependência externa.
- Verifique o `docker-compose` (todas as variantes: `docker-compose*.yml`): procure por `volumes` que montam `node_modules` do host (`- ./node_modules:/app/node_modules`) — isso força dependência do host. Ideal: **não** montar `node_modules` do host; deixar o contêiner instalar.
- Procure scripts de entrada (`command`/`entrypoint` ou `start.sh`): se chamam `npm install` / `npm run` dentro do contêiner, ótimo. Se esperam que `node_modules` já exista (sem rodar install) ou chamam `npm` no host, é dependência.
- Veja se há instruções de setup pedindo “rode `npm install` localmente antes do Docker”. Se houver, é indício de acoplamento ao host.

## 2) Ajustar imagens para buildar tudo dentro do contêiner

- Para cada API:
  - Use um `Dockerfile` que:
    1) Copia `package*.json` e roda `npm ci`/`npm install` **dentro** da imagem.
    2) Copia o restante do código.
    3) Opcional: multi-stage para gerar `dist` e copiar apenas artefatos e `node_modules` de produção na imagem final.
- Remova volumes de `node_modules` do host nos `docker-compose`.
- Garanta que o `command`/`entrypoint` de dev rode `npm run start:dev` (ou equivalente com watch) **dentro** do contêiner.
- Se há múltiplas APIs, repita o padrão para cada serviço (service `api-a`, `api-b`, etc.), cada um com seu `Dockerfile`/build context.

## 3) Configuração de hot reload sem Node no host

- Monte o código-fonte no contêiner: `.:/app` (ou caminho adequado), mas **não** monte `node_modules` do host.
- Instale dependências dentro do contêiner (no `Dockerfile` ou em um script de entrypoint) antes de rodar o watch.
- Use scripts de start de dev no contêiner: `npm run start:dev`, `nest start --watch`, `nodemon`, `ts-node-dev` etc.
- Se o container sobe mas não inicia o servidor (ex.: `tail -f /dev/null`), adicione um `postCreateCommand` (no Dev Container) ou ajuste o `command` do serviço para iniciar o modo watch automaticamente.

## 4) Dev Container (VS Code) igual ao modelo

Crie `.devcontainer/devcontainer.json` e `.devcontainer/docker-compose.yml` alinhados ao seu compose principal:

`.devcontainer/devcontainer.json` (exemplo genérico)

```json
{
  "name": "Meu Ecossistema",
  "dockerComposeFile": [
    "../docker-compose.yaml",        
    "docker-compose.yml"             
  ],
  "service": "app",                
  "workspaceFolder": "/app",       
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": ["Orta.vscode-jest", "firsttris.vscode-jest-runner"]
    }
  }
}
```

`.devcontainer/docker-compose.yml` (override mínimo)

```yaml
version: '3'
services:
  app:
    volumes:
      - ..:/app:cached  # monta o código; não monte node_modules
    # opcional: command para manter contêiner vivo ou rodar start:dev
    # command: npm run start:dev
```

Notas:

- Ajuste `service` para o nome do serviço de app no seu compose (ou faça um override específico para dev). Para múltiplas APIs, você pode ter múltiplos `.devcontainer` ou um service que agrupe o workspace principal que você vai abrir.
- Inclua outros services de infraestrutura (db, cache, fila) via `dockerComposeFile` (referenciando o compose principal já existente).

## 5) Checklist de correção (resumido)

- [ ] `Dockerfile` instala dependências e builda dentro do contêiner; nada exige Node no host.
- [ ] `docker-compose*` não monta `node_modules` do host.
- [ ] `command`/`entrypoint` em modo dev roda o servidor em watch (`npm run start:dev` ou equivalente) dentro do contêiner.
- [ ] Scripts de setup não pedem `npm install` no host.
- [ ] Dev Container configurado para abrir a pasta do código dentro do contêiner (`workspaceFolder`) usando o serviço correto.
- [ ] Para múltiplas APIs, cada serviço segue o mesmo padrão (build interno, sem node_modules do host, comando de dev dentro do contêiner).

## 6) Fluxo sugerido para a Alfa

1) Abrir os `Dockerfile`(s) e `docker-compose*` e marcar onde há montagem de `node_modules` ou expectativa de `npm install` no host.
2) Ajustar os `Dockerfile`(s) para instalar e buildar internamente (multi-stage se precisar). Remover volumes de `node_modules` do host.
3) Garantir que o comando de dev no compose ou no Dev Container execute o modo watch dentro do contêiner.
4) Subir com `docker compose up --build` e validar que tudo sobe sem Node no host.
5) No VS Code, abrir via Dev Containers para trabalhar já dentro do contêiner; confirmar que editar um arquivo dispara o hot reload.

## 7) Dicas rápidas

- Use `docker compose exec app npm run start:dev` enquanto não automatiza o `command`.
- Se faltar permissão ou performance, mude o tipo de volume (ex.: `:cached` ou `:delegated` em macOS).
- Para ambientes offline, prebaixe as imagens e o cache de `npm ci` em um registry interno; o host continua sem Node.
