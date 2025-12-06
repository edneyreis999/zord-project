# NestJS Architect – Lite

**Uso:** tarefas rápidas de domínio/NestJS que cabem em uma única interação. Máx. 200 linhas; vá para `SKILL.md` para padrões avançados.

## 1) Regras de ativação

- Use somente se trabalhar com NestJS + DDD/Clean.
- Confirme início com: `🏗️ NestJS Architect Skill Ativada` + lista de padrões que aplicará.

## 2) Estrutura mínima

```
src/
├─ core/
│  └─ <context>/
│     ├─ domain/            # entidades, aggregates, VOs, events, repos (interfaces)
│     ├─ application/       # use-cases, validations
│     └─ infra/             # repos impl (prisma/orm), mappers
└─ nest-modules/
   └─ <context>-module/     # controllers finos, providers, DTOs, presenters
```

- Domínio não importa `@nestjs/*` nem libs de infra.

## 3) Aggregate (template curto)

```ts
export class Order extends AggregateRoot {
  private constructor(
    readonly id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) { super(id); }

  static create(props: CreateOrderProps): Order {
    const notification = new Notification();
    const order = new Order(props.id, props.items, OrderStatus.created());
    order.validate(notification);
    if (notification.hasErrors()) throw new EntityValidationError(notification.messages());
    order.apply(new OrderCreatedEvent(order.id));
    return order;
  }

  private validate(notification: Notification) {
    if (!this.items?.length) notification.addError('Order must have items');
  }
}
```

Checklist: construtor privado; fábrica `create`; valida com Notification Pattern; eventos aplicados; sem decorators NestJS; VOs imutáveis.

## 4) Use case (template curto)

```ts
export class CreateOrderUseCase implements IUseCase<Input, Output> {
  constructor(private repo: IOrderRepository) {}
  async execute(input: Input): Promise<Output> {
    const order = Order.create(mapToDomain(input));
    await this.repo.insert(order);
    return OrderPresenter.toOutput(order);
  }
}
```

Checklist: orquestra lógica; recebe repo via construtor; usa mapper para output; sem regras de negócio no controller.

## 5) Repository Pattern

- Interface no domínio: `IOrderRepository` com operações do agregado.
- Implementação na infra (Prisma/TypeORM/in-memory) usando mapper.
- Providers em `nest-modules/<context>-module/<context>.providers.ts`:

```ts
export const REPOSITORIES = {
  ORDER_REPOSITORY: {
    provide: 'IOrderRepository',
    useFactory: (prisma: PrismaService) => new OrderPrismaRepository(prisma),
    inject: [PrismaService]
  }
};
```

## 6) Controller fino

```ts
@Controller('orders')
export class OrderController {
  constructor(@Inject(CreateOrderUseCase) private createOrder: CreateOrderUseCase) {}
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return OrderPresenter.toHttp(await this.createOrder.execute(dto));
  }
}
```

## 7) DTOs e validação

- Use `class-validator`; um DTO por rota.
- Converta tipos primitivos para VOs no use case, não no controller.

## 8) Anti-patterns críticos

- Decorators NestJS no domínio.
- Value Objects mutáveis ou com setters públicos.
- Validação comentada ou lançando exception genérica.
- Controllers gordos com regra de negócio.
- Repos retornando modelos ORM diretamente ao domínio.

## 9) Testes mínimos

- Builders fake para aggregates/VOs.
- Testes de use case sem framework (mocks de repo).
- Integration test de controller usando módulo NestJS configurado.

## 10) Quick steps (para nova feature)

1. Criar dirs em `core/<context>/domain|application|infra` e `nest-modules/<context>-module`.
2. Escrever aggregate + VOs + events.
3. Interface de repo no domínio; impl prisma/in-memory.
4. Use case(s) chamando aggregate e repo.
5. Providers + controller + DTO + presenter.
6. Testes unitários (domínio e use case) e integração de controller.

## 11) Se precisar de mais

- Regras complexas → Specification Pattern (ver `SKILL.md`).
- Pipelines de validação → Chain of Responsibility (ver `SKILL.md`).
- Migrações grandes → Architecture Migrator Agent (se existir).

## 12) Referências rápidas

- Domínio puro: sem imports de framework.
- Aggregates aplicam eventos, não retornam `void` silencioso.
- Use case retorna DTO de saída via mapper/presenter.
- Providers agrupados em constantes (REPOSITORIES, USE_CASES, VALIDATIONS).
