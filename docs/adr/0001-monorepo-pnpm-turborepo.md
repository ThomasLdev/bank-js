# 0001 — Monorepo pnpm + Turborepo, aucun code partagé entre apps

- Statut : Accepté
- Date : 2026-10-24

## Contexte
Projet d'entraînement avec un backend et un frontend. On veut la simplicité d'un seul repo, tout en apprenant à travailler comme si les deux projets étaient indépendants.

## Décision
- pnpm workspaces + Turborepo (cache et orchestration des tâches).
- `apps/api` et `apps/web` ne partagent **aucun code**. Seule la configuration d'outillage (tsconfig, eslint) peut aller dans `packages/config`.
- Le contrat entre les deux est la spec OpenAPI (puis le schéma GraphQL).

## Conséquences
- Le front doit régénérer son client quand l'API évolue : c'est une étape explicite du workflow.
- Les deux apps pourraient être extraites dans deux repos sans refactoring.

## Alternatives écartées
- **Nx** : très bien intégré à Nest, mais trop lourd et trop « magique » pour ce projet.
- **Package `shared-types`** : pratique, mais crée un couplage de déploiement et masque la question du contrat d'API.
