# 0006 — Montants en centimes entiers, Value Object `Money`

- Statut : Accepté
- Date : 2026-10-24
- Révision : 2026-10-24, format JSON de l'API passé de la chaîne décimale aux entiers en unités mineures (avant toute implémentation)

## Contexte
En JavaScript, `0.1 + 0.2 !== 0.3`. Un `number` flottant est interdit pour représenter de l'argent.

## Décision
- Value Object `Money { amountMinor: bigint; currency: Currency }` dans le shared kernel.
- `amountMinor` est exprimé en unités mineures (centimes pour l'EUR) : `123,55 €` = `12355`.
- Opérations : `add`, `subtract`, `negate`, `isNegative`, comparaisons. Une erreur est levée si les devises diffèrent.
- En base : colonne `BigInt` avec la devise à côté.
- **Côté API, comme Stripe : entier en unités mineures et devise**, par exemple `{ "amount": 12355, "currency": "EUR" }`.
  - Dans la spec OpenAPI, `amount` est un `integer`.
  - `JSON.stringify` ne sait pas sérialiser un `bigint` : l'adapter HTTP convertit `bigint` ↔ `number` à la frontière.
  - En entrée, l'adapter refuse tout montant qui n'est pas un entier sûr (`Number.isSafeInteger`). Un `number` JS représente exactement les entiers jusqu'à 2^53, soit environ 90 000 milliards d'euros en centimes.
- `Currency` liste les devises **connues** (`Money` sait les manipuler), et non les devises **acceptées** par la banque. La restriction v1 « EUR uniquement » est une règle d'Accounts (RG-ACC-03).

## Conséquences
- Le même modèle (unités mineures) de la base jusqu'au client : aucun parsing de chaîne décimale, aucun arrondi possible.
- La conversion `bigint` ↔ `number` se fait à un seul endroit, dans l'adapter HTTP.
- Le front ne fait aucun calcul monétaire. Il formate pour l'affichage uniquement (`Intl.NumberFormat`, en divisant par 10^décimales de la devise).
- Le jour où l'on gérera plusieurs devises, le client devra connaître le nombre de décimales de chacune (0 pour le JPY, 3 pour le BHD, selon ISO 4217).

## Alternatives écartées
- **`Decimal` (Prisma ou decimal.js) dans le domaine** : valable, mais les entiers sont plus simples et plus explicites pour du calcul en centimes, sans multiplication ni change en v1.
- **Chaîne décimale dans l'API** (`"123.55"`, comme PayPal) : lisible et indépendante des décimales de la devise, mais impose un parsing et une validation stricts (séparateur, nombre de décimales), source de bugs.
