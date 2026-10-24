# 0003 — REST + OpenAPI d'abord, GraphQL en second adapter

- Statut : Accepté
- Date : 2026-10-24

## Contexte
REST reste majoritaire sur le marché. GraphQL est intéressant mais ajoute une charge cognitive (resolvers, DataLoader, N+1) à un moment où l'on apprend déjà Nest, Prisma et Next.

## Décision
- v1 : REST avec la spec OpenAPI générée par `@nestjs/swagger`.
- Erreurs au format RFC 9457 (Problem Details).
- Bonus : GraphQL code-first comme **second adapter primaire**, branché sur les mêmes use cases.

## Conséquences
- Le front génère son client typé depuis la spec OpenAPI.
- L'ajout de GraphQL sert de **test de l'architecture** : si cela oblige à modifier `domain/` ou `application/`, l'hexagone fuit.

## Alternatives écartées
- **GraphQL d'emblée** : trop de nouveautés simultanées.
- **tRPC** : couple fortement front et back en TypeScript, ce qui contredit l'ADR 0001.
