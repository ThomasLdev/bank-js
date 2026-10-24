# 02 — Architecture

## Vue d'ensemble

```
training-js-web-stack/
├── apps/
│   ├── api/            # NestJS — backend hexagonal
│   └── web/            # Next.js — frontend
├── packages/
│   └── config/         # (optionnel) tsconfig / eslint partagés — JAMAIS de code métier
├── docs/
├── docker-compose.yml  # PostgreSQL (+ outils plus tard)
├── pnpm-workspace.yaml
└── turbo.json
```

**Règle d'or : `api` et `web` ne partagent aucun code.** Le seul contrat entre eux est la spec OpenAPI exposée par l'API, à partir de laquelle le front génère son client typé. On simule ainsi deux équipes et deux repos distincts.

## Backend (`apps/api`)

### Découpage

```
apps/api/
├── prisma/
│   └── schema.prisma (ou un dossier de schémas, un fichier par contexte)
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── shared/                     # Shared kernel : le strict minimum, stable
    │   ├── domain/                 # Money, Currency, AggregateRoot, DomainEvent, DomainError
    │   └── infrastructure/         # PrismaService, gestion transactionnelle, filtres d'erreur HTTP
    └── contexts/
        ├── accounts/
        ├── ledger/
        └── payments/
```

Chaque bounded context suit le même découpage :

```
contexts/<context>/
├── domain/              # TS pur. Agrégats, Value Objects, événements, erreurs, ports de repository
├── application/         # Use cases (command / query handlers), autres ports (Clock, IdGenerator, gateways vers d'autres contextes)
├── infrastructure/
│   ├── http/            # Controllers REST, DTO / schémas Zod, mapping erreurs → HTTP   (adapter primaire)
│   ├── persistence/     # Repositories Prisma + mappers domaine ↔ Prisma            (adapter secondaire)
│   └── <context>.module.ts  # Câblage Nest : port → implémentation
└── index.ts             # API publique du contexte (ce que les autres contextes ont le droit d'importer)
```

### Règles de dépendance (non négociables)

| Couche | Peut importer | Ne peut PAS importer |
|---|---|---|
| `domain` | `shared/domain` | `@nestjs/*`, `@prisma/*`, `application`, `infrastructure` |
| `application` | `domain`, `shared/domain` | `@prisma/*`, `infrastructure`. Seuls `@nestjs/common` (`@Injectable`, `@Inject`) et `@nestjs/cqrs` (handlers) sont tolérés |
| `infrastructure` | tout | — |

- Un contexte n'importe **jamais** le `domain` d'un autre contexte. Il passe par son `index.ts` (façade applicative) ou par un port défini chez lui et implémenté en infrastructure.
- Ces règles sont **vérifiées automatiquement** par `dependency-cruiser` (`apps/api/.dependency-cruiser.cjs`), lancé par `pnpm lint:archi` et inclus dans `lint`, donc dans la CI. Les cycles d'imports sont aussi interdits.

### Où sont les ports ?

- **Ports de repository** : dans `domain/` (ils parlent le langage du domaine).
- **Autres ports secondaires** (horloge, générateur d'ID, accès à un autre contexte, gestion transactionnelle) : dans `application/`.
- **Ports primaires** : les use cases eux-mêmes (une classe par command ou query).

### Commandes, requêtes, événements

- `@nestjs/cqrs` pour le `CommandBus` et le `QueryBus` (l'équivalent de Messenger en bus synchrone).
- **Attention** : l'`EventBus` de `@nestjs/cqrs` n'attend pas ses handlers. Il ne convient donc **pas** aux réactions qui doivent s'exécuter dans la même transaction. En v1, les réactions inter-contextes synchrones passent par des ports explicites (voir [ADR 0008](adr/0008-coherence-transactions-concurrence.md)).
- Les événements de domaine sont enregistrés par l'agrégat (`pullEvents()`) puis dispatchés par la couche application après la persistance.

### Gestion des erreurs

- Le domaine lève des erreurs typées (`InsufficientFundsError`, `AccountClosedError`…) qui héritent de `DomainError`. Pas d'erreurs HTTP dans le domaine.
- Un exception filter Nest traduit ces erreurs en codes HTTP (422, 409, 404…) au format **RFC 9457 (Problem Details)**, comme le fait API Platform.
- Option à discuter plus tard : un type `Result<T, E>` au lieu d'exceptions pour les rejets métier attendus.

### Persistance

- Un seul `schema.prisma` (ou un dossier de schémas). Les modèles sont **préfixés ou rangés par contexte**, et aucune relation Prisma ne traverse deux contextes : on ne garde que des IDs.
- Les mappers `toDomain()` / `toPersistence()` sont explicites. Les types Prisma ne sortent jamais de `infrastructure/persistence`.
- Transactions : contexte transactionnel propagé via `AsyncLocalStorage`. Piste à évaluer : `@nestjs-cls/transactional` avec son adapter Prisma. Voir [ADR 0008](adr/0008-coherence-transactions-concurrence.md).

### Stratégie de tests

| Niveau | Cible | Outils | Base de données |
|---|---|---|---|
| Unitaire | Domaine (agrégats, VO, règles `RG-*`) | Vitest | aucune |
| Application | Use cases avec des adapters en mémoire | Vitest | aucune |
| Intégration | Repositories Prisma, transactions, **concurrence** | Vitest + Testcontainers | Postgres réel |
| E2E API | Controllers → base | Supertest + Testcontainers | Postgres réel |

Les tests de concurrence (deux débits simultanés sur le même compte) sont **obligatoires** sur le Ledger.

## Frontend (`apps/web`)

- Next.js App Router, TypeScript, Tailwind CSS.
- **Server Components par défaut** : les données sont récupérées côté serveur via le client OpenAPI généré.
- **Server Actions** pour les mutations (virement, ouverture de compte…). Next sert de BFF devant l'API Nest.
- Client Components uniquement pour l'interactivité. TanStack Query sera introduit au premier vrai besoin (voir [ADR 0005](adr/0005-front-nextjs-rsc-first.md)).
- Client API : génération depuis l'OpenAPI avec `openapi-typescript` + `openapi-fetch`, ou Orval.
- Intégration HTML/CSS : prise en charge par Claude.
