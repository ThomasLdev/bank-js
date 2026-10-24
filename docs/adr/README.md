# ADR — Architecture Decision Records

Un ADR par décision structurante. On ne modifie pas un ADR accepté : on en crée un nouveau qui le remplace (`Statut : Remplacé par XXXX`).

| # | Décision | Statut |
|---|---|---|
| [0001](0001-monorepo-pnpm-turborepo.md) | Monorepo pnpm + Turborepo, aucun code partagé entre apps | Accepté |
| [0002](0002-nestjs-architecture-hexagonale.md) | NestJS en architecture hexagonale, domaine en TS pur | Accepté |
| [0003](0003-rest-first-graphql-plus-tard.md) | REST + OpenAPI d'abord, GraphQL en second adapter | Accepté |
| [0004](0004-prisma.md) | Prisma comme ORM, confiné à l'infrastructure | Accepté |
| [0005](0005-front-nextjs-rsc-first.md) | Next.js App Router, Server Components d'abord, TanStack Query au besoin | Accepté |
| [0006](0006-money-entiers-centimes.md) | Montants en centimes entiers, Value Object `Money` | Accepté |
| [0007](0007-ledger-partie-double.md) | Ledger en partie double, append-only | Accepté |
| [0008](0008-coherence-transactions-concurrence.md) | Cohérence transactionnelle et concurrence | Proposé |
| [0009](0009-idempotence.md) | Idempotence des opérations financières | Accepté |

## Modèle

```md
# NNNN — Titre

- Statut : Proposé | Accepté | Remplacé par NNNN
- Date : AAAA-MM-JJ

## Contexte
## Décision
## Conséquences
## Alternatives écartées
```
