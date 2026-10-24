# 01 — Vision & stack

## Objectif

Monter en compétence sur la stack TypeScript full-stack la plus répandue du marché, en conservant les exigences de qualité d'un projet Symfony / API Platform bien architecturé (DDD, hexagonal, tests).

Le projet n'est pas un produit : c'est un **terrain d'entraînement**. On privilégie la compréhension et la justesse des choix plutôt que la vitesse.

## Stack retenue

| Couche | Choix | Équivalent Symfony | ADR |
|---|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | — | [0001](adr/0001-monorepo-pnpm-turborepo.md) |
| Backend | NestJS, architecture hexagonale | Symfony + API Platform | [0002](adr/0002-nestjs-architecture-hexagonale.md) |
| API | REST + OpenAPI d'abord, GraphQL en bonus | API Platform (REST) | [0003](adr/0003-rest-first-graphql-plus-tard.md) |
| ORM | Prisma | Doctrine | [0004](adr/0004-prisma.md) |
| Base de données | PostgreSQL | PostgreSQL | — |
| Frontend | Next.js (App Router), RSC d'abord | Twig + Symfony UX | [0005](adr/0005-front-nextjs-rsc-first.md) |
| Validation | Zod | Validator | — |
| Tests | Vitest, Testcontainers, Supertest | PHPUnit, Foundry | — |

## Ce qu'on veut apprendre (par ordre de priorité)

1. Faire du **DDD hexagonal en TypeScript** sans que le framework ni l'ORM ne contaminent le domaine.
2. Maîtriser NestJS : modules, injection de dépendances, pipes, guards, interceptors.
3. Maîtriser Prisma *derrière un port*, y compris les transactions et la concurrence.
4. Comprendre le modèle **Server / Client Components** de Next.js.
5. Faire tenir un contrat d'API typé de bout en bout sans partager de code (OpenAPI → codegen).
6. En bonus : un second adapter GraphQL, TanStack Query, l'asynchrone avec un outbox.

## Répartition des rôles

- **Développeur** : écrit tout le code back et la logique front.
- **Claude** : plan, architecture, revue, déblocage. Code **uniquement l'intégration HTML/CSS** côté front.
