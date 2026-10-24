# 0002 — NestJS en architecture hexagonale, domaine en TS pur

- Statut : Accepté
- Date : 2026-10-24

## Contexte
NestJS est le standard « entreprise » du backend Node. Son système de modules et de décorateurs pousse naturellement à coupler le métier au framework, comme les entités Doctrine annotées couplent le métier à l'ORM.

## Décision
- Découpage par bounded context, puis par couche `domain` / `application` / `infrastructure` (voir [Architecture](../02-architecture.md)).
- **Le domaine est du TypeScript pur** : aucun décorateur Nest, Prisma, class-validator ou Swagger.
- Un module Nest par contexte, qui câble les ports à leurs implémentations.
- `@nestjs/cqrs` pour les bus de commandes et de requêtes.
- Les règles de dépendance sont vérifiées par un linter dans la CI.

## Conséquences
- Plus de code qu'un CRUD Nest classique : mappers, DTO séparés, ports.
- Le domaine se teste sans Nest et sans base de données.
- Ajouter GraphQL (ADR 0003) doit pouvoir se faire sans toucher au domaine ni à l'application.

## Alternatives écartées
- **Nest « à la doc officielle »** (entités ORM = modèle métier, services fourre-tout) : plus rapide, mais va contre l'objectif d'apprentissage.
- **Express ou Fastify nus** : trop de câblage manuel, et moins représentatif du marché pour un backend structuré.
