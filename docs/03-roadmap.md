# 03 — Roadmap

Chaque phase a une **définition de fini**. On ne passe pas à la suivante tant qu'elle n'est pas remplie.

## Phase 0 — Socle
- Monorepo pnpm + Turborepo, `apps/api` (Nest) et `apps/web` (Next) qui démarrent.
- `docker-compose` avec Postgres. Prisma initialisé.
- Lint, format, Vitest, **règles de dépendance hexagonales** actives.
- CI minimale : lint + tests.

**Fini quand** : `pnpm dev` lance les deux apps, `pnpm test` passe, et un import interdit (domaine → Prisma) fait échouer le lint.

## Phase 1 — Contexte Accounts
- Shared kernel : `Money`, `AggregateRoot`, `DomainError`.
- Titulaires et comptes : inscription, ouverture, gel, dégel, clôture, découvert.
- Endpoints REST et spec OpenAPI exposée.

**Fini quand** : les règles `RG-ACC-*` sont couvertes par des tests unitaires, et les endpoints par des tests e2e.

## Phase 2 — Contexte Ledger + dépôts et retraits
- Comptabilité en partie double, écritures immuables, solde dérivé et snapshot.
- Synchronisation Accounts → Ledger.
- Dépôt et retrait au guichet.
- **Tests de concurrence.**
- Job de rapprochement : vérifier que le snapshot de solde est égal à la somme des écritures.

**Fini quand** : 50 retraits concurrents sur un compte ne produisent jamais de solde incohérent ni de découvert dépassé.

## Phase 3 — Contexte Payments : virements internes
- Agrégat `Transfer` et sa machine à états.
- Idempotence.
- Contre-passation par un conseiller.

**Fini quand** : rejouer la même requête avec la même `Idempotency-Key` ne crée jamais deux virements.

## Phase 4 — Front
- Espace client : mes comptes, détail avec solde et relevé, nouveau virement.
- Espace conseiller : recherche de client, ouverture de compte, gel, découvert, guichet, contre-passation.
- Client API généré depuis l'OpenAPI.

## Phase 5 — Authentification & autorisations
- JWT, rôles `CUSTOMER` / `ADVISOR`, guards Nest.
- Un client ne voit que ses comptes (équivalent d'un voter).

## Bonus (dans l'ordre qui nous plaira)
- **GraphQL** comme second adapter primaire. Critère de réussite : aucun fichier hors `infrastructure/` modifié.
- **TanStack Query** : polling du statut d'un virement, relevé en scroll infini.
- **Virements externes asynchrones** vers un faux partenaire SEPA : outbox, worker BullMQ, saga, retries.
- Multi-devises.
- Event sourcing du Ledger.
