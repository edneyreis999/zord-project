## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Lista de Tarefas

- [x] Arrumar o Git
- [x] Adicionar o husky no backend
- [x] Colocar banco de dados na feature de cadastro de chapter
- [x] Coverage 100%
- [x] Mover textService do chapterController para chapterService
- [x] Adicionar no lint para remover unused variables
- [x] resolver bug de chapter nunca ser criado sem a referencia de um book
- [x] Adicionar mongo em memoria para fazer os testes
- [x] Criar CRUD para book service.
- [ ] tratar erro Cannot read properties of null (reading '\_id') quando findOne
      não encontra ninguém.
- [ ] Criar um model abstrato com base no Book e fazer book extender toda essa
      abstração.
- [ ] Criar services/modules e controller para arc e scene.
- [ ] Adicionar plugn para query paginada nos models book, chapter, arc e scene.
- [ ] Remover bug onde as tags estão aparecendo nos arcos e cenas
