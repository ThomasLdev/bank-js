# 0006 — Montants en centimes entiers, Value Object `Money`

- Statut : Accepté
- Date : 2026-10-24

## Contexte
En JavaScript, `0.1 + 0.2 !== 0.3`. Un `number` flottant est interdit pour représenter de l'argent.

## Décision
- Value Object `Money { amountMinor: bigint; currency: Currency }` dans le shared kernel.
- `amountMinor` est exprimé en unités mineures (centimes pour l'EUR).
- Opérations : `add`, `subtract`, `negate`, `isNegative`, comparaisons. Une erreur est levée si les devises diffèrent.
- En base : colonne `BigInt` avec la devise à côté.
- Côté API (JSON ne gère pas `bigint`) : montant en **chaîne décimale** (`"125.40"`) avec la devise, convertie aux frontières.
- v1 : une seule devise, `EUR`.

## Conséquences
- La conversion texte ↔ centimes se fait à un seul endroit, dans l'adapter HTTP.
- Aucun calcul monétaire ne se fait côté front : il ne fait qu'afficher.

## Alternatives écartées
- **`Decimal` (Prisma ou decimal.js) dans le domaine** : valable, mais les entiers sont plus simples et plus explicites pour du calcul en centimes, sans multiplication ni change en v1.
